import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Modal, Box, Typography, Button, Alert, Snackbar } from "@mui/material";
import axios from "axios";

export const UpdateInventoryModal = ({
  modal,
  setModal,
  filteredRows,
  setFilteredRows,
  columns,
}) => {
  const [newColumns, setNewColumns] = useState([]);
  let updatedRows = [];

  useEffect(() => {
    const requiredColumns = columns.reduce((acc, current) => {
      switch (current?.field) {
        case "id":
          acc.push(current);
          return acc;
        case "Part #":
          acc.push({
            ...current,
            headerName: "Part",
          });
          return acc;
        case "Alt.Part#":
          acc.push({
            ...current,
            headerName: "Alt_Part",
          });
          return acc;
        case "LOCATION A STOCK":
          acc.push({
            ...current,
            headerName: "LocA_Stock",
            width: 150,
            editable: true,
            type: "number",
          });
          return acc;
        case "LOC B STOCK":
          acc.push({
            ...current,
            headerName: "LocB_Stock",
            width: 150,
            editable: true,
            type: "number",
          });
          return acc;
        default:
          return acc;
      }
    }, []);
    setNewColumns(requiredColumns);
  }, []);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,

    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    overflow: "hidden",
    overflowY: "scroll",
    borderRadius: 2,
  };

  const saveDataHandler = async () => {
    try {
      const res = await axios.put("https://topaz-humane-night.glitch.me", {
        updatedRows,
      });
      setFilteredRows(res.data);
      setModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={modal}
      onClose={() => setModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          align="center"
        >
          Update Inventory
        </Typography>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={newColumns}
            processRowUpdate={(params) => {
              if (typeof params["LOCATION A STOCK"] === "number") {
                updatedRows.push({
                  id: params.id,
                  "LOCATION A STOCK": params["LOCATION A STOCK"],
                });
              } else if (typeof params["LOC B STOCK"] === "number") {
                updatedRows.push({
                  id: params.id,
                  "LOC B STOCK": params["LOC B STOCK"],
                });
              }
            }}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
                },
              },
            }}
          />
        </div>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 0.5 }}
        >
          <Button variant="contained" sx={{ mr: 2 }} onClick={saveDataHandler}>
            Save
          </Button>
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            onClick={() => setModal(false)}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
