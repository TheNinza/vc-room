import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Peer from "simple-peer";
import { firestore, serverTimestamp } from "../lib/firebase/firebase";

const useOnCall = () => {
  const { userOnOtherSide, isReceivingCall } = useSelector(
    (state) => state.call
  );
  const currentUserUid = useSelector((state) => state.user?.userData?.uid);

  const [localStream, setLocalStream] = useState();
  const [callAcceptedByUser, setCallAcceptedByUser] = useState(false);
  const [callDeclinedByUser, setCallDeclinedByUser] = useState(false);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnectionRef = useRef();
  const localStreamTracksRef = useRef();

  const unsubscribeCallDocListner = useRef();

  const getLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
    localVideoRef.current.srcObject = stream;
  };

  const createNewCall = useCallback(async () => {
    const callDoc = firestore.collection("calls").doc();
    const peer = new Peer({ initiator: true, stream: localStream });

    peer.on("signal", async (data) => {
      await callDoc.set({
        userOnOtherSide: userOnOtherSide,
        signalData: data,
        from: currentUserUid,
        timeStamp: serverTimestamp(),
        callAccepted: false,
        callDeclined: false,
      });
    });

    peer.on("stream", (remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;
    });

    unsubscribeCallDocListner.current = callDoc.onSnapshot((snapshot) => {
      const { callAccepted, signalData, callDeclined } = snapshot.data();
      if (callDeclined) {
        setCallDeclinedByUser(true);
      }
      if (callAccepted) {
        setCallAcceptedByUser(true);
        peer.signal(signalData);
      }
    });

    peerConnectionRef.current = peer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userOnOtherSide && currentUserUid) {
      getLocalStream();
      if (!isReceivingCall) {
        createNewCall();
      }
    }

    return () => {
      console.log("called");
      peerConnectionRef.current?.destroy();
      localStreamTracksRef.current?.forEach((track) => {
        track.stop();
      });
      unsubscribeCallDocListner?.current && unsubscribeCallDocListner.current();
    };
  }, [createNewCall, userOnOtherSide, currentUserUid, isReceivingCall]);

  useEffect(() => {
    if (localStream) localStreamTracksRef.current = localStream.getTracks();
  }, [localStream]);

  return {
    localVideoRef,
    remoteVideoRef,
    localStream,
    callAcceptedByUser,
    callDeclinedByUser,
  };
};

export default useOnCall;
