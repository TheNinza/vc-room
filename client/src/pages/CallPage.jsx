import {
  Avatar,
  Button,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import endCallSource from "../assets/endCallIcon.svg";
import incomingVideoSrc from "../assets/streamIncomingDummy.mp4";
import outgoingVideoSrc from "../assets/streamOutgoingDummy.mp4";

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
  },
  stream: {
    position: "relative",
    height: "100%",
    flex: 1,
    overflow: "hidden",
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
  },
  endCallImage: {
    height: "5rem",
  },
}));

const CallPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.callContainer}>
        <div className={classes.streams}>
          <Paper elevation={5} className={classes.stream}>
            <video src={incomingVideoSrc} autoPlay loop></video>
            <div className={classes.userInfo}>
              <Avatar
                src="https://images.pexels.com/photos/3283568/pexels-photo-3283568.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                alt="profilePhoto"
                className={classes.avatar}
              />
              <Typography variant="h6">Raechel Jain</Typography>
            </div>
          </Paper>
          <Paper elevation={5} className={classes.stream}>
            <video src={outgoingVideoSrc} autoPlay loop></video>
            <div className={classes.userInfo}>
              <Avatar
                src="https://images.pexels.com/photos/3748221/pexels-photo-3748221.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                alt="profilePhoto"
                className={classes.avatar}
              />
              <Typography variant="h6">Mike Ross</Typography>
            </div>
          </Paper>
        </div>
        <div className={classes.controlls}>
          <Button color="secondary">
            <img
              className={classes.endCallImage}
              src={endCallSource}
              alt="end call"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallPage;
