import { CircularProgress, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { ReactComponent as Coin } from "../../assets/vsCoin.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
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
      position: "unset",
      marginTop: "1rem",
      width: "fit-content",
      margin: "auto",
      fontSize: "0.8rem",
    },
  },
  coin: {
    width: "1.5rem",
    height: "1.5rem",
    marginRight: "0.5rem",
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
  },
}));

const CoinCounter = () => {
  // styles
  const classes = useStyles();

  const [coins, setCoins] = useState(0);
  const [finalCoins, setFinalCoins] = useState(0);

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

  return (
    <div className={classes.root}>
      {coins !== null ? (
        <div
          onClick={() =>
            // set coins to random integer from 1 to 50
            setFinalCoins(Math.floor(Math.random() * 100) + 1)
          }
          className={classes.container}
        >
          <Coin className={classes.coin} /> <span> x {coins}</span>
        </div>
      ) : (
        <CircularProgress
          size={20}
          onClick={() =>
            // set coins to random integer from 1 to 50
            setFinalCoins(Math.floor(Math.random() * 100) + 1)
          }
        />
      )}
    </div>
  );
};

export default CoinCounter;
