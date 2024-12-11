import axios from "axios";
import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import useShiftStore from "../../pages/SetupPage/ShiftManagement/store/useShiftStore"

const useShiftData = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { shiftName } = useShiftStore();
  const [id, setId] = useState(null);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [newAppliedLeaveEvents, setNewAppliedLeaveEvents] = useState([]);
  const queryclient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [disabledShiftId, setDisabledShiftId] = useState(null);
  // const [isUpdating, setIsUpdating] = useState(false);
  const [selectEvent, setselectEvent] = useState(false);

  const { data, isLoading, isError, error } = useQuery(
    "employee-leave-table-without-default",
    async () => {
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
    }
  );
  const createShifts = async () => {
    console.log("This is final selected leave", selectedLeave);
    try {
      if (selectedLeave) {
        await axios.post(
          `${process.env.REACT_APP_API}/route/shiftApply/create`,
          {
            title: shiftName,
            start: newAppliedLeaveEvents[0]?.start,
            end: newAppliedLeaveEvents[0]?.end,
          },
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
      } else {
        await axios.patch(
          `${process.env.REACT_APP_API}/route/shiftApply/update/${id}`,
          {
            title: shiftName,
            start: newAppliedLeaveEvents[0]?.start,
            end: newAppliedLeaveEvents[0]?.end,
          },
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
      }
      // Invalidate queries and reset state after successful mutation
      queryclient.invalidateQueries("employee-leave-table");
      queryclient.invalidateQueries("employee-summary-table");
      queryclient.invalidateQueries("employee-leave-table-without-default");
      setNewAppliedLeaveEvents([]);
      setDisabledShiftId(selectedLeave ? selectedLeave._id : id);
    } catch (error) {
      console.error("Error creating or updating shifts:", error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Shifts operation failed"
      );
    }
  };

  const leaveMutation = useMutation(createShifts, {
    onSuccess: () => {
      queryclient.invalidateQueries("employee-leave-table");
      queryclient.invalidateQueries("employee-leave-table");
      queryclient.invalidateQueries("employee-summary-table");
      queryclient.invalidateQueries("employee-leave-table-without-default");
      setNewAppliedLeaveEvents([]);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    setCalendarOpen(false);

    leaveMutation.mutate();
  };
  const handleInputChange = () => {
    setCalendarOpen(true);
  };

  const handleUpdateFunction = (e) => {
    console.log(
      `🚀 ~ file: useLeaveData.jsx:88 ~ selectedLeave._id:`,
      selectedLeave
    );
    setselectEvent(true);
    setSelectedLeave(null);
    // setIsUpdating(true);
    setId(selectedLeave._id);

    let array = data?.requests.filter((item) => {
      return item._id !== selectedLeave?._id;
    });
    queryclient.setQueryData("employee-leave-table-without-default", (old) => {
      old.currentYearLeaves = old?.requests.filter((item) => {
        return item._id !== selectedLeave?._id;
      });
      return { ...old };
    });
    setDisabledShiftId(selectedLeave._id);
    setSelectedLeave(array);
    console.log(selectedLeave);
  };
  return {
    data,
    isLoading,
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
    disabledShiftId,
  };
};

export default useShiftData;
