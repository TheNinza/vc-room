import {
  Avatar,
  makeStyles,
  Paper,
  Typography,
  Badge,
  withStyles,
  Divider,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import profileSvgSrc from "../../assets/profileWave.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    overflow: "hidden",
  },
  imagePreview: {
    position: "relative",
    background: theme.palette.primary.main,
    height: "7rem",
    width: "100%",
  },

  wave: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    transform: "translateY(70%)",
  },
  imageContainer: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translate(-50%, 50%)",
    borderRadius: "50%",
    border: `5px solid ${theme.palette.background.paper}`,
  },
  image: {
    height: theme.spacing(17),
    width: theme.spacing(17),
  },
  profileText: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(2),
  },
  detailsText: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
  dot: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    borderRadius: "50%",
  },
}))(Badge);

const UserPanel = () => {
  const classes = useStyles();

  const {
    userData: { displayName, status, photoURL },
  } = useSelector((state) => state.user);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={6}>
        <div className={classes.imagePreview}>
          <img className={classes.wave} src={profileSvgSrc} alt="wave" />
          <div className={classes.imageContainer}>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar className={classes.image} alt="photo" src={photoURL} />
            </StyledBadge>
          </div>
        </div>
        <div className={classes.profileText}>
          <Typography gutterBottom variant="h5" align="center">
            {displayName}
          </Typography>
          <Typography
            variant="subtitle2"
            align="center"
            component="div"
            color="textSecondary"
            style={{ fontStyle: "italic" }}
          >
            "{status}"
          </Typography>
        </div>

        <Divider />

        <div className={classes.detailsText}>
          <Typography
            gutterBottom
            variant="h5"
            align="center"
            color="textSecondary"
          >
            Friends
          </Typography>
          <Typography
            gutterBottom
            variant="h5"
            align="center"
            color="textPrimary"
          >
            24
          </Typography>
        </div>

        <Divider />

        <div className={classes.detailsText}>
          <Link to="/profile">
            <Typography
              variant="subtitle2"
              align="center"
              component="div"
              color="primary"
              style={{ textDecoration: "underline" }}
            >
              View Profile
            </Typography>
          </Link>
        </div>
      </Paper>
    </div>
  );
};

export default UserPanel;
