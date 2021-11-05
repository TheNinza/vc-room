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

  const [recentCallData, setRecentCallData] = useState([]);

  useEffect(() => {
    let unsubscribeFromSentCalls = firestore
      .collection("calls")
      .where("from", "==", currentUserUid)
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) => {
        let data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        // neat trick to remove duplicates
        // let uniqueData = data.filter(
        //   (item, pos, arr) =>
        //     pos === 0 || item.userOnOtherSide !== arr[pos - 1].userOnOtherSide
        // );
        setRecentCallData(
          data.map((formatedData) => ({
            ...formatedData,
            timeStamp: formatedData?.timeStamp?.toMillis(),
          }))
        );
      });

    return unsubscribeFromSentCalls;
  }, [currentUserUid]);

  return (
    <div className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Recent Calls
      </Typography>

      <div className={classes.swiperContainer}>
        {recentCallData.length ? (
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
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 4,
                },
                1024: {
                  slidesPerView: 6,
                },
              }}
            >
              {recentCallData.map((card, idx) => (
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
