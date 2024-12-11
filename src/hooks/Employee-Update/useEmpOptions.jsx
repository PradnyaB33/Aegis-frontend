import useEmployeeQuery from "./useEmployeeQuery";

const useEmployeeOptions = (organisationId) => {
  const {
    DepartmentListCall,
    DesignationCall,
    SalaryTempCall,
    EmpTypesCall,
    ManagerListCall,
    ShiftCall,
    CostNumberCall,
    EmpRoleListCall,
    LocationListCall,
    EmpCodeCall,
  } = useEmployeeQuery(organisationId);

  const DepartmentList = DepartmentListCall();
  const ManagerList = ManagerListCall();
  const empCode = EmpCodeCall();
  const empRolesList = EmpRoleListCall();
  const shiftList = ShiftCall();
  const costNumber = CostNumberCall();
  const locationList = LocationListCall();
  const SalaryTemp = SalaryTempCall();
  const DesignationList = DesignationCall();
  const empTypes = EmpTypesCall();

  const Departmentoptions = DepartmentList?.department?.map((item) => {
    return {
      value: item?._id,
      label: item?.departmentName,
    };
  });

  const Manageroptions = ManagerList?.manager?.map((item) => {
    return {
      value: item?._id,
      label: `${item?.first_name} ${item?.last_name}`,
    };
  });

  const EmpCodeoptions = empCode?.EmpCodeoptions?.map((item) => {
    return {
      value: item?._id,
      label: item?.getEmployeeCode,
    };
  });

  const RolesOptions =
    empRolesList?.roles &&
    Object.entries(empRolesList?.roles)
      .filter(([key, other], index) => other?.isActive)
      .map(([key, other], index) => {
        return {
          value: key, // Extract the _id property from the role object
          label: key, // Use the role name as the label
        };
      });
  // const RolesOptions =
  //   empRolesList?.roles &&
  //   Object.entries(empRolesList?.roles).map(([key, other], index) => {
  //     if (other?.isActive === true) {
  //       return {
  //         value: key, // Extract the _id property from the role object
  //         label: key, // Use the role name as the label
  //       };
  //     } else {
  //       return null;
  //     }
  //   });
  const Shiftoptions = shiftList?.shifts?.map((item) => {
    return {
      value: item?._id,
      label: item?.shiftName,
    };
  });

  const cosnotoptions = costNumber?.data?.departments?.map((item) => {
    return {
      value: item?._id,
      label: item?.dept_cost_center_id,
    };
  });

  console.log("dept cost center no", cosnotoptions);

  const locationoption = locationList?.locationsData?.map((item) => {
    return {
      value: item?._id,
      label: item?.city,
    };
  });
  const salaryTemplateoption = SalaryTemp?.salaryTemplates?.map((item) => {
    return {
      value: item?._id,
      label: item?.name,
    };
  });

  const empTypesoption = empTypes?.empTypes?.map((item) => {
    return {
      value: item?._id,
      label: item?.title,
    };
  });

  const Designationoption = DesignationList?.designations?.map((item) => {
    return {
      value: item?._id,
      label: item?.designationName,
    };
  });

  return {
    Departmentoptions,
    Manageroptions,
    EmpCodeoptions,
    RolesOptions,
    Shiftoptions,
    cosnotoptions,
    locationoption,
    salaryTemplateoption,
    empTypesoption,
    Designationoption,
  };
};

export default useEmployeeOptions;
