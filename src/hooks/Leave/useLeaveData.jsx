import axios from "axios";
import moment from "moment";
import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import useLeaveRequesationHook from "../QueryHook/Leave-Requsation/hook";
import UserProfile from "../UserData/useUser";

const useLeaveData = (empId = "") => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();

  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [newAppliedLeaveEvents, setNewAppliedLeaveEvents] = useState([]);
  const queryclient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [selectEvent, setselectEvent] = useState(false);
  const [calLoader, setCalLoader] = useState(false);
  const { data: leaveBalance } = useLeaveRequesationHook();

  const { data, isLoading, isError, error } = useQuery(
    ["employee-leave-table-without-default"],
    async () => {
      setCalLoader(true);
      const response = await axios.get(
        empId === "" || empId === undefined
          ? `${process.env.REACT_APP_API}/route/leave/getEmployeeCurrentYearLeave`
          : `${process.env.REACT_APP_API}/route/leave/getOrgEmployeeYearLeave/${empId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    },
    {
      onSuccess: async (data) => {
        console.info(`🚀 ~ file: useLeaveData.jsx:33 ~ data:`, data);
        setCalLoader(false);
      },
      onError: async (error) => {
        console.error(`🚀 ~ file: useLeaveData.jsx:36 ~ error:`, error);
        setCalLoader(false);
      },
    }
  );

  const { data: shiftData } = useQuery(
    "shifts-calender",
    async () => {
      setCalLoader(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/shiftApply/get`,
        {
          headers: { Authorization: authToken },
        }
      );
      queryclient.invalidateQueries("employee-leave-table");
      queryclient.invalidateQueries("employee-summary-table");
      queryclient.invalidateQueries("employee-leave-table-without-default");
      return response.data;
    },
    {
      onSuccess: async () => {
        setCalLoader(false);
      },
      onError: async (error) => {
        // console.error(`🚀 ~ file: useLeaveData.jsx:36 ~ error:`, error);
        setCalLoader(false);
      },
    }
  );

  const createLeaves = async () => {
    setCalLoader(true);
    setSelectedLeave(null);
    const isLeaveBalanceLeft = [];
    newAppliedLeaveEvents.forEach((leave) => {
      leaveBalance?.leaveTypes?.forEach((balance) => {
        if (balance._id === leave.leaveTypeDetailsId) {
          let getDiff = 0;
          getDiff += moment(leave.end).diff(moment(leave.start), "days") + 1;
          const getLeaveAlreadyExists = isLeaveBalanceLeft?.findIndex(
            (leave) => leave.leaveType === balance.leaveName
          );

          if (getLeaveAlreadyExists >= 0) {
            isLeaveBalanceLeft[getLeaveAlreadyExists].count -= getDiff;
          } else {
            isLeaveBalanceLeft.push({
              leaveType: balance.leaveName,
              count: balance?.count - getDiff,
            });
          }
        }
      });
    });

    const isCountExcceed = isLeaveBalanceLeft?.findIndex(
      (leave) =>
        leave?.count < 0 &&
        leave?.leaveType !== "Available" &&
        leave?.leaveType !== "Work from home" &&
        leave?.leaveType !== "Unpaid leave"
    );

    if (isCountExcceed !== -1) {
      handleAlert(true, "error", "Leave balance exceeded");
      setCalLoader(false);
      throw new Error("Leave balance exceeded");
    }

    console.log("apel", newAppliedLeaveEvents);

    newAppliedLeaveEvents.forEach(async (value) => {
      try {
        await axios.post(
          `${process.env.REACT_APP_API}/route/leave/create?empId=${empId}&role=${role}`,
          {
            leaveTypeDetailsId: value?.leaveTypeDetailsId,
            start: value.start,
            end: value.end,
            _id: value._id,
            color: value?.color,
            title: value?.title,
          },
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        setSelectedLeave(null);
        handleAlert(true, "success", " Your request  sent successfully.");
      } catch (error) {
        console.error(`🚀 ~ error:`, error);
        handleAlert(
          true,
          "error",
          error?.response?.data?.message || "Leaves not created succcesfully"
        );
      }
    });
  };

  const leaveMutation = useMutation(createLeaves, {
    onSuccess: async () => {
      setCalLoader(false);

      await queryclient.invalidateQueries({
        queryKey: ["employee-leave-table"],
      });
      await queryclient.invalidateQueries({
        queryKey: ["employee-leave-table"],
      });
      await queryclient.invalidateQueries({
        queryKey: ["employee-summary-table"],
      });
      await queryclient.invalidateQueries(
        "employee-leave-table-without-default"
      );
      // handleAlert(true, "success", "Applied for leave successfully");
      setNewAppliedLeaveEvents([]);
      setCalendarOpen(false);
    },

    onError: (error) => {
      setCalLoader(false);
      console.error(error);
    },
  });

  // Delete Investment Mutation need to change in backend so if manager delete leave then it should be deleted directly  from employee leave table
  const deleteLeaveMutation = useMutation(
    async ({ id, deleteReason }) => {
      setCalLoader(true);
      await axios.post(
        `${process.env.REACT_APP_API}/route/leave/delete/${id}`,
        {
          deleteReason,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: async (data, variable) => {
        console.log(
          `🚀 ~ file: useLeaveData.jsx:138 ~ variable:`,
          variable?.onClose()
        );
        await queryclient.invalidateQueries({
          queryKey: ["employee-leave-table"],
        });
        await queryclient.invalidateQueries({
          queryKey: ["employee-leave-table"],
        });
        await queryclient.invalidateQueries({
          queryKey: ["employee-summary-table"],
        });
        await queryclient.invalidateQueries(
          "employee-leave-table-without-default"
        );
        setCalLoader(false);
        handleAlert(true, "success", "Leave deleted successfully");
      },
      onError: (error) => {
        setCalLoader(false);
        console.error(error);
        handleAlert(true, "error", "Leave not deleted successfully");
      },
    }
  );
  const handleSubmit = async (e) => {
    setCalLoader(true);
    e.preventDefault();

    leaveMutation.mutate();
    setCalLoader(false);
  };

  const handleInputChange = () => {
    setCalendarOpen(true);
    setSelectedLeave(null);
  };

  const handleUpdateFunction = async (e) => {
    setCalLoader(true);
    setselectEvent(true);

    data?.currentYearLeaves.filter((item) => {
      return item._id !== selectedLeave?._id;
    });
    await queryclient.setQueryData(
      "employee-leave-table-without-default",
      (old) => {
        old.currentYearLeaves = old?.currentYearLeaves.filter((item) => {
          return item._id !== selectedLeave?._id;
        });
        return { ...old };
      }
    );
    setCalLoader(false);
  };

  return {
    data,
    isLoading,
    shiftData,
    isError,
    error,
    handleSubmit,
    isCalendarOpen,
    setCalendarOpen,
    newAppliedLeaveEvents,
    setNewAppliedLeaveEvents,
    handleInputChange,
    selectedLeave,
    setSelectedLeave,
    handleUpdateFunction,
    selectEvent,
    setselectEvent,
    deleteLeaveMutation,
    calLoader,
    setCalLoader,
  };
};

export default useLeaveData;
