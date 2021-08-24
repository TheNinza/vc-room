import { makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  disabled: {},
  enabled: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 10,
    backdropFilter: "blur( 10px )",
    WebkitBackdropFilter: "blur( 10px )",
    background: "rgba(0, 0, 0, 0.3)",
  },
}));

const Blurred = () => {
  const classes = useStyles();

  const fullPageBlurred = useSelector((state) => state.ui.fullPageBlurred);

  return (
    <div
      style={{ transition: "all 0.5s ease" }}
      className={fullPageBlurred ? classes.enabled : classes.disabled}
    />
  );
};

export default Blurred;
