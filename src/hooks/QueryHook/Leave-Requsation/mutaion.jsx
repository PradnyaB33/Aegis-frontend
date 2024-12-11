import moment from "moment";
import { useContext } from "react";
import { TestContext } from "../../../State/Function/Main";

const useLeaveRequisitionMutation = () => {
  const { handleAlert } = useContext(TestContext);
  function calculateDays(startDateString, endDateString) {
    // Parse the start and end dates using Moment.js
    var startDate = moment(startDateString);
    var endDate = moment(endDateString);

    // Calculate the difference in days
    var daysDifference = endDate.diff(startDate, "days");

    return daysDifference;
  }
  async function checkLeaveProblem(
    dataArray,
    id,
    item,
    newLeaveArray,
    itemDays
  ) {
    let maxCount = 0;
    let totalCountOfLeave = 0;
    await newLeaveArray.forEach((item) => {
      if (item.leaveTypeDetailsId === id) {
        totalCountOfLeave =
          totalCountOfLeave + calculateDays(item?.start, item?.end);
      }
    });

    await dataArray.forEach((item) => {
      if (item._id === id) {
        maxCount = item?.count;
      }
    });

    if (maxCount < totalCountOfLeave) {
      if (maxCount === 0) {
        return true;
      }
      handleAlert(
        true,
        "error",
        `You don't have specific balance for the leaves`
      );
      return false;
    }
    return true;
  }
  return { calculateDays, checkLeaveProblem };
};

export default useLeaveRequisitionMutation;
