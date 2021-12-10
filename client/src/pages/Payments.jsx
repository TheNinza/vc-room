import useQuery from "../hooks/useQuery";

const { makeStyles } = require("@material-ui/core");

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    position: "relative",
    marginTop: "7rem",
    width: "60%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "3rem",
    padding: "1.5rem 0",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
}));

const Payments = () => {
  // styles
  const classes = useStyles();

  // query
  const query = useQuery();

  const success = query.get("success");
  const sessionId = query.get("sessionId");

  console.log(success, sessionId);

  return (
    <div className={classes.root}>
      <h1>Payments</h1>
    </div>
  );
};

export default Payments;
