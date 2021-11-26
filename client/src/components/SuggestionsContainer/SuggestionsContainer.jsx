import SuggestionCard from "../SuggestionCard/SuggestionCard";
import { CircularProgress, makeStyles, Typography } from "@material-ui/core";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper/core";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import { useGetSuggestionsQuery } from "../../features/suggestions-api/suggestions-api-slice";
import { useEffect } from "react";
import toast from "react-hot-toast";

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
  defaultHeight: {
    width: "100%",
    height: "18rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const SuggestionsContainer = () => {
  const classes = useStyles();

  const { data, isError, isLoading, refetch } = useGetSuggestionsQuery();

  useEffect(() => {
    if (isError) {
      toast.error("Error Fetching Suggestions!!");
    }
  }, [isError]);

  return (
    <div className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Suggestions
      </Typography>

      {isLoading ? (
        <div className={classes.defaultHeight}>
          <CircularProgress />
        </div>
      ) : data?.suggestions.length ? (
        <div className={classes.swiperContainer}>
          <div className={`${classes.next} next2`}>
            <PlayCircleFilledIcon fontSize="large" />
          </div>
          <div className={`${classes.prev} prev2`}>
            <PlayCircleFilledIcon
              style={{ transform: "scale(-1)" }}
              fontSize="large"
            />
          </div>
          <Swiper
            slidesPerView={1}
            freeMode={true}
            navigation={{ nextEl: ".next2", prevEl: ".prev2" }}
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
            {data.suggestions.map((uid, idx) => (
              <SwiperSlide
                style={{ transform: "translateX(1.6rem)" }}
                key={idx}
              >
                <SuggestionCard refetch={refetch} uid={uid} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className={classes.defaultHeight}>
          <Typography
            variant="h4"
            align="center"
            color="textSecondary"
            gutterBottom
          >
            No suggestions for you at the moment
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary">
            Looks like you are an early user of the the platform. Welcome!
          </Typography>
        </div>
      )}
    </div>
  );
};

export default SuggestionsContainer;
