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
import { CustomSnackbar } from "./CustomSnackbar";

function App() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [modal, setModal] = useState(false);

  useEffect(() => {
    getGridData();
  }, []);

  const getGridData = async () => {
    try {
      const res = await axios.get("https://topaz-humane-night.glitch.me");
      setRows(res.data);
      setFilteredRows(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // 000-202-0019	202-0160-10	PULLY PVC 6P
  const filterHandler = () => {
    const filterTextArray = filterText.split(",");
    let newRows = [];
    filterTextArray.forEach((text) => {
      newRows.push(
        ...rows.filter(
          (row) =>
            row["Part #"].includes(text.trim()) ||
            row["Alt.Part#"].includes(text.trim())
        )
      );
      console.log("newRows", text, newRows);
    });
    setFilteredRows(newRows);
  };

  const deleteHandler = async (params) => {
    try {
      const res = await axios.delete(
        `https://topaz-humane-night.glitch.me/${params.target.value}`
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
      <CustomSnackbar
        open={open}
        setOpen={setOpen}
        message={"Successfully Deleted!"}
        severity={"success"}
      />
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
