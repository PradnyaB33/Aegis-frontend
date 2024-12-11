import useLoanQuery from "./useLoanQuery";

const useLoanOption = (organisationId) => {
  const {LoanTypeListCall} = useLoanQuery(organisationId);
  const LoanTypeList = LoanTypeListCall();
  const LoanTypeListOption = LoanTypeList?.data?.map((item) => {
    return {
      value: item?._id,
      label: item?.loanName , 
      rateOfInterest : item?.rateOfInterest,
    };
  });

  return {LoanTypeListOption};
};

export default useLoanOption;