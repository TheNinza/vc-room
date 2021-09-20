import { Avatar, Button, makeStyles, Paper } from "@material-ui/core";
import CallIcon from "@material-ui/icons/Call";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useOnScreen from "../../hooks/useOnScreen";
import {
  setCallingStatus,
  setIsReceivingCall,
  setUserOnOtherSide,
} from "../../features/call/call-slice";
import { firestore } from "../../lib/firebase/firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    padding: "0.5rem",
    marginBottom: "1rem",
  },
  name: {
    fontSize: "1rem",
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
  noPadding: {
    padding: 0,
  },
}));

const PanelFriendCard = ({ friend, searchData = false }) => {
  const classes = useStyles();
  const [userData, setUserData] = useState(null);

  const callingStatus = useSelector((state) => state.call.callingStatus);

  const ref = useRef();

  const isIntersecting = useOnScreen(ref);
  const dispatch = useDispatch();

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
    dispatch(setUserOnOtherSide(userData.uid));
    dispatch(setIsReceivingCall(false));
    dispatch(setCallingStatus(true));
  };
  return (
    <Paper ref={ref} elevation={3} className={classes.root}>
      {userData && (
        <>
          <Avatar alt="profile" src={userData.photoURL} />
          <div className={classes.name}>{userData.displayName}</div>
          <Button
            disableElevation
            disabled={callingStatus}
            className={classes.noPadding}
            onClick={handleCallClick}
          >
            <CallIcon className={classes.callIcon} />
          </Button>
        </>
      )}
    </Paper>
  );
};

export default PanelFriendCard;
