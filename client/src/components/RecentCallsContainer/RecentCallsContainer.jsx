import RecentCallCard from "../RecentCallCard/RecentCallCard";
import { makeStyles, Typography } from "@material-ui/core";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper/core";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import { useEffect, useState } from "react";
import { firestore } from "../../lib/firebase/firebase";
import { useSelector } from "react-redux";

SwiperCore.use([Navigation]);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    overflow: "hidden",
    marginBottom: "4rem",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "1rem",
    },
  },
  swiperContainer: {
    width: "100%",
    position: "relative",
  },
  next: {
    position: "absolute",
    top: "50%",
    right: 0,
    transform: "translate(0, -50%)",
    zIndex: 10,
    cursor: "pointer",
    opacity: 0.2,
    transition: "all 0.3s ease",

    "&:hover": {
      opacity: 1,
      transform: "translate(0, -50%) scale(1.2)",
    },
  },
  prev: {
    position: "absolute",
    top: "50%",
    left: 0,
    transform: "translate(0, -50%)",
    zIndex: 10,
    cursor: "pointer",
    opacity: 0.2,
    transition: "all 0.3s ease",

    "&:hover": {
      opacity: 1,
      transform: "translate(0, -50%) scale(1.2)",
    },
  },
}));

const RecentCallsContainer = () => {
  const classes = useStyles();

  const currentUserUid = useSelector((state) => state.user.userData.uid);

  const [recentSentCallData, setRecentSentCallData] = useState([]);
  const [recentReceivedCallData, setRecentReceivedCallData] = useState([]);

  const allCalls = [...recentSentCallData, ...recentReceivedCallData].sort(
    (a, b) => {
      return new Date(b.timeStamp) - new Date(a.timeStamp);
    }
  );

  useEffect(() => {
    let unsubscribeFromSentCalls = () => {};
    let unsubscribeFromReceivedCalls = () => {};

    if (currentUserUid) {
      unsubscribeFromSentCalls = firestore
        .collection("calls")
        .where("from", "==", currentUserUid)
        .onSnapshot((snapshot) => {
          let sentCalls = snapshot.docs
            .map((doc) => ({ ...doc.data(), id: doc.id }))
            .map((eachData) => ({
              ...eachData,
              timeStamp: eachData?.timeStamp?.toMillis(),
              isCaller: true,
            }));
          setRecentSentCallData(sentCalls);
        });

      unsubscribeFromReceivedCalls = firestore
        .collection("calls")
        .where("userOnOtherSide", "==", currentUserUid)
        .onSnapshot((snapshot) => {
          let receivedCalls = snapshot.docs
            .map((doc) => ({ ...doc.data(), id: doc.id }))
            .map((eachData) => ({
              ...eachData,
              timeStamp: eachData?.timeStamp?.toMillis(),
              isCaller: false,
            }));

          setRecentReceivedCallData(receivedCalls);
        });
    }

    return () => {
      unsubscribeFromSentCalls();
      unsubscribeFromReceivedCalls();
    };
  }, [currentUserUid]);

  return (
    <div className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Recent Calls
      </Typography>

      <div className={classes.swiperContainer}>
        {allCalls.length ? (
          <>
            <div className={`${classes.next} next`}>
              <PlayCircleFilledIcon fontSize="large" />
            </div>
            <div className={`${classes.prev} prev`}>
              <PlayCircleFilledIcon
                style={{ transform: "scale(-1)" }}
                fontSize="large"
              />
            </div>{" "}
            <Swiper
              slidesPerView={1}
              freeMode={true}
              navigation={{ nextEl: ".next", prevEl: ".prev" }}
              className="mySwiper"
              breakpoints={{
                150: {
                  slidesPerView: 1,
                },
                300: {
                  slidesPerView: 2,
                },
                500: {
                  slidesPerView: 3,
                },
                620: {
                  slidesPerView: 4,
                },
                900: {
                  slidesPerView: 5,
                },
                960: {
                  slidesPerView: 2,
                },
                1100: {
                  slidesPerView: 3,
                },
                1300: {
                  slidesPerView: 4,
                },
                1500: {
                  slidesPerView: 5,
                },
                1700: {
                  slidesPerView: 6,
                },
                1900: {
                  slidesPerView: 7,
                },
                2100: {
                  slidesPerView: 8,
                },
              }}
            >
              {allCalls.map((card, idx) => (
                <SwiperSlide
                  style={{ transform: "translateX(1.6rem)" }}
                  key={idx}
                >
                  <RecentCallCard card={card} />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <>
            <Typography
              variant="h4"
              align="center"
              color="textSecondary"
              gutterBottom
            >
              Your recent calls will appear here
            </Typography>
            <Typography variant="h6" align="center" color="textSecondary">
              Make calls to your friends from the bottom left panel.
            </Typography>
          </>
        )}
      </div>
    </div>
  );
};

export default RecentCallsContainer;
