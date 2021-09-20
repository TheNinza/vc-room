import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Peer from "simple-peer";
import { firestore, serverTimestamp } from "../lib/firebase/firebase";

const useOnCall = () => {
  const { userOnOtherSide, isReceivingCall, incomingCallDetails } = useSelector(
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

  const unsubscribeCreatingCallDocListner = useRef();
  const unsubscribeAnsweringCallDocListner = useRef();

  const getLocalStream = async () => {
    console.log("getting local stream");
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
      console.log("signalling", data);

      await callDoc.set({
        userOnOtherSide: userOnOtherSide,
        initiatorSignalData: data,
        from: currentUserUid,
        timeStamp: serverTimestamp(),
        callAccepted: false,
        callDeclined: false,
        receiverSignalData: null,
      });
    });

    peer.on("stream", (remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;
    });

    unsubscribeCreatingCallDocListner.current = callDoc.onSnapshot(
      (snapshot) => {
        const { callAccepted, receiverSignalData, callDeclined } =
          snapshot.data();
        if (callDeclined) {
          setCallDeclinedByUser(true);
        }
        if (callAccepted) {
          setCallAcceptedByUser(true);
          peer.signal(receiverSignalData);
        }
      }
    );

    peerConnectionRef.current = peer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answerCall = useCallback(async () => {
    console.log("answering", incomingCallDetails);
    const callDoc = firestore
      .collection("calls")
      .doc(incomingCallDetails.callDocId);

    const peer = new Peer({ initiator: false, stream: localStream });

    console.log(peer);

    peer.on("signal", async (data) => {
      console.log("data", data);
      const a = await callDoc.update({
        receiverSignalData: data,
      });

      console.log("result", a);
    });

    unsubscribeAnsweringCallDocListner.current = callDoc.onSnapshot(
      (snapshot) => {
        const { initiatorSignalData } = snapshot.data();
        peer.signal(initiatorSignalData);
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentUserUid) {
      getLocalStream();
      if (!isReceivingCall) {
        createNewCall();
      } else {
        answerCall();
      }
    }

    return () => {
      console.log("called");
      peerConnectionRef.current?.destroy();
      localStreamTracksRef.current?.forEach((track) => {
        track.stop();
      });
      unsubscribeCreatingCallDocListner?.current &&
        unsubscribeCreatingCallDocListner.current();
    };
  }, [
    createNewCall,
    userOnOtherSide,
    currentUserUid,
    isReceivingCall,
    answerCall,
  ]);

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
