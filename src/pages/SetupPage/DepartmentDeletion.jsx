import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { UseContext } from "../../State/UseState/UseContext";

const DepartmentDeletion = () => {
  const { setAppAlert, cookies } = useContext(UseContext);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmationExcel, setShowConfirmationExcel] = useState(false);
  const organizationId = useParams().organisationId;
  const authToken = cookies["aegis"];
  var deptLocationId;

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        console.log(organizationId);
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organizationId}`,
          {
            headers: { Authorization: authToken },
          }
        );
        setLocations(response.data.locationsData);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocations();
  }, [authToken, organizationId]);

  const handleLocationChange = async (event) => {
    const selectedShortName = event.target.value;
    setSelectedLocation(selectedShortName);
    const selectedLocation = locations.find(
      (obj) => obj.shortName === selectedShortName
    );
    deptLocationId = selectedLocation._id;

    try {
      let departments = await axios.get(
        `${process.env.REACT_APP_API}/route/department/getbylocation/${deptLocationId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      setDepartments(departments.data.message);
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedLocation) {
        console.error("Please select a department to delete.");
        return;
      }
      await axios
        .delete(
          `${process.env.REACT_APP_API}/route/department/delete/${deptLocationId}`,
          {
            headers: { Authorization: authToken },
          }
        )
        .then((response) => {
          setAppAlert({
            alert: true,
            type: "success",
            msg: "Department deleted successfully!",
          });
          setShowConfirmation(false);
        })
        .catch((error) => {
          console.error("Error deleting department:", error);
          setAppAlert({
            alert: true,
            type: "error",
            msg: "Error deleting department. Please try again.",
          });
          setShowConfirmation(false);
        });

      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/department/get`
      );
      setDepartments(response.data.department);
      setSelectedLocation("");
    } catch (error) {
      console.error("Error deleting department:", error);
    }
    setShowConfirmation(false);
  };

  const generateExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      const wsData = [["Department Name", "Department ID"]];

      departments.forEach((department) => {
        wsData.push([department.departmentName, department._id]);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const columnWidths = [{ wch: 20 }, { wch: 15 }];
      ws["!cols"] = columnWidths;

      XLSX.utils.book_append_sheet(wb, ws, "DepartmentSheet");
      XLSX.writeFile(wb, "DepartmentTemplate.xlsx");
    } catch (error) {
      console.error("Error generating Excel:", error);
    }
  };

  const handleDeleteFromExcel = async () => {
    try {
      const fileInput = document.getElementById("fileInput");
      const file = fileInput.files[0];
      console.log(file);

      if (!file) {
        console.error("Please upload an excel file.");
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Please upload an excel file.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = async function (e) {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const ws = workbook.Sheets["DepartmentSheet"];
          const deleteColumnIndex = XLSX.utils.decode_range(ws["!ref"]).e.c;

          if (deleteColumnIndex === undefined) {
            console.error("Delete column not found in the Excel sheet.");
            setAppAlert({
              alert: true,
              type: "error",
              msg: "Delete column not found in the excel sheet.",
            });
            return;
          }

          const departmentsToDelete = [];

          for (
            let row = 1;
            row <= XLSX.utils.decode_range(ws["!ref"]).e.r;
            row++
          ) {
            const deleteCommand =
              ws[XLSX.utils.encode_cell({ r: row, c: deleteColumnIndex })];

            if (
              deleteCommand &&
              deleteCommand.v &&
              deleteCommand.v.toLowerCase() === "delete"
            ) {
              const departmentIdToDelete =
                ws[XLSX.utils.encode_cell({ r: row, c: 1 })].v;
              const departmentToDelete = departments.find(
                (dept) => dept._id === departmentIdToDelete
              );

              if (departmentToDelete) {
                departmentsToDelete.push(departmentToDelete);
              }
            }
          }
          if (departmentsToDelete.length === 0) {
            setAppAlert({
              alert: true,
              type: "error",
              msg: "Failed to delete department from Excel. Please try again.",
            });
            setShowConfirmationExcel(false);
            setSelectedLocation("");
            return;
          }

          for (const department of departmentsToDelete) {
            try {
              await axios
                .delete(
                  `${process.env.REACT_APP_API}/route/department/delete/${department._id}`,
                  {
                    headers: { Authorization: authToken },
                  }
                )
                .then((resp) => {
                  console.log("deleted successfully");
                  setDepartments((prevDepartments) =>
                    prevDepartments.filter(
                      (dept) => dept._id !== department._id
                    )
                  );
                  setAppAlert({
                    alert: true,
                    type: "success",
                    msg: "Departments deleted from the Excel sheet.",
                  });
                  setSelectedLocation("");
                })
                .catch((error) => {
                  console.log(error);
                  setAppAlert({
                    alert: true,
                    type: "error",
                    msg: "Failed to delete department from Excel. Please try again.",
                  });
                });
            } catch (error) {
              console.log(error);
              return;
            }
          }

          setShowConfirmationExcel(false);
        } catch (error) {
          console.error("Error processing Excel data:", error);
          setAppAlert({
            alert: true,
            type: "error",
            msg: "Error processing Excel data.",
          });
          setShowConfirmationExcel(false);
          setSelectedLocation("");
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error handling Excel delete:", error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error handling Excel delete.",
      });
      setShowConfirmationExcel(false);
      setSelectedLocation("");
    }
  };

  const handleConfirmation = async (confirmed) => {
    setShowConfirmation(false);

    if (confirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API}/route/department/delete/${deptLocationId}`,
          {
            headers: { Authorization: authToken },
          }
        );

        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/department/get`
        );
        setDepartments(response.data.department);
        setSelectedLocation("");
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Department deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting department:", error);
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Error deleting department. Please try again.",
        });
      }
    }
  };

  return (
    <Container
      style={{
        width: "100%",
        position: "relative",
        top: "5rem",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        paddingTop: "1rem",
      }}
    >
      <Tooltip
        title={
          <span>
            To perform bulk deletion:
            <ol>
              <li>Select the location whatever you want to delete .</li>
              <li>
                Click on generate excel button. Excel file will be generating.
              </li>
              <li>
                Write "delete" in front of department id in the Excel sheet.
              </li>
              <li>Save the file.</li>
              <li>Click on the choose flle</li>
              <li>Open the dialogue box for delete the department</li>
            </ol>
          </span>
        }
      >
        <Typography variant="h4" className="text-center mb-6 mt-2">
          Departments
        </Typography>
      </Tooltip>
      <p className="text-xs text-gray-600  text-center">
        Add multiple departments for your orgnisation.
      </p>

      <FormControl
        required
        style={{
          width: "100%",
          marginBottom: 30,
          marginTop: 20,
        }}
        size="small"
        variant="outlined"
      >
        <InputLabel
          id="holiday-type-label"
          style={{
            backgroundColor: "white",
            paddingLeft: 8,
          }}
        >
          Select Location
        </InputLabel>
        <Select
          labelId="holiday-type-label"
          id="demo-simple-select"
          name="location"
          value={selectedLocation}
          onChange={handleLocationChange}
          label="Select Location"
        >
          {locations.map((data, index) => (
            <MenuItem key={index} value={data.shortName}>
              {data.shortName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        type="file"
        id="fileInput"
        className="w-full rounded"
        onChange={() => setShowConfirmationExcel(true)}
      />
      <div className="flex gap-5 w-full my-5">
        <Button
          variant="contained"
          color="warning"
          style={{ marginBottom: "2rem" }}
          onClick={generateExcel}
        >
          Generate Excel
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onClose={() => handleConfirmation(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this department?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmation(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="outlined"
            color="primary"
            size="small"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showConfirmationExcel}
        onClose={() => handleConfirmation(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete these departments?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowConfirmationExcel(false)}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleDeleteFromExcel}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DepartmentDeletion;
