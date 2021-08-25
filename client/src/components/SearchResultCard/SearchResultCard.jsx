import { Avatar, makeStyles, Paper, Typography } from "@material-ui/core";

import GroupAddIcon from "@material-ui/icons/GroupAdd";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { firestore, serverTimestamp } from "../../lib/firebase/firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    minHeight: "5rem",
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
  callIcon: {
    transform: "scaleX(-1)",
    transition: "all 0.5s ease",
    cursor: "pointer",
    fontSize: "2rem",

    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
  avatar: {
    height: theme.spacing(10),
    width: theme.spacing(10),
  },
}));

const SearchResultCard = ({ uid, displayName, photoURL }) => {
  const classes = useStyles();

  const userData = useSelector((state) => state.user.userData);

  if (uid === userData.uid) {
    return null;
  }

  // custom functions

  const sendFriendReq = async () => {
    try {
      const batch = firestore.batch();

      const timeStamp = serverTimestamp();

      const notificationRef = firestore.collection("notifications").doc();
      const senderNotificationRef = firestore
        .collection("users")
        .doc(userData.uid)
        .collection("notifications")
        .doc(notificationRef.id);

      const recieverNotificationRef = firestore
        .collection("users")
        .doc(uid)
        .collection("notifications")
        .doc(notificationRef.id);

      batch.set(notificationRef, {
        from: userData.uid,
        to: uid,
        status: "pending",
        createdAt: timeStamp,
      });

      batch.set(senderNotificationRef, {
        notificationId: notificationRef.id,
        createdAt: timeStamp,
      });

      batch.set(recieverNotificationRef, {
        notificationId: notificationRef.id,
        createdAt: timeStamp,
      });

      await batch.commit();

      toast.success("Friend Request Sent");
    } catch (error) {
      toast.error("Can't Send Friend Request");
    }
  };

  return (
    <Paper elevation={3} className={classes.root}>
      <Avatar alt="profile" src={photoURL} className={classes.avatar} />
      <Typography variant="h6" className={classes.name}>
        {" "}
        {displayName}{" "}
      </Typography>
      <GroupAddIcon onClick={sendFriendReq} className={classes.callIcon} />
    </Paper>
  );
};

export default SearchResultCard;
