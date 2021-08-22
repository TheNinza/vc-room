import SuggestionCard from "../SuggestionCard/SuggestionCard";
import { makeStyles, Typography } from "@material-ui/core";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper/core";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";

const dummyCards = [
  {
    id: "1",
    image:
      "https://images.pexels.com/photos/4407688/pexels-photo-4407688.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    name: "Thor",
    time: "2021-08-21T06:24:46+0000",
    status:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, fugit.",
  },
  {
    id: "1",
    image:
      "https://images.pexels.com/photos/2811087/pexels-photo-2811087.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    name: "Iron Man",
    time: "2021-08-21T06:24:46+0000",
    status:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, fugit.",
  },
  {
    id: "1",
    image:
      "https://images.pexels.com/photos/3170437/pexels-photo-3170437.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    name: "Captain America",
    time: "2021-08-21T06:24:46+0000",
    status:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, fugit.",
  },

  {
    id: "1",
    image:
      "https://images.pexels.com/photos/3170437/pexels-photo-3170437.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    name: "Captain Marvel",
    time: "2021-08-21T06:24:46+0000",
    status:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, fugit.",
  },
  {
    id: "1",
    image:
      "https://images.pexels.com/photos/3170437/pexels-photo-3170437.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    name: "Captain America",
    time: "2021-08-21T06:24:46+0000",
    status:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, fugit.",
  },
  {
    id: "1",
    image:
      "https://images.pexels.com/photos/3170437/pexels-photo-3170437.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    name: "Captain America",
    time: "2021-08-21T06:24:46+0000",
    status:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, fugit.",
  },
  {
    id: "1",
    image:
      "https://images.pexels.com/photos/3170437/pexels-photo-3170437.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    name: "Captain America",
    time: "2021-08-21T06:24:46+0000",
    status:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, fugit.",
  },
  {
    id: "1",
    image:
      "https://images.pexels.com/photos/3170437/pexels-photo-3170437.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    name: "Captain America",
    time: "2021-08-21T06:24:46+0000",
    status:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, fugit.",
  },
];

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

const SuggestionsContainer = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Suggestions
      </Typography>

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
          {dummyCards.map((card, idx) => (
            <SwiperSlide style={{ transform: "translateX(1.6rem)" }} key={idx}>
              <SuggestionCard card={card} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SuggestionsContainer;
