import React, { useContext } from "react";
import axios from "axios";
import useDepartmentState from "../../../hooks/DepartmentHook/useDepartmentState";
import { useNavigate, useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import { Error } from "@mui/icons-material";
import { useMutation } from "react-query";
import UserProfile from "../../../hooks/UserData/useUser";
import { Button } from "@mui/material";
import BasicButton from "../../../components/BasicButton";
const Step3 = ({ prevStep }) => {
  // to define the state, hook , other funciton
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const { organisationId } = useParams();
  const navigate = useNavigate("");
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const {
    dept_name,
    dept_description,
    dept_location,
    dept_head_name,
    dept_delegate_head_name,
    dept_cost_center_name,
    dept_cost_center_description,
    dept_id,
    dept_cost_center_id,
    emptyState,
  } = useDepartmentState();

  // to define the handleSumbit function
  const handleSubmit = useMutation(
    () => {
      const deptData = {
        departmentName: dept_name,
        departmentDescription: dept_description,
        departmentLocation: dept_location.value,
        ...(dept_head_name && { departmentHeadName: dept_head_name.value }),
        ...(dept_delegate_head_name && {
          departmentHeadDelegateName: dept_delegate_head_name.value,
        }),
        costCenterName: dept_cost_center_name,
        departmentId: dept_id,
        dept_cost_center_id: dept_cost_center_id,
      };

      const response = axios.post(
        `${process.env.REACT_APP_API}/route/department/create/${organisationId}?role=${role}`,
        deptData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return response;
    },
    {
      onSuccess: (response) => {
        const successMessage =
          role === "HR" || role === "Super-Admin"
            ? "Department added successfully"
            : "Request sent successfully.";
        handleAlert(true, "success", successMessage);
        emptyState();
        navigate(`/organisation/${organisationId}/department-list`);
      },
      onError: (error) => {
        console.log(error);
        handleAlert(true, "error", "Department name must be unique");
      },
    }
  );

  return (
    <>
      <div>
        {dept_location?.value && dept_name && dept_id && dept_cost_center_id ? (
          <>
            <div>
              <h1 className="text-lg bg-gray-200 px-4 py-2 w-full my-2">
                Department Details
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="p-2 rounded-sm">
                  <h1 className="text-gray-500 text-sm">Name</h1>
                  <p>{dept_name}</p>
                </div>
                <div className="p-2 rounded-sm">
                  <h1 className="text-gray-500 text-sm">Location</h1>
                  <p>{dept_location?.label}</p>
                </div>
                <div className="p-2 rounded-sm">
                  <h1 className="text-gray-500 text-sm">Description</h1>
                  <p>{dept_description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="p-2 rounded-sm">
                  <h1 className="text-gray-500 text-sm">Department Head</h1>
                  <p>{dept_head_name?.label}</p>
                </div>
                <div className="p-2 rounded-sm">
                  <h1 className="text-gray-500 text-sm">
                    Delegate Department Head
                  </h1>
                  <p>{dept_delegate_head_name?.label}</p>
                </div>
              </div>

              <h1 className="text-lg bg-gray-200 px-4 py-2 w-full my-2">
                Department Cost Center Details
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-2 rounded-sm">
                  <h1 className="text-gray-500 text-sm">
                    Department Cost Center Name
                  </h1>
                  <p>{dept_cost_center_name}</p>
                </div>
                <div className="p-2 rounded-sm">
                  <h1 className="text-gray-500 text-sm">
                    Department Cost Center Description
                  </h1>
                  <p>{dept_cost_center_description}</p>
                </div>
                <div className="p-2 rounded-sm">
                  <h1 className="text-gray-500 text-sm">Department ID</h1>
                  <p>{dept_id}</p>
                </div>
                <div className="p-2 rounded-sm">
                  <h1 className="text-gray-500 text-sm">
                    Department Cost Center ID
                  </h1>
                  <p>{dept_cost_center_id}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                onClick={prevStep}
                type="button"
                variant="outlined"
                className="!w-max"
                sx={{ textTransform: "none" }}
              >
                Back
              </Button>
              <BasicButton type="submit" title={"Submit"} onClick={() => handleSubmit.mutate()} />
            </div>


            {/* <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

              <button
                onClick={() => handleSubmit.mutate()}
                className="w-full sm:w-auto flex justify-center px-4 py-2 rounded-md text-md font-semibold text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
              >
                Submit
              </button>
            </div> */}
          </>
        ) : (
          <section className="py-6 px-4 rounded-md w-full">
            <article className="flex items-center mb-1 text-red-500 gap-2">
              <Error className="!text-2xl" />
              <h1 className="text-xl font-semibold">
                Kindly fill, all the fields
              </h1>
            </article>
            <p>
              Please fill in the fields from the previous steps to be able to
              view and confirm the addition of the department
            </p>
          </section>
        )}
      </div>
    </>
  );
};

export default Step3;
