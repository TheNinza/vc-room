import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { firestore } from "../lib/firebase/firebase";
import Peer from "simple-peer";
import toast from "react-hot-toast";
import { useHistory } from "react-router";

const useOnCall = () => {
  const history = useHistory();
  const callDocId = useSelector((state) => state.call.activeCall?.callDocId);
  const isReceivingCall = useSelector((state) => state.call.isReceivingCall);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  const [isRemoteStreamAvailable, setIsRemoteStreamAvailable] = useState(false);

  const [stream, setStream] = useState();

  const [isRemoteStreamVideoEnabled, setIsRemoteStreamVideoEnabled] =
    useState(true);

  const peerRef = useRef(new Peer());

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
      setIsAudioEnabled(stream.getAudioTracks()[0].enabled);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
      setIsVideoEnabled(stream.getVideoTracks()[0].enabled);
      peerRef.current.send(
        JSON.stringify({
          isVideoEnabled: stream.getVideoTracks()[0].enabled,
        })
      );
    }
  };

  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(stream);
      localVideoRef.current.srcObject = stream;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // get local video stream

    if (!stream) {
      getLocalStream();
    }

    return () => {
      stream?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, [stream]);

  useEffect(() => {
    if (callDocId && stream) {
      if (isReceivingCall) {
        peerRef.current = new Peer({
          initiator: false,
          trickle: false,
          stream: stream,
        });

        peerRef.current.on("signal", (data) => {
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
              if (change.type === "added" && !peerRef.current.destroyed) {
                const data = change.doc.data();

                peerRef.current.signal(data);
              }
            });
          });

        peerRef.current.on("stream", (stream) => {
          console.log("Stream Received");
          setIsRemoteStreamAvailable(true);
          toast.success("Connected Successfully");
          remoteVideoRef.current.srcObject = stream;
        });
      } else {
        peerRef.current = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
        });

        peerRef.current.on("signal", (data) => {
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
              if (change.type === "added" && !peerRef.current.destroyed) {
                const data = change.doc.data();

                peerRef.current.signal(data);
              }
            });
          });

        peerRef.current.on("stream", (stream) => {
          console.log("Stream Received");
          setIsRemoteStreamAvailable(true);
          toast.success("Connected Successfully");
          remoteVideoRef.current.srcObject = stream;
        });
      }
      peerRef.current.on("data", (data) => {
        const string = new TextDecoder().decode(data);
        const object = JSON.parse(string);
        setIsRemoteStreamVideoEnabled(object.isVideoEnabled);
      });
      peerRef.current.on("error", (event) => {
        toast.error("Something bad happened, retry call");
        history.push("/dashboard");
      });
      peerRef.current.on("close", () => {
        toast.error("Disconnected");
        history.push("/dashboard");
      });
      peerRef.current.addListener("end", () => {
        toast.error("Disconnected");
        history.push("/dashboard");
      });
      peerRef.current._pc.oniceconnectionstatechange = function () {
        if (peerRef.current._pc.iceConnectionState === "disconnected") {
          history.push("/dashboard");
        }
      };
    }

    return () => {
      peerRef.current.removeAllListeners();
      peerRef.current.destroy();
    };
  }, [callDocId, isReceivingCall, stream, history]);

  return {
    localVideoRef,
    remoteVideoRef,
    isRemoteStreamAvailable,
    peerRef,
    isReceivingCall,
    toggleAudio,
    toggleVideo,
    isAudioEnabled,
    isVideoEnabled,
    isRemoteStreamVideoEnabled,
  };
};

export default useOnCall;
