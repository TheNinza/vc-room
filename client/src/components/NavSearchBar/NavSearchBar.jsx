import { InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import { makeStyles } from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  disableFullPageBlur,
  enableFullPageBlur,
} from "../../features/ui/ui-slice";
import debounce from "lodash.debounce";
import SearchResultCard from "../SearchResultCard/SearchResultCard";
import { useGetSearchResultsPeopleQuery } from "../../features/search-api/search-api-slice";

const useStyles = makeStyles((theme) => ({
  searchbar: {
    maxWidth: "50rem",
    flex: 1,
    minWidth: "0",
  },
  smoothAnimation: {
    borderRadius: theme.spacing(3),
    transition: "all 0.4s ease",
  },
  searchContainer: {
    position: "absolute",
    top: "12vh",

    left: "50%",
    minWidth: "50rem",
    zIndex: 10,
    transform: "translateX(-50%)",
    [theme.breakpoints.down("sm")]: {
      minWidth: "90%",
      top: "10vh",
    },
  },
}));

const NavSearchBar = () => {
  const classes = useStyles();
  const [showResults, setShowResults] = useState(false);
  const [debouncedSearchString, setDebouncedSearchString] = useState("");

  const { data = { users: [] } } = useGetSearchResultsPeopleQuery(
    debouncedSearchString,
    {
      skip: !debouncedSearchString.length,
    }
  );

  const dispatch = useDispatch();
  const fullPageBlurred = useSelector((state) => state.ui.fullPageBlurred);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setDebouncedSearchStringFunction = useCallback(
    debounce((value) => {
      setDebouncedSearchString(value);
    }, 500),
    []
  );

  useEffect(() => {
    if (showResults) {
      dispatch(enableFullPageBlur());
    } else if (!showResults && !debouncedSearchString.length) {
      dispatch(disableFullPageBlur());
    }
  }, [showResults, debouncedSearchString, dispatch]);

  return (
    <>
      <TextField
        className={classes.searchbar}
        variant="outlined"
        placeholder="Search People"
        margin="dense"
        onChange={(e) => setDebouncedSearchStringFunction(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="inherit" />
            </InputAdornment>
          ),
          classes: {
            notchedOutline: classes.smoothAnimation,
          },
          onFocus: () => setShowResults(true),
          onBlur: () => setShowResults(false),
        }}
      />

      <div className={classes.searchContainer}>
        {fullPageBlurred
          ? data.users.map((user, idx) => (
              <SearchResultCard
                uid={user.uid}
                displayName={user.displayName}
                photoURL={user.photoURL}
                key={idx}
                isFriend={user.isFriend}
              />
            ))
          : ""}
      </div>
    </>
  );
};

export default NavSearchBar;
