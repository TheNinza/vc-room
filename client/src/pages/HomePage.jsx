import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import hero from "../assets/homepage-hero.svg";
import { ReactComponent as GoogleIcon } from "../assets/google.svg";
import { signInWithGoogle } from "../lib/firebase/firebase";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
    marginTop: "5rem",
    position: "relative",

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
      marginTop: "1rem",
      gap: "1.5rem",
    },
  },
  flexChildren: {
    flex: 1,
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "1rem",
    },
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
  signInButton: {
    marginTop: "3rem",
    [theme.breakpoints.down("sm")]: {
      marginTop: "0",
    },
  },
  footer: {
    position: "absolute",
    bottom: 10,
    width: "fit-content",
    left: "50%",
    transform: "translateX(-50%)",

    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
      position: "relative",
      transform: "translate(0)",
      left: 0,
    },
  },

  footerLinks: {
    display: "flex",
    gap: "1.5rem",
    marginTop: "1rem",
    justifyContent: "center",

    "& svg": {
      transition: "all 0.3s ease-in-out",
      width: "1.5rem",
      height: "1.5rem",

      "&:hover": {
        color: `${theme.palette.primary.main} !important`,
        transform: "scale(1.2) translateY(-2px)",
        "& path": {
          fill: `${theme.palette.primary.main} !important`,
          fillOpacity: 1,
        },
      },
    },
  },
  underlineLinks: {
    textDecoration: "underline",
    color: theme.palette.primary.main,
    cursor: "pointer",
    display: "inline-block",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
}));

