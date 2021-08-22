import {
  Avatar,
  Button,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import CallIcon from "@material-ui/icons/Call";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "11rem",
    height: "18rem",
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
  controls: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "auto",
  },
}));

const RecentCallCard = ({ card: { name, id, image, time } }) => {
  const classes = useStyles();

  // helper functions
  const generateTimeDifference = () => {
    const currentTime = Date.now();

    const hours = moment(currentTime).diff(moment(time), "hours");
    if (hours > 0) return `${hours} hours`;

    const minutes = moment(currentTime).diff(moment(time), "minutes");
    if (minutes > 0) return `${minutes} minutes`;

    const seconds = moment(currentTime).diff(moment(time), "seconds");
    if (seconds > 0) return `${seconds} seconds`;
  };
  return (
    <Paper elevation={6} className={classes.root}>
      <Avatar alt="profile" src={image} className={classes.avatarImage} />
      <Typography variant="h6">{name}</Typography>
      <Typography color="textSecondary" variant="subtitle2">
        {generateTimeDifference()} ago
      </Typography>

      <div className={classes.controls}>
        <div className={classes.control}>
          <Button
            style={{ padding: "5px", borderRadius: "50%", minWidth: 0 }}
            variant="outlined"
            color="primary"
          >
            <CallIcon style={{ fontSize: "2rem" }} />
          </Button>
        </div>
        <div className={classes.control}>
          <Button
            style={{ padding: "5px", borderRadius: "50%", minWidth: 0 }}
            variant="outlined"
            color="secondary"
          >
            <ClearIcon style={{ fontSize: "2rem" }} />
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default RecentCallCard;
