import {
  Avatar,
  Button,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import CallEndIcon from "@material-ui/icons/CallEnd";
import VideocamIcon from "@material-ui/icons/Videocam";
import useOnCall from "../hooks/useOnCall";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { firestore } from "../lib/firebase/firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
    position: "relative",
    marginTop: "7rem",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  callContainer: {
    width: "80%",
    height: "70vh",
  },
  streams: {
    display: "flex",
    gap: "2rem",
    height: "80%",
    justifyContent: "center",
  },
  stream: {
    position: "relative",
    height: "100%",
    flex: 1,
    overflow: "hidden",
    maxWidth: "700px",
    "& > video": {
      height: "100%",
      width: "100%",
      objectFit: "cover",
    },
  },
  userInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    background:
      "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.98) 100%)",
    padding: "1rem",
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  controlls: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "2rem",
    gap: "1rem",
  },
  buttonIcon: {
    width: "2rem",
    height: "2rem",
  },
  hiddenVideo: {
    display: "none",
  },
}));

const CallPage = () => {
  const classes = useStyles();
  const userData = useSelector((state) => state?.user?.userData);
  const [otherUserData, setOtherUserData] = useState({
    otherPhotoURL: "",
    otherDisplayName: "",
  });

  const { photoURL, displayName } = userData || {
    photoURL: "",
    displayName: "",
  };

  const { otherPhotoURL, otherDisplayName } = otherUserData || {
    otherPhotoURL: "",
    otherDisplayName: "",
  };
  const {
    localVideoRef,
    remoteVideoRef,
    isRemoteStreamAvailable,
    peerRef,
    isReceivingCall,
  } = useOnCall();

  const activeCall = useSelector((state) => state.call.activeCall);
  console.log({
    localVideoRef,
    remoteVideoRef,
  });

  useEffect(() => {
    const otherUserId = isReceivingCall
      ? activeCall.from
      : activeCall.userOnOtherSide;

    firestore
      .collection("users")
      .doc(otherUserId)
      .get()
      .then((doc) => {
        const { photoURL: otherPhotoURL, displayName: otherDisplayName } =
          doc.data();
        setOtherUserData({ otherPhotoURL, otherDisplayName });
      });
  }, [activeCall, isReceivingCall]);

  return (
    <div className={classes.root}>
      <div className={classes.callContainer}>
        <div className={classes.streams}>
          <Paper
            elevation={5}
            className={`${
              isRemoteStreamAvailable ? classes.stream : classes.hiddenVideo
            }`}
          >
            <video ref={remoteVideoRef} autoPlay playsInline></video>
            <div className={classes.userInfo}>
              <Avatar
                src={otherPhotoURL}
                alt="profilePhoto"
                className={classes.avatar}
              />
              <Typography variant="h6">{otherDisplayName}</Typography>
            </div>
          </Paper>

          <Paper elevation={5} className={classes.stream}>
            <video ref={localVideoRef} autoPlay playsInline></video>
            <div className={classes.userInfo}>
              <Avatar
                src={photoURL}
                alt="profilePhoto"
                className={classes.avatar}
              />
              <Typography variant="h6">{displayName}</Typography>
            </div>
          </Paper>
        </div>
        <div className={classes.controlls}>
          <Button
            style={{
              borderRadius: "50%",
              width: "4rem",
              height: "4rem",
              minWidth: "0px",
            }}
            variant="outlined"
            color="primary"
          >
            <MicIcon className={classes.buttonIcon} />
          </Button>
          <Button
            style={{
              borderRadius: "50%",
              width: "4rem",
              height: "4rem",
              minWidth: "0px",
            }}
            variant="outlined"
            color="primary"
          >
            <VideocamIcon className={classes.buttonIcon} />
          </Button>
          <Button
            style={{
              borderRadius: "50%",
              width: "4rem",
              height: "4rem",
              minWidth: "0px",
            }}
            variant="outlined"
            color="secondary"
            onClick={() => {
              peerRef.current.destroy();
            }}
          >
            <CallEndIcon className={classes.buttonIcon} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallPage;
