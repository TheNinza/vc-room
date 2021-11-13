const { firestore } = require("../configs/firebase");
const { shuffle } = require("../utils/arrayMethods");
const { getFriendsOfTheUser } = require("../utils/getFriendsOfTheUser");
const { validateUser } = require("../utils/validateUser");

exports.getSuggestions = async (req, res) => {
  try {
    let { uid } = validateUser(req);
    let friends = await getFriendsOfTheUser(uid);
    let suggestions = [];

    // if user has no friends
    if (!friends.length) {
      const query = firestore
        .collection("users")
        .where("uid", "!=", uid)
        .limit(10);
      const snapshot = await query.get();

      snapshot.docs.forEach((doc) => {
        suggestions.push(doc.id);
      });

      return res.status(200).json({
        suggestions,
        message: "ok",
      });
    }

    // set to contain friends
    const ownFriends = new Set(friends);
    ownFriends.add(uid);

    // check if there are any pending requests from user to any user
    const notifQuery = firestore
      .collection("notifications")
      .where("from", "==", uid)
      .where("status", "==", "pending");

    (await notifQuery.get()).docs.forEach((doc) => {
      ownFriends.add(doc.data().to);
    });

    // let's start creating suggestions

    const suggestionSet = new Set();

    // traversing the freinds list and adding them to suggestions if not in suggestions already

    for (let i = 0; i < friends.length; i++) {
      const friends2ndLevel = await getFriendsOfTheUser(friends[i]);

      for (let j = 0; j < friends2ndLevel.length; j++) {
        if (!ownFriends.has(friends2ndLevel[j])) {
          suggestionSet.add(friends2ndLevel[j]);
        }
        if (suggestionSet.size > 10) break;

        const friends3rdLevel = await getFriendsOfTheUser(friends2ndLevel[j]);

        for (let k = 0; k < friends3rdLevel.length; k++) {
          if (!ownFriends.has(friends3rdLevel[k])) {
            suggestionSet.add(friends3rdLevel[k]);
          }
          if (suggestionSet.size > 10) break;
        }
      }
    }

    // adding more suggestions for those who aren't in the list
    if (suggestionSet.size < 4) {
      const query = firestore.collection("users").where("uid", "!=", uid);
      const snapshot = await query.get();

      snapshot.docs.forEach((doc) => {
        if (!ownFriends.has(doc.id) && !suggestionSet.has(doc.id))
          suggestionSet.add(doc.id);
      });
    }

    suggestions = Array.from(suggestionSet);

    shuffle(suggestions.slice(0, 10));

    res.status(200).json({
      suggestions,
      message: "ok",
    });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .send({ message: err?.message || "Some error occured", error: err });
  }
};
