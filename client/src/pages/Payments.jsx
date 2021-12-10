import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useFetchSessionQuery } from "../features/payments-api/payments-api-slice";
import useQuery from "../hooks/useQuery";

const {
  makeStyles,
  Typography,
  CircularProgress,
  Button,
} = require("@material-ui/core");

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    position: "relative",
    marginTop: "7rem",
    width: "60%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1.5rem 0",
    [theme.breakpoints.down("sm")]: {
      marginTop: "10vh",
      width: "90%",
      gap: "0.5rem",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  loader: {
    width: "fit-content",
    margin: "auto",
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: "0.5rem",

      "& *": {
        wordBreak: "break-all",
      },
    },
  },
  moreDetailButton: {
    marginTop: "1rem",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const Payments = () => {
  // styles
  const classes = useStyles();

  // query
  const query = useQuery();
  const userDataUid = useSelector((state) => state?.user?.userData?.uid);

  const sessionId = query.get("sessionId");

  const { data, isLoading } = useFetchSessionQuery(
    {
      sessionId,
    },
    {
      skip: !sessionId || !userDataUid,
    }
  );

  const history = useHistory();

  return (
    <div className={classes.root}>
      {isLoading ? (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      ) : (
        data && (
          <div>
            <Typography variant="h5" gutterBottom align="center">
              Payment Details
            </Typography>
            <div className={classes.flexContainer}>
              <Typography variant="body1">Session Id</Typography>
              <Typography variant="body2">{data.session.id}</Typography>
            </div>
            <div className={classes.flexContainer}>
              <Typography variant="body1">Payment Status</Typography>
              <Typography variant="body2">
                {data.session.paymentStatus}
              </Typography>
            </div>
            <div className={classes.flexContainer}>
              <Typography variant="body1">Customer Email</Typography>
              <Typography variant="body2">{data.customerEmail}</Typography>
            </div>
            <div className={classes.flexContainer}>
              <Typography variant="body1">VCoin Bundle Name</Typography>
              <Typography variant="body2">{data.price.name}</Typography>
            </div>
            <div className={classes.flexContainer}>
              <Typography variant="body1">Amount</Typography>
              <Typography variant="body2">₹ {data.price.amount}</Typography>
            </div>
            <div className={classes.flexContainer}>
              <Typography variant="body1">Number Of VCoin Purchased</Typography>
              <Typography variant="body2">{data.price.quantity}</Typography>
            </div>
            <div className={classes.flexContainer}>
              {data.session.resumeUrl && (
                <Button
                  className={classes.moreDetailButton}
                  variant="contained"
                  color="secondary"
                  onClick={() =>
                    (window.location.href = data.session.resumeUrl)
                  }
                >
                  Retry Payment
                </Button>
              )}
              {data.session.receiptUrl && (
                <Button
                  className={classes.moreDetailButton}
                  variant="contained"
                  color="secondary"
                  onClick={() => window.open(data.session.receiptUrl)}
                >
                  More Details
                </Button>
              )}
            </div>
          </div>
        )
      )}
      <div className={classes.flexContainer}>
        <Button
          className={classes.moreDetailButton}
          variant="contained"
          color="primary"
          onClick={() => history.push("/dashboard")}
        >
          Go To Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Payments;
