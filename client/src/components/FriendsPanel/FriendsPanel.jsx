import {
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
} from "@material-ui/core";
import GroupIcon from "@material-ui/icons/Group";

import friendSvgSrc from "../../assets/friendsSearchWave.svg";
import PanelFriendCard from "../PanelFriendCard/PanelFriendCard";

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
  },

  friendsContainer: {
    height: "65%",
    marginTop: theme.spacing(7),
    padding: "0 0.5rem",
    overflowY: "scroll",
  },
}));

const FriendsPanel = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
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
            }}
          />
        </div>

        <div className={classes.friendsContainer}>
          <PanelFriendCard
            id="1"
            image="https://images.pexels.com/photos/3170437/pexels-photo-3170437.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            name="Captain America"
          />
          <PanelFriendCard
            id="1"
            image="https://images.pexels.com/photos/2811087/pexels-photo-2811087.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            name="Iron Man"
          />
          <PanelFriendCard
            id="1"
            image="https://images.pexels.com/photos/4407688/pexels-photo-4407688.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            name="Spider Man"
          />
          <PanelFriendCard
            id="1"
            image="https://images.pexels.com/photos/3170437/pexels-photo-3170437.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            name="Thor"
          />
          <PanelFriendCard
            id="1"
            image="https://images.pexels.com/photos/3170437/pexels-photo-3170437.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            name="Black Widow"
          />
        </div>
      </Paper>
    </div>
  );
};

export default FriendsPanel;
