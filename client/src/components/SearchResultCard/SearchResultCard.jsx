import { Avatar, makeStyles, Paper, Typography } from "@material-ui/core";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { useSelector } from "react-redux";
import { useSendFriendRequestMutation } from "../../features/friends-api/friends-api-slice";

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
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
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
    [theme.breakpoints.down("sm")]: {
      height: theme.spacing(6),
      width: theme.spacing(6),
    },
  },
}));

const SearchResultCard = ({
  uid = "",
  displayName = "",
  photoURL = "",
  isFriend = false,
}) => {
  const classes = useStyles();

  const userData = useSelector((state) => state.user.userData);

  const [sendReq] = useSendFriendRequestMutation();

  if (uid === userData.uid) {
    return null;
  }

  // custom functions

  const sendFriendReq = async () => {
    sendReq({ friendUid: uid });
  };

  return (
    <Paper elevation={3} className={classes.root}>
      <Avatar alt="profile" src={photoURL} className={classes.avatar} />
      <Typography variant="h6" className={classes.name}>
        {" "}
        {displayName}{" "}
      </Typography>
      {!isFriend && (
        <GroupAddIcon onClick={sendFriendReq} className={classes.callIcon} />
      )}
    </Paper>
  );
};

export default SearchResultCard;
