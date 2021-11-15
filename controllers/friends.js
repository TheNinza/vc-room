const { firestore, serverTimestamp } = require("../configs/firebase");
const { validateUser } = require("../utils/validateUser");

exports.sendFriendRequest = async (req, res) => {
  try {
    const { uid } = validateUser(req);
    const { friendUid } = req.body;
    if (!friendUid) {
      throw new Error("Friend UID is required");
    }

    // check if the user has already sent a friend request to the friend
    const query = firestore
      .collection("notifications")
      .where("from", "==", uid)
      .where("to", "==", friendUid);
    const querySnapshot = await query.get();
    if (querySnapshot.empty) {
      throw new Error("You have already sent a friend request to this user");
    }

    // check if the user has already received a friend request from the friend
    const query2 = firestore
      .collection("notifications")
      .where("from", "==", friendUid)
      .where("to", "==", uid);
    const querySnapshot2 = await query2.get();
    if (querySnapshot2.empty) {
      throw new Error(
        "You have already received a friend request from this user"
      );
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
    res.status(400).json({ message: error.message });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { uid } = validateUser(req);
    const { friendUid } = req.body;

    // check if user is already friends with the friend

    const query = firestore
      .collection("users")
      .doc(uid)
      .collection("friends")
      .where("uid", "==", friendUid);
    const querySnapshot = await query.get();
    if (!querySnapshot.empty) {
      throw new Error("You are already friends with this user");
    }

    // check if the friend is already friends with the user

    const query2 = firestore
      .collection("users")
      .doc(friendUid)
      .collection("friends")
      .where("uid", "==", uid);
    const querySnapshot2 = await query2.get();
    if (!querySnapshot2.empty) {
      throw new Error("This user is already friends with you");
    }

    // check if the user has already sent a friend request to the friend
    const query3 = firestore
      .collection("notifications")
      .where("from", "==", uid)
      .where("to", "==", friendUid);
    const querySnapshot3 = await query3.get();
    if (querySnapshot3.empty) {
      throw new Error("You have not sent a friend request to this user");
    }

    // check if the user has already received a friend request from the friend

    const query4 = firestore
      .collection("notifications")
      .where("from", "==", friendUid)
      .where("to", "==", uid);
    const querySnapshot4 = await query4.get();
    if (querySnapshot4.empty) {
      throw new Error("You have not received a friend request from this user");
    }

    // update the friend request status to accepted

    const batch = firestore.batch();

    const timestamp = serverTimestamp();

    const notifRef = firestore
      .collection("notifications")
      .doc(notification.notificationId);

    const recieverNotificationRef = firestore
      .collection("users")
      .doc(notification.to)
      .collection("notifications")
      .doc(notification.notificationId);

    const senderNotificationRef = firestore
      .collection("users")
      .doc(notification.from)
      .collection("notifications")
      .doc(notification.notificationId);

    const recieverFriendsRef = firestore
      .collection("users")
      .doc(notification.to)
      .collection("friends")
      .doc(notification.from);

    const senderFriendsRef = firestore
      .collection("users")
      .doc(notification.from)
      .collection("friends")
      .doc(notification.to);

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
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.declineFriendRequest = async (req, res) => {
  try {
    const { uid } = validateUser(req);
    const { friendUid } = req.body;

    // check if the user has already received a friend request from the friend
    const query2 = firestore
      .collection("notifications")
      .where("from", "==", friendUid)
      .where("to", "==", uid);
    const querySnapshot2 = await query2.get();

    const hasReceivedRequest = querySnapshot2.empty;

    if (!hasReceivedRequest) {
      throw new Error("You have not received a friend request from this user");
    }

    // update the friend request status to declined

    const batch = firestore.batch();

    const timestamp = serverTimestamp();

    const notifRef = firestore
      .collection("notifications")
      .doc(notification.notificationId);

    const recieverNotificationRef = firestore
      .collection("users")
      .doc(notification.to)
      .collection("notifications")
      .doc(notification.notificationId);

    const senderNotificationRef = firestore
      .collection("users")
      .doc(notification.from)
      .collection("notifications")
      .doc(notification.notificationId);

    batch.update(notifRef, {
      status: "declined",
      lastModified: timestamp,
    });

    batch.update(senderNotificationRef, {
      status: "declined",
    });

    batch.update(recieverNotificationRef, {
      status: "declined",
    });

    await batch.commit();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
