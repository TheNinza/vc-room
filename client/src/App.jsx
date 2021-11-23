import { Container, makeStyles } from "@material-ui/core";
import { lazy, Suspense, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./lib/firebase/firebase";
import { fetchUserData } from "./features/user/user-slice";
import Navbar from "./components/Navbar/Navbar";
import Blurred from "./components/Blurred/Blurred";

const HomePage = lazy(() => import("./pages/HomePage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CallPage = lazy(() => import("./pages/CallPage"));

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
}));

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { userData, error } = useSelector((state) => state.user);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      dispatch(fetchUserData(user));
      if (user) {
        toast.success(`Welcome ${user.displayName}`);
        auth.currentUser.getIdToken(true).then((token) => {
          console.log(token);
        });
      }
    });

    // stop listenning when component unmounts
    return unsubscribe;
  }, [dispatch]);

  // helper functions

  return (
    <Container maxWidth="xl" className={classes.container}>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Suspense
        fallback={
          <div style={{ color: "white", fontSize: "5rem", marginTop: "50vh" }}>
            Loading
          </div>
        }
      >
        <Switch>
          <Route path="/" exact>
            {!(userData && !error) ? (
              <HomePage />
            ) : (
              <Redirect to="/dashboard" />
            )}
          </Route>
          <Route path="/dashboard" exact>
            {userData && !error ? <Dashboard /> : <Redirect to="/" />}
          </Route>
          <Route path="/call">
            <CallPage />
          </Route>
        </Switch>
      </Suspense>
      <Blurred />
    </Container>
  );
};

export default App;
