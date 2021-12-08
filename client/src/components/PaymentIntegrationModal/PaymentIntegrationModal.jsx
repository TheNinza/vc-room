import { makeStyles, Paper, Typography } from "@material-ui/core";
import { useState } from "react";
import { ReactComponent as CoinIcon } from "../../assets/vsCoin.svg";
import { ReactComponent as CoinIconSmall } from "../../assets/vsCoinSmall.svg";
import { ReactComponent as CoinIconLarge } from "../../assets/vsCoinLarge.svg";

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
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
}));

const PaymentIntegrationModal = () => {
  // styles
  const classes = useStyles();

  const [selectedPlan, setSelectedPlan] = useState(0);

  const plans = [
    {
      name: "Enterprise",
      price: "20",
      description: "20",
      imageComponent: <CoinIconLarge />,
    },

    {
      name: "Premium",
      price: "10",
      description: "10",
      imageComponent: <CoinIconSmall />,
    },

    {
      name: "Free",
      price: "0",
      description: "0",
      imageComponent: <CoinIcon />,
    },
  ];

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
        {plans.map((plan, idx) => (
          <Paper
            elevation={0}
            className={`${classes.planBox} ${
              selectedPlan === idx ? "selected" : ""
            }`}
            onClick={() => setSelectedPlan(idx)}
          >
            <Typography variant="h6" color="textSecondary">
              {plan.name}
            </Typography>

            {plan.imageComponent}

            <Typography variant="h6" color="textSecondary">
              {plan.price}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {plan.description}
            </Typography>
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default PaymentIntegrationModal;
