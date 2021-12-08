import {
  Button,
  CircularProgress,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import { ReactComponent as CoinIcon } from "../../assets/vsCoin.svg";
import { ReactComponent as CoinIconSmall } from "../../assets/vsCoinSmall.svg";
import { ReactComponent as CoinIconLarge } from "../../assets/vsCoinLarge.svg";
import { useFetchProductsQuery } from "../../features/payments-api/payments-api-slice";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    alignItems: "center",
  },
  planContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
  planBox: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    margin: "1rem",
    borderRadius: "1rem",
    cursor: "pointer",
    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
    transition: "all 0.5s ease-in-out",

    "&.selected": {
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: theme.palette.secondary.main,

      "& *": {
        color: `${theme.palette.text.primary} !important`,
      },
    },
  },

  ribbon: {
    position: "absolute",
    top: "0",
    right: "0",
    background: theme.palette.primary.main,
    clipPath: "polygon(0 0, 40% 0, 100% 60%, 100% 100%)",
    width: 120,
    height: 120,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    "& > span": {
      transform: "rotate(45deg) translate(0, -50%)",
      fontSize: "0.8rem",
      "& > span": {
        fontWeight: "bold",
        fontSize: "1.5rem",
      },
    },
  },
}));

const PaymentIntegrationModal = () => {
  // styles
  const classes = useStyles();

  const [selectedPlan, setSelectedPlan] = useState(0);

  const { data = [], isLoading } = useFetchProductsQuery();

  const images = [<CoinIconLarge />, <CoinIconSmall />, <CoinIcon />];
  return (
    <div className={classes.root}>
      <Typography
        variant="body1"
        color="textSecondary"
        align="center"
        gutterBottom
      >
        Get the credits for making calls
      </Typography>
      <div className={classes.planContainer}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            {data.map((plan, idx) => (
              <Paper
                elevation={0}
                className={`${classes.planBox} ${
                  selectedPlan === idx ? "selected" : ""
                }`}
                onClick={() => setSelectedPlan(idx)}
              >
                <Typography variant="h5" align="center">
                  {plan.name}
                </Typography>

                {images[idx]}

                {idx !== data.length - 1 && (
                  <div className={classes.ribbon}>
                    <span>
                      <span>{plan.discountPercentage} %</span> Off
                    </span>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "1rem",
                  }}
                >
                  <CoinIcon
                    style={{ height: "1.5rem", width: "fit-content" }}
                  />
                  <Typography variant="body1">x {plan.quantity}</Typography>
                </div>
              </Paper>
            ))}
          </>
        )}
      </div>

      <Button size="large" variant="contained" color="primary">
        Buy Now
      </Button>
    </div>
  );
};

export default PaymentIntegrationModal;
