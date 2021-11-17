import { Avatar, makeStyles, Paper, Typography } from "@material-ui/core";

import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useSendFriendRequestMutation } from "../../features/friends-api/friends-api-slice";
// import { sendFriendRequest } from "../../features/friends/friends-slice";
import { firestore } from "../../lib/firebase/firebase";

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

  const [showButtons, setShowButtons] = useState(false);
  const userData = useSelector((state) => state.user.userData);
  // const dispatch = useDispatch();

  const [sendReq] = useSendFriendRequestMutation();

  const findIfYouWantToShowButtons = useCallback(async () => {
    try {
      const notifQuery = firestore
        .collection("notifications")
        .where("from", "==", userData.uid)
        .where("to", "==", uid)
        .where("status", "==", "pending");

      const notifRef = await notifQuery.get();

      const userQuery = firestore
        .collection("users")
        .doc(userData.uid)
        .collection("friends")
        .where("uid", "==", uid);

      const friendRef = await userQuery.get();

      setShowButtons(notifRef.empty && friendRef.empty);
    } catch (error) {
      console.error(error);
      toast.error("Some Network Error Occured");
    }
  }, [uid, userData]);

  useEffect(() => {
    findIfYouWantToShowButtons();
  }, [findIfYouWantToShowButtons]);

  if (uid === userData.uid) {
    return null;
  }

  // custom functions

  const sendFriendReq = async () => {
    await sendReq({ friendUid: uid });

    findIfYouWantToShowButtons();
  };

  return (
    <Paper elevation={3} className={classes.root}>
      <Avatar alt="profile" src={photoURL} className={classes.avatar} />
      <Typography variant="h6" className={classes.name}>
        {" "}
        {displayName}{" "}
      </Typography>
      {showButtons && (
        <GroupAddIcon onClick={sendFriendReq} className={classes.callIcon} />
      )}
    </Paper>
  );
};

export default SearchResultCard;
