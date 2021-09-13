import React, { useEffect, useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import { useDispatch, useSelector } from "react-redux";
import {
  setIncomingCallDetails,
  setIsReceivingCall,
} from "../../features/call/call-slice";
import {
  Avatar,
  makeStyles,
  Paper,
  Typography,
  Button,
} from "@material-ui/core";
import { firestore } from "../../lib/firebase/firebase";
import CallIcon from "@material-ui/icons/Call";
import ClearIcon from "@material-ui/icons/Clear";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    backdropFilter: "blur( 10px )",
    WebkitBackdropFilter: "blur( 10px )",
    background: "rgba(0, 0, 0, 0.3)",
    color: theme.palette.text.primary,
    width: "15rem",
    aspectRatio: 11 / 16,
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    animation: `$myEffect 1s linear infinite alternate`,
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    marginTop: "auto",
    gap: "1rem",
  },
  "@keyframes myEffect": {
    "0%": {
      transform: "translateY(0)",
    },
    "100%": {
      transform: "translateY(5px)",
    },
  },
}));

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

const IncomingCallNotification = () => {
  const classes = useStyles();

  const history = useHistory();

  const [open, setOpen] = useState(false);
  const [transition, setTransition] = useState(undefined);
  const [callingUser, setCallingUser] = useState(null);

  const incomingCallDetails = useSelector(
    (state) => state.call.incomingCallDetails
  );
  const dispatch = useDispatch();

  const handleClick = (Transition) => () => {
    setTransition(() => Transition);
    setOpen(true);
  };

  const handleClose = () => {
    dispatch(setIncomingCallDetails(null));
    setOpen(false);
  };
  const handleAcceptCall = () => {
    handleClose();
    setTimeout(() => {
      history.push("/call");
    }, 1000);
  };

  const getUserFromId = async (uid) => {
    const query = firestore.collection("users").doc(uid);
    const snapshot = await query.get();
    setCallingUser(snapshot.data());
  };

  useEffect(() => {
    dispatch(setIncomingCallDetails(null));
  }, [dispatch]);

  useEffect(() => {
    if (incomingCallDetails) {
      handleClick(TransitionLeft)();
      getUserFromId(incomingCallDetails.from);
    }
  }, [incomingCallDetails]);

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      TransitionComponent={transition}
      key={transition ? transition.name : ""}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Paper elevation={7} className={classes.root}>
        <Typography variant="h5" align="center" gutterBottom>
          Incoming Call
        </Typography>
        {callingUser && (
          <>
            <Avatar
              src={callingUser.photoURL}
              alt="Incoming Call Profile"
              style={{ height: "7rem", width: "7rem", margin: "1rem" }}
            />
            <Typography variant="h6" align="center" gutterBottom>
              {callingUser.displayName}
            </Typography>
            <div className={classes.controls}>
              <div className={classes.control}>
                <Button
                  style={{ padding: "5px", borderRadius: "50%", minWidth: 0 }}
                  variant="outlined"
                  color="primary"
                  onClick={handleAcceptCall}
                >
                  <CallIcon style={{ fontSize: "3rem" }} />
                </Button>
              </div>
              <div className={classes.control}>
                <Button
                  style={{ padding: "5px", borderRadius: "50%", minWidth: 0 }}
                  variant="outlined"
                  color="secondary"
                  onClick={handleClose}
                >
                  <ClearIcon style={{ fontSize: "3rem" }} />
                </Button>
              </div>
            </div>
          </>
        )}
      </Paper>
    </Snackbar>
  );
};

export default IncomingCallNotification;
