import {
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
} from "@material-ui/core";
import GroupIcon from "@material-ui/icons/Group";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import friendSvgSrc from "../../assets/friendsSearchWave.svg";
import { firestore } from "../../lib/firebase/firebase";
import PanelFriendCard from "../PanelFriendCard/PanelFriendCard";
import debounce from "lodash.debounce";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    flex: 1,
  },
  paper: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      height: "100%",
      diplay: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      overflowY: "scroll",
    },
  },
  searchSection: {
    position: "relative",
    background: theme.palette.secondary.main,
    height: "4em",
    width: "100%",
  },
  searchbar: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translate(-50%, 50%)",
    width: "80%",
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
  },
  smoothAnimation: {
    borderRadius: theme.spacing(3),
    transition: "all 0.4s ease",
  },
  textfield: {
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(3),
    border: `5px solid ${theme.palette.background.paper}`,
  },
  wave: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    transform: "translateY(80%)",
    zIndex: 0,
  },

  friendsContainer: {
    height: "65%",
    marginTop: theme.spacing(7),
    padding: "0 0.5rem",
    overflowY: "scroll",
    [theme.breakpoints.down("sm")]: {
      height: "70%",
    },
  },
}));

const FriendsPanel = ({ friendPanelHeight }) => {
  const classes = useStyles();
  const [searchString, setSearchString] = useState("");
  const [searchData, setSearchData] = useState([]);
  const friendsData = useSelector((state) => state.friends.friendsData);

  const getSearchData = async (searchString, friendsData) => {
    let results = [];
    if (searchString.length) {
      for (let i = 0; i < friendsData.length; i++) {
        const { uid } = friendsData[i];

        const data = (
          await firestore.collection("users").doc(uid).get()
        ).data();

        if (
          data.displayName.toLowerCase().includes(searchString.toLowerCase())
        ) {
          results.push(data);
        }
      }
      setSearchData(results);
    } else {
      setSearchData([]);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(
    debounce((a, b) => {
      getSearchData(a, b);
    }, 500),
    []
  );

  useEffect(() => {
    debounceSearch(searchString, friendsData);
  }, [searchString, friendsData, debounceSearch]);

  return (
    <div
      style={friendPanelHeight ? { height: friendPanelHeight } : {}}
      className={classes.root}
    >
      <Paper className={classes.paper} elevation={6}>
        <div className={classes.searchSection}>
          <img className={classes.wave} src={friendSvgSrc} alt="wave" />
          <TextField
            className={classes.searchbar}
            color="secondary"
            variant="outlined"
            placeholder="Search Friends"
            margin="dense"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GroupIcon color="inherit" />
                </InputAdornment>
              ),
              classes: {
                notchedOutline: classes.smoothAnimation,
                root: classes.textfield,
              },
              value: searchString,
              onChange: (e) => setSearchString(e.target.value),
            }}
          />
        </div>

        <div className={classes.friendsContainer}>
          {searchData.length
            ? searchData.map((friend) => (
                <PanelFriendCard
                  searchData={true}
                  friend={friend}
                  key={friend.uid}
                />
              ))
            : friendsData.map((friend) => (
                <PanelFriendCard friend={friend} key={friend.uid} />
              ))}
        </div>
      </Paper>
    </div>
  );
};

export default FriendsPanel;
