import React from "react";
import { makeStyles } from "@material-ui/styles";
import {
  AppBar,
  Badge,
  Button,
  InputAdornment,
  TextField,
  Typography,
  useScrollTrigger,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SearchIcon from "@material-ui/icons/Search";
import { auth } from "../../lib/firebase/firebase";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const ElevationScroll = (props) => {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 6 : 0,
  });
};

const useStyles = makeStyles((theme) => ({
  appBar: {
    padding: "1rem 16px",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    background: theme.palette.background.default,
    [theme.breakpoints.up("sm")]: {
      paddingLeft: "24px",
      paddingRight: "24px",
    },
  },
  logo: {
    fontFamily: "Allison",
    width: "fit-content",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
  },
  searchbar: {
    width: "50rem",
  },
  smoothAnimation: {
    borderRadius: theme.spacing(3),
    transition: "all 0.4s ease",
  },
}));

const Navbar = (props) => {
  // styles
  const classes = useStyles();
  const userData = useSelector((state) => state.user.userData);

  return (
    <ElevationScroll {...props}>
      <AppBar className={classes.appBar} elevation={0} color="transparent">
        <Link to="/">
          <Typography variant="h2" className={classes.logo}>
            Video Social
          </Typography>
        </Link>

        {userData && (
          <TextField
            className={classes.searchbar}
            variant="outlined"
            placeholder="Search People"
            margin="dense"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="inherit" />
                </InputAdornment>
              ),
              classes: {
                notchedOutline: classes.smoothAnimation,
              },
            }}
          />
        )}

        <div className={classes.navLinks}>
          {userData ? (
            <>
              <Button color="primary">
                <Badge color="primary" badgeContent={4}>
                  <NotificationsIcon />
                </Badge>
              </Button>
              <Button
                color="secondary"
                onClick={() => {
                  auth.signOut();
                  toast.success("Signed Out Successfully");
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                toast.success("This will be added soon");
              }}
            >
              Learn More
            </Button>
          )}
        </div>
      </AppBar>
    </ElevationScroll>
  );
};

export default Navbar;
