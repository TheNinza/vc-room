const {
  serverTimestamp,
  firestore,
  timestamp,
} = require("../configs/firebase");
const { validateUser } = require("../utils/validateUser");

exports.createCall = async (req, res) => {
  try {
    const { uid } = validateUser(req);
    const { userOnOtherSide } = req.body;

    // check if user is friend with the userOnOtherSide
    const query = firestore
      .collection("users")
      .doc(uid)
      .collection("friends")
      .doc(userOnOtherSide);

    const doc = await query.get();

    if (!doc.exists) {
      return res.status(400).json({
        message: "User is not your friend",
      });
    }

    // Check if useronotherside is friend with the user
    const query2 = firestore
      .collection("users")
      .doc(userOnOtherSide)
      .collection("friends")
      .doc(uid);

    const doc2 = await query2.get();

    if (!doc2.exists) {
      return res.status(400).json({
        message: "User is not your friend",
      });
    }

    // check if user has 'user' role and has already made 5 calls today and they were accepted

    const userRef = firestore.collection("users").doc(uid);

    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const { role } = userDoc.data();

    if (role === "user") {
      const today = timestamp().toDate();

      const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const todayEnd = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const query3 = firestore
        .collection("calls")
        .where("from", "==", uid)
        .where("timeStamp", ">=", todayStart)
        .where("timeStamp", "<", todayEnd)
        .where("callAccepted", "==", true);

      const docs = await query3.get();

      if (docs.size >= 5) {
        return res.status(400).json({
          message: "You have already made 5 calls today",
        });
      }
    } else if (role !== "unlimited") {
      return res.status(400).json({
        message: "User does not have the correct role",
      });
    }

    // create call
    const callDoc = await firestore.collection("calls").add({
      userOnOtherSide,
      from: uid,
      timeStamp: serverTimestamp(),
      callAccepted: false,
      callDeclined: false,
    });

    res.status(200).json({
      message: "Call created successfully",
      callId: callDoc.id,
    });
  } catch (error) {
    console.error("createCall", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteCallRecord = async (req, res) => {
  try {
    const { uid } = validateUser(req);
    const { callId } = req.body;

    const callDoc = await firestore.collection("calls").doc(callId).get();

    if (!callDoc.exists) {
      return res.status(400).json({
        message: "Call does not exist",
      });
    }

    const { userOnOtherSide, from } = callDoc.data();

    // check if the user is the userOnOtherSide or from
    if (userOnOtherSide !== uid && from !== uid) {
      return res.status(400).json({
        message: "You are not allowed to delete this call",
      });
    }

    // delete sender and receiver collections in calls
    const batch = firestore.batch();
    const callRef = firestore.collection("calls").doc(callId);

    const senderRef = await callRef.collection("sender").get();

    const receiverRef = await callRef.collection("receiver").get();

    senderRef.forEach((doc) => {
      batch.delete(doc.ref);
    });

    receiverRef.forEach((doc) => {
      batch.delete(doc.ref);
    });

    batch.delete(callRef);

    await batch.commit();

    res.status(200).json({
      message: "Call deleted successfully",
    });
  } catch (error) {
    console.error("deleteCallRecord", error);
    res.status(500).json({
      message: error.message,
    });
  }
};
