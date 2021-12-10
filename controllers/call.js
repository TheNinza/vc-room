const {
  serverTimestamp,
  firestore,
  timestamp,
  increment,
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

    // check if user has 'user' role and has enough credits

    const userRef = firestore.collection("users").doc(uid);

    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const { role } = userDoc.data();

    if (role === "user") {
      const accountRef = firestore.collection("accounts").doc(uid);
      const accountDoc = await accountRef.get();

      if (!accountDoc.exists) {
        return res.status(400).json({
          message: "User does not have an account",
        });
      }

      const { credits } = accountDoc.data();

      if (credits <= 0) {
        return res.status(400).json({
          message: "You do not have enough credits. Go buy some!",
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

exports.acceptCall = async (req, res) => {
  try {
    const { uid } = validateUser(req);
    const { callId } = req.body;

    if (!callId) {
      return res.status(400).json({
        message: "Call id is required",
      });
    }

    const callRef = firestore.collection("calls").doc(callId);

    const callDoc = await callRef.get();

    if (!callDoc.exists) {
      return res.status(400).json({
        message: "Call does not exist",
      });
    }

    const { userOnOtherSide, from } = callDoc.data();

    if (uid !== userOnOtherSide) {
      return res.status(400).json({
        message: "You are not the user on the other side of the call",
      });
    }

    // if from is a friend of the userOnOtherSide or the userOnOtherSide is a friend of from
    const query = firestore
      .collection("users")
      .doc(uid)
      .collection("friends")
      .doc(from);

    const doc = await query.get();

    if (!doc.exists) {
      return res.status(400).json({
        message: "User is not your friend",
      });
    }

    const query2 = firestore
      .collection("users")
      .doc(from)
      .collection("friends")
      .doc(uid);

    const doc2 = await query2.get();

    if (!doc2.exists) {
      return res.status(400).json({
        message: "User is not your friend",
      });
    }

    // update call and decrement credits of userOnOtherSide by 1

    const batch = firestore.batch();

    batch.update(callRef, {
      callAccepted: true,
    });

    // decrement credits of from by 1 if has user role
    const userRef = firestore.collection("users").doc(from);

    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const { role } = userDoc.data();

    console.log("role", role);

    if (role === "user") {
      const accountRef = firestore.collection("accounts").doc(from);
      const accountDoc = await accountRef.get();

      if (!accountDoc.exists) {
        return res.status(400).json({
          message: "User does not have an account",
        });
      }

      const { credits } = accountDoc.data();

      if (credits <= 0) {
        return res.status(400).json({
          message: "User on the other side does not have enough credits",
        });
      }

      console.log("credits", credits);

      batch.update(accountRef, {
        credits: increment(-1),
      });
    }

    await batch.commit();

    res.status(200).json({
      message: "Call accepted successfully",
    });
  } catch (error) {
    console.error("acceptCall", error);
    res.status(500).json({
      message: "Error accepting call",
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
