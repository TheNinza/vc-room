import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FriendsPanel from "../components/FriendsPanel/FriendsPanel";
import IncomingCallNotification from "../components/IncomingCallNotification/IncomingCallNotification";
import RecentCallsContainer from "../components/RecentCallsContainer/RecentCallsContainer";
import SuggestionsContainer from "../components/SuggestionsContainer/SuggestionsContainer";

import UserPanel from "../components/UserPanel/UserPanel";
import { setIncomingCallDetails } from "../features/call/call-slice";
import { setFriends } from "../features/friends/friends-slice";
import { firestore } from "../lib/firebase/firebase";

const useStyles = makeStyles((theme) => ({
  root: { flex: 1, display: "flex", position: "relative" },
  flexParent: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "7rem",
  },
  leftPanel: {
    width: "18rem",
    height: "87vh",
    alignSelf: "flex-start",
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "1rem",
  },

  middlePanel: {
    flex: 1,
    marginLeft: "20rem",
    width: "calc(100% - 20rem)",
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  const uid = useSelector((state) => state.user.userData.uid);
  const dispatch = useDispatch();

  // start listenning to various collectoins related to user for realtime update and update redux store
  useEffect(() => {
    const now = new Date().getTime();

    let unsubscribeFromFriendsCollection, unsubscribeFromCallsCollection;
    if (uid) {
      const friendCollectionQuery = firestore
        .collection("users")
        .doc(uid)
        .collection("friends");

      const callsCollectionQuery = firestore
        .collection("calls")
        .where("userOnOtherSide", "==", uid)
        .orderBy("timeStamp", "asc");

      unsubscribeFromFriendsCollection = friendCollectionQuery.onSnapshot(
        (snapshot) => {
          const friends = snapshot.docs.map((doc) => doc.data());
          dispatch(setFriends(friends));
        }
      );

      unsubscribeFromCallsCollection = callsCollectionQuery.onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            if (change.type === "added" && data?.timeStamp?.toMillis() > now) {
              dispatch(
                setIncomingCallDetails({
                  ...data,
                  timeStamp: data.timeStamp.toMillis(),
                })
              );
            }
          });
        }
      );
    }
    return () => {
      unsubscribeFromFriendsCollection();
      unsubscribeFromCallsCollection();
    };
  }, [uid, dispatch]);

  return (
    <div className={classes.root}>
      <div className={classes.flexParent}>
        <div className={classes.leftPanel}>
          <UserPanel />
          <FriendsPanel />
        </div>
        <div className={classes.middlePanel}>
          <RecentCallsContainer />
          <SuggestionsContainer />
        </div>
      </div>
      <IncomingCallNotification />
    </div>
  );
};

export default Dashboard;
