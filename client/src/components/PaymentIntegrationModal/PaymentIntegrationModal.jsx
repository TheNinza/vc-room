import {
  Button,
  CircularProgress,
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
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
    flex: 0.95,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    width: "100%",

    [theme.breakpoints.up("sm")]: {
      "& > div": {
        "&:nth-child(2n)": {
          alignSelf: "flex-end",
        },
        "&:nth-child(2n+1)": {
          alignSelf: "flex-start",
        },
      },
    },
  },
  planBox: {
    position: "relative",
    width: "60%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    padding: "2rem 1rem",
    margin: "1rem",
    borderRadius: "1rem",
    cursor: "pointer",
    boxShadow: "0px 0px 10px 2px rgba(0,0,0,0.2)",
    transition: "all 0.5s ease-in-out",

    [theme.breakpoints.down("xs")]: {
      margin: "0.5rem",
      padding: "0.5rem",
      width: "100%",
      gap: "0.5rem",
    },

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
    width: 100,
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    "& > span": {
      transform: "rotate(45deg) translate(0, -35%)",
      fontSize: "0.8rem",

      [theme.breakpoints.down("xs")]: {
        transform: "rotate(45deg) translate(0, -40%)",
      },

      "& > span": {
        fontWeight: "bold",
        fontSize: "1.5rem",

        [theme.breakpoints.down("xs")]: {
          fontSize: "1rem",
        },
      },
    },

    [theme.breakpoints.down("xs")]: {
      width: 80,
      height: 80,
    },
  },

  planDescription: {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",

    "& svg": {
      height: "10vh",
      width: "auto",
    },
  },
}));

const PaymentIntegrationModal = () => {
  // styles
  const classes = useStyles();

  const [selectedPlan, setSelectedPlan] = useState(0);

  const { data = [], isLoading } = useFetchProductsQuery();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

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
      </Typography>{" "}
      {isLoading ? (
        <CircularProgress
          style={{
            margin: "auto",
          }}
        />
      ) : (
        <>
          <div className={classes.planContainer}>
            {data.map((plan, idx) => (
              <Paper
                elevation={0}
                className={`${classes.planBox} ${
                  selectedPlan === idx ? "selected" : ""
                }`}
                onClick={() => setSelectedPlan(idx)}
              >
                <Typography variant={isMobile ? "h6" : "h5"} align="center">
                  {plan.name}
                </Typography>

                <div className={classes.planDescription}>
                  {images[idx]}

                  <div>
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
                    </div>{" "}
                    {/* price */}
                    <Typography variant="h6" align="center">
                      ₹ {plan.amount}
                    </Typography>
                  </div>
                </div>
              </Paper>
            ))}
          </div>
          <Button size="large" variant="contained" color="primary">
            Buy Now
          </Button>
        </>
      )}
    </div>
  );
};

export default PaymentIntegrationModal;
