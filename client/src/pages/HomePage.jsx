import {
  Button,
  makeStyles,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import hero from "../assets/homepage-hero.svg";
import { ReactComponent as GoogleIcon } from "../assets/google.svg";
import { signInWithGoogle } from "../lib/firebase/firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
    marginTop: "5rem",

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
      marginTop: "1rem",
    },
  },
  flexChildren: {
    flex: 1,
  },
  heroImage: {
    width: "100%",
  },
  imageContainer: {
    alignSelf: "center",
  },
  textContainer: {
    marginTop: "5rem",
    [theme.breakpoints.down("sm")]: {
      "& *": {
        textAlign: "center",
      },
    },
  },
}));

const HomePage = () => {
  const classes = useStyles();

  const matches = useMediaQuery("(max-width:600px)");
  return (
    <div className={classes.root}>
      <div className={`${classes.textContainer} ${classes.flexChildren}`}>
        <Typography gutterBottom variant={matches ? "h4" : "h3"}>
          The most vibrant place to meet new people
        </Typography>
        <Typography gutterBottom variant={matches ? "subtitle1" : "h6"}>
          With{" "}
          <span
            style={{
              fontFamily: "Allison",
              fontSize: "1.8rem",
              fontWeight: "bold",
            }}
          >
            Video Social
          </span>
          , make new bond with people around you
        </Typography>

        <Button
          style={{ marginTop: "3rem" }}
          color="primary"
          variant="contained"
          startIcon={<GoogleIcon style={{ width: "2rem", height: "2rem" }} />}
          fullWidth
          onClick={async () => {
            await signInWithGoogle();
          }}
        >
          Sign In With Google
        </Button>
      </div>
      <div className={`${classes.imageContainer} ${classes.flexChildren}`}>
        <img className={classes.heroImage} src={hero} alt="hero" />
      </div>
    </div>
  );
};

export default HomePage;
