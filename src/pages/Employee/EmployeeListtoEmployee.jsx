import {
  Container,
  TextField,
  Typography,
  Pagination,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useQuery } from "react-query";
import React, { useContext, useState } from "react";
import { UseContext } from "../../State/UseState/UseContext";

const EmployeeListToEmployee = ({ organisationId }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [nameSearch, setNameSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
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

  return (
    <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
      <article className=" bg-white w-full h-max shadow-md rounded-sm border items-center">
        <Typography variant="h4" className=" text-center pl-10  mb-6 mt-2">
          Employee List
        </Typography>
        <p className="text-xs text-gray-600 pl-10 text-center">
          Edit employee data here by using the edit button.
        </p>

        {/* Filters */}
        <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
          <div className="flex items-center gap-3 mb-3 md:mb-0 w-full md:w-auto">
            <TextField
              onChange={(e) => setNameSearch(e.target.value)}
              placeholder="Search Employees Name...."
              variant="outlined"
              size="small"
              sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
            />
          </div>
          <div className="flex items-center gap-3 mb-3 md:mb-0 w-full md:w-auto">
            <TextField
              onChange={(e) => setDeptSearch(e.target.value)}
              placeholder="Search Department Name...."
              variant="outlined"
              size="small"
              sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <TextField
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder="Search Location ...."
              variant="outlined"
              size="small"
              sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
            />
          </div>
        </div>

        {/* Employee Table */}
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
                  Employee Id
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  Location
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  Department
                </th>
              </tr>
            </thead>
            <tbody>
              {availableEmployee
                .filter((item) => {
                  return (
                    (!nameSearch ||
                      item.first_name
                        ?.toLowerCase()
                        .includes(nameSearch.toLowerCase())) &&
                    (!deptSearch ||
                      item.deptname?.some((dept) =>
                        dept.departmentName
                          ?.toLowerCase()
                          .includes(deptSearch.toLowerCase())
                      )) &&
                    (!locationSearch ||
                      item.worklocation?.some((location) =>
                        location?.city
                          ?.toLowerCase()
                          .includes(locationSearch.toLowerCase())
                      ))
                  );
                })
                .map((item, id) => (
                  <tr className="!font-medium border-b" key={id}>
                    <td className="!text-left pl-8 py-3">{id + 1}</td>
                    <td className="py-3 pl-8">{item?.first_name}</td>
                    <td className="py-3 pl-8">{item?.last_name}</td>
                    <td className="py-3 pl-8">{item?.email}</td>
                    <td className="py-3 pl-8">{item?.empId}</td>
                    <td className="py-3 pl-8">
                      {item?.worklocation?.map((location, index) => (
                        <span key={index}>{location?.city}</span>
                      ))}
                    </td>
                    <td className="py-3 pl-8">
                      {item?.deptname?.map((dept, index) => (
                        <span key={index}>{dept?.departmentName}</span>
                      ))}
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
      </article>
    </Container>
  );
};

export default EmployeeListToEmployee;
