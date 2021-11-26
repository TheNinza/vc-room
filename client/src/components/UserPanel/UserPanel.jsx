import {
  Avatar,
  makeStyles,
  Paper,
  Typography,
  Badge,
  withStyles,
  Divider,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import profileSvgSrc from "../../assets/profileWave.svg";
import { selectNumFriends } from "../../features/friends/friends-selector";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      width: "unset",
      minWidth: "8rem",
      maxWidth: "8rem",
    },
  },
  paper: {
    width: "100%",
    overflow: "hidden",
    [theme.breakpoints.down("sm")]: {
      height: "100%",
      overflowY: "scroll",
    },
  },
  imagePreview: {
    position: "relative",
    background: theme.palette.primary.main,
    height: "7rem",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      height: "3rem",
    },
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
    [theme.breakpoints.down("sm")]: {
      height: theme.spacing(10),
      width: theme.spacing(10),
    },
  },
  profileText: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(2),
    },
  },
  detailsText: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      margin: 0,

      "&.profileLink": {
        margin: theme.spacing(1),
      },
    },
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

const UserPanel = ({ setFriendPanelHeight }) => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    userData: { displayName, status, photoURL },
  } = useSelector((state) => state.user);

  const numFriends = useSelector(selectNumFriends);

  const containerRef = useRef(null);

  // setting the height of container based on user profile card
  useEffect(() => {
    if (matches) {
      const height = containerRef.current?.getBoundingClientRect().height;
      setFriendPanelHeight(height);
      window.addEventListener("resize", () => {
        const height = containerRef.current?.getBoundingClientRect().height;
        setFriendPanelHeight(height);
      });
    } else {
      setFriendPanelHeight(null);
    }

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, [matches, setFriendPanelHeight]);

  return (
    <div ref={containerRef} className={classes.root}>
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
          <Typography
            gutterBottom
            variant={!matches ? "h5" : "subtitle1"}
            align="center"
          >
            {displayName}
          </Typography>
          <Typography
            variant={!matches ? "subtitle2" : "caption"}
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
            variant={!matches ? "h5" : "subtitle1"}
            align="center"
            color="textSecondary"
          >
            Friends
          </Typography>
          <Typography
            gutterBottom
            variant={!matches ? "h5" : "subtitle1"}
            align="center"
            color="textPrimary"
          >
            {numFriends}
          </Typography>
        </div>

        <Divider />

        <div className={`${classes.detailsText} profileLink`}>
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
