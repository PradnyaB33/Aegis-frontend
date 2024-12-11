import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";

const useShiftData = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [id, setId] = useState(null);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [newData, setNewData] = useState([]);
  const [newAppliedLeaveEvents, setNewAppliedLeaveEvents] = useState([]);
  const queryclient = useQueryClient();
  const { setAppAlert } = useContext(UseContext);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [disabledShiftId, setDisabledShiftId] = useState(null);
  // const [isUpdating, setIsUpdating] = useState(false);
  const [selectEvent, setselectEvent] = useState(false);

  useEffect(() => {
    console.log("names array", newAppliedLeaveEvents);
  }, [newAppliedLeaveEvents]);

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
      return response.data;
    }
  );

  const { data: leaveData } = useQuery(
    "employee-leave-table-without-default-leave",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getEmployeeCurrentYearLeave`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    }
  );
  const createShifts = async () => {
    console.log("This is final selected leave", selectedLeave);
    newAppliedLeaveEvents.forEach(async (value, idx) => {
      console.log("value", value);
      setId(idx);
      try {
        if (selectedLeave) {
          await axios.post(
            `${process.env.REACT_APP_API}/route/shiftApply/create`,
            {
              title: value?.name,
              start: value?.start,
              end: value?.end,
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
      }
    });
  };

  const leaveMutation = useMutation(createShifts, {
    onSuccess: () => {
      queryclient.invalidateQueries("table");
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
    queryclient.invalidateQueries("table");
    queryclient.invalidateQueries("employee-leave-table-without-default");

    setCalendarOpen(false);
    leaveMutation.mutate();
    setAppAlert({
      alert: true,
      type: "success",
      msg: "Request Raised Successfully",
    });
  };
  const handleInputChange = () => {
    setCalendarOpen(true);
  };

  const handleUpdateFunction = (e) => {
    setselectEvent(true);
    console.log("event", e);
    console.log("shift events", newAppliedLeaveEvents);

    // Filter out the selected event from the requests data
    const filteredRequests = data?.requests.filter((item) => {
      return item._id !== selectedLeave?._id;
    });

    // Update the state or query data with the filtered requests
    queryclient.invalidateQueries("employee-leave-table-without-default");
    queryclient.setQueryData("employee-leave-table-without-default", (old) => {
      old.currentYearLeaves = filteredRequests;
      return { ...old };
    });

    setDisabledShiftId(selectedLeave._id);
    setSelectedLeave(filteredRequests);
  };
  return {
    data,
    leaveData,
    isLoading,
    newData,
    setNewData,
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
