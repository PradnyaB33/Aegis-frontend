import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import BasicButton from "../../../components/BasicButton";

const Test4 = ({ prevStep }) => {
  // to get the user from UserProfile Component
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const creatorId = user._id;
  // use useNavigate
  const navigate = useNavigate("");
  const { handleAlert } = useContext(TestContext);
  const authToken = useAuthToken();
  const { organisationId } = useParams("");

  const {
    first_name,
    last_name,
    email,
    phone_number,
    mgrempid,
    address,
    citizenship,
    adhar_card_number,
    pan_card_number,
    gender,
    password,
    bank_account_no,
    date_of_birth,
    designation,
    worklocation,
    deptname,
    employmentType,
    empId,
    joining_date,
    salarystructure,
    dept_cost_center_no,
    companyemail,
    shift_allocation,
    data,
    profile,
    emptyState,
    pwd,
    uanNo,
    esicNo,
  } = useEmpState();
  console.log(shift_allocation);


  // define the handleSubmit function
  const handleSubmit = useMutation(
    () => {

      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== null)
      );

      // Use filteredData in your component or wherever you need the data
      const userData = {
        first_name,
        last_name,
        email,
        profile,
        password,
        phone_number,
        address,
        citizenship,
        adhar_card_number,
        mgrempid: mgrempid?.value,
        pan_card_number,
        gender,
        bank_account_no,
        date_of_birth,
        empId,
        companyemail,
        joining_date,
        pwd,
        uanNo,
        esicNo,
        //TODO This is additonal field data
        ...filteredData,
        designation: designation.value,
        worklocation: worklocation.value,
        deptname: deptname.value,
        employmentType: employmentType.value,
        salarystructure: salarystructure.value,
        dept_cost_center_no: dept_cost_center_no.value,
        // shift_allocation: shift_allocation.value || null,
        // shift_allocation: shift_allocation.value || '',
        // shift_allocation: shift_allocation.value || {},
        shift_allocation: data.shift_allocation?.value || null,
        organizationId: organisationId,
        creatorId,
      };
      console.log("fdfd", userData);

      const response = axios.post(
        `${process.env.REACT_APP_API}/route/employee/add-employee`,
        userData,
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
        toast.success("Employee added successfully");
        emptyState();
        navigate(`/organisation/${organisationId}/employee-list`);
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
              Personal Details
            </h1>
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
              <div className=" p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 w-full text-sm">Full Name</h1>
                <p className="w-full">
                  {first_name} {last_name}
                </p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Personal Email</h1>
                <p className="">{email}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Contact</h1>
                <p className="">{phone_number}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <div className=" p-2 w-[30%] rounded-sm w-full">
                <h1 className="text-gray-500 text-sm">Gender</h1>
                <p className="">{gender}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Date Of Birth</h1>
                <p className="">{date_of_birth}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">
                  Current Address
                </h1>
                <p className="">{address}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 justify-between">
              <div className=" p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Aadhar No</h1>
                <p className="">{adhar_card_number}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">PAN card</h1>
                <p className="">{pan_card_number}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm w-full">
                <h1 className="text-gray-500 text-sm">Citizenship Status</h1>
                <p className="">{citizenship}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 justify-between">
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Bank Account</h1>
                <p className="">{bank_account_no}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">UAN Number</h1>
                <p className="">{uanNo ?? "-"}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">ESIC Number</h1>
                <p className="">{esicNo ?? "-"}</p>
              </div>
            </div>

            <h1 className=" text-lg bg-gray-200 px-4 py-2 w-full  my-2">
              Company Details
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between">
              <div className=" p-2 rounded-sm w-full">
                <h1 className="text-gray-500 text-sm">Employee No</h1>
                <p className="">{empId}</p>
              </div>
              <div className="p-2 rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Profile</h1>
                <p className="">{profile?.map((item) => item) ?? "-"}</p>
              </div>
              <div className="p-2 rounded-sm w-full">
                <h1 className="text-gray-500 text-sm">Company Email</h1>
                <p className="">{companyemail}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between">
              <div className=" p-2 rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">
                  Date Of Joining
                </h1>
                <p className="">{joining_date}</p>
              </div>
              <div className="p-2 rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Department</h1>
                <p className="">{deptname?.label}</p>
              </div>
              <div className="p-2 rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Designation</h1>
                <p className="">{designation?.label}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between">
              <div className=" p-2 rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Shift</h1>
                <p className="">{shift_allocation?.label}</p>
              </div>
              <div className="p-2 rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">
                  Department Cost No
                </h1>
                <p className="">{dept_cost_center_no?.label}</p>
              </div>
              <div className="p-2 rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Location</h1>
                <p className="">{worklocation?.label}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between">
              <div className=" p-2 rounded-sm">
                <h1 className="text-gray-500 w-full text-sm">
                  Employment Types
                </h1>
                <p className="">{employmentType?.label}</p>
              </div>
              <div className="p-2 rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">
                  Salary Template
                </h1>
                <p className="">
                  {typeof salarystructure === "object" &&
                    salarystructure?.label}
                </p>
              </div>
            </div>

            {data &&
              typeof data === "object" &&
              Object.entries(data).length > 0 && (
                <>
                  <h1 className=" text-lg bg-gray-200 px-4 py-2 w-full  my-2">
                    Additional Details
                  </h1>
                  <div className="grid grid-cols-3 justify-between">
                    {Object.entries(data)?.map(([key, value]) => (
                      <div className="p-2 rounded-sm ">
                        <h1 className="text-gray-500 text-sm">{key}</h1>
                        <p className="">{value ? value : "-"}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
          </div>
          <div className="flex items-end w-full justify-between">
            <BasicButton type="button"
              onClick={() => {
                prevStep();
              }} title="Prev" />
            <BasicButton onClick={() => handleSubmit.mutate()} title="Submit" />
          </div>
        </>
      </div>
    </>
  );
};

export default Test4;
