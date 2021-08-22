import {
  Avatar,
  Button,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import GroupAddIcon from "@material-ui/icons/GroupAdd";

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
}));

const SuggestionCard = ({ card: { name, id, image, status } }) => {
  const classes = useStyles();

  // helper functions
  return (
    <Paper elevation={6} className={classes.root}>
      <Avatar alt="profile" src={image} className={classes.avatarImage} />
      <Typography variant="h6">{name}</Typography>
      <div className={classes.friends}>
        <Typography variant="subtitle1" color="textSecondary">
          Friends:{" "}
          <Typography variant="subtitle1" color="textPrimary" component="span">
            {Math.floor(Math.random() * 10 + 10)}
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
        "{status}"
      </Typography>
    </Paper>
  );
};

export default SuggestionCard;
