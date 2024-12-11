import { CheckCircle, Person } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import UserProfile from "../../hooks/UserData/useUser";

const RolePage = () => {
  const [selected, setSelected] = useState(null);
  const { handleAlert } = useContext(TestContext);
  const [role, setRole] = useState();
  const redirect = useNavigate();

  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const roles = useGetCurrentRole();

  useEffect(() => {
    if (!user) {
      redirect("/sign-in");
    }
    if (user?._id && roles) {
      if (roles === "Super-Admin" || roles === "Delegate-Super Admin")
        return redirect("/");
      else if (
        roles === "Hr" ||
        roles === "Accountant" ||
        roles === "Delegate-Accountant"
      )
        return redirect(
          `/organisation/${user?.organisationId}/dashboard/HR-dashboard`
        );
      else if (roles === "Manager")
        return redirect(
          `/organisation/${user?._id}/dashboard/manager-dashboard`
        );
      else if (
        roles === "Employee" ||
        roles === "Department-Admin" ||
        roles === "Department-Head" ||
        role ==="Teacher"
      )
        return redirect(
          `/organisation/${user?.organisationId}/dashboard/employee-dashboard`
        );
    }
    // eslint-disable-next-line
  }, []);

  const handleRadioChange = (index, item) => {
    setSelected(index);
    setRole(item);
  };

  const handleRole = useMutation(
    (data) => {
      const res = axios.post(
        `${process.env.REACT_APP_API}/route/employee/changerole`,
        data
      );
      return res;
    },

    {
      onSuccess: (response) => {
        Cookies.set("role", response?.data?.roleToken);

        handleAlert(true, "success", `Welcome`);

        if (response?.data?.role === "Super-Admin") {
          redirect("/");
        } else if (response?.data?.role === "Hr") {
          redirect(
            `/organisation/${user.organizationId}/dashboard/HR-dashboard`
          );
        } else if (response?.data?.role === "Manager") {
          redirect(
            `/organisation/${user.organizationId}/dashboard/manager-dashboard`
          );
        } else if (response?.data?.role === "Employee" || response?.data?.role === "Teacher") {
          redirect(
            `/organisation/${user.organizationId}/dashboard/employee-dashboard`
          );
        } else if (response?.data?.role === "Department-Head") {
          redirect(
            `/organisation/${user.organizationId}/dashboard/DH-dashboard`
          );
        } else {
          redirect(
            `/organisation/${user.organizationId}/dashboard/employee-dashboard`
          );
        }

        window.location.reload();
      },

      onError: (error) => {
        console.log(error);
        handleAlert(
          true,
          "error",
          error?.response?.data?.message ||
            "Failed to sign in. Please try again."
        );
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) {
      return handleAlert(true, "warning", "Please select a profile");
    }
    await handleRole.mutateAsync({ role: role, email: user?.email });
  };

  return (
    <>
      <div className="h-screen flex flex-col items-center">
        {!user ? (
          <>
            <div className="w-[50%]">
              <Skeleton variant="text" width="40%" height={50} />
              <Skeleton variant="text" width="60%" height={30} />

              <div className="mt-4">
                <Skeleton variant="text" width="100%" height={70} />
                <Skeleton variant="text" width="100%" height={70} />
                <Skeleton variant="text" width="100%" height={70} />
              </div>
            </div>
          </>
        ) : (
          <div className="w-[80%] md:w-[50%]">
            <h1 className="text-3xl font-bold mb-1">Choose your Profile</h1>
            <p className="text-sm text-gray-700">
              By choosing a profile, you'll be able to access different profiles
            </p>

            <form className="flex-col gap-4 mt-6 flex items-center">
              {user?.profile?.map((item, index) => (
                <label
                  key={index}
                  className={`inline-flex items-center space-x-2 cursor-pointer w-full border-[.5px] border-gray-300 p-4 py-3  rounded-lg ${
                    selected === index && "bg-blue-400 "
                  }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={selected === index}
                    onChange={() => handleRadioChange(index, item)}
                  />
                  <span
                    className={`text-gray-700 space-x-2 ${
                      selected === index && "text-white"
                    }`}
                  >
                    {selected === index ? <CheckCircle /> : <Person />} {item}
                  </span>
                </label>
              ))}
            </form>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 my-4 text-white p-2 rounded-md"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default RolePage;
