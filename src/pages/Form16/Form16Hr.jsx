import { MoreVert } from "@mui/icons-material";
import {
  Menu,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import Form16DeleteModal from "../../components/Modal/Form16Modal/Form16DeleteModal";
import Form16Download from "../../components/Modal/Form16Modal/Form16Download";
import Form16UploadModal from "../../components/Modal/Form16Modal/Form16UploadModal";
const Form16Hr = () => {
  // state and other thing
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [nameSearch, setNameSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const { organisationId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch function to get paginated employees
  const fetchAvailableEmployee = async (organisationId, authToken, page) => {
    const apiUrl = `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}?page=${page}&nameSearch=${nameSearch}&deptSearch=${deptSearch}&locationSearch=${locationSearch}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: authToken,
      },
    });
    return response.data;
  };

  // Use React Query to fetch employee data
  const { data } = useQuery(
    ["employees", organisationId, currentPage],
    () => fetchAvailableEmployee(organisationId, authToken, currentPage),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  const totalPages = data?.totalPages || 1;
  const availableEmployee = data?.employees || [];

  //   for morevert icon
  const [anchorEl, setAnchorEl] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);

  const handleClick = (e, id) => {
    setAnchorEl(e.currentTarget);
    setEmployeeId(id);
  };
  const handleCloseIcon = () => {
    setAnchorEl(null);
  };

  // Modal states and function for upload
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // for open
  const handleUploadModalOpen = () => {
    setUploadModalOpen(true);
  };
  //   for close
  const handleUploadModalClose = () => {
    setUploadModalOpen(false);
  };

  // Modal states and function for download or view form 16
  const [downloadModalOpen, setDownLoadModalOpen] = useState(false);
  // for open
  const handleDownLoadModalOpen = () => {
    setDownLoadModalOpen(true);
  };
  //   for close
  const handleDownLoadModalClose = () => {
    setDownLoadModalOpen(false);
  };

  // Modal states and function for delete form 16
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // for open
  const handleDeleteModalOpen = () => {
    setDeleteModalOpen(true);
  };
  //   for close
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };
  return (
    <>
      <BoxComponent>
        <HeadingOneLineInfo
          heading={"Form-16"}
          info={"Upload , download and view form-16 of your employee here."}
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 w-full mb-2">
          <div className="flex items-center gap-3 mb-3 md:mb-0 w-full md:w-auto">
            <TextField
              onChange={(e) => setNameSearch(e.target.value)}
              placeholder="Search Employee Name...."
              variant="outlined"
              size="small"
              sx={{ width: { xs: "100%", sm: 300 }, bgcolor: "white" }}
            />
          </div>
          <div className="flex items-center gap-3 mb-3 md:mb-0 w-full md:w-auto">
            <TextField
              onChange={(e) => setDeptSearch(e.target.value)}
              placeholder="Search Department Name...."
              variant="outlined"
              size="small"
              sx={{ width: { xs: "100%", sm: 300 }, bgcolor: "white" }}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <TextField
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder="Search Location ...."
              variant="outlined"
              size="small"
              sx={{ width: { xs: "100%", sm: 300 }, bgcolor: "white" }}
            />
          </div>
        </div>

        <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
          <table className="min-w-full bg-white  text-left !text-sm font-light">
            <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
              <tr className="!font-semibold">
                <th scope="col" className="!text-left pl-8 py-3">
                  Sr. No
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  First Name
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  Last Name
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  Email
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  Location
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  Department
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  Phone Number
                </th>
                <th scope="col" className="pl-8 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {availableEmployee
                .filter((item) => {
                  return (
                    (!nameSearch.toLowerCase() ||
                      (item.first_name !== null &&
                        item.first_name !== undefined &&
                        item.first_name.toLowerCase().includes(nameSearch))) &&
                    (!deptSearch ||
                      (item.deptname !== null &&
                        item.deptname !== undefined &&
                        item.deptname.some(
                          (dept) =>
                            dept.departmentName !== null &&
                            dept.departmentName
                              .toLowerCase()
                              .includes(deptSearch.toLowerCase())
                        ))) &&
                    (!locationSearch.toLowerCase() ||
                      item.worklocation.some(
                        (location) =>
                          location &&
                          location.city !== null &&
                          location.city !== undefined &&
                          location.city.toLowerCase().includes(locationSearch)
                      ))
                  );
                })
                .map((item, id) => (
                  <tr className="!font-medium border-b" key={id}>
                    <td className="!text-left pl-8 py-3">{id + 1}</td>
                    <td className="py-3 pl-8">{item?.first_name}</td>
                    <td className="py-3 pl-8">{item?.last_name}</td>
                    <td className="py-3 pl-8">{item?.email}</td>
                    <td className="py-3 pl-8">
                      {item?.worklocation?.map((location, index) => (
                        <span key={index}>{location?.city}</span>
                      ))}
                    </td>
                    <td className="py-3 pl-8 ">
                      {item?.deptname?.map((dept, index) => (
                        <span key={index}>{dept?.departmentName}</span>
                      ))}
                    </td>
                    <td className="py-3 pl-8 ">{item?.phone_number}</td>
                    <td className="py-3 pl-8 ">
                      <MoreVert
                        onClick={(e) => handleClick(e, item._id)} // Pass item._id to handleClick
                        className="cursor-pointer"
                      />
                      <Menu
                        elevation={2}
                        anchorEl={anchorEl}
                        key={id}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseIcon}
                      >
                        <Tooltip title="Button for uploading form 16">
                          <MenuItem
                            onClick={() => {
                              handleUploadModalOpen();
                            }}
                          >
                            upload form 16
                            {/* <CloudUploadIcon
                              color="primary"
                              aria-label="edit"
                              style={{
                                color: "#f50057",
                                marginRight: "10px",
                              }}
                            /> */}
                          </MenuItem>
                        </Tooltip>
                        <Tooltip title="Button for downloading or view  form 16">
                          <MenuItem onClick={() => handleDownLoadModalOpen()}>
                            Download or view form 16
                            {/* <GetAppIcon
                              color="primary"
                              aria-label="edit"
                              style={{
                                color: "#2196f3",
                                marginRight: "10px",
                              }}
                            /> */}
                          </MenuItem>
                        </Tooltip>
                        <Tooltip title="Button for deleting  form 16">
                          <MenuItem onClick={() => handleDeleteModalOpen()}>
                            {/* <DeleteIcon
                              aria-label="edit"
                              style={{
                                marginRight: "10px",
                              }}
                            /> */}
                            Delete form 16
                          </MenuItem>
                        </Tooltip>
                      </Menu>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* Pagination */}
          <Stack
            direction={"row"}
            className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
          >
            <div>
              <Typography variant="body2">
                Showing page {currentPage} of {totalPages} pages
              </Typography>
            </div>
            <Pagination
              count={totalPages}
              page={currentPage}
              color="primary"
              shape="rounded"
              onChange={(event, value) => setCurrentPage(value)}
            />
          </Stack>
        </div>

        {/* for upload*/}
        <Form16UploadModal
          handleClose={handleUploadModalClose}
          organizationId={organisationId}
          open={uploadModalOpen}
          employeeId={employeeId}
        />

        {/* for download or view  */}
        <Form16Download
          handleClose={handleDownLoadModalClose}
          organizationId={organisationId}
          open={downloadModalOpen}
          employeeId={employeeId}
        />

        {/* for delete form 16 */}
        <Form16DeleteModal
          handleClose={handleDeleteModalClose}
          organizationId={organisationId}
          open={deleteModalOpen}
          employeeId={employeeId}
        />
      </BoxComponent>
    </>
  );
};

export default Form16Hr;
