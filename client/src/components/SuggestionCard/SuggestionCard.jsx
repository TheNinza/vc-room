import {
  Avatar,
  Button,
  CircularProgress,
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { useRef, useEffect, useState } from "react";
import { useSendFriendRequestMutation } from "../../features/friends-api/friends-api-slice";
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
    gap: "0.5rem",
    [theme.breakpoints.down("sm")]: {
      padding: "0.5rem",
      minHeight: "13rem",
      height: "fit-content",
      width: "7rem",
      gap: 0,
    },
  },
  avatarImage: {
    height: theme.spacing(12),
    width: theme.spacing(12),
    marginTop: "1rem",
    [theme.breakpoints.down("sm")]: {
      height: theme.spacing(8),
      width: theme.spacing(8),
      margin: 0,
      marginBottom: "0.5rem",
    },
  },
  friends: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
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
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const cardRef = useRef();
  const [sendReq] = useSendFriendRequestMutation();

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
    await sendReq({
      friendUid: uid,
    });
    refetch();
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
          <Typography variant={!matches ? "h5" : "subtitle1"}>
            {cardData.displayName}
          </Typography>
          <div className={classes.friends}>
            <Typography
              variant={!matches ? "subtitle1" : "caption"}
              color="textSecondary"
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              Friends:{" "}
              <Typography
                vvariant={!matches ? "subtitle1" : "caption"}
                color="textPrimary"
                style={{ display: "inline-block" }}
              >
                {friendCount}
              </Typography>
            </Typography>
            <Button
              style={{
                padding: !matches ? "5px" : "2px",
                minWidth: 0,
              }}
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
            variant={!matches ? "subtitle1" : "caption"}
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
