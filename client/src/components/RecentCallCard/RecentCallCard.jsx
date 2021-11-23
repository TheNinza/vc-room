import {
  Avatar,
  Button,
  CircularProgress,
  makeStyles,
  Paper,
  Typography,
  Tooltip,
} from "@material-ui/core";
import moment from "moment";
import CallIcon from "@material-ui/icons/Call";
import ClearIcon from "@material-ui/icons/Clear";
import CallMadeIcon from "@material-ui/icons/CallMade";
import CallReceivedIcon from "@material-ui/icons/CallReceived";
import { useEffect, useRef, useState } from "react";
import useOnScreen from "../../hooks/useOnScreen";
import { firestore } from "../../lib/firebase/firebase";
import { useDispatch } from "react-redux";
import { createCall } from "../../features/call/call-slice";
import toast from "react-hot-toast";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "11rem",
    height: "18rem",
    margin: "1rem 0",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
  },
  avatarImage: {
    height: theme.spacing(12),
    width: theme.spacing(12),
    marginTop: "1rem",
  },
  controls: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "auto",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
}));

const RecentCallCard = ({ card }) => {
  const classes = useStyles();

  const cardRef = useRef();
  const isOnScreen = useOnScreen(cardRef);

  const [cardData, setCardData] = useState({ displayName: "", photoURL: "" });

  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribe;
    if (isOnScreen) {
      unsubscribe = firestore
        .collection("users")
        .doc(card.isCaller ? card.userOnOtherSide : card.from)
        .get()
        .then((snapshot) => {
          const { displayName, photoURL } = snapshot.data();
          setCardData({ displayName, photoURL });
        });
    }
    return unsubscribe;
  }, [card, isOnScreen]);

  const calculateTimeDiff = () => {
    const units = ["year", "month", "day", "hour", "minute", "second"];

    for (const unit of units) {
      if (unit) {
        const i = moment().diff(moment(card.timeStamp), unit);
        if (!!i) {
          return `${i} ${unit}${i > 1 ? "s" : ""} ago`;
        }
      }
    }
  };

  const handleCallClick = () => {
    dispatch(createCall(card.userOnOtherSide));
  };

  const handleDelete = async () => {
    try {
      await firestore.collection("calls").doc(card.id).delete();
      toast.success("Deleted!!");
    } catch (error) {
      toast.error("Error deleting call");
    }
  };

  const getTitle = () => {
    return `${card.isCaller ? "Outgoing" : "Incomming"}  ${
      card.callAccepted
        ? "call accepted"
        : card.callDeclined
        ? "call declined"
        : "call didn't connect"
    }`;
  };

  return (
    <Paper ref={cardRef} elevation={6} className={classes.root}>
      {cardData.displayName.length === 0 ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Avatar
            alt="profile"
            src={cardData.photoURL}
            className={classes.avatarImage}
          />
          <Typography variant="h6">{cardData.displayName}</Typography>
          <Tooltip title={getTitle()} arrow>
            <Button
              style={{ padding: "5px", borderRadius: "50%", minWidth: 0 }}
              color={
                card.callAccepted
                  ? "primary"
                  : card.callDeclined
                  ? "secondary"
                  : "default"
              }
              disableElevation={!card.callAccepted && !card.callDeclined}
            >
              {card.isCaller ? <CallMadeIcon /> : <CallReceivedIcon />}
            </Button>
          </Tooltip>
          <Typography color="textSecondary" variant="subtitle2">
            {calculateTimeDiff()}
          </Typography>

          <div className={classes.controls}>
            <div className={classes.control}>
              <Button
                style={{ padding: "5px", borderRadius: "50%", minWidth: 0 }}
                variant="outlined"
                color="primary"
                onClick={handleCallClick}
              >
                <CallIcon style={{ fontSize: "2rem" }} />
              </Button>
            </div>
            <div className={classes.control}>
              <Button
                style={{ padding: "5px", borderRadius: "50%", minWidth: 0 }}
                variant="outlined"
                color="secondary"
                onClick={handleDelete}
              >
                <ClearIcon style={{ fontSize: "2rem" }} />
              </Button>
            </div>
          </div>
        </>
      )}
    </Paper>
  );
};

export default RecentCallCard;
