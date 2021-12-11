import { useEffect, useRef, useState } from "react";
import moment from "moment";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
// import faker from "faker";
import { firestore } from "../../lib/firebase/firebase";
import { makeStyles, useTheme } from "@material-ui/styles";
import { Paper, Typography, useMediaQuery } from "@material-ui/core";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "1rem",
    flex: 1,
    position: "relative",
    width: "100%",
    [theme.breakpoints.down("800")]: {
      padding: "0.5rem",
      overflowX: "scroll",

      "& canvas": {
        overflowX: "scroll",
      },
    },
  },
}));

const CallChart = ({ uid }) => {
  const [incommingCalls, setIncommingCalls] = useState([]);
  const [outgoingCalls, setOutgoingCalls] = useState([]);
  const chartRef = useRef();
  const containerRef = useRef();
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery("(max-width:800px)");

  // get last 10 days data of incomming and outgoing calls
  const last10Days =
    incommingCalls.length || outgoingCalls.length
      ? [...incommingCalls, ...outgoingCalls]
          .filter(
            (call) =>
              new Date(call.timeStamp).getTime() >
              new Date(new Date().setDate(new Date().getDate() - 10)).getTime()
          )
          .sort((a, b) => a.timeStamp - b.timeStamp)
      : [];

  // count number of days from the first call and today
  let days = last10Days.length
    ? moment().diff(moment(last10Days[0].timeStamp), "days") +
      1 +
      (moment(last10Days[0].timeStamp).isSame(moment(), "day") ? 0 : 1)
    : 0;

  // get 10 days from today
  const labels = [...Array(10 < days ? 10 : days).keys()]
    .map((day) => {
      const dateString = new Date(
        new Date().setDate(new Date().getDate() - day)
      ).toDateString();
      return dateString.slice(4, dateString.length);
    })
    .reverse();

  // fetch number of calls from and to the current user in each month from firebase
  useEffect(() => {
    let unsubscribeFromOutgoingCallsCollection = () => {};
    let unsubscribeFromIncomingCallsCollection = () => {};
    if (uid) {
      const outgoingCallsCollectionQuery = firestore
        .collection("calls")
        .where("from", "==", uid)
        .where("callAccepted", "==", true);

      unsubscribeFromOutgoingCallsCollection =
        outgoingCallsCollectionQuery.onSnapshot((snapshot) => {
          const calls = snapshot.docs.map((doc) => {
            return {
              ...doc.data(),
              id: doc.id,
              timeStamp: doc.data().timeStamp.toMillis(),
            };
          });
          setOutgoingCalls(calls);
        });

      const incomingCallsCollectionQuery = firestore
        .collection("calls")
        .where("userOnOtherSide", "==", uid)
        .where("callAccepted", "==", true);

      unsubscribeFromIncomingCallsCollection =
        incomingCallsCollectionQuery.onSnapshot((snapshot) => {
          const calls = snapshot.docs.map((doc) => {
            return {
              ...doc.data(),
              id: doc.id,
              timeStamp: doc.data().timeStamp.toMillis(),
            };
          });
          setIncommingCalls(calls);
        });
    }
    return () => {
      unsubscribeFromOutgoingCallsCollection();
      unsubscribeFromIncomingCallsCollection();
    };
  }, [uid]);

  const data = {
    labels,
    datasets: [
      {
        label: "Outgoing Calls",
        data: labels.map((label) => {
          const calls = outgoingCalls.filter(
            (call) => new Date(call.timeStamp).toDateString().slice(4) === label
          );
          return calls.length;
        }),
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.main,
        tension: 0.15,
      },
      {
        label: "Incoming Calls",
        data: labels.map((label) => {
          const calls = incommingCalls.filter(
            (call) => new Date(call.timeStamp).toDateString().slice(4) === label
          );
          return calls.length;
        }),
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main,
        tension: 0.15,
      },
    ],
  };

  useEffect(() => {
    if (chartRef.current && containerRef.current) {
      let containerWidth = containerRef.current.clientWidth;
      let containerHeight = containerRef.current.clientHeight - 60;

      const width =
        (days * 91 > containerWidth ? days * 91 : containerWidth) - 20;

      const targetCtx = chartRef.current?.getContext("2d");
      targetCtx.chart.resize(matches ? width : containerWidth, containerHeight);

      window.addEventListener("resize", () => {
        const width =
          (days * 91 > containerWidth ? days * 91 : containerWidth) - 20;

        containerWidth = containerRef.current?.clientWidth;
        containerHeight = containerRef.current?.clientHeight - 60;
        if (containerHeight && containerWidth) {
          targetCtx?.chart?.resize(
            matches ? width : containerWidth,
            containerHeight
          );
        }
      });
    }

    window.removeEventListener("resize", () => {
      console.log("removed");
    });
  }, [matches, days]);

  if (!incommingCalls.length && !outgoingCalls.length) {
    return (
      <Typography variant="h6" align="center">
        Go make some calls!
      </Typography>
    );
  }

  return (
    <Paper ref={containerRef} elevation={9} className={classes.paper}>
      <Line
        ref={chartRef}
        data={data}
        style={{
          width: matches ? days * 91 : "100%",
          height: "100% !important",
          display: "block",
          minHeight: "20rem",
          maxHeight: matches ? "20rem" : "70vh",
        }}
        options={{
          responsive: matches ? false : true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false,
          },

          plugins: {
            filler: {
              propagate: true,
            },
            legend: {
              labels: {
                font: {
                  size: theme.typography.htmlFontSize,
                },
                color: theme.palette.text.primary,
              },
            },
            title: {
              display: true,
              text: "Successfully Connected Calls",
              font: {
                size: matches ? theme.typography.fontSize : 24,
                family: "Poppins",
                weight: 500,
              },
              color: theme.palette.text.primary,
              align: matches ? "start" : "center",
            },
          },
          scales: {
            y: {
              type: "linear",
              display: true,
              position: "left",
              id: "y",
              ticks: {
                font: {
                  size: matches ? 12 : theme.typography.fontSize,
                  family: "Poppins",
                },
                color: theme.palette.text.primary,
                precision: 0,
              },
            },
            x: {
              type: "category",
              display: true,
              position: "bottom",
              id: "x",
              ticks: {
                font: {
                  size: matches ? 12 : theme.typography.fontSize,
                  family: "Poppins",
                },
                color: theme.palette.text.primary,
                align: "center",
              },
            },
          },
        }}
      />
    </Paper>
  );
};

export default CallChart;