const HomePage = () => {
  const classes = useStyles();

  const matches = useMediaQuery("(max-width:600px)");

  const [termsOfServicesDialogOpen, setTermsOfServicesDialogOpen] =
    useState(false);

  const [privacyPolicyDialogOpen, setPrivacyPolicyDialogOpen] = useState(false);

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
          className={classes.signInButton}
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

        {/* a section to make sure user understand terms and conditions */}
        <Typography
          gutterBottom
          variant={matches ? "body1" : "body2"}
          style={{
            marginTop: "1rem",
          }}
        >
          By signing up, you agree to our{" "}
          <span
            className={classes.underlineLinks}
            onClick={() => setTermsOfServicesDialogOpen(true)}
          >
            Terms of Service
          </span>
          , including our{" "}
          <span
            className={classes.underlineLinks}
            onClick={() => setPrivacyPolicyDialogOpen(true)}
          >
            Privacy Policy
          </span>
          .
        </Typography>
      </div>
      <div className={`${classes.imageContainer} ${classes.flexChildren}`}>
        <img className={classes.heroImage} src={hero} alt="hero" />
      </div>
      <div className={classes.footer}>
        <Typography variant="body1" color="textSecondary">
          Made With ❤️ by Nikhil Gupta
        </Typography>
        <div className={classes.footerLinks}>
          <div>
            <a
              href="https://github.com/theninza"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5807 20.2772 21.0497 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z"
                  fill="white"
                  fillOpacity="0.36"
                />
              </svg>
            </a>
          </div>
          <div>
            <a
              href="https://www.linkedin.com/in/theninza/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.96792e-07 2.00509C2.96792e-07 1.47331 0.21125 0.963308 0.587278 0.58728C0.963305 0.211253 1.47331 2.67307e-06 2.00509 2.67307e-06H21.9927C22.2563 -0.000427747 22.5173 0.0511258 22.7609 0.151712C23.0045 0.252298 23.2258 0.399941 23.4123 0.586188C23.5987 0.772435 23.7466 0.993628 23.8475 1.2371C23.9483 1.48058 24.0001 1.74156 24 2.00509V21.9927C24.0003 22.2563 23.9486 22.5174 23.8479 22.761C23.7472 23.0046 23.5994 23.2259 23.4131 23.4123C23.2268 23.5988 23.0055 23.7466 22.762 23.8475C22.5184 23.9483 22.2574 24.0001 21.9938 24H2.00509C1.74169 24 1.48086 23.9481 1.23752 23.8473C0.994184 23.7464 0.773096 23.5986 0.586892 23.4123C0.400688 23.226 0.253017 23.0049 0.152316 22.7615C0.0516145 22.5181 -0.000143013 22.2572 2.96792e-07 21.9938V2.00509ZM9.49964 9.15055H12.7495V10.7825C13.2185 9.84437 14.4185 9 16.2218 9C19.6789 9 20.4982 10.8687 20.4982 14.2975V20.6487H16.9996V15.0785C16.9996 13.1258 16.5305 12.024 15.3393 12.024C13.6865 12.024 12.9993 13.212 12.9993 15.0785V20.6487H9.49964V9.15055ZM3.49964 20.4993H6.99927V9H3.49964V20.4982V20.4993ZM7.5 5.24946C7.5066 5.5491 7.45328 5.84704 7.34317 6.1258C7.23306 6.40456 7.06838 6.65851 6.8588 6.87276C6.64921 7.08702 6.39894 7.25725 6.12268 7.37346C5.84641 7.48968 5.54972 7.54955 5.25 7.54955C4.95028 7.54955 4.65359 7.48968 4.37732 7.37346C4.10106 7.25725 3.85079 7.08702 3.6412 6.87276C3.43162 6.65851 3.26694 6.40456 3.15683 6.1258C3.04672 5.84704 2.9934 5.5491 3 5.24946C3.01295 4.6613 3.25569 4.10159 3.67624 3.69021C4.09678 3.27882 4.6617 3.04846 5.25 3.04846C5.8383 3.04846 6.40322 3.27882 6.82376 3.69021C7.24431 4.10159 7.48705 4.6613 7.5 5.24946Z"
                  fill="white"
                  fillOpacity="0.36"
                />
              </svg>
            </a>
          </div>

          <div>
            <a
              href="https://theninza.me/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.232 14.4C17.328 13.608 17.4 12.816 17.4 12C17.4 11.184 17.328 10.392 17.232 9.6H21.288C21.48 10.368 21.6 11.172 21.6 12C21.6 12.828 21.48 13.632 21.288 14.4H17.232ZM15.108 21.072C15.828 19.74 16.38 18.3 16.764 16.8H20.304C19.1414 18.8019 17.2969 20.3184 15.108 21.072V21.072ZM14.808 14.4H9.192C9.072 13.608 9 12.816 9 12C9 11.184 9.072 10.38 9.192 9.6H14.808C14.916 10.38 15 11.184 15 12C15 12.816 14.916 13.608 14.808 14.4ZM12 21.552C11.004 20.112 10.2 18.516 9.708 16.8H14.292C13.8 18.516 12.996 20.112 12 21.552ZM7.2 7.2H3.696C4.84663 5.19266 6.68975 3.67378 8.88 2.928C8.16 4.26 7.62 5.7 7.2 7.2ZM3.696 16.8H7.2C7.62 18.3 8.16 19.74 8.88 21.072C6.69435 20.318 4.85382 18.8013 3.696 16.8V16.8ZM2.712 14.4C2.52 13.632 2.4 12.828 2.4 12C2.4 11.172 2.52 10.368 2.712 9.6H6.768C6.672 10.392 6.6 11.184 6.6 12C6.6 12.816 6.672 13.608 6.768 14.4H2.712ZM12 2.436C12.996 3.876 13.8 5.484 14.292 7.2H9.708C10.2 5.484 11.004 3.876 12 2.436V2.436ZM20.304 7.2H16.764C16.3884 5.71375 15.8323 4.27908 15.108 2.928C17.316 3.684 19.152 5.208 20.304 7.2ZM12 0C5.364 0 0 5.4 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C4.62902 21.5996 5.95189 22.4835 7.4078 23.0866C8.86371 23.6896 10.4241 24 12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 10.4241 23.6896 8.86371 23.0866 7.4078C22.4835 5.95189 21.5996 4.62902 20.4853 3.51472C19.371 2.40042 18.0481 1.5165 16.5922 0.913446C15.1363 0.310389 13.5759 0 12 0V0Z"
                  fill="white"
                  fillOpacity="0.36"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <Dialog
        open={termsOfServicesDialogOpen}
        onClose={() => setTermsOfServicesDialogOpen(false)}
        aria-labelledby="terms-of-services-dialog"
        aria-describedby="terms-of-services-dialog"
      >
        <DialogTitle id="terms-of-services-dialog">
          Terms of Service
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="terms-of-services-dialog">
            {/* terms and conditions related to personal projects */}
            <p>
              This website is a personal project of{" "}
              <a
                href="https://linkedin.com/in/theninza"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nikhil Gupta
              </a>
              .
            </p>
            <p>
              This website is a demonstration of the skills as a web developer.
            </p>
            <p>
              The user will be solely responsible for the use of the website.
            </p>
            <p>
              Any malicious or illegal use of the website will be dealt with at
              the user's own discretion.
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setTermsOfServicesDialogOpen(false)}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={privacyPolicyDialogOpen}
        onClose={() => setPrivacyPolicyDialogOpen(false)}
        aria-labelledby="privacy-policy-dialog"
        aria-describedby="privacy-policy-dialog"
      >
        <DialogTitle id="privacy-policy-dialog">Privacy Policy</DialogTitle>
        <DialogContent>
          <DialogContentText id="privacy-policy-dialog">
            <Typography variant="h6" component="h6" gutterBottom>
              This website is a personal project of{" "}
              <a
                href="https://linkedin.com/in/theninza"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nikhil Gupta
              </a>
              .
            </Typography>
            <Typography Typography variant="body1" component="p" gutterBottom>
              The data that we store and manipulate are as following:
            </Typography>
            <ul>
              <li>
                Your public google profile information (name, email, profile,
                etc). For more information, please visit{" "}
                <a
                  href="https://support.google.com/accounts/answer/10130420?hl=en&ref_topic=7188760"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#4e69ff", textDecoration: "underline" }}
                >
                  here
                </a>
                .
              </li>

              <li>
                Your uploaded images. We store the images in a cloud storage
                service called firestore storage.
              </li>

              <li>
                As this is a personal project, and all stripe transactions are
                dummy transactions, we do not store any of the card details.
              </li>

              <li>
                Your device information required to create a WebRTC connection.
                For more information, please visit{" "}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#4e69ff", textDecoration: "underline" }}
                >
                  here
                </a>
                . To know more about WebRTC security and privacy, please visit{" "}
                <a
                  href="https://webrtc-security.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#4e69ff", textDecoration: "underline" }}
                >
                  here
                </a>
                .
              </li>
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPrivacyPolicyDialogOpen(false)}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HomePage;
