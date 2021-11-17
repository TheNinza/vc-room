import { makeStyles } from "@material-ui/styles";
import { useState, useEffect } from "react";
import { firestore } from "../../lib/firebase/firebase";
import { Avatar, Button, Paper, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
} from "../../features/friends-api/friends-api-slice";

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
  notificationBody: {
    flex: 1,
  },
  buttonContainer: {
    display: "flex",
    gap: "0.5rem",
  },
}));

const NotificationCard = ({ notification }) => {
  const classes = useStyles();

  const [toUser, setToUser] = useState(null);

  const currentUserUID = useSelector((state) => state.user.userData.uid);

  const notificationRecieved = !!(currentUserUID === notification.to);

  const [acceptReq] = useAcceptFriendRequestMutation();
  const [declineReq] = useDeclineFriendRequestMutation();

  const { photoURL, displayName } = toUser
    ? toUser
    : { photoURL: "", displayName: "" };

  useEffect(() => {
    if (notificationRecieved) {
      firestore
        .collection("users")
        .doc(notification.from)
        .get()
        .then((res) => setToUser(res.data()));
    } else {
      firestore
        .collection("users")
        .doc(notification.to)
        .get()
        .then((res) => setToUser(res.data()));
    }
  }, [notification, notificationRecieved]);

  // custom Functions

  const acceptRequest = () => {
    acceptReq({
      friendUid: notification.from,
      notifId: notification.notificationId,
    });
  };

  const declineRequest = () => {
    declineReq({
      friendUid: notificationRecieved ? notification.from : notification.to,
      notifId: notification.notificationId,
    });
  };

  // conditional rendering functions

  const notificationBody = () => {
    if (notification.status === "pending") {
      if (notificationRecieved)
        return `${displayName} has sent you a connection request.`;
      else {
        return `You sent a connection request to ${displayName}.`;
      }
    }
    if (notification.status === "accepted") {
      if (notificationRecieved) {
        return `You have accepted ${displayName}'s connection request.`;
      } else {
        return `${displayName} has accepted your connection request.`;
      }
    }
  };

  const conditionalButtons = () => {
    if (notification.status === "pending") {
      if (notificationRecieved) {
        return (
          <div className={classes.buttonContainer}>
            <Button
              style={{ padding: "5px 9px" }}
              variant="outlined"
              color="primary"
              onClick={acceptRequest}
            >
              Accept
            </Button>
            <Button
              style={{ padding: "5px 9px" }}
              variant="outlined"
              color="secondary"
              onClick={declineRequest}
            >
              Decline
            </Button>
          </div>
        );
      } else {
        return (
          <Button
            style={{ padding: "5px 9px" }}
            variant="outlined"
            color="secondary"
            onClick={declineRequest}
          >
            Decline
          </Button>
        );
      }
    }
  };

  return (
    <Paper elevation={3} className={classes.root}>
      <Avatar alt="profile" src={photoURL} className={classes.avatar} />
      <Typography
        variant="caption"
        className={classes.notificationBody}
        align="left"
      >
        {notificationBody()}
      </Typography>
      {conditionalButtons()}
    </Paper>
  );
};

export default NotificationCard;
