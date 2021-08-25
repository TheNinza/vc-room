import { makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { disableFullPageBlur } from "../../features/ui/ui-slice";

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
  const dispatch = useDispatch();
  return (
    <div
      onClick={() => dispatch(disableFullPageBlur())}
      style={{ transition: "all 0.5s ease" }}
      className={fullPageBlurred ? classes.enabled : classes.disabled}
    />
  );
};

export default Blurred;
