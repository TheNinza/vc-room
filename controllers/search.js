const { firestore } = require("../configs/firebase");
const { validateUser } = require("../utils/validateUser");

exports.people = async (req, res) => {
  try {
    const { uid } = validateUser(req);
    const { searchString } = req.query;

    // check if searchString is empty
    if (!searchString) {
      return res.status(400).json({
        message: "Please enter a search string",
      });
    }

    const query = firestore
      .collection("users")
      .where("displayName", ">=", searchString.toUpperCase());

    const users = await query.get();

    const usersArray = users.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    // get friends of the user
    const friends = (
      await firestore.collection("users").doc(uid).collection("friends").get()
    ).docs.map((doc) => doc.id);

    // check if existing pending friend requests from the user
    const notificationsSend = (
      await firestore
        .collection("notifications")
        .where("from", "==", uid)
        .where("status", "==", "pending")
        .get()
    ).docs.map((doc) => {
      return doc.data()?.to;
    });

    // check if existing pending friend requests to the user
    const notificationsReceived = (
      await firestore
        .collection("notifications")
        .where("to", "==", uid)
        .where("status", "==", "pending")
        .get()
    ).docs.map((doc) => {
      return doc.data()?.from;
    });

    const filteredUsers = usersArray
      .filter((user) => {
        return user.id !== uid;
      })
      .filter((user) =>
        user.displayName.toUpperCase().includes(searchString.toUpperCase())
      )
      .map((user) => {
        return {
          ...user,
          isFriend: friends.includes(user.id),
          isNotificationSend: notificationsSend.includes(user.id),
          isNotificationReceived: notificationsReceived.includes(user.id),
        };
      });

    res.status(200).json({
      users: filteredUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
