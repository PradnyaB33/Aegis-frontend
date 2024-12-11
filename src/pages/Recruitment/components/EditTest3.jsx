import React, { useContext } from "react";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import { useNavigate, useParams } from "react-router-dom";
import useCreateJobPositionState from "../../../hooks/RecruitmentHook/useCreateJobPositionState";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import UserProfile from "../../../hooks/UserData/useUser";
import { CircularProgress } from "@mui/material";


const EditTest3 = ({ prevStep }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const { jobPositionId, organisationId } = useParams();
  const navigate = useNavigate("");
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const creatorId = user?._id;
  const queryClient = useQueryClient();

  const {
    position_name,
    department_name,
    location_name,
    date,
    job_type,
    mode_of_working,
    job_level,
    job_description,
    role_and_responsibility,
    required_skill,
    hiring_manager,
    hiring_hr,
    education,
    experience_level,
    age_requirement,
    working_time,
    emptyState,
  } = useCreateJobPositionState();

  // for send the data for update
  const handleSubmit = useMutation(
    () => {
      const JobPositionData = {
        position_name,
        department_name: department_name?.value,
        location_name: location_name?.value,
        date,
        job_type: job_type,
        mode_of_working: mode_of_working,
        job_level: job_level,
        job_description,
        role_and_responsibility,
        required_skill,
        hiring_manager: hiring_manager?.value,
        hiring_hr: hiring_hr?.value,
        education,
        experience_level,
        age_requirement,
        working_time,
        organizationId: organisationId,
        creatorId,
      };

      const response = axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${jobPositionId}/update-job-position`,
        JobPositionData,
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
        queryClient.invalidateQueries({ queryKey: ["job-position"] });
        handleAlert(true, "success", "Job position added successfully");
        emptyState();
        navigate(`/organisation/${organisationId}/view-job-position`);
      },
      onError: (error) => {
        handleAlert(
          "true",
          "error",
          error.response?.data.message ?? "Something went wrong"
        );
      },
    }
  );

  return (
    <>
      {handleSubmit.isLoading && (
        <div className="flex items-center justify-center fixed top-0 bottom-0 right-0 left-0  bg-black/20">
          <CircularProgress />
        </div>
      )}

      <div className="w-full mt-4">
        <h1 className="text-2xl mb-2 font-bold">Confirm Details</h1>

        <>
          <div className="md:p-3 py-1 ">
            <h1 className=" text-lg bg-gray-200 px-4 py-2 w-full  my-2">
              Job Details
            </h1>
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
              <div className=" p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 w-full text-sm">Position Name</h1>
                <p className="w-full">position_name</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">
                  Department Name
                </h1>
                <p className="">{department_name?.label}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Location Name</h1>
                <p className="">{location_name?.label}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <div className=" p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Date</h1>
                <p className="">{date}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Job Type</h1>
                <p className="">{job_type?.label}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">
                  Mode of Working
                </h1>
                <p className="">{mode_of_working?.label}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 justify-between">
              <div className=" p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Job Level</h1>
                <p className="">{job_level?.label}</p>
              </div>
            </div>

            <h1 className=" text-lg bg-gray-200 px-4 py-2 w-full  my-2">
              Additional Info
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between">
              <div className=" p-2 rounded-sm w-full">
                <h1 className="text-gray-500 text-sm">Required Skills</h1>
                <p className="">{required_skill?.map((item) => item?.label)}</p>
              </div>
              <div className="p-2 rounded-sm w-full">
                <h1 className="text-gray-500 text-sm">Hiring Manager</h1>
                <p className="">{hiring_manager?.label}</p>
              </div>
              <div className=" p-2 rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Hiring HR</h1>
                <p className="">{hiring_hr?.label}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between">
              <div className="p-2 rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Education</h1>
                <p className="">{education}</p>
              </div>
              <div className="p-2 rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">
                  Experience Lavel
                </h1>
                <p className="">{experience_level}</p>
              </div>
              <div className=" p-2 rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Working Time</h1>
                <p className="">{working_time}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between">
              <div className="p-2 rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">
                  Age Requirement
                </h1>
                <p className="">{age_requirement}</p>
              </div>
            </div>
          </div>
          <div className="flex items-end w-full justify-between">
            <button
              type="button"
              onClick={() => {
                prevStep();
              }}
              className="!w-max flex group justify-center px-6 gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
            >
              Prev
            </button>
            <div className="flex gap-6">
              <button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => handleSubmit.mutate()}
                className="!w-max flex group justify-center px-6 gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
              >
                Submit
              </button>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default EditTest3;
