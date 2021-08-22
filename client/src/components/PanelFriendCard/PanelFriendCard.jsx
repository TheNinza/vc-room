import { Avatar, makeStyles, Paper } from "@material-ui/core";
import CallIcon from "@material-ui/icons/Call";

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
}));

const PanelFriendCard = ({ id, name, image }) => {
  const classes = useStyles();

  return (
    <Paper elevation={3} className={classes.root}>
      <Avatar alt="profile" src={image} />
      <div className={classes.name}> {name} </div>
      <CallIcon className={classes.callIcon} />
    </Paper>
  );
};

export default PanelFriendCard;
