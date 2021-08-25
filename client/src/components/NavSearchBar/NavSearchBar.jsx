import { InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import { makeStyles } from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  disableFullPageBlur,
  enableFullPageBlur,
} from "../../features/ui/ui-slice";
import { firestore } from "../../lib/firebase/firebase";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";
import PanelFriendCard from "../PanelFriendCard/PanelFriendCard";
import SearchResultCard from "../SearchResultCard/SearchResultCard";

const useStyles = makeStyles((theme) => ({
  searchbar: {
    width: "50rem",
  },
  smoothAnimation: {
    borderRadius: theme.spacing(3),
    transition: "all 0.4s ease",
  },
  searchContainer: {
    position: "absolute",
    top: "15vh",

    left: "50%",
    width: "50rem",
    zIndex: 10,
    transform: "translateX(-50%)",
  },
}));

const NavSearchBar = () => {
  const classes = useStyles();
  const [searchString, setSearchString] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const dispatch = useDispatch();
  const fullPageBlurred = useSelector((state) => state.ui.fullPageBlurred);

  const getSearchResults = useCallback(
    debounce(async (query) => {
      // setLoading(true);
      try {
        const result = await query.get();
        const data = result.docs.map((doc) => {
          const { displayName, photoURL, uid } = doc.data();
          return { displayName, photoURL, uid };
        });
        setSearchResult(data);
      } catch (error) {
        console.log(error);
        toast.error("Error Fetching Data!!!!");
        setSearchResult([]);
      }

      // setLoading(false);
    }, 500),
    []
  ); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const query = firestore
      .collection("users")
      .where("displayName", ">=", searchString.toUpperCase());

    searchString.length ? getSearchResults(query) : setSearchResult([]);
  }, [searchString, getSearchResults]);

  useEffect(() => {
    if (showResults) {
      dispatch(enableFullPageBlur());
    } else if (!showResults && !searchString.length) {
      dispatch(disableFullPageBlur());
    }
  }, [showResults, searchString, dispatch]);

  return (
    <>
      <TextField
        className={classes.searchbar}
        variant="outlined"
        placeholder="Search People"
        margin="dense"
        onChange={(e) => setSearchString(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="inherit" />
            </InputAdornment>
          ),
          classes: {
            notchedOutline: classes.smoothAnimation,
          },
          value: searchString,
          onFocus: () => setShowResults(true),
          onBlur: () => setShowResults(false),
        }}
      />

      <div className={classes.searchContainer}>
        {loading ? (
          <h1>Loading...</h1>
        ) : fullPageBlurred ? (
          searchResult.map((r, idx) => (
            <SearchResultCard
              uid={r.uid}
              displayName={r.displayName}
              photoURL={r.photoURL}
              key={idx}
            />
          ))
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default NavSearchBar;
