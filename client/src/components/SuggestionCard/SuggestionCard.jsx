import {
  Avatar,
  Button,
  CircularProgress,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { useRef, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { sendFriendRequest } from "../../features/friends/friends-slice";
import useOnScreen from "../../hooks/useOnScreen";
import { firestore } from "../../lib/firebase/firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "11rem",
    minHeight: "18rem",
    margin: "1rem 0",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  avatarImage: {
    height: theme.spacing(12),
    width: theme.spacing(12),
    marginTop: "1rem",
  },
  friends: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    flex: 1,
  },
}));

const SuggestionCard = ({ uid, refetch }) => {
  const classes = useStyles();
  const cardRef = useRef();
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.user.userData.uid);

  const isOnScreen = useOnScreen(cardRef);
  const [cardData, setCardData] = useState({
    displayName: "",
    photoURL: "",
    status: "",
  });
  const [friendCount, setFriendCount] = useState(0);

  useEffect(() => {
    if (isOnScreen) {
      firestore
        .collection("users")
        .doc(uid)
        .get()
        .then((snapshot) => {
          setCardData(snapshot.data());
        });

      firestore
        .collection("users")
        .doc(uid)
        .collection("friends")
        .get()
        .then((snapshot) => {
          setFriendCount(snapshot.docs.length);
        });
    }
  }, [isOnScreen, uid]);

  // helper functions
  const sendFriendReq = async () => {
    const dispatchObj = await dispatch(
      sendFriendRequest({ friendUid: uid, uid: currentUserId })
    );
    if (dispatchObj.meta.requestStatus === "fulfilled") {
      toast.success(dispatchObj.payload.message);
      refetch();
    } else {
      toast.error(dispatchObj.payload.message);
    }
  };
  return (
    <Paper ref={cardRef} elevation={6} className={classes.root}>
      <Avatar
        alt="profile"
        src={cardData.photoURL}
        className={classes.avatarImage}
      />
      {cardData.displayName.length ? (
        <>
          <Typography variant="h6">{cardData.displayName}</Typography>
          <div className={classes.friends}>
            <Typography variant="subtitle1" color="textSecondary">
              Friends:{" "}
              <Typography
                variant="subtitle1"
                color="textPrimary"
                component="span"
              >
                {friendCount}
              </Typography>
            </Typography>
            <Button
              style={{ padding: "2px 8px", minWidth: 0 }}
              variant="outlined"
              color="primary"
              onClick={sendFriendReq}
            >
              <GroupAddIcon />
            </Button>
          </div>
          <Typography
            style={{ fontStyle: "italic", marginTop: "1.5rem" }}
            color="textSecondary"
            variant="subtitle2"
            align="center"
          >
            "{cardData.status}"
          </Typography>
        </>
      ) : (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )}
    </Paper>
  );
};

export default SuggestionCard;
