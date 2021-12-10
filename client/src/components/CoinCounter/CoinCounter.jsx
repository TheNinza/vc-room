import { CircularProgress, makeStyles, Dialog } from "@material-ui/core";
import { lazy, useEffect, useState } from "react";
import { ReactComponent as Coin } from "../../assets/vsCoin.svg";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import { firestore } from "../../lib/firebase/firebase";
// lazy imports
const PaymentIntegrationModal = lazy(() =>
  import("../PaymentIntegrationModal/PaymentIntegrationModal")
);

const useStyles = makeStyles((theme) => ({
  root: {
    top: 10,
    right: 10,
    zIndex: 10,

    background: "rgba(0, 0, 0, 0.4)",
    padding: "0.2rem 0.5rem",

    border: "3px solid rgba(0, 0, 0, 0.5)",
    borderRadius: "1rem",
    animation: "$fadeIn 0.5s ease",

    cursor: "pointer",

    "&:active": {
      "& svg": {
        transform: "scale(1) rotate(0)",
      },
    },

    "&:hover": {
      background: "rgba(0, 0, 0, 0.6)",
      "& svg": {
        transform: "scale(1.1) rotate(-15deg)",
      },
    },

    [theme.breakpoints.down("sm")]: {
      position: "static !important",
      marginTop: "1rem",
      width: "fit-content",
      margin: "auto",
      fontSize: "0.8rem",
    },
  },
  coin: {
    width: "1.5rem",
    height: "1.5rem",
    transition: "all 0.5s ease",
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
      transform: "scaleY(0)",
    },
    "100%": {
      opacity: 1,
      transform: "scaleY(5rem)",
    },
  },
  container: {
    animation: "$fadeIn 0.5s ease",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    transition: "all 0.5s ease",
    gap: "0.5rem",
  },
}));

const CoinCounter = ({ position = "absolute" }) => {
  // styles
  const classes = useStyles();

  const [coins, setCoins] = useState(0);
  const [finalCoins, setFinalCoins] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

  const currentUserId = useSelector((state) => state.user.userData.uid);
  const currentUserRole = useSelector((state) => state.user.userData.role);

  // animate coin counter
  useEffect(() => {
    let timeout;
    if (coins === finalCoins) {
      clearTimeout(timeout);
      return;
    } else {
      const diff = finalCoins - coins;
      timeout = setTimeout(() => {
        if (coins === finalCoins) {
          clearInterval(timeout);
        } else {
          if (diff > 0) {
            setCoins(coins + 1);
          } else {
            setCoins(coins - 1);
          }
        }
      }, 50);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [coins, finalCoins]);

  useEffect(() => {
    // add firestore listner to listen for credits
    let unsubscribe = () => {};
    if (currentUserRole === "user") {
      unsubscribe = firestore
        .collection("accounts")
        .doc(currentUserId)
        .onSnapshot(
          (snapshot) => {
            const data = snapshot.data();
            if (data) {
              setFinalCoins(data.credits);
              setIsLoading(false);
            }
          },
          (error) => {
            console.log(error);
          }
        );
    }

    if (currentUserRole === "unlimited") {
      setIsLoading(false);
    }

    return () => {
      unsubscribe();
    };
  }, [currentUserId, currentUserRole]);

  return (
    <>
      <div className={classes.root} style={{ position }}>
        {!isLoading ? (
          <div
            onClick={() => currentUserRole === "user" && setIsOpen(true)}
            className={classes.container}
          >
            <Coin className={classes.coin} />x
            <span
              style={{ fontSize: currentUserRole === "unlimited" ? 20 : 16 }}
            >
              {currentUserRole === "user" ? coins : "∞"}
            </span>
          </div>
        ) : (
          <CircularProgress size={20} />
        )}
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <Suspense
          fallback={
            <div
              className={classes.container}
              style={{
                width: "100%",
                height: "100vh",
              }}
            >
              <CircularProgress />
            </div>
          }
        >
          <PaymentIntegrationModal />
        </Suspense>
      </Dialog>
    </>
  );
};

export default CoinCounter;
