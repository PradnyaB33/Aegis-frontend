import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import UserProfile from "../../../hooks/UserData/useUser";

const EditModelOpen = ({ handleClose, open, employeeId, organisationId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  console.log("role", role);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    companyemail: "",
    address: "",
    citizenship: "",
    date_of_birth: "",
    joining_date: "",
    bank_account_no: "",
    adhar_card_number: "",
    pan_card_number: "",
    empId: "",
  });

  const [selectedGender, setSelectedGender] = useState("");

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const [additionalInfo, setAdditionalInfo] = useState({
    "Emergency Contact": "",
    "Passport No": "",
    "Middle Name": "",
    "Permanent Address": "",
    "Primary Nationality": "",
    "Relative Information": "",
    "Marital Status": "",
    Education: "",
  });

  const [profile, setProfile] = useState([]);
  const [selectedWorkLocation, setSelectedWorkLocation] = useState(null);
  const [deptname, setDepartment] = useState(null);
  const [designation, setDesignation] = useState(null);
  const [salaryTemplate, setSalaryTemplate] = useState(null);
  const [employementType, setEmployementType] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [mgrempid, setMgrempid] = useState(null);
  const [dept_cost_center_no, setDeptCostCenterId] = useState(null);
  const [shift_allocation, setShiftAllocation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (open && employeeId !== null && employeeId !== undefined) {
          const response = await axios.get(
            `${process.env.REACT_APP_API}/route/employee/get/profile/${employeeId}`,
            {
              headers: {
                Authorization: authToken,
              },
            }
          );
          setEmployeeData(response.data.employee);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchData();
    return () => {};
  }, [open, employeeId, authToken]);

  console.log(employeeData);

  const [availabelLocation, setAvailableLocation] = useState([]);
  const fetchAvailableLocation = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setAvailableLocation(response.data.locationsData);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Available Work Location");
    }
  };
  useEffect(() => {
    fetchAvailableLocation();
    // eslint-disable-next-line
  }, []);

  const [availabelDepartment, setAvailableDepartment] = useState([]);
  const fetchAvailableDepartment = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/department/get/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setAvailableDepartment(response.data.department);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Available Work Location");
    }
  };
  useEffect(() => {
    fetchAvailableDepartment();
    // eslint-disable-next-line
  }, []);

  const [availabelDesignation, setAvailableDesignation] = useState([]);
  const fetchAvailableDesignation = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/designation/create/${organisationId}`
      );

      setAvailableDesignation(response.data.designations);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Available Designation");
    }
  };

  useEffect(() => {
    fetchAvailableDesignation();
    // eslint-disable-next-line
  }, []);

  const [availabelSalaryTemplate, setAvailabaleSalaryTemplate] = useState([]);
  const fetchAvailableSalaryTemplate = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/salary-template-org/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setAvailabaleSalaryTemplate(response.data.salaryTemplates);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Available Salary Template");
    }
  };
  useEffect(() => {
    fetchAvailableSalaryTemplate();
    // eslint-disable-next-line
  }, []);

  const [availabelEmpTypes, setAvailableEmpTypes] = useState([]);
  const fetchAvailabeEmpTypes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employment-types-organisation/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      setAvailableEmpTypes(response.data.empTypes);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Available Employement Type");
    }
  };
  useEffect(() => {
    fetchAvailabeEmpTypes();
    // eslint-disable-next-line
  }, []);

  const [managerData, setManagerData] = useState([]);
  const fetchManagerData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/getAllManager/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log("response", response);
      setManagerData(response.data.manager);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchManagerData();
    // eslint-disable-next-line
  }, []);
  console.log("manager data ", managerData);

  // pull the profile
  const [availableProfiles, setAvailableProfiles] = useState([]);
  const fetchAvailableProfiles = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/profile/role/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      const rolesArray = Object.entries(response.data.roles ?? {})
        .filter(([role, obj]) => obj.isActive === true)
        .map(([role, obj]) => ({
          roleName: role,
          isApprover: obj.isApprover,
          isActive: obj.isActive,
        }));

      setAvailableProfiles(rolesArray);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch available profiles");
    }
  };

  useEffect(() => {
    fetchAvailableProfiles();
    // eslint-disable-next-line
  }, [organisationId]);

  const [availaleCostCenterId, setAvailableCostCenter] = useState([]);
  const fetchAvailableCostCenter = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/department/get/cost-center-id/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setAvailableCostCenter(response.data.data.departments);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAvailableCostCenter();
    // eslint-disable-next-line
  }, []);

  const [availaleShiftAllocation, setAvailableShiftAllocation] = useState([]);
  const fetchAvailableShiftAllocation = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/shifts/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setAvailableShiftAllocation(response.data.shifts);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAvailableShiftAllocation();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleLocationChange = (event) => {
    setSelectedWorkLocation(event.target.value);
  };
  const handleShiftChange = (event) => {
    setShiftAllocation(event.target.value);
  };

  const handleDepartmnetChange = (event) => {
    setDepartment(event.target.value);
  };

  const handleDesignationChange = (event) => {
    setDesignation(event.target.value);
  };

  const handleSalaryTemplateChange = (event) => {
    setSalaryTemplate(event.target.value);
  };

  const handleEmployementChange = (event) => {
    setEmployementType(event.target.value);
  };

  const handleProfileChange = (event) => {
    const selectedProfile = event.target.value;
    setProfile((prevProfiles) => {
      if (prevProfiles.includes(selectedProfile)) {
        return prevProfiles.filter((profile) => profile !== selectedProfile);
      } else {
        return [...prevProfiles, selectedProfile];
      }
    });
  };

  useEffect(() => {
    if (employeeData) {
      const formattedDateOfBirth = employeeData.date_of_birth
        ? new Date(employeeData.date_of_birth).toLocaleDateString("en-US")
        : "";
      const formattedJoiningDate = employeeData.joining_date
        ? new Date(employeeData.joining_date).toLocaleDateString("en-US")
        : "";

      setFormData({
        first_name: employeeData?.first_name || "",
        last_name: employeeData?.last_name || "",
        email: employeeData?.email || "",
        phone_number: employeeData?.phone_number || "",
        companyemail: employeeData?.companyemail || "",
        address: employeeData?.address || "",
        citizenship: employeeData?.citizenship || "",
        date_of_birth: formattedDateOfBirth,
        joining_date: formattedJoiningDate,
        bank_account_no: employeeData?.bank_account_no || "",
        adhar_card_number: employeeData?.adhar_card_number || "",
        pan_card_number: employeeData?.pan_card_number || "",
        empId: employeeData?.empId || "",
        gender: employeeData?.gender || "",
      });

      if (employeeData?.additionalInfo) {
        const additionalInfoData = employeeData.additionalInfo;
        setAdditionalInfo({
          Education: additionalInfoData.Education ?? "",
          "Emergency Contact":
            additionalInfoData["Emergency Contact"] &&
            additionalInfoData["Emergency Contact"] !== null
              ? additionalInfoData["Emergency Contact"]
              : "",
          "Marital Status":
            additionalInfoData["Marital Status"] &&
            additionalInfoData["Marital Status"] !== null
              ? additionalInfoData["Marital Status"]
              : "",
          "Middle Name": additionalInfoData["Middle Name"] ?? "",
          "Permanent Address": additionalInfoData["Permanent Address"] ?? "",
          "Passport No": additionalInfoData["Passport No"] ?? "",
          "Primary Nationality":
            additionalInfoData["Primary Nationality"] ?? "",
          "Relative Information":
            additionalInfoData["Relative Information"] ?? "",
        });
      }

      // pull work location of employee which is already stored in database
      const employeeWorkLocations = employeeData?.worklocation || "";
      const workLocationName = employeeWorkLocations[0]?.city || "";
      const selectedWorkLocationObject = availabelLocation.find(
        (location) => location.city === workLocationName
      );
      if (selectedWorkLocationObject) {
        setSelectedWorkLocation(selectedWorkLocationObject._id);
      } else {
        setSelectedWorkLocation(null);
      }

      const employeeDepartment = employeeData?.deptname || "";
      const employeeDepartmentName =
        employeeDepartment[0]?.departmentName || "";

      const empDeptObject = availabelDepartment.find(
        (department) => department.departmentName === employeeDepartmentName
      );

      if (empDeptObject) {
        setDepartment(empDeptObject._id);
      } else {
        setDepartment(null);
      }

      const employeeDesignation = employeeData?.designation || "";
      const employeeDesignationName =
        employeeDesignation[0]?.designationName || "";
      const empDesignationObject = availabelDesignation.find(
        (designation) => designation.designationName === employeeDesignationName
      );
      if (empDesignationObject) {
        setDesignation(empDesignationObject._id);
      } else {
        setDesignation(null);
      }

      const empSalaryTemplate = employeeData?.salarystructure || "";
      if (empSalaryTemplate) {
        setSalaryTemplate(empSalaryTemplate._id);
      } else {
        setSalaryTemplate(null);
      }

      const employementType = employeeData?.employmentType || "";
      if (employementType) {
        setEmployementType(employementType._id);
      } else {
        setEmployementType(null);
      }
      let shift_id = employeeData?.shift_allocation || "";
      console.log("shift id", shift_id);
      const employeeProfileData = employeeData?.profile || [];
      setProfile(employeeProfileData);
      setMgrempid(employeeData?.mgrempid || "");
      setSelectedGender(employeeData?.gender || "");
      setDeptCostCenterId(employeeData?.dept_cost_center_no || "");
      setShiftAllocation(employeeData?.shift_allocation || "");
    }
  }, [
    employeeData,
    availabelLocation,
    availabelDepartment,
    availabelDesignation,
  ]);

  const EditEmployeeData = useMutation(
    (data) =>
      axios.put(
        `${process.env.REACT_APP_API}/route/employee/update/${organisationId}/${employeeId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["employeeId"] });
        handleClose();
        handleAlert(true, "success", "Employee updated successfully");
      },
      onError: () => {
        handleAlert("Failed to update employee. Please try again.");
      },
    }
  );

  // when user click on edit employee data button that time invoke this function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (employeeId) {
        const updatedData = {
          ...formData,
          additionalInfo,
          worklocation: [selectedWorkLocation],
          deptname,
          gender: selectedGender,
          designation,
          mgrempid: mgrempid,
          salarystructure: salaryTemplate,
          employmentType: employementType,
          profile,
          shift_allocation,
          dept_cost_center_no,
        };
        await EditEmployeeData.mutateAsync(updatedData);
      }
    } catch (error) {
      console.error(error);
      handleAlert("Failed to update employee. Please try again.");
    }
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "800px!important",
          height: "100%",
          maxHeight: "85vh!important",
        },
      }}
      open={open}
      onClose={handleClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="flex w-full justify-between py-4 items-center  px-4">
        <h1 id="modal-modal-title" className="text-lg pl-2 font-semibold">
          Edit Employee Data
        </h1>
        <IconButton onClick={handleClose}>
          <CloseIcon className="!text-[16px]" />
        </IconButton>
      </div>

      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <div className="w-full">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>

        <div className="px-5 space-y-4 mt-4">
          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                First Name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>

          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Last Name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>

          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Employee Id
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Employee Id"
                name="empId"
                value={formData.empId}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Email
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Phone Number
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Bank Account Number
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Bank Account Number"
                name="bank_account_no"
                value={formData.bank_account_no}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Comapany Email
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="companyemail"
                name="companyemail"
                value={formData.companyemail}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>

          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Address
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Citizenship
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="citizenship"
                name="citizenship"
                value={formData.citizenship}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Adhar Card Number
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="adhar_card_number"
                name="adhar_card_number"
                value={formData.adhar_card_number}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">PAN</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="PAN"
                name="pan_card_number"
                value={formData.pan_card_number}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Date Of Birth
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>

          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Date of Joining
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="joining_date"
                name="joining_date"
                value={formData.joining_date}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>

          {/* AdditionalInfo fields */}

          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Education
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Education"
                name="Education"
                value={additionalInfo.Education}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    Education: e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Emergency Contact
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Emergency Contact"
                name="Emergency Contact"
                value={additionalInfo["Emergency Contact"]}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    "Emergency Contact": e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Middle Name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Middle Name"
                name="Middle Name"
                value={additionalInfo["Middle Name"]}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    "Middle Name": e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Permanent Address
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Permanent Address"
                name="Permanent Address"
                value={additionalInfo["Permanent Address"]}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    "Permanent Address": e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Primary Nationality
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Primary Nationality"
                name="Primary Nationality"
                value={additionalInfo["Primary Nationality"]}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    "Primary Nationality": e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>
          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Relative Information
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Relative Information"
                name="Relative Information"
                value={additionalInfo["Relative Information"]}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    "Relative Information": e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>
          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Passport No
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Passport No"
                name="Passport No"
                value={additionalInfo["Passport No"]}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    "Passport No": e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>

          <div
            className="space-y-2"
            style={{ borderColor: "rgba(0, 0, 0, 0.3)" }}
          >
            <label
              htmlFor="workLocation"
              style={{ display: "block", color: "#000000" }}
            >
              Role:
            </label>
            <select
              multiple // Enable multiple selections
              value={profile}
              onChange={handleProfileChange}
              style={{
                width: "750px",
                padding: "8px",
                borderColor: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <option value="">Select Role</option>
              {availableProfiles.map((empProfile) => (
                <option key={empProfile.roleName} value={empProfile.roleName}>
                  {empProfile.roleName}
                </option>
              ))}
            </select>
          </div>
          <div
            className="space-y-2"
            style={{ borderColor: "rgba(0, 0, 0, 0.3)" }}
          >
            <label
              htmlFor="workLocation"
              style={{ display: "block", color: "#000000" }}
            >
              Work Location:
            </label>
            <select
              id="workLocation"
              value={selectedWorkLocation || ""}
              onChange={handleLocationChange}
              style={{
                width: "750px",
                padding: "8px",
                borderColor: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <option value="">Select Work Location</option>
              {Array.isArray(availabelLocation) &&
                availabelLocation?.map((location) => (
                  <option key={location._id} value={location._id}>
                    {location?.city || ""}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="workLocation"
              style={{ display: "block", color: "#000000" }}
            >
              Department:
            </label>
            <select
              value={deptname || ""}
              onChange={handleDepartmnetChange}
              style={{
                width: "750px",
                padding: "8px",
                borderColor: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <option value="">Select Department</option>
              {Array.isArray(availabelDepartment) &&
                availabelDepartment?.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department?.departmentName || ""}
                  </option>
                ))}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="workLocation"
              style={{ display: "block", color: "#000000" }}
            >
              Designation:
            </label>
            <select
              value={designation || ""}
              onChange={handleDesignationChange}
              style={{
                width: "750px",
                padding: "8px",
                borderColor: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <option value="">Select Designation</option>
              {Array.isArray(availabelDesignation) &&
                availabelDesignation?.map((designation) => (
                  <option key={designation._id} value={designation._id}>
                    {designation?.designationName || ""}
                  </option>
                ))}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="workLocation"
              style={{ display: "block", color: "#000000" }}
            >
              Salary Template:
            </label>
            <select
              value={salaryTemplate || ""}
              onChange={handleSalaryTemplateChange}
              style={{
                width: "750px",
                padding: "8px",
                borderColor: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <option value="">Select Salary Template</option>
              {Array.isArray(availabelSalaryTemplate) &&
                availabelSalaryTemplate?.map((salarytemplate) => (
                  <option key={salarytemplate._id} value={salarytemplate._id}>
                    {salarytemplate?.name || ""}
                  </option>
                ))}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="workLocation"
              style={{ display: "block", color: "#000000" }}
            >
              Employment Type :
            </label>
            <select
              value={employementType || ""}
              onChange={handleEmployementChange}
              style={{
                width: "750px",
                padding: "8px",
                borderColor: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <option value="">Select Employment Type</option>
              {Array.isArray(availabelEmpTypes) &&
                availabelEmpTypes?.map((empType) => (
                  <option key={empType?._id} value={empType?._id}>
                    {empType?.title}
                  </option>
                ))}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="workLocation"
              style={{ display: "block", color: "#000000" }}
            >
              Department Cost No:
            </label>
            <select
              value={dept_cost_center_no}
              onChange={(e) => setDeptCostCenterId(e.target.value)}
              style={{
                width: "750px",
                padding: "8px",
                borderColor: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <option value="">Select Department Cost Center No</option>
              {Array.isArray(availaleCostCenterId) &&
                availaleCostCenterId?.map((costno) => (
                  <option key={costno?._id} value={costno?.dept_cost_center_id}>
                    {costno?.dept_cost_center_id}
                  </option>
                ))}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="workLocation"
              style={{ display: "block", color: "#000000" }}
            >
              Shift :
            </label>
            <select
              value={shift_allocation || ""}
              onChange={handleShiftChange}
              style={{
                width: "750px",
                padding: "8px",
                borderColor: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <option value="">Select Shift Allocation</option>
              {Array.isArray(availaleShiftAllocation) &&
                availaleShiftAllocation?.map((shift) => (
                  <option key={shift?._id} value={shift?.shiftName}>
                    {shift?.shiftName}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="workLocation"
              style={{ display: "block", color: "#000000" }}
            >
              Manager :
            </label>

            <select
              value={mgrempid || ""}
              onChange={(e) => setMgrempid(e.target.value)}
              style={{
                width: "750px",
                padding: "8px",
                borderColor: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <option value="">Select Manager</option>
              {Array.isArray(managerData) &&
                managerData?.map((manager) => (
                  <option key={manager._id} value={manager._id}>
                    {`${manager?.first_name} ${manager?.last_name}`}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-2 ">
            <RadioGroup
              aria-label="gender"
              name="gender"
              value={selectedGender}
              onChange={handleGenderChange}
              row
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </div>
          <DialogActions>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={EditEmployeeData.isLoading}
            >
              {EditEmployeeData.isLoading ? (
                <CircularProgress size={20} />
              ) : (
                "Apply"
              )}
            </Button>
          </DialogActions>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditModelOpen;
