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
    [theme.breakpoints.down("sm")]: {
      marginTop: "10vh",
    },
  },
  callContainer: {
    width: "80%",
    height: "70vh",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "90vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
  },
  streams: {
    display: "flex",
    gap: "2rem",
    height: "80%",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      width: "100%",
      gap: "0.5rem",
    },
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
  mutedVideoUserInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  },
  mutedVideoAvatar: {
    height: 100,
    width: 100,
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
  strikeThrough: {
    clipPath: "polygon(95% 0, 100% 5%, 5% 100%, 0 95%)",
    background: theme.palette.secondary.main,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
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
    toggleAudio,
    toggleVideo,
    isAudioEnabled,
    isVideoEnabled,
    isRemoteStreamVideoEnabled,
  } = useOnCall();

  const activeCall = useSelector((state) => state.call.activeCall);

  useEffect(() => {
    if (activeCall) {
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
    }
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
            <div
              className={
                isRemoteStreamVideoEnabled
                  ? classes.userInfo
                  : classes.mutedVideoUserInfo
              }
            >
              <Avatar
                src={otherPhotoURL}
                alt="profilePhoto"
                className={
                  isRemoteStreamVideoEnabled ? "" : classes.mutedVideoAvatar
                }
              />
              <Typography variant="h6">{otherDisplayName}</Typography>
            </div>
          </Paper>

          <Paper elevation={5} className={classes.stream}>
            {/* must mute own video to avoid feedback */}
            <video ref={localVideoRef} muted autoPlay playsInline></video>
            <div
              className={
                isVideoEnabled ? classes.userInfo : classes.mutedVideoUserInfo
              }
            >
              <Avatar
                src={photoURL}
                alt="profilePhoto"
                className={isVideoEnabled ? "" : classes.mutedVideoAvatar}
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
              position: "relative",
              overflow: "hidden",
            }}
            variant="outlined"
            color={isAudioEnabled ? "primary" : "secondary"}
            onClick={toggleAudio}
            disableElevation={!isAudioEnabled}
          >
            <MicIcon className={classes.buttonIcon} />
            <div className={isAudioEnabled ? "" : classes.strikeThrough}></div>
          </Button>
          <Button
            style={{
              borderRadius: "50%",
              width: "4rem",
              height: "4rem",
              minWidth: "0px",
              position: "relative",
              overflow: "hidden",
            }}
            variant="outlined"
            color={isVideoEnabled ? "primary" : "secondary"}
            onClick={toggleVideo}
            disableElevation={!isVideoEnabled}
          >
            <VideocamIcon className={classes.buttonIcon} />
            <div className={isVideoEnabled ? "" : classes.strikeThrough}></div>
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
