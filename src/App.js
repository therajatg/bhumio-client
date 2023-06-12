import { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import axios from "axios";
import { Alert, Button, Snackbar, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { UpdateInventoryModal } from "./UpdateInventoryModal";

function App() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [modal, setModal] = useState(false);

  useEffect(() => {
    getGridData();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const getGridData = async () => {
    try {
      const res = await axios.get("http://localhost:5000");
      setRows(res.data);
      setFilteredRows(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterHandler = () => {
    const trimedFilteredText = filterText.trim();
    setFilteredRows(
      rows.filter(
        (row) =>
          row["Part #"].includes(trimedFilteredText) ||
          row["Alt.Part#"].includes(trimedFilteredText)
      )
    );
  };

  const deleteHandler = async (params) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/${params.target.value}`
      );
      setRows(res.data);
      setFilteredRows(res.data);
      setOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  };

  const columns = [
    { field: "id" },
    { field: "Part #", headerName: "Part #", width: 100 },
    { field: "Alt.Part#", headerName: "Alt.Part#" },
    { field: "name", headerName: "Name" },
    { field: "brand", headerName: "Brand", width: 100 },
    { field: "model", headerName: "Model" },
    { field: "engine", headerName: "Engine" },
    { field: "car", headerName: "Car", width: 100 },
    { field: "location A", headerName: "location A" },
    { field: "LOCATION A STOCK", headerName: "LOCATION A STOCK", width: 150 },
    { field: "LOCATION B", headerName: "LOCATION B", width: 100 },
    { field: "LOC B STOCK", headerName: "LOC B STOCK", width: 120 },
    { field: "unit", headerName: "Unit" },
    { field: "rate", headerName: "Rate", width: 100 },
    { field: "Value", headerName: "Value" },
    { field: "remarks", headerName: "Remarks" },
    {
      field: "",
      headerName: "",
      renderCell: (params) => (
        <Button value={params.id} variant="contained" onClick={deleteHandler}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ m: 4 }}>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Successfully Deleted!
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            size="small"
            label="Search"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <Button variant="contained" onClick={filterHandler}>
            Filter
          </Button>
        </Box>
        <Button variant="contained" onClick={() => setModal(true)}>
          Update Inventory
        </Button>
      </Box>
      {rows?.length && (
        <DataGrid
          rows={filteredRows}
          columns={columns}
          slots={{
            toolbar: CustomToolbar,
          }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
          }}
        />
      )}
      {modal && (
        <UpdateInventoryModal
          modal={modal}
          setModal={setModal}
          filteredRows={filteredRows}
          setFilteredRows={setFilteredRows}
          columns={columns}
        />
      )}
    </Box>
  );
}

export default App;
