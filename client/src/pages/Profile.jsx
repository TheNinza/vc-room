import {
  Avatar,
  Badge,
  Button,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";
import EditIcon from "@material-ui/icons/Edit";
import { useEffect, useState } from "react";
import { firestore } from "../lib/firebase/firebase";
import GroupIcon from "@material-ui/icons/Group";
import CallChart from "../components/CallChart/CallChart";
import { useUpdateUserMutation } from "../features/user-api/user-api-slice";
import toast from "react-hot-toast";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    position: "relative",
    marginTop: "7rem",
    width: "60%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "3rem",
    padding: "1.5rem 0",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  flexParent: {
    width: "100%",
    display: "flex",
    gap: "2rem",
    justifyContent: "center",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem",
  },
  avatarImage: {
    width: "150px",
    height: "150px",
    margin: "0 auto",
    [theme.breakpoints.down("sm")]: {
      width: "80px",
      height: "80px",
    },
  },
  editIcon: {
    width: 35,
    height: 35,
    padding: 5,
    borderRadius: "50%",
    border: `4px solid ${theme.palette.background.paper}`,
    background: theme.palette.text.primary,
    cursor: "pointer",
    transition: "all 0.5s ease",

    "&:hover": {
      transform: "scale(1.2) rotate(-20deg)",
    },

    [theme.breakpoints.down("sm")]: {
      width: 30,
      height: 30,
      padding: 2,
    },
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    flex: 1,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "2rem",
    width: "100%",
    marginTop: "auto",
  },
}));

const Profile = () => {
  const classes = useStyles();

  // local state
  const [userDetail, setUserDetail] = useState();
  const [dirty, setDirty] = useState(false);

  // redux state
  const user = useSelector((state) => state.user.userData);

  // redux mutations
  const [updateUser, { isLoading, isSuccess, isError }] =
    useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setUserDetail(user);
    }
  }, [user]);

  useEffect(() => {
    // check if any of the key-value of userDetail is changed
    if (userDetail) {
      const keys = Object.keys(userDetail);
      const values = Object.values(userDetail);
      const dirty = keys.some((key, index) => {
        return user[key] ? user[key] !== values[index] : false;
      });
      setDirty(dirty);
    }
  }, [userDetail, user]);

  useEffect(() => {
    // fetch number of friends of the user from firestore

    let unsubscribeFromFriendsCollection = () => {};

    if (user) {
      const { uid } = user;
      const friendCollectionQuery = firestore
        .collection("users")
        .doc(uid)
        .collection("friends");

      unsubscribeFromFriendsCollection = friendCollectionQuery.onSnapshot(
        (snapshot) => {
          const numFriends = snapshot.docs.length;
          setUserDetail((prevState) => {
            return { ...prevState, numFriends };
          });
        }
      );
    }

    return () => {
      unsubscribeFromFriendsCollection();
    };
  }, [user]);

  useEffect(() => {
    // set dirty based on isSuccess
    if (isSuccess) {
      setDirty(false);
    }
    // reset userDetail if isError
    if (isError) {
      setUserDetail((prevState) => {
        return { ...prevState, ...user };
      });
    }
  }, [isSuccess, isError, user]);

  // helper functions

  const handleImageChange = (e) => {
    const image = e.target.files[0];

    try {
      const reader = new FileReader();

      // check if the image is valid
      if (image.type.split("/")[0] !== "image") {
        throw new Error("Invalid image type");
      }

      // check if the image is too large
      if (image.size > 5000000) {
        throw new Error("Image is too large");
      }

      reader.readAsDataURL(image);
      reader.onload = (e) => {
        setUserDetail((prevState) => {
          return { ...prevState, photoURL: e.target.result };
        });
      };
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateUser = async () => {
    if (!dirty) {
      toast.info("No changes to update");
      return;
    }

    const body = {};

    // check if displayName is changed
    if (userDetail.displayName !== user.displayName) {
      body.displayName = userDetail.displayName;
    }

    // check if photoURL is changed
    if (userDetail.photoURL !== user.photoURL) {
      body.photoURL = userDetail.photoURL;
    }

    // check if status is changed
    if (userDetail.status !== user.status) {
      body.status = userDetail.status;
    }

    updateUser(body);
  };

  return userDetail ? (
    <div className={classes.root}>
      <div className={classes.flexParent}>
        <Paper elevation={9} className={classes.paper}>
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={
              <label htmlFor="profile-image">
                <EditIcon color="primary" className={classes.editIcon} />
              </label>
            }
          >
            <Avatar
              alt={userDetail.displayName}
              src={userDetail.photoURL}
              className={classes.avatarImage}
            />
            <input
              style={{ display: "none" }}
              type="file"
              id="profile-image"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
            />
          </Badge>

          <Typography variant="subtitle1">{userDetail.email}</Typography>
          <Typography
            variant="subtitle1"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <GroupIcon />
            {userDetail.numFriends} Friends
          </Typography>
        </Paper>

        <Paper elevation={9} className={`${classes.paper} ${classes.form} `}>
          <TextField
            fullWidth={true}
            color="primary"
            label="Display Name"
            type="text"
            name="displayName"
            value={userDetail.displayName}
            onChange={(e) => {
              if (e.target.value.length <= 50) {
                setUserDetail({ ...userDetail, displayName: e.target.value });
              }
            }}
          />
          <TextField
            color="secondary"
            fullWidth={true}
            label="Status"
            type="text"
            name="status"
            value={userDetail.status}
            onChange={(e) => {
              if (e.target.value.length <= 80) {
                setUserDetail({ ...userDetail, status: e.target.value });
              }
            }}
          />
          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              disabled={!dirty || isLoading}
              fullWidth={true}
              onClick={handleUpdateUser}
            >
              Update
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth={true}
              onClick={() => {
                setUserDetail((prevState) => {
                  return { ...prevState, ...user };
                });

                setDirty(false);
              }}
              disabled={!dirty || isLoading}
            >
              Reset
            </Button>
          </div>
        </Paper>
      </div>

      <CallChart uid={user.uid} />
    </div>
  ) : null;
};

export default Profile;
