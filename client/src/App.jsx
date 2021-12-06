import { Container, makeStyles } from "@material-ui/core";
import { lazy, Suspense, useEffect, useRef } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./lib/firebase/firebase";
import { fetchUserData } from "./features/user/user-slice";
import Navbar from "./components/Navbar/Navbar";
import Blurred from "./components/Blurred/Blurred";
import FullPageLoader from "./components/FullPageLoader/FullPageLoader";
import Profile from "./pages/Profile";
import io from "socket.io-client";

const HomePage = lazy(() => import("./pages/HomePage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CallPage = lazy(() => import("./pages/CallPage"));

const useStyles = makeStyles(() => ({
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

  const socketRef = useRef();

  // handling authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      dispatch(fetchUserData(user));

      if (user) {
        toast.success(`Welcome ${user.displayName}`);
      }
    });

    // stop listenning when component unmounts
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      auth.currentUser.getIdToken(true).then((token) => {
        // setup socket connection
        socketRef.current = io(
          process.env.NODE_ENV === "production"
            ? process.env.REACT_APP_BACKEND_PROD
            : process.env.REACT_APP_BACKEND_DEV,
          {
            auth: {
              token,
            },
          }
        );

        if (socketRef.current) {
          socketRef.current.on("connect", () => {
            console.log("connected");
          });

          socketRef.current.on("disconnect", () => {
            console.log("disconnected");
          });

          socketRef.current.on("error", (error) => {
            console.log("error", error);
          });
        }
      });
    } else {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [userData]);

  // helper functions

  return (
    <Container maxWidth="xl" className={classes.container}>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Suspense fallback={<FullPageLoader />}>
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
          <Route path="/call" exact>
            <CallPage />
          </Route>
          <Route path="/profile" exact>
            <Profile />
          </Route>
        </Switch>
      </Suspense>
      <Blurred />
    </Container>
  );
};

export default App;
