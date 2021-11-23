import { makeStyles } from "@material-ui/core";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import FriendsPanel from "../components/FriendsPanel/FriendsPanel";
import IncomingCallNotification from "../components/IncomingCallNotification/IncomingCallNotification";
import RecentCallsContainer from "../components/RecentCallsContainer/RecentCallsContainer";
import SuggestionsContainer from "../components/SuggestionsContainer/SuggestionsContainer";

import UserPanel from "../components/UserPanel/UserPanel";
import {
  resetCallDetails,
  setActiveCall,
  setCallingStatus,
  setIsReceivingCall,
} from "../features/call/call-slice";
import { setFriends } from "../features/friends/friends-slice";
import { firestore } from "../lib/firebase/firebase";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
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

  // local States

  // Refs
  const timerRef = useRef();
  const toastRef = useRef();

  // Redux
  const uid = useSelector((state) => state.user.userData.uid);
  const activeCallDocId = useSelector((state) => state.call.activeCallDocId);
  const dispatch = useDispatch();

  // React-Router
  const history = useHistory();

  // reset timer
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (toastRef.current) {
      toast.dismiss(toastRef.current);
      toastRef.current = null;
    }
  };

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
              clearTimer();
              dispatch(setCallingStatus(true));
              dispatch(setIsReceivingCall(true));
              dispatch(
                setActiveCall({
                  ...data,
                  timeStamp: data.timeStamp.toMillis(),
                  callDocId: change.doc.id,
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

  // start listenning to if call is being accepted
  useEffect(() => {
    let unsubscribeFromCreateCallDocument;
    if (activeCallDocId) {
      // create a loading toast for calling
      toastRef.current = toast.loading("Calling...", {
        position: "bottom-center",
      });

      // set a timeout for 25 secs to reset the call
      timerRef.current = setTimeout(() => {
        clearTimer();
        dispatch(resetCallDetails());

        toast.error("Call Timed Out");
      }, 25000);

      dispatch(setCallingStatus(true));

      unsubscribeFromCreateCallDocument = firestore
        .collection("calls")
        .doc(activeCallDocId)
        .onSnapshot((snapshot) => {
          const callData = snapshot.data();
          const { callAccepted, callDeclined } = callData;

          if (callAccepted) {
            clearTimer();

            toast.success("Connecting Call");
            dispatch(
              setActiveCall({
                ...callData,
                callDocId: activeCallDocId,
                timeStamp: callData.timeStamp.toMillis(),
              })
            );
            history.push("/call");
          }

          if (callDeclined) {
            clearTimer();

            dispatch(resetCallDetails());
            toast.error("Call Declined");
          }
        });
    } else {
      clearTimer();
      dispatch(resetCallDetails());
    }

    return () => {
      unsubscribeFromCreateCallDocument && unsubscribeFromCreateCallDocument();
    };
  }, [activeCallDocId, dispatch, history]);

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
