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
