import { makeStyles, Snackbar } from "@material-ui/core";
import { useCallback, useEffect, useRef, useState } from "react";
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
  setIncomingCallDetails,
} from "../features/call/call-slice";
import { setFriends } from "../features/friends/friends-slice";
import { firestore, serverTimestamp } from "../lib/firebase/firebase";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";

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

  // local States

  const [callingSnackBarOpen, setCallingSnackBarOpen] = useState(false);

  // Refs
  const timerRef = useRef();
  const unsubscribeFromCreateCallDocument = useRef();

  // Redux
  const uid = useSelector((state) => state.user.userData.uid);
  const callState = useSelector((state) => state.call);
  const dispatch = useDispatch();

  // React-Router
  const history = useHistory();

  // reset timer
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
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
              dispatch(setCallingStatus(true));
              dispatch(
                setIncomingCallDetails({
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

  const createCallDocument = useCallback(async (userOnOtherSide) => {
    setCallingSnackBarOpen(true);
    const callDoc = firestore.collection("calls").doc();
    await callDoc.set({
      userOnOtherSide: userOnOtherSide,
      from: uid,
      timeStamp: serverTimestamp(),
      initiatorSignalData: null,
      receiverSignalData: null,
      callAccepted: false,
      callDeclined: false,
    });

    unsubscribeFromCreateCallDocument.current = callDoc.onSnapshot(
      (snapshot) => {
        const callData = snapshot.data();
        const { callAccepted, callDeclined } = callData;

        if (callAccepted) {
          clearTimer();
          setCallingSnackBarOpen(false);
          toast.success("Connecting Call");
          dispatch(setActiveCall({ ...callData, callDocId: callDoc.id }));
          history.push("/call");
        }

        if (callDeclined) {
          clearTimer();
          setCallingSnackBarOpen(false);
          dispatch(resetCallDetails());
          toast.error("Call Declined");
        }
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // start listenning to if call is being accepted
  useEffect(() => {
    clearTimer();
    if (unsubscribeFromCreateCallDocument.current)
      unsubscribeFromCreateCallDocument.current();

    const { callingStatus, userOnOtherSide } = callState;

    if (callingStatus && userOnOtherSide) {
      timerRef.current = setTimeout(() => {
        toast.error("Call not connected");
        setCallingSnackBarOpen(false);
        dispatch(resetCallDetails());
      }, 10000);
      createCallDocument(userOnOtherSide);
    }

    return () => {
      clearTimer();
      if (unsubscribeFromCreateCallDocument.current)
        unsubscribeFromCreateCallDocument.current();
    };
  }, [callState, createCallDocument, dispatch]);

  // listenner for resetting states

  useEffect(() => {
    if (history.action === "POP") {
      dispatch(resetCallDetails());
      setCallingSnackBarOpen(false);
      clearTimer();
    }
  }, [dispatch, history]);

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
      <Snackbar open={callingSnackBarOpen} message="Calling..." />
    </div>
  );
};

export default Dashboard;
