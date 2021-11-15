const { serverTimestamp, firestore } = require("../configs/firebase");
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
      error: error.message,
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

    if (uid !== from || uid !== userOnOtherSide) {
      return res.status(400).json({
        message: "You are not allowed to delete this call",
      });
    }

    await firestore.collection("calls").doc(callId).delete();

    res.status(200).json({
      message: "Call deleted successfully",
    });
  } catch (error) {
    console.error("deleteCallRecord", error);
    res.status(500).json({
      error: error.message,
    });
  }
};
