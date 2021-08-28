import { makeStyles } from "@material-ui/styles";
import { useState, useEffect } from "react";
import { firestore } from "../../lib/firebase/firebase";
import { Avatar, Paper, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    minHeight: "3.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    padding: "0.5rem",
    marginBottom: "1rem",
    backdropFilter: "blur( 10px )",
    WebkitBackdropFilter: "blur( 10px )",
    background: "rgba(0, 0, 0, 0.13)",
  },
  name: {
    flex: 1,
  },
}));

const NotificationCard = ({ notification }) => {
  const classes = useStyles();

  const [toUser, setToUser] = useState(null);

  const currentUserUID = useSelector((state) => state.user.userData.uid);

  const notificationRecieved = !!(currentUserUID === notification.to);

  const { photoURL, displayName } = toUser
    ? toUser
    : { photoURL: "", displayName: "" };

  useEffect(() => {
    if (notification?.to) {
      firestore
        .collection("users")
        .doc(notification.to)
        .get()
        .then((res) => setToUser(res.data()));
    }
  }, [notification]);

  const notificationBody = () => {
    if (notification.status === "pending") {
      if (notificationRecieved)
        return `${displayName} has sent you a connection request.`;
      else {
        return `You sent a connection request to ${displayName}.`;
      }
    }
    if (notification.status === "accepted") {
      return `${displayName} has accepted you a connection request.`;
    }
  };

  return (
    <Paper elevation={3} className={classes.root}>
      <Avatar alt="profile" src={photoURL} className={classes.avatar} />
      <Typography variant="caption" className={classes.name} align="left">
        {notificationBody()}
      </Typography>
    </Paper>
  );
};

export default NotificationCard;
