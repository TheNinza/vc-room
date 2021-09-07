import {
  Avatar,
  Button,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import incomingVideoSrc from "../assets/streamIncomingDummy.mp4";
import MicIcon from "@material-ui/icons/Mic";
import CallEndIcon from "@material-ui/icons/CallEnd";
import VideocamIcon from "@material-ui/icons/Videocam";
import useOnCall from "../hooks/useOnCall";
import { useSelector } from "react-redux";

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
}));

const CallPage = () => {
  const classes = useStyles();
  const userData = useSelector((state) => state?.user?.userData);

  const { photoURL, displayName } = userData || {
    photoURL: "",
    displayName: "",
  };
  const {
    localVideoRef,
    remoteVideoRef,
    callAcceptedByUser,
    callDeclinedByUser,
  } = useOnCall();

  console.log({
    localVideoRef,
    remoteVideoRef,
    callAcceptedByUser,
    callDeclinedByUser,
  });

  return (
    <div className={classes.root}>
      <div className={classes.callContainer}>
        <div className={classes.streams}>
          {callAcceptedByUser && (
            <Paper elevation={5} className={classes.stream}>
              <video
                ref={remoteVideoRef}
                src={incomingVideoSrc}
                autoPlay
                loop
              ></video>
              <div className={classes.userInfo}>
                <Avatar
                  src="https://images.pexels.com/photos/3283568/pexels-photo-3283568.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                  alt="profilePhoto"
                  className={classes.avatar}
                />
                <Typography variant="h6">Raechel Jain</Typography>
              </div>
            </Paper>
          )}
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
          >
            <CallEndIcon className={classes.buttonIcon} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallPage;
