import { CheckCircle, CorporateFare, West } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useState } from "react";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import useOrgList from "../../hooks/QueryHook/Orglist/hook";
import useAuthToken from "../../hooks/Token/useAuth";
import UserProfile from "../../hooks/UserData/useUser";
import AssignModal from "./AssignModal";
const AssignOrg = () => {
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const { data } = useOrgList();
  const orgList = data?.organizations;
  const [open, setOpen] = useState(false);

  const openDialog = () => {
    setOpen(true);
  };
  const closeDialog = () => {
    setOrganizationId(user.organizationId);
    setOpen(false);
  };

  const [organizationId, setOrganizationId] = useState(user.organizationId);
  const handleRadioChange = (index, item) => {
    // setSelected(index);
    setOrganizationId(item);
  };

  const { handleAlert } = useContext(TestContext);

  const authToken = useAuthToken();

  const handleSubmit = async () => {
    try {
      const data = await axios.put(
        `${process.env.REACT_APP_API}/route/employee/assignOrgToSelf`,
        { organizationId },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      console.log(data.data.token, "token");
      Cookies.set("aegis", data.data.token, { expires: 4 / 24 });
      handleAlert(true, "success", "Organisation assigned successful");
      window.location.reload();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const mutation = useMutation(handleSubmit);

  console.log(user.organizationId === organizationId);

  return (
    <div className="bg-gray-50 h-screen">
      {mutation.isLoading && (
        <div className="fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center h-screen w-full bg-black/10">
          <CircularProgress />
        </div>
      )}
      <header className="text-xl w-full pt-6 bg-white border-b   p-4">
        {/* <BackComponent /> */}
        <Link to={"/organizationList"}>
          <West className="mx-4 !text-xl" />
        </Link>
        Assign organisation
      </header>

      <section className="md:px-8 flex space-x-2 md:py-6">
        <article className="w-full rounded-md ">
          <div>
            <div className="w-full ">
              <h1 className="text-2xl tracking-tight">
                Assign organisation to self
              </h1>
              <p>
                This will helps an allows you to perform task related to
                employee fields such as leaves , shifts , payroll related task
              </p>
              <form className="flex-col gap-4 mt-4 mb-6  flex ">
                {orgList?.map((item, index) => (
                  <label
                    key={index}
                    className={` inline-flex bg-white items-center space-x-2 cursor-pointer sm:w-[80%] w-full border-[.5px] border-gray-300 p-4 py-3  rounded-sm ${
                      organizationId === item._id && "!bg-blue-400 "
                    }`}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      checked={organizationId === item._id}
                      onChange={() => handleRadioChange(index, item?._id)}
                    />
                    <span
                      className={`text-gray-700 space-x-2 ${
                        organizationId === item._id && "text-white"
                      }`}
                    >
                      {organizationId === item._id ? (
                        <CheckCircle />
                      ) : (
                        <CorporateFare />
                      )}{" "}
                      {item?.orgName}
                    </span>
                  </label>
                ))}
              </form>
              <div className="flex w-full">
                <button
                  type="button"
                  onClick={openDialog}
                  disabled={user.organizationId === organizationId}
                  className={`bg-blue-500 text-end  text-white p-2 px-4 rounded-md
                 ${
                   user.organizationId === organizationId &&
                   "!bg-gray-200 !text-gray-500"
                 }
                  `}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>

      <AssignModal
        open={open}
        openDialog={openDialog}
        closeDialog={closeDialog}
        mutation={mutation}
      />
    </div>
  );
};

export default AssignOrg;
