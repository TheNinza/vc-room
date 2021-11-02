import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { firestore } from "../lib/firebase/firebase";
import Peer from "simple-peer";

const useOnCall = () => {
  const callDocId = useSelector((state) => state.call.activeCall?.callDocId);
  console.log(callDocId);
  const isReceivingCall = useSelector((state) => state.call.isReceivingCall);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  const [stream, setStream] = useState();

  const peerRef = useRef(new Peer());

  const getLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(stream);
    localVideoRef.current.srcObject = stream;
  };

  useEffect(() => {
    // get local video stream
    getLocalStream();

    return () => {
      stream?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, [stream]);

  useEffect(() => {
    if (callDocId && stream) {
      console.log("streaaaaammm", stream);
      if (isReceivingCall) {
        peerRef.current = new Peer({
          initiator: false,
          trickle: true,
          stream: stream,
        });

        peerRef.current.on("signal", (data) => {
          console.log("sending data", data);

          firestore
            .collection("calls")
            .doc(callDocId)
            .collection("receiver")
            .add(data);
        });
        firestore
          .collection("calls")
          .doc(callDocId)
          .collection("sender")
          .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                const data = change.doc.data();
                console.log("signalling data receiver", data);

                peerRef.current.signal(data);
              }
            });
          });

        peerRef.current.on("stream", (stream) => {
          console.log("stream received");
          remoteVideoRef.current.srcObject = stream;
        });
      } else {
        peerRef.current = new Peer({
          initiator: true,
          trickle: true,
          stream: stream,
        });

        peerRef.current.on("signal", (data) => {
          console.log("receiving data", data);

          firestore
            .collection("calls")
            .doc(callDocId)
            .collection("sender")
            .add(data);
        });
        firestore
          .collection("calls")
          .doc(callDocId)
          .collection("receiver")
          .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                const data = change.doc.data();
                console.log("signalling data caller", data);

                peerRef.current.signal(data);
              }
            });
          });

        peerRef.current.on("stream", (stream) => {
          console.log("stream received");
          remoteVideoRef.current.srcObject = stream;
        });
      }

      console.log(peerRef.current);
    }
  }, [callDocId, isReceivingCall, stream]);

  return {
    localVideoRef,
    remoteVideoRef,
  };
};

export default useOnCall;
