import { makeStyles, Paper } from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "../../features/notifications/notifications-slice";
import { firestore } from "../../lib/firebase/firebase";
import NotificationCard from "../NotificationCard/NotificationCard";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    top: "8vh",
    right: "1rem",
    width: "20rem",
    padding: "0.5rem",
    zIndex: 2000,
    backdropFilter: "blur( 10px )",
    WebkitBackdropFilter: "blur( 10px )",
    background: "rgba(0, 0, 0, 0.3)",
    height: "28rem",

    overflow: "scroll",
    textAlign: "center",
  },
}));

const NotificationDropDown = ({ uid }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const notificationsData = useSelector(
    (state) => state.notifications.notificationsData
  );

  useEffect(() => {
    let unsubscribe;
    if (uid.length) {
      firestore
        .collection("users")
        .doc(uid)
        .collection("notifications")
        .onSnapshot(async (snapshot) => {
          const notifs = snapshot.docs.map((doc) => doc.data());

          let array = [];

          for (let i = 0; i < notifs.length; i++) {
            const query = firestore
              .collection("notifications")
              .doc(notifs[i].notificationId);

            const notifSnapshot = await query.get();

            const data = notifSnapshot.data();

            array.push({
              ...data,
              notificationId: notifSnapshot.id,

              // by default, firebase server timestamp is not serialisable
              createdAt: data.createdAt?.toMillis() || 0,
            });
          }

          dispatch(setNotifications(array));
        });
    }

    return unsubscribe;
  }, [uid, dispatch]);

  return (
    <Paper className={classes.root}>
      {notificationsData.map((notification) => (
        <NotificationCard
          notification={notification}
          key={notification.notificationId}
        />
      ))}
    </Paper>
  );
};

export default NotificationDropDown;
