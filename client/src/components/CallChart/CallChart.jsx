import { useEffect, useState } from "react";
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
import { Paper } from "@material-ui/core";

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
  },
}));

const CallChart = ({ uid }) => {
  const [incommingCalls, setIncommingCalls] = useState([]);
  const [outgoingCalls, setOutgoingCalls] = useState([]);

  const classes = useStyles();
  const theme = useTheme();

  // get last 10 days data of incomming and outgoing calls
  const last10Days =
    incommingCalls.length || outgoingCalls.length
      ? [...incommingCalls, ...outgoingCalls].filter(
          (call) =>
            new Date(call.timeStamp).getTime() >
            new Date(new Date().setDate(new Date().getDate() - 10)).getTime()
        )
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
        .where("from", "==", uid);

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
        .where("userOnOtherSide", "==", uid);

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

  return (
    <Paper elevation={9} className={classes.paper}>
      <Line
        data={data}
        style={{
          width: "100% !important",
          height: "100% !important",
          display: "block",
        }}
        options={{
          responsive: true,
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
          },
          scales: {
            y: {
              type: "linear",
              display: true,
              position: "left",
              id: "y",
              ticks: {
                font: {
                  size: theme.typography.fontSize,
                  family: "Poppins",
                },
                color: theme.palette.text.primary,
              },
            },
            x: {
              type: "category",
              display: true,
              position: "bottom",
              id: "x",
              ticks: {
                font: {
                  size: theme.typography.fontSize,
                  family: "Poppins",
                },
                color: theme.palette.text.primary,
              },
            },
          },
        }}
      />
    </Paper>
  );
};

export default CallChart;
