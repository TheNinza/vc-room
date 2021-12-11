import { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbar,
  GridOverlay,
} from "@material-ui/data-grid";

import { useSelector } from "react-redux";
import moment from "moment";
import { useFetchAllSessionsOfUserQuery } from "../../features/payments-api/payments-api-slice";
import { Button, LinearProgress } from "@material-ui/core";

const PaymentsTable = () => {
  const [rows, setRows] = useState([]);
  const [pageSize, setPageSize] = useState(5);

  const currentUserUid = useSelector((state) => state.user.userData.uid);
  const {
    data,
    isFetching: loading,
    refetch,
  } = useFetchAllSessionsOfUserQuery(null, {
    skip: !currentUserUid,
  });

  const columns = [
    {
      field: "createdAt",
      headerName: "Created At",
      width: 220,
      filterable: false,

      valueFormatter: (params) => {
        return moment(params.value).format("DD MMM, YYYY @ h:mm:ss a");
      },
    },

    {
      field: "sessionId",
      headerName: "Session Id",
      minWidth: 600,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
      valueFormatter: (params) => {
        return `₹ ${params.value}`;
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 150,
      valueFormatter: (params) => {
        return `${params.value} VCoins`;
      },
    },
    {
      field: "paymentStatus",
      headerName: "Status",
      width: 180,
    },

    {
      field: "paidAt",
      headerName: "Paid At",
      width: 220,
      filterable: false,

      valueFormatter: (params) => {
        return params.value
          ? moment(params.value).format("DD MMM, YYYY @ h:mm:ss a")
          : "Not Paid Yet";
      },
    },

    {
      field: "action",
      headerName: "Action",
      width: 150,
      filterable: false,
      sortable: false,

      renderCell: (params) => {
        switch (params.getValue(params.id, "paymentStatus")) {
          case "succeeded":
            return (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  window.open(
                    params.getValue(params.id, "receiptUrl"),
                    "_blank"
                  );
                }}
              >
                View Receipt
              </Button>
            );
          case "requires_payment_method":
            return (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  window.location.href = params.getValue(
                    params.id,
                    "resumeUrl"
                  );
                }}
              >
                Resume Payment
              </Button>
            );
          default:
            return "";
        }
      },
    },
  ];

  useEffect(() => {
    console.log("data", data);
    if (data?.sessions) {
      setRows(data.sessions);
    } else {
      setRows([]);
    }
  }, [data, loading]);

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        pagination={true}
        autoHeight
        loading={loading}
        components={{
          Toolbar: (props) => (
            <GridToolbarContainer {...props}>
              <GridToolbar style={{ marginLeft: "auto" }} {...props} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  refetch();
                }}
              >
                Refresh
              </Button>
            </GridToolbarContainer>
          ),

          LoadingOverlay: (props) => (
            <GridOverlay>
              <div style={{ position: "absolute", top: 0, width: "100%" }}>
                <LinearProgress />
              </div>
            </GridOverlay>
          ),
        }}
      />
    </div>
  );
};

export default PaymentsTable;
