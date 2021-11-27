import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Paper,
} from "@material-ui/core";
import CallIcon from "@material-ui/icons/Call";
import Delete from "@material-ui/icons/CloseOutlined";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useOnScreen from "../../hooks/useOnScreen";
import { firestore } from "../../lib/firebase/firebase";
import { useRemoveFriendMutation } from "../../features/friends-api/friends-api-slice";
import { useCreateCallMutation } from "../../features/call-api/call-api-slice";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem",
    marginBottom: "1rem",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "0.5rem",
    },
  },
  name: {
    fontSize: "1rem",
    flex: 1,
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
  callIcon: {
    transform: "scaleX(-1)",
    transition: "all 0.5s ease",
    cursor: "pointer",
    fontSize: "2rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.5rem",
    },

    "&.call-icon": {
      marginRight: "0.5rem",
      "&:hover": {
        color: theme.palette.secondary.main,
      },
    },

    "&.remove-icon": {
      color: theme.palette.grey[600],
      "&:hover": {
        color: theme.palette.error.main,
      },
    },
  },
  noPadding: {
    padding: 0,
    minWidth: "fit-content",
    "&:first-child": {
      marginRight: "1rem",
    },
  },
}));

const PanelFriendCard = ({ friend, searchData = false }) => {
  const classes = useStyles();
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = useState(false);

  const callingStatus = useSelector((state) => state.call.callingStatus);
  const [createCall] = useCreateCallMutation();

  const ref = useRef();

  const isIntersecting = useOnScreen(ref);

  const [removeFriend] = useRemoveFriendMutation();

  const getMoreUserDetails = useCallback(async () => {
    if (!userData) {
      try {
        const query = firestore.collection("users").doc(friend.uid);

        const userRef = await query.get();

        setUserData(userRef.data());
      } catch (error) {
        console.error(error);
      }
    }
  }, [friend, userData]);

  useEffect(() => {
    if (isIntersecting && !searchData) {
      getMoreUserDetails();
    } else if (searchData) {
      setUserData(friend);
    }
  }, [isIntersecting, searchData, friend, getMoreUserDetails]);

  const handleCallClick = () => {
    createCall({
      userOnOtherSide: userData.uid,
    });
  };

  const handleRemoveFriend = () => {
    removeFriend({
      friendUid: friend.uid,
    });
  };

  return (
    <Paper ref={ref} elevation={3} className={classes.root}>
      {userData && (
        <>
          <Avatar
            style={{ marginRight: "1rem" }}
            alt="profile"
            src={userData.photoURL}
          />
          <div className={classes.name}>{userData.displayName}</div>
          <Button
            disableElevation
            disabled={callingStatus}
            className={classes.noPadding}
            onClick={handleCallClick}
          >
            <CallIcon className={`${classes.callIcon} call-icon`} />
          </Button>
          <Button
            onClick={() => setOpen(true)}
            disableElevation
            className={classes.noPadding}
          >
            <Delete className={`${classes.callIcon} remove-icon`} />
          </Button>
          {/* confirmation dialog while removing friend */}
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`Are you sure to remove ${userData.displayName} from your friends?`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                This action cannot be undone. Also all call history will be
                deleted.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleRemoveFriend} color="secondary" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Paper>
  );
};

export default PanelFriendCard;
