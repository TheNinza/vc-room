import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  AppBar,
  Badge,
  Button,
  ClickAwayListener,
  Typography,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from "@material-ui/core";
import { Link, useRouteMatch } from "react-router-dom";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { auth, firestore } from "../../lib/firebase/firebase";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import NavSearchBar from "../NavSearchBar/NavSearchBar";
import NotificationDropDown from "../NotificationDropDown/NotificationDropDown";
import { setNotificationCount } from "../../features/notifications/notifications-slice";
import { suggestionsApi } from "../../features/suggestions-api/suggestions-api-slice";

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
    id: trigger ? "navbar-blur" : "navbar-noblur",
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

    "&#navbar-blur": {
      background: "rgb(0, 0, 0, 0.5)",
      transition: "background 0.5s ease-in-out",
      backdropFilter: " blur(16px) saturate(180%)",
      "&:hover": {
        background: theme.palette.background.default,
      },
    },
  },
  logo: {
    fontFamily: "Allison",

    [theme.breakpoints.down("md")]: {
      fontSize: "2.5rem",
      marginRight: "1rem",
      width: "fit-content",
    },
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",

    [theme.breakpoints.down("md")]: {
      gap: "1.2rem",
      "& *": {
        padding: 0,
      },
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0.5rem",
      "& *": {
        padding: 0,
        width: "fit-content",
        minWidth: "fit-content",
        "& .MuiBadge-badge": {
          minWidth: "20px",
        },
      },
    },
  },
}));

const Navbar = (props) => {
  // styles
  const classes = useStyles();

  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user.userData);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const matchLocation = useRouteMatch();

  const notificationCount = useSelector(
    (state) => state.notifications.notificationCount
  );
  const [notificationBar, setNotificationBar] = useState(false);

  useEffect(() => {
    let unsubscribe;

    if (userData) {
      unsubscribe = firestore
        .collection("users")
        .doc(userData.uid)
        .collection("notifications")
        .where("status", "==", "pending")
        .where("seen", "==", false)
        .onSnapshot((snapshot) => {
          dispatch(setNotificationCount(snapshot.docs.length));
          // forcing refetching of suggestions when updating notifications
          if (matchLocation.path === "/dashboard") {
            const { refetch } = dispatch(
              suggestionsApi.endpoints.getSuggestions.initiate()
            );
            refetch();
          }
        });
    }
    return unsubscribe;
  }, [userData, dispatch, matchLocation.path]);

  return (
    <div style={{ position: "relative" }}>
      <ElevationScroll {...props}>
        <AppBar className={classes.appBar} elevation={0} color="transparent">
          <Link to="/">
            <Typography variant="h2" className={classes.logo}>
              {matches ? "VS" : "VC Room"}
            </Typography>
          </Link>

          {userData && <NavSearchBar />}

          <div className={classes.navLinks}>
            {userData ? (
              <>
                <Button
                  onClick={() => setNotificationBar(!notificationBar)}
                  color="primary"
                >
                  <Badge color="primary" badgeContent={notificationCount}>
                    <NotificationsIcon id="notification-dropdown" />
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
                  window.open("https://github.com/theninza/vc-room");
                }}
              >
                Learn More
              </Button>
            )}
          </div>
        </AppBar>
      </ElevationScroll>
      {userData && notificationBar && (
        <ClickAwayListener
          onClickAway={(e) => {
            if (e.target.parentNode.id === "notification-dropdown") {
              return;
            }
            setNotificationBar(false);
          }}
        >
          <div>
            <NotificationDropDown uid={userData.uid} />
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default Navbar;
