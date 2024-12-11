import {
  Checklist,
  KeyboardDoubleArrowDown,
  MoreHoriz,
  Person,
  Search,
} from "@mui/icons-material";
import {
  Avatar,
  Divider,
  IconButton,
  Menu,
  Pagination,
  Stack,
  Tooltip,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { format } from "date-fns";
import moment from "moment";
import React, { useContext, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Select from "react-select";
import { TestContext } from "../../../../State/Function/Main";
import EmptyAlertBox from "../../../../components/EmptyAlertBox";
import { CustomOption } from "../../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";
import DeleteGoal from "./DeleteGoal";
import GoalsModel from "./GoalsModel";
import MonitoringModel from "./Modal/MonitoringModel";
import PreviewGoalModal from "./Modal/PreviewGoalModal";
import RatingModel from "./Modal/RatingModel";
import RevaluateModel from "./Modal/RevaluateModel";
import TabelSkeleton from "./Skelton/TabelSkeleton";

const GoalsTable = ({ performance, isError }) => {
  const { useGetCurrentRole, getCurrentUser } = UserProfile();
  const role = useGetCurrentRole();
  const user = getCurrentUser();
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [employeeGoals, setEmployeeGoals] = useState();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openRevaluate, setOpenRevaluate] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewId, setPreviewId] = useState(null);
  const [openMenu, setopenMenu] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { handleAlert } = useContext(TestContext);
  const openMenuBox = Boolean(anchorEl);
  const [focusedInput, setFocusedInput] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
    setPreviewModal(false);
    setPreviewId(null);
    setOpenRevaluate(false);
    setopenMenu(null);
    setOpenEdit(false);
    setDeleteConfirmation(null);
  };

  const handleOpen = (id) => {
    setPreviewModal(true);
    setPreviewId(id);
  };

  const authToken = useAuthToken();
  const isTimeFinish = useMemo(() => {
    const endDate = moment(performance?.enddate);
    const currentDate = moment();
    return endDate.diff(currentDate, "days") > -1;
    //eslint-disable-next-line
  }, [performance?.enddate]);

  const { data: employeeData } = useQuery(["employee", role], async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/getEmployeeUnderManager/${role}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  });

  const { data: orgGoals = [], isFetching } = useQuery(
    ["orggoals", employeeGoals, page, search],
    async () => {
      // if (role === "Employee" || employeeGoals) {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/performance/getOrganizationGoals`,
        {
          headers: {
            Authorization: authToken,
          },
          params: {
            role,
            empId: employeeGoals,
            page,
            search,
          },
        }
      );
      return data;
    },
    { refetchOnMount: false }
  );

  const options = useMemo(() => {
    if (Array.isArray(employeeData) && employeeData) {
      return employeeData?.map((emp) => ({
        value: emp._id,
        label: `${emp.first_name} ${emp.last_name}`,
        image: emp.user_logo_url,
      }));
    }
    return [];
    //eslint-disable-next-line
  }, []);

  const acceptGoal = useMutation(async (status) => {
    try {
      const data = {
        status,
        isGoalSettingCompleted: false,
        assignee: { label: openMenu.empId._id, value: openMenu.empId._id },
        goalStatus: "Not started",
      };

      if (status === "Goal Rejected") {
        data.goalStatus = "Goal Rejected";
      }

      await axios.patch(
        `${process.env.REACT_APP_API}/route/performance/updateSingleGoal/${openMenu._id}`,
        { data },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", "Goal Accepted");
    } catch (e) {
      console.log(e);
    }
  });

  return (
    <section className=" py-0 mb-10 ">
      {isError && (
        <EmptyAlertBox
          title={"Performance setup required"}
          desc={
            "Please setup your performance setup first to enable the performance Management ."
          }
        />
      )}
      {isError && !isFetching && (
        <div className="gap-2 flex flex-col w-full items-end">
          {performance?.isMidGoal && isTimeFinish
            ? true
            : performance?.stages === "Goal setting" &&
              isTimeFinish &&
              (role !== "Employee"
                ? true
                : role === "Employee" && performance.isSelfGoal
                ? true
                : false) && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-2 mr-4 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
                >
                  Add Goal
                </button>
              )}
          <EmptyAlertBox
            title={"Goals Not Found"}
            desc={"Add goals to goal settings."}
          />
        </div>
      )}

      <div className="  rounded-md ">
        {/* <div className=" py-2">
          <h1 className="text-black  text-2xl">
            {role === "Employee" ? "My Goals" : "Manager Goals"}
          </h1>
        </div> */}
        <div className="space-y-2 flex justify-between">
          <div className="flex gap-4 ">
            <div className={`mb-2  min-w-[300px] md:min-w-[40vw] w-max `}>
              <div
                onFocus={() => {
                  setFocusedInput("search");
                }}
                onBlur={() => setFocusedInput(null)}
                className={` ${
                  focusedInput === "search"
                    ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                    : "outline-none border-gray-200 border-[.5px]"
                } flex  rounded-md items-center px-2   bg-white py-3 md:py-[6px]`}
                // className="flex  rounded-md items-center px-2   bg-white py-3 md:py-[6px] outline-none border-gray-200 border-[.5px]"
              >
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type={"text"}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={"Search goals"}
                  className={`border-none bg-white w-full outline-none px-2  `}
                  formNoValidate
                />
              </div>
            </div>
            {role !== "Employee" && (
              <div className={`space-y-1 my-2 min-w-[250px]  md:min-w-[15vw] `}>
                <div
                  className={`flex rounded-md px-2 bg-white border-gray-200 border-[.5px]  items-center`}
                >
                  <Checklist className="text-gray-700 md:text-lg !text-[1em]" />
                  <Select
                    aria-errormessage=""
                    placeholder={"Goal Type"}
                    isClearable
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        borderWidth: "0px",
                        boxShadow: "none",
                      }),
                    }}
                    className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                    components={{
                      // Option: CustomOption,
                      IndicatorSeparator: () => null,
                    }}
                    options={performance?.goals?.map((goal) => ({
                      label: goal,
                      value: goal,
                    }))}
                    onChange={(value) => {
                      setEmployeeGoals(value?.value);
                    }}
                  />
                </div>
              </div>
            )}
            {role !== "Employee" && (
              <div className={`space-y-1 min-w-[15vw] `}>
                <div
                  className={`flex rounded-md px-2 bg-white border-gray-200 border-[.5px] items-center`}
                >
                  <Person className="text-gray-700 md:text-lg !text-[1em]" />
                  <Select
                    aria-errormessage=""
                    placeholder={"Assignee"}
                    isClearable
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        borderWidth: "0px",
                        boxShadow: "none",
                      }),
                    }}
                    className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                    components={{
                      Option: CustomOption,
                      IndicatorSeparator: () => null,
                    }}
                    options={options}
                    onChange={(value) => {
                      setEmployeeGoals(value?.value);
                    }}
                  />
                </div>
              </div>
            )}

            {(performance?.isMidGoal && isTimeFinish) ||
            (performance?.stages === "Goal setting" &&
              isTimeFinish &&
              (role !== "Employee" ||
                (role === "Employee" && performance.isSelfGoal))) ? (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-2 mr-4 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
              >
                Add Goal
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>

        {isFetching || performance === undefined ? (
          // <CircularProgress />
          <TabelSkeleton />
        ) : orgGoals?.goals?.length <= 0 ? (
          <EmptyAlertBox title={"Goals Not Found"} />
        ) : (
          <div className=" w-full overflow-x-auto">
            {/* <section className="bg-gray-50 border py-6 px-8 rounded-md w-full">
              <article className="flex  text-red-500 gap-2">
                <Info className="!text-3xl mt-1" />
                <div>
                  <h1 className="text-xl font-semibold">Goals Not Found</h1>
                  <p className="text-gray-900">Add goals to goal settings.</p>
                </div>
              </article>
            </section> */}
            <div className="overflow-auto ">
              <table className="w-full table-auto  border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
                <thead className="border-b bg-gray-100 font-bold">
                  <tr className="!font-semibold ">
                    <th
                      scope="col"
                      className="!text-left px-2 w-max py-3 text-sm "
                    >
                      Sr. No
                    </th>
                    <th scope="col" className="py-3 text-sm px-2 "></th>
                    <th scope="col" className="py-3 text-sm px-2 ">
                      Goal Name
                    </th>

                    {role !== "Employee" && (
                      <th scope="col" className="py-3 text-sm px-2 ">
                        Assignee
                      </th>
                    )}
                    <th scope="col" className="py-3 text-sm px-2 ">
                      Goal Type
                    </th>

                    <th scope="col" className="py-3 text-sm px-2 ">
                      Time
                    </th>
                    {/* {performance?.stages !== "Goal setting" && (
                      <th scope="col" className="py-3 text-sm px-2 ">
                        Monitoring done
                      </th>
                    )} */}

                    <th scope="col" className=" py-3 text-sm px-2 ">
                      Status
                    </th>

                    <th scope="col" className=" py-3 text-sm px-2 ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orgGoals?.goals?.map((goal, id) => (
                    <tr
                      key={id}
                      className={` hover:bg-gray-50 bg-white  !font-medium  w-max border-b `}
                    >
                      <td
                        onClick={() => handleOpen(goal._id)}
                        className="!text-left  cursor-pointer py-4    px-2 text-sm w-[70px]  "
                      >
                        {(page - 1) * 10 + id + 1}
                      </td>

                      <td
                        className="w-[30px] hover:bg-gray-50 !font-medium  border-b"
                        onClick={() => handleOpen(goal._id)}
                      >
                        {goal.downcasted && (
                          <Tooltip
                            className="cursor-pointer"
                            title="This goal is downcasted any changes will apply to all related downcasted goal"
                          >
                            <KeyboardDoubleArrowDown className="text-blue-500" />
                          </Tooltip>
                        )}{" "}
                      </td>
                      <td
                        onClick={() => handleOpen(goal._id)}
                        className="text-sm cursor-pointer truncate text-left   px-2"
                      >
                        <Tooltip
                          className="cursor-pointer"
                          title="Click to view"
                        >
                          <p className="space-x-3 truncate">{goal.goal}</p>
                        </Tooltip>
                      </td>
                      {role !== "Employee" && (
                        <td
                          onClick={() => handleOpen(goal._id)}
                          className="text-sm w-max cursor-pointer  text-left   px-2"
                        >
                          <Tooltip title={`Click to view`}>
                            <div className="flex w-max items-center gap-4">
                              <Avatar src={goal?.empId?.user_logo_url} />
                              <p className="text-sm">
                                {goal?.empId?.first_name}{" "}
                                {goal?.empId?.last_name}
                              </p>
                            </div>
                          </Tooltip>
                        </td>
                      )}

                      <td
                        onClick={() => handleOpen(goal?._id)}
                        className=" cursor-pointer text-left !p-0 !w-[250px]  "
                      >
                        <Tooltip title={`Click to view`}>
                          <p
                            className={`
                        px-2 md:w-full w-max text-sm`}
                          >
                            {goal?.goalType}
                          </p>
                        </Tooltip>
                      </td>

                      <td
                        onClick={() => handleOpen(goal._id)}
                        className=" cursor-pointer text-left !p-0 !w-[250px]  "
                      >
                        <Tooltip title={`Click to view`}>
                          <p
                            className={`
                        px-2 md:w-full w-max text-sm`}
                          >
                            {format(new Date(goal.startDate), "PP")} -{" "}
                            {format(new Date(goal.endDate), "PP")}
                          </p>
                        </Tooltip>
                      </td>

                      {/* {performance?.stages !== "Goal setting" && (
                        <td
                          onClick={() => handleOpen(goal._id)}
                          className="cursor-pointer text-left px-2 text-sm w-[200px]  "
                        >
                          {!goal?.comments ? (
                            <Cancel className="text-red-400 " />
                          ) : (
                            <CheckCircle className="text-green-400 " />
                          )}
                        </td>
                      )} */}

                      <td
                        onClick={() => handleOpen(goal._id)}
                        className="cursor-pointer text-left text-sm w-[200px]  "
                      >
                        {goal?.goalStatus}
                        {/* <GoalStatus
                          goal={goal}
                          isTimeFinish={isTimeFinish}
                          status={goal?.status}
                          performance={performance}
                        /> */}
                      </td>
                      {isTimeFinish && goal?.status !== "Goal Completed" && (
                        // goal?.isMonitoringCompleted &&
                        <td className="cursor-pointer text-left text-sm  ">
                          <IconButton
                            id="basic-button"
                            aria-controls={openMenu ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={openMenu ? "true" : undefined}
                            onClick={(e) => {
                              handleClick(e);
                              // setCurrentGoal(goal);
                              setopenMenu(goal);
                            }}
                          >
                            <MoreHoriz />
                          </IconButton>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <Stack
                direction={"row"}
                className="border-[.5px] border-gray-200 bg-white  border-t-0 px-4 py-2 h-full  items-center w-full justify-between "
              >
                <div>
                  <h1>
                    Showing {page} to {orgGoals?.totalPages} of{" "}
                    {orgGoals?.totalGoals} entries
                  </h1>
                </div>
                <Pagination
                  count={orgGoals?.totalPages}
                  page={page}
                  color="primary"
                  shape="rounded"
                  onChange={(event, value) => setPage(value)}
                />
              </Stack>
            </div>
          </div>
        )}
      </div>

      <GoalsModel
        performance={performance}
        open={open}
        options={options}
        handleClose={handleClose}
      />

      <Menu
        id="basic-menu"
        open={openMenuBox}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        elevation={2}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <div className="flex !pl-0 !pr-2 !w-[200px] flex-col !z-10  mx-4 !py-3 bg-white   !items-start !justify-start">
          <h1 className="text-lg">Goal Setting</h1>
        </div>
        <Divider variant="fullWidth" orientation="horizontal" />

        {role === "Employee" &&
        openMenu?.goalStatus === "Pending" &&
        openMenu?.approverId !== user._id &&
        performance?.stages !== "Monitoring stage/Feedback collection stage" &&
        role !== "Manager" &&
        openMenu?.status !== "Goal Rejected" &&
        role !== "Employee" ? (
          <h1 className="py-2 px-4 w-full h-full ">No options</h1>
        ) : (
          <></>
        )}

        {role !== "Employee" &&
          openMenu?.goalStatus === "Pending" &&
          openMenu?.approverId === user._id && (
            <>
              <MenuItem
                className="!p-0"
                onClick={() => acceptGoal.mutate("Goal Approved")}
              >
                <div className="hover:!bg-green-500  flex  w-full h-full items-center hover:!text-white transition-all gap-4  py-2 px-4">
                  Approve goal
                </div>
              </MenuItem>
              <MenuItem
                className="!p-0"
                onClick={() => acceptGoal.mutate("Goal Rejected")}
              >
                <div className="hover:!bg-red-500 !text-red-500 flex  w-full h-full items-center hover:!text-white transition-all gap-4  py-2 px-4">
                  Reject Goal
                </div>
              </MenuItem>
            </>
          )}

        {performance?.stages === "Monitoring stage/Feedback collection stage" &&
          role === "Manager" && (
            <MenuItem
              onClick={() => {
                setOpenEdit(true);
                setPreviewId(openMenu);
                handleMenuClose();
              }}
            >
              Monitoring form
            </MenuItem>
          )}

        {performance?.stages === "Goal setting" && (
          <>
            {openMenu?.status === "Goal Rejected" && role === "Employee" && (
              <MenuItem
                onClick={() => {
                  setOpenEdit(true);
                  setPreviewId(openMenu);
                  handleMenuClose();
                }}
              >
                Reapply for goal
              </MenuItem>
            )}
            {openMenu?.creatorId === user._id && (
              <MenuItem
                onClick={() => {
                  setOpenEdit(true);
                  setPreviewId(openMenu);
                  handleMenuClose();
                }}
              >
                Update Goal
              </MenuItem>
            )}
          </>
        )}

        {performance?.stages === "Goal setting" &&
          openMenu?.creatorId === user?._id && (
            <MenuItem
              className="!p-0"
              onClick={() => {
                setDeleteConfirmation(openMenu);
                handleMenuClose();
              }}
            >
              <div className="hover:!bg-red-500 !text-red-500 flex  w-full h-full items-center hover:!text-white transition-all gap-4  py-2 px-4">
                Delete goal
              </div>
            </MenuItem>
          )}

        {/* {performance?.stages === "Employee acceptance/acknowledgement stage" &&
          role === "Employee" && (
            <>
              <MenuItem
                onClick={() => {
                  setOpenRevaluate(true);
                  handleMenuClose();
                }}
              >
                Request for revaluation
              </MenuItem>
              <MenuItem
                onClick={() => acceptGoal("Goal Completed")}
                className="!p-0"
              >
                <div className="hover:!bg-green-500 !text-green-500 flex  w-full h-full items-center hover:!text-white transition-all gap-4  py-2 px-4">
                  Accept goal rating
                </div>
              </MenuItem>
            </>
          )} */}
      </Menu>

      <DeleteGoal
        deleteConfirmation={deleteConfirmation}
        handleClose={handleClose}
      />

      {performance?.stages === "Monitoring stage/Feedback collection stage" ? (
        <MonitoringModel
          open={openEdit}
          id={openMenu}
          // assignee={openMenu}
          options={options}
          performance={performance}
          handleClose={handleClose}
        />
      ) : performance?.stages ===
          "KRA stage/Ratings Feedback/Manager review stage" ||
        openMenu?.status === "Revaluation Requested" ? (
        <RatingModel
          open={openEdit}
          id={openMenu}
          assignee={employeeGoals}
          options={options}
          performance={performance}
          handleClose={handleClose}
        />
      ) : (
        <GoalsModel
          open={openEdit}
          id={openMenu}
          assignee={employeeGoals}
          options={options}
          performance={performance}
          handleClose={handleClose}
        />
      )}
      <PreviewGoalModal
        open={previewModal}
        performance={performance}
        assignee={employeeGoals}
        id={previewId}
        handleClose={handleClose}
      />
      <RevaluateModel
        open={openRevaluate}
        id={openMenu}
        assignee={employeeGoals}
        options={options}
        performance={performance}
        handleClose={handleClose}
      />
    </section>
  );
};

export default GoalsTable;
