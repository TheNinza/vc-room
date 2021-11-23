const { firestore } = require("../configs/firebase");

exports.getFriendsOfTheUser = async (uid) => {
  const query = await firestore
    .collection("users")
    .doc(uid)
    .collection("friends");

  const { docs } = await query.get();

  const currentUserFriends = await Promise.all(
    docs.map(async (doc) => (await doc.data()).uid)
  );
  return currentUserFriends;
};
