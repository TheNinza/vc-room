const { firestore, serverTimestamp } = require("../configs/firebase");
const { validateUser } = require("../utils/validateUser");

exports.sendFriendRequest = async (req, res) => {
  try {
    const { uid } = validateUser(req);
    const { friendUid } = req.body;
    if (!friendUid) {
      return res.status(400).json({ message: "Friend UID is required" });
    }

    // check if the user has already sent a friend request to the friend
    const query = firestore
      .collection("notifications")
      .where("from", "==", uid)
      .where("to", "==", friendUid)
      .where("status", "==", "pending");
    const querySnapshot = await query.get();
    if (!querySnapshot.empty) {
      return res.status(400).json({
        message: "You have already sent a friend request to this user",
      });
    }

    // check if the user has already received a friend request from the friend
    const query2 = firestore
      .collection("notifications")
      .where("from", "==", friendUid)
      .where("to", "==", uid)
      .where("status", "==", "pending");
    const querySnapshot2 = await query2.get();
    if (!querySnapshot2.empty) {
      return res.status(400).json({
        message: "You have already received a friend request from this user",
      });
    }

    // check if the user is already friends with the friend
    const query3 = firestore
      .collection("users")
      .doc(uid)
      .collection("friends")
      .where("uid", "==", friendUid);
    const querySnapshot3 = await query3.get();
    if (!querySnapshot3.empty) {
      return res.status(400).json({
        message: "You are already friends with this user",
      });
    }

    // check if the friend is already friends with the user
    const query4 = firestore
      .collection("users")
      .doc(friendUid)
      .collection("friends")
      .where("uid", "==", uid);
    const querySnapshot4 = await query4.get();
    if (!querySnapshot4.empty) {
      return res.status(400).json({
        message: "This user is already friends with you",
      });
    }

    // create a new friend request
    const batch = firestore.batch();
    const timeStamp = serverTimestamp();

    const notificationRef = firestore.collection("notifications").doc();
    const senderNotificationRef = firestore
      .collection("users")
      .doc(uid)
      .collection("notifications")
      .doc(notificationRef.id);

    const recieverNotificationRef = firestore
      .collection("users")
      .doc(friendUid)
      .collection("notifications")
      .doc(notificationRef.id);

    batch.set(notificationRef, {
      from: uid,
      to: friendUid,
      status: "pending",
      createdAt: timeStamp,
      lastModified: timeStamp,
    });

    batch.set(senderNotificationRef, {
      notificationId: notificationRef.id,
      status: "pending",
      seen: false,
    });

    batch.set(recieverNotificationRef, {
      notificationId: notificationRef.id,
      status: "pending",
      seen: false,
    });

    await batch.commit();

    res.status(200).json({
      message: "Successfully sent request",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { uid } = validateUser(req);
    const { friendUid, notifId } = req.body;

    // check if the body is valid
    if (!friendUid || !notifId) {
      return res.status(400).json({
        message: "Friend UID and Notification ID are required",
      });
    }

    // check if user is already friends with the friend

    const query = firestore
      .collection("users")
      .doc(uid)
      .collection("friends")
      .where("uid", "==", friendUid);
    const querySnapshot = await query.get();
    if (!querySnapshot.empty) {
      return res.status(400).json({
        message: "You are already friends with this user",
      });
    }

    // check if the friend is already friends with the user

    const query2 = firestore
      .collection("users")
      .doc(friendUid)
      .collection("friends")
      .where("uid", "==", uid);
    const querySnapshot2 = await query2.get();
    if (!querySnapshot2.empty) {
      return res.status(500).json({
        message: "This user is already friends with you",
      });
    }

    // check if the user has already received a friend request from the friend

    const query3 = firestore
      .collection("notifications")
      .where("from", "==", friendUid)
      .where("to", "==", uid)
      .where("status", "==", "pending");
    const querySnapshot3 = await query3.get();

    if (querySnapshot3.empty) {
      return res.status(400).json({
        message: "You have not received a friend request from this user",
      });
    }

    // check if the notifId is valid

    const query4 = firestore.collection("notifications").doc(notifId);

    const querySnapshot4 = await query4.get();
    if (
      querySnapshot3.docs.filter((doc) => doc.id === notifId).length === 0 ||
      !querySnapshot4.exists
    ) {
      return res.status(400).json({
        message: "Notification ID is invalid",
      });
    }

    // update the friend request status to accepted

    const batch = firestore.batch();

    const timestamp = serverTimestamp();

    const notifRef = firestore.collection("notifications").doc(notifId);

    const recieverNotificationRef = firestore
      .collection("users")
      .doc(uid)
      .collection("notifications")
      .doc(notifId);

    const senderNotificationRef = firestore
      .collection("users")
      .doc(friendUid)
      .collection("notifications")
      .doc(notifId);

    const recieverFriendsRef = firestore
      .collection("users")
      .doc(uid)
      .collection("friends")
      .doc(friendUid);

    const senderFriendsRef = firestore
      .collection("users")
      .doc(friendUid)
      .collection("friends")
      .doc(uid);

    batch.update(notifRef, {
      status: "accepted",
      lastModified: timestamp,
    });

    batch.update(senderNotificationRef, {
      status: "accepted",
    });

    batch.update(recieverNotificationRef, {
      status: "accepted",
    });

    batch.set(recieverFriendsRef, {
      uid: recieverFriendsRef.id,
    });

    batch.set(senderFriendsRef, {
      uid: senderFriendsRef.id,
    });

    await batch.commit();

    res.status(200).json({
      message: "Successfully accepted request",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.declineFriendRequest = async (req, res) => {
  try {
    const { uid } = validateUser(req);
    const { friendUid, notifId } = req.body;

    // check if the body is valid
    if (!friendUid || !notifId) {
      return res.status(400).json({
        message: "Friend UID and Notification ID are required",
      });
    }

    // check if the user has already received a friend request from the friend
    const query2 = firestore
      .collection("notifications")
      .where("from", "==", friendUid)
      .where("to", "==", uid)
      .where("status", "==", "pending");
    const querySnapshot2 = await query2.get();

    const hasReceivedRequest =
      !querySnapshot2.empty &&
      querySnapshot2.docs.filter((doc) => doc.id === notifId).length > 0;

    // check if the user has already sent a friend request to the friend
    const query3 = firestore
      .collection("notifications")
      .where("from", "==", uid)
      .where("to", "==", friendUid)
      .where("status", "==", "pending");
    const querySnapshot3 = await query3.get();

    const hasSentRequest =
      !querySnapshot3.empty &&
      querySnapshot3.docs.filter((doc) => doc.id === notifId).length > 0;

    if (!hasReceivedRequest && !hasSentRequest) {
      return res.status(400).json({
        message:
          "You have not received or sent a friend request from this user",
      });
    }

    // delete the friend request

    const batch = firestore.batch();

    const notifRef = firestore.collection("notifications").doc(notifId);

    const recieverNotificationRef = firestore
      .collection("users")
      .doc(uid)
      .collection("notifications")
      .doc(notifId);

    recieverNotificationRef
      .get()
      .then((doc) => console.log("exist: ", doc.exists));
    const senderNotificationRef = firestore
      .collection("users")
      .doc(friendUid)
      .collection("notifications")
      .doc(notifId);

    batch.delete(notifRef);

    batch.delete(senderNotificationRef);

    batch.delete(recieverNotificationRef);

    await batch.commit();

    res.status(200).json({
      message: "Successfully declined request",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const { uid } = validateUser(req);
    const { friendUid } = req.body;

    // check if the body is valid
    if (!friendUid) {
      return res.status(400).json({
        message: "Friend UID is required",
      });
    }

    // check if the user is friends with the friend

    const query = firestore
      .collection("users")
      .doc(uid)
      .collection("friends")
      .where("uid", "==", friendUid);
    const querySnapshot = await query.get();

    if (querySnapshot.empty) {
      return res.status(400).json({
        message: "You are not friends with this user",
      });
    }

    // delete the friend

    const batch = firestore.batch();

    const friendsRef = firestore
      .collection("users")
      .doc(uid)
      .collection("friends")
      .doc(friendUid);

    const friendRef = firestore
      .collection("users")
      .doc(friendUid)
      .collection("friends")
      .doc(uid);

    batch.delete(friendsRef);

    batch.delete(friendRef);

    // delete all the calls between the two users

    const fromCallsRef = firestore
      .collection("calls")
      .where("from", "==", uid)
      .where("userOnOtherSide", "==", friendUid);

    const toCallsRef = firestore
      .collection("calls")
      .where("from", "==", friendUid)
      .where("userOnOtherSide", "==", uid);

    const fromCallsSnapshot = await fromCallsRef.get();
    const toCallsSnapshot = await toCallsRef.get();

    const fromCalls = fromCallsSnapshot.docs.map((doc) => doc.id);
    const toCalls = toCallsSnapshot.docs.map((doc) => doc.id);

    const callsToDelete = [...fromCalls, ...toCalls];

    callsToDelete.forEach((callId) => {
      const callRef = firestore.collection("calls").doc(callId);
      batch.delete(callRef);
    });

    await batch.commit();

    res.status(200).json({
      message: "Successfully deleted friend",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
