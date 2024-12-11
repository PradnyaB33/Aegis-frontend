import useDeptQuery from "./useDeptQuery";
const useDeptOption = (organisationId) => {
  const {
    DepartmentLocaltionListCall,
    DepartmentHeadListCall,
    DelegateDepartmentHeadListCall,
  } = useDeptQuery(organisationId);

  const DepartmentLocationList = DepartmentLocaltionListCall();
  const DepartmentHeadList = DepartmentHeadListCall();
  const DelegateDepartmentHeadList = DelegateDepartmentHeadListCall();

  //   for location
  const DepartmentLocationOptions = DepartmentLocationList?.locationsData?.map(
    (item) => {
      return {
        value: item?._id,
        label: item?.city,
      };
    }
  );

  //   for department head
  const DepartmentHeadOptions = DepartmentHeadList?.employees?.map((item) => {
    return {
      value: item?._id,
      label: item?.first_name,
    };
  });

  const DelegateDepartmentHeadOptions =
    DelegateDepartmentHeadList?.employees?.map((item) => {
      return {
        value: item?._id,
        label: item?.first_name,
      };
    });

  return {
    DepartmentLocationOptions,
    DepartmentHeadOptions,
    DelegateDepartmentHeadOptions,
  };
};

export default useDeptOption;
