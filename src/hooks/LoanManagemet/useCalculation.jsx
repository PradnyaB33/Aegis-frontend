import dayjs from "dayjs";
import useLaonState from "./useLaonState";
const useCalculation = () => {
  const {
    rateOfIntereset,
    loanAmount,
    noOfEmi,
    setNoOfEmi,
    setCompletedDate,
    loanDisbursementDate,
  } = useLaonState();

  const handleNoOfEmiChange = (e) => {
    const value = e.target.value;
    setNoOfEmi(value);
    calculateCompletionDate(loanDisbursementDate, value);
  };

  const calculateCompletionDate = (disbursementDate, emiCount) => {
    const monthsToAdd = parseInt(emiCount);
    if (!isNaN(monthsToAdd)) {
      const completionDate = dayjs(disbursementDate)
        .add(monthsToAdd, "month")
        .format("MM-DD-YYYY");
      setCompletedDate(completionDate);
    }
  };

  const roi = rateOfIntereset / 100;

  // Calculate principal monthly
  const principalMonthly =
    isNaN(loanAmount) || isNaN(noOfEmi) || loanAmount === "" || noOfEmi === ""
      ? 0
      : parseFloat(loanAmount) / parseInt(noOfEmi);
  const principalPerMonth = principalMonthly.toFixed(2);

  // Calculate interest per month
  const interestPerMonth =
    isNaN(loanAmount) ||
    isNaN(roi) ||
    loanAmount === "" ||
    rateOfIntereset === ""
      ? 0
      : (parseFloat(loanAmount) * roi) / 12;
  const interestPerMonths = interestPerMonth.toFixed(2);

  // Calculate total deduction per month
  const totalDeductionPerMonth = (
    parseFloat(principalPerMonth) + parseFloat(interestPerMonths)
  ).toFixed(2);

  // Calculate total amount with simple interest
  const totalAmountWithSimpleInterest =
    isNaN(loanAmount) || isNaN(noOfEmi) || loanAmount === "" || noOfEmi === ""
      ? 0
      : parseFloat(loanAmount) +
        parseFloat(interestPerMonths) * parseInt(noOfEmi);

  return {
    principalPerMonth,
    interestPerMonths,
    totalDeductionPerMonth,
    totalAmountWithSimpleInterest: totalAmountWithSimpleInterest,
    handleNoOfEmiChange,
  };
};

export default useCalculation;
