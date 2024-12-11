import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import useIncomeTax from "../../../hooks/IncomeTax/useIncomeTax";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import useForm16NotificationHook from "../../../hooks/QueryHook/notification/Form16Notification/useForm16NotificationHook";
import useMissedPunchNotificationCount from "../../../hooks/QueryHook/notification/MissedPunchNotification/MissedPunchNotification";
import usePayslipNotificationHook from "../../../hooks/QueryHook/notification/PayslipNotification/usePayslipNotificaitonHook";
import useAdvanceSalaryData from "../../../hooks/QueryHook/notification/advance-salary-notification/useAdvanceSalary";
import useDepartmentNotification from "../../../hooks/QueryHook/notification/department-notification/hook";
import useDocNotification from "../../../hooks/QueryHook/notification/document-notification/hook";
import useJobPositionNotification from "../../../hooks/QueryHook/notification/job-position-notification/useJobPositionNotification";
import useLeaveNotificationHook from "../../../hooks/QueryHook/notification/leave-notification/hook";
import useLoanNotification from "../../../hooks/QueryHook/notification/loan-notification/useLoanNotificaiton";
import usePunchNotification from "../../../hooks/QueryHook/notification/punch-notification/hook";
import useShiftNotification from "../../../hooks/QueryHook/notification/shift-notificatoin/hook";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import useOrgGeo from "../../Geo-Fence/useOrgGeo";
import useLeaveNotification from "../../SelfLeaveNotification/useLeaveNotification";
import UseEmployeeShiftNotification from "../../SelfShiftNotification/UseEmployeeShiftNotification";
import LeaveNotification from "../../leave-notification/page";
import ShiftNotification from "../../shift-notification/page";
import SelfLeaveNotification from "../../SelfLeaveNotification/page";
import SelfShiftNotification from "../../SelfShiftNotification/page";
import PunchNotification from "../../punch-notification/page";
import GeoFencingAcceptModal from "../../../components/Modal/RemotePunchingModal/GeoFencingAcceptModal";
import EmpGeoFencingNotification from "../../emp-notifications/EmpGeoFencingNotification";
import LoanMgtNotification from "../../LoanMgtNotified/LoanMgtNotification";
import LoanNotificationToEmp from "../../LoanMgtNotified/LoanNotificationToEmp";
import AdvanceSalaryNotification from "../../AdvanceSalaryNotification/AdvanceSalaryNotification";
import AdvanceSalaryNotificationToEmp from "../../AdvanceSalaryNotification/AdvanceSalaryNotificationToEmp";
import MissedPunchNotification from "../../MissedPunchNotification/MissedPunchNotification";
import MissedPunchNotificationToEmp from "../../MissedPunchNotification/MissedPunchNotificationToEmp";
import Form16NotificationToEmp from "../../Form16NotificationToEmp/Form16NotificationToEmp";
import IncomeTaxNotification from "../../Income/IncomeTaxNotification";
import DeclarationPage from "../../Income/components/accountantDeclarations/DeclarationPage";
import JobPositionNotificaitonToMgr from "../../Recruitment/Notification/JobPositonNotificatinToMgr";
import JobNotificationToEmp from "../../Recruitment/Notification/JobNotificationToEmp";
import DepartmentNotification from "../../DeptNotification/DepartmentNotification";
import DepartmentNotificationToEmp from "../../DeptNotification/DepartmentNotificationToEmp";
import PayslipNotification from "../../PayslipNotification/PayslipNotification";
import RecruitmentApproval from "../../Recruitment/components/RecruitmentApproval";
import DocumentApproval from "../../DocumentManagement/Docmanagenotification/DocumentApproval";

const useNotification = () => {
  //testing code for dev branch on git hub
  const { cookies } = useContext(UseContext);
  const { organisationId } = useParams();
  const token = cookies["aegis"];
  const authToken = useAuthToken();
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();

  const { data: orgData } = useSubscriptionGet({
    organisationId,
  });
  const { data } = useLeaveNotificationHook(); //super admin and manager side notification
  const { data: shiftNotification, accData } = useShiftNotification(); //super admin and manager side notification
  console.log("accData", accData);

  const { data: employeeShiftNotification } = UseEmployeeShiftNotification(); //employee side notification
  const { data: selfLeaveNotification } = useLeaveNotification();
  const { data: data3 } = usePunchNotification();

  //states
  const [emp, setEmp] = useState();
  console.log(`🚀 ~ emp:`, emp);
  const [shiftCount, setShiftCount] = useState(0);
  const [shiftAccCount, setShiftAccCount] = useState(0);
  console.log("shiftAccCount", shiftAccCount);

  const [employeeShiftCount, setEmployeeShiftCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [employeeLeaveCount, setEmployeeLeaveCount] = useState(0);
  const [loanCount, setLoanCount] = useState(0);
  const [empLoanCount, setEmpLoanCount] = useState(0);
  const [advanceSalaryCount, setAdvanceSalaryCount] = useState(0);
  const [empAdvanceSalaryCount, setEmpAdvanceSalaryCount] = useState(0);
  const [TDSCount, setTDSCount] = useState(0);
  const [TDSCountEmp, setTDSCountEmp] = useState(0);

  //---------super admin and manager side leave notification count
  useEffect(() => {
    if (data && data?.leaveRequests && data?.leaveRequests?.length > 0) {
      let total = 0;
      data?.leaveRequests.forEach((item) => {
        total += item.notificationCount;
      });
      setLeaveCount(total);
    } else {
      setLeaveCount(0);
    }
  }, [data]);

  //employee side leave notification count
  useEffect(() => {
    if (
      selfLeaveNotification &&
      selfLeaveNotification?.leaveRequests &&
      selfLeaveNotification?.leaveRequests?.length > 0
    ) {
      let total = 0;
      selfLeaveNotification?.leaveRequests?.forEach((item) => {
        total += item.approveRejectNotificationCount;
      });
      setEmployeeLeaveCount(total);
    } else {
      setEmployeeLeaveCount(0);
    }
  }, [selfLeaveNotification]);

  const Leavecount =
    role === "Super-Admin" || role === "Manager"
      ? leaveCount
      : employeeLeaveCount;

  //---------super admin and manager side shift notification count
  useEffect(() => {
    if (shiftNotification && shiftNotification?.length > 0) {
      let total = 0;
      shiftNotification.forEach((item) => {
        total += item.notificationCount;
      });
      setShiftCount(total);
    } else {
      setShiftCount(0);
    }
  }, [shiftNotification]);

  //Account side shift notification count
  useEffect(() => {
    if (accData && accData?.length > 0) {
      let total = 0;
      accData.forEach((item) => {
        total += item.accNotificationCount;
      });
      setShiftAccCount(total);
    }
  }, [accData]);

  //employee side shift notification count
  useEffect(() => {
    if (
      employeeShiftNotification &&
      employeeShiftNotification?.requests &&
      employeeShiftNotification?.requests?.length > 0
    ) {
      let total = 0;
      employeeShiftNotification?.requests.forEach((item) => {
        total += item?.approveRejectNotificationCount || 0;
      });
      setEmployeeShiftCount(total);
    } else {
      setEmployeeShiftCount(0);
    }
  }, [employeeShiftNotification]);

  const count =
    role === "Super-Admin" || role === "Manager"
      ? shiftCount
      : role === "Accountant"
        ? shiftAccCount
        : employeeShiftCount;

  //---------Employee Side remote and geofencing Notification count
  const employeeId = user?._id;
  const { data: EmpNotification } = useQuery({
    queryKey: ["EmpDataPunchNotification", employeeId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/punch/get-notification/${employeeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: employeeId !== undefined,
  });

  // Calculate total notificationCount for geoFencingArea false
  const punchNotifications = data3?.punchNotification || [];
  const totalFalseStartNotificationsCount = punchNotifications
    .filter((item) => item.geoFencingArea === false)
    .reduce(
      (total, item) =>
        total +
        (item.punchData?.reduce(
          (sum, punch) => sum + punch.notificationCount,
          0
        ) || 0),
      0
    );
  console.log("data3", data3);

  const totalFalseStopNotificationsCount = punchNotifications
    .filter((item) => item.geoFencingArea === false)
    .reduce(
      (total, item) =>
        total +
        (item.punchData?.reduce(
          (sum, punch) => sum + punch.stopNotificationCount,
          0
        ) || 0),
      0
    );
  const totalFalseNotificationsCount =
    totalFalseStartNotificationsCount + totalFalseStopNotificationsCount;

  const totalTrueStartNotificationsCount = punchNotifications
    .filter((item) => item.geoFencingArea === true)
    .reduce(
      (total, item) =>
        total +
        (item.punchData?.reduce(
          (sum, punch) => sum + punch.notificationCount,
          0
        ) || 0),
      0
    );
  console.log("totalTrueStartNotificationsCount", punchNotifications);

  const totalTrueStopNotificationsCount = punchNotifications
    .filter((item) => item.geoFencingArea === true)
    .reduce(
      (total, item) =>
        total +
        (item.punchData?.reduce(
          (sum, punch) => sum + punch.stopNotificationCount,
          0
        ) || 0),
      0
    );

  const totalTrueNotificationsCount =
    totalTrueStopNotificationsCount + totalTrueStartNotificationsCount;

  // remote punch notification count
  let remotePunchingCount;
  if (role === "Employee") {
    const punchData = EmpNotification?.punchData?.[0];
    console.log("punchData", punchData);

    if (punchData?.geoFencingArea === false) {
      remotePunchingCount = punchData.approveRejectNotificationCount;
    } else {
      remotePunchingCount = 0;
    }
  } else {
    remotePunchingCount = totalFalseNotificationsCount;
  }
  console.log("remotePunchingCount", remotePunchingCount);

  let geoFencingCount;
  if (role === "Employee") {
    // Check if geoFencingArea is true and then assign the approveRejectNotificationCount
    const punchData = EmpNotification?.punchData?.[0];
    console.log("punchData", punchData);

    if (punchData?.geoFencingArea === true) {
      geoFencingCount = punchData.approveRejectNotificationCount;
    } else {
      geoFencingCount = 0;
    }
  } else {
    geoFencingCount = totalTrueNotificationsCount;
  }

  //selected employee list for geofencing
  const { data: geofencingData } = useOrgGeo(user?.organizationId);

  //match currect user and selcted employee in list
  const isUserMatchInEmployeeList = geofencingData?.area?.some((area) =>
    area.employee.includes(employeeId)
  );

  //---------Notification for loan
  const { getEmployeeRequestLoanApplication, getLoanEmployee } =
    useLoanNotification();

  //get notification count of loan
  useEffect(() => {
    if (
      getEmployeeRequestLoanApplication &&
      getEmployeeRequestLoanApplication?.length > 0
    ) {
      let total = 0;
      getEmployeeRequestLoanApplication?.forEach((item) => {
        total += item.notificationCount;
      });
      setLoanCount(total);
    } else {
      setLoanCount(0);
    }

    if (getLoanEmployee && getLoanEmployee?.length > 0) {
      let total = 0;
      getLoanEmployee?.forEach((item) => {
        total += item.acceptRejectNotificationCount;
      });
      setEmpLoanCount(total);
    } else {
      setEmpLoanCount(0);
    }
  }, [getEmployeeRequestLoanApplication, getLoanEmployee]);

  const countLoan =
    role === "Super-Admin" || role === "HR" || role === "Delegate-Super-Admin"
      ? loanCount
      : empLoanCount;

  //---------notification Count for advance salary
  const { getAdvanceSalary, advanceSalaryNotificationEmp } =
    useAdvanceSalaryData();

  //get notification count of advance salary
  useEffect(() => {
    if (getAdvanceSalary && getAdvanceSalary?.length > 0) {
      let total = 0;
      getAdvanceSalary?.forEach((item) => {
        total += item.notificationCount;
      });
      setAdvanceSalaryCount(total);
    } else {
      setAdvanceSalaryCount(0);
    }

    if (
      advanceSalaryNotificationEmp &&
      advanceSalaryNotificationEmp?.length > 0
    ) {
      let total = 0;
      advanceSalaryNotificationEmp?.forEach((item) => {
        total += item.acceptRejectNotificationCount;
      });
      setEmpAdvanceSalaryCount(total);
    } else {
      setEmpAdvanceSalaryCount(0);
    }
  }, [getAdvanceSalary, advanceSalaryNotificationEmp]);

  const countAdvance =
    role === "Super-Admin" || role === "HR" || role === "Delegate-Super-Admin"
      ? advanceSalaryCount
      : empAdvanceSalaryCount;

  //---------miss punch notification count
  const { missPunchData, getMissedPunchData } =
    useMissedPunchNotificationCount();

  const calculateNotificationCount = (data, key) => {
    return (
      data?.reduce((total, employee) => {
        return (
          total +
          employee.unavailableRecords?.reduce((sum, record) => {
            return sum + (record[key] || 0);
          }, 0)
        );
      }, 0) || 0
    );
  };

  const MissPunchCountMA = calculateNotificationCount(
    missPunchData,
    "notificationCount"
  );
  const MissPunchCountHR = calculateNotificationCount(
    missPunchData,
    "MaNotificationCount"
  );
  const MissPunchCountEmp = calculateNotificationCount(
    getMissedPunchData,
    "HrNotificationCount"
  );

  let MissPunchCount;
  switch (role) {
    case "Super-Admin":
    case "Manager":
      MissPunchCount = MissPunchCountMA;
      break;
    case "HR":
      MissPunchCount = MissPunchCountHR;
      break;
    case "Employee":
      MissPunchCount = MissPunchCountEmp;
      break;
    default:
      MissPunchCount = 0;
  }

  //--------payslip notification count
  const { PayslipNotification: Payslip } = usePayslipNotificationHook();
  console.log("PayslipNotification", PayslipNotification);

  const totalNotificationCount =
    Payslip?.reduce((total, notification) => {
      return total + notification.NotificationCount;
    }, 0) || 0;

  //---------Notification for TDS super admin or accountant
  const { financialYear } = useIncomeTax();
  const getInvestmentSection = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/route/tds/getTDSWorkflow/${financialYear}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching investment data:", error);
      throw error;
    }
  };

  const { data: investmentsData, isFetching } = useQuery({
    queryKey: ["getAllInvestment"],
    queryFn: getInvestmentSection,
  });

  useEffect(() => {
    if (!isFetching && investmentsData) {
      const investments = investmentsData.investment || [];

      if (Array.isArray(investments)) {
        const totalNotificationTDS = investments.reduce((total, investment) => {
          return total + (investment?.notificationCount || 0);
        }, 0);
        setTDSCount(totalNotificationTDS);
      } else {
        console.error("Investments data is not an array");
      }
    }
  }, [investmentsData, isFetching]);

  //Employee side notification TDS
  const { data: empTDSData } = useQuery({
    queryKey: ["TDSNotify"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getTDSNotify/${user._id}/${financialYear}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        return res?.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    if (empTDSData && empTDSData.data && Array.isArray(empTDSData.data)) {
      const totalNotificationCountEmp = empTDSData.data.reduce(
        (total, item) => {
          return total + (item.notificationCountEmp || 0);
        },
        0
      );

      setTDSCountEmp(totalNotificationCountEmp);
    } else {
      console.error("Invalid empTDSData structure");
    }
  }, [empTDSData]);

  const countTDS =
    role === "Super-Admin" || role === "Accountant" ? TDSCount : TDSCountEmp;

  const tdsRoute = useMemo(() => {
    if (
      role === "Accountant" ||
      role === "Super-Admin" ||
      role === "Delegate-Super-Admin"
    ) {
      return "/notification/income-tax";
    }
    return "/";
  }, [role]);
  //////////////////////////////////////
  const { data: data4 } = useDocNotification();

  const { Form16Notification } = useForm16NotificationHook();

  const { getJobPositionToMgr, getNotificationToEmp } =
    useJobPositionNotification();

  const { getDepartmnetData, getDeptNotificationToEmp } =
    useDepartmentNotification();

  // for form 16 notification count
  let form16NotificationCount;
  if (role === "Employee") {
    form16NotificationCount = Form16Notification?.length ?? 0;
  } else {
    form16NotificationCount = 0;
  }

  // for view job position count
  let jobPositionCount;
  if (role === "Employee") {
    jobPositionCount = getNotificationToEmp?.length ?? 0;
  } else {
    jobPositionCount = getJobPositionToMgr?.length ?? 0;
  }

  // department notification count
  let departmentNotificationCount;

  if (role === "Employee") {
    departmentNotificationCount = getDeptNotificationToEmp?.length ?? 0;
  } else if (
    role === "HR" ||
    role === "Super-Admin" ||
    role === "Delegate-Super-Admin"
  ) {
    departmentNotificationCount = getDepartmnetData?.length ?? 0;
  } else {
    departmentNotificationCount = 0;
  }

  useEffect(() => {
    (async () => {
      if (user?._id) {
        const resp = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/get/profile/${user?._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setEmp(resp?.data?.employee?.organizationId);
      }
    })();
    // eslint-disable-next-line
  }, []);

  const dummyData = [
    {
      name: "Leave",
      tooltipName: "Attendance & Leave Requests",
      count: typeof Leavecount === "number" ? Leavecount : 0,
      color: "#FF7373",
      url: "/leave-notification",
      url2: "/self/leave-notification",
      visible: true,
      page: <LeaveNotification />,
      empPage: <SelfLeaveNotification />
    },

    {
      name: "Shift",
      tooltipName: "Shift Requests",
      count: typeof count === "number" ? count : 0,
      color: "#3668ff",
      url: `/organisation/${organisationId}/shift-notification`,
      url2: "/self/shift-notification",
      visible:
        orgData?.organisation?.packageInfo === "Essential Plan" ? false : true,
      page: <ShiftNotification />,
      empPage: <SelfShiftNotification />,
    },

    ...(role === "Super-Admin" || role === "Manager" || role === "HR"
      ? [
        {
          name: "Remote Punch",
          tooltipName: "Remote Punch Requests",
          count:
            typeof remotePunchingCount === "number" ? remotePunchingCount : 0,
          color: "#51FD96",
          url: "/punch-notification",
          url2: "/remote-punching-notification",
          visible:
            orgData?.organisation?.packageInfo === "Essential Plan" ||
              orgData?.organisation?.packageInfo === "Basic Plan"
              ? false
              : true,
          page: <PunchNotification />,
          empPage: <EmpNotification />,
        },
        {
          name: "Geo Fence",
          tooltipName: "Geo Fence Requests",
          count: typeof geoFencingCount === "number" ? geoFencingCount : 0,
          color: "#51FD96",
          url: `/organisation/${organisationId}/geo-fencing-notification`,
          url2: `/organisation/${organisationId}/geofencing-notification`,
          visible:
            orgData?.organisation?.packageInfo === "Essential Plan" ||
              orgData?.organisation?.packageInfo === "Basic Plan"
              ? false
              : true,

          page: <GeoFencingAcceptModal />,
          empPage: <EmpGeoFencingNotification />,
        },
      ]
      : // For Employees, conditionally show either Remote Punching or Geo Fencing based on `isUserMatchInEmployeeList`
      [
        isUserMatchInEmployeeList
          ? {
            name: "Geo Fence",
            tooltipName: "Geo Fence Requests",
            count:
              typeof geoFencingCount === "number" ? geoFencingCount : 0,
            color: "#51FD96",
            url: `/organisation/${organisationId}/geo-fencing-notification`,
            url2: `/organisation/${organisationId}/geofencing-notification`,
            visible:
              orgData?.organisation?.packageInfo === "Essential Plan" ||
                orgData?.organisation?.packageInfo === "Basic Plan"
                ? false
                : true,
            page: <GeoFencingAcceptModal />,
            empPage: <EmpGeoFencingNotification />,
          }
          : {
            name: "Remote Punch",
            tooltipName: "Remote Punch Requests",
            count:
              typeof remotePunchingCount === "number"
                ? remotePunchingCount
                : 0,
            color: "#51FD96",
            url: "/punch-notification",
            url2: "/remote-punching-notification",
            visible:
              orgData?.organisation?.packageInfo === "Essential Plan" ||
                orgData?.organisation?.packageInfo === "Basic Plan"
                ? false
                : true,
            page: <PunchNotification />,
            empPage: <EmpNotification />,
          },
      ]),
    {
      name: "Recruitment",
      tooltipName: "Recruitment Approval",
      count: 0,
      color: "#3668ff",
      // url: `/organisation/${organisationId}/shift-notification`,
      // url2: "/self/shift-notification",
      visible:
        orgData?.organisation?.packageInfo === " Enterprise Plan" ? false : true,
      page: <RecruitmentApproval />,
      empPage: <SelfShiftNotification />,
    },

    {
      name: "Document Approval",
      tooltipName: "Document Approval Requests",
      count: data4?.data?.doc?.length ?? 0,
      color: "#FF7373",
      url: "/doc-notification",
      visible:
        orgData?.organisation?.packageInfo === "Essential Plan" ||
          orgData?.organisation?.packageInfo === "Basic Plan"
          ? false
          : true,
      page: <DocumentApproval />,
    },
    {
      name: "Loan",
      tooltipName: "Loan Requests",
      count: typeof countLoan === "number" ? countLoan : 0,
      color: "#51E8FD",
      url: "/loan-notification",
      url2: "/loan-notification-to-emp",
      visible:
        orgData?.organisation?.packageInfo === "Essential Plan" ? false : true,
      page: <LoanMgtNotification />,
      empPage: <LoanNotificationToEmp />,
    },
    {
      name: "Advance Salary",
      tooltipName: "Advance Salary",
      count: typeof countAdvance === "number" ? countAdvance : 0,
      color: "#FF7373",
      url: "/advance-salary-notification",
      url2: "/advance-salary-notification-to-emp",
      visible:
        orgData?.organisation?.packageInfo === "Essential Plan" ? false : true,
      page: <AdvanceSalaryNotification />,
      empPage: <AdvanceSalaryNotificationToEmp />,
    },
    {
      name: "Missed Punch",
      tooltipName: "Missed Punch Requests",
      count: typeof MissPunchCount === "number" ? MissPunchCount : 0,
      color: "#51E8FD",
      url: "/missedPunch-notification",
      url2: "/missed-punch-notification-to-emp",
      visible:
        orgData?.organisation?.packageInfo === "Essential Plan" ? false : true,
      page: <MissedPunchNotification />,
      empPage: <MissedPunchNotificationToEmp />,
    },

    {
      name: "Payslip",
      tooltipName: "Payslip Requests",
      count:
        typeof totalNotificationCount === "number" ? totalNotificationCount : 0,
      color: "#51E8FD",
      url2: "/payslip-notification-to-emp",
      visible: role === "Employee",
      empPage: <PayslipNotification />
    },
    {
      name: "Form-16",
      tooltipName: "Form-16 Requests",
      count:
        typeof form16NotificationCount === "number"
          ? form16NotificationCount
          : 0,
      color: "#FF7373",
      url2: "/form16-notification-to-emp",
      visible:
        orgData?.organisation?.packageInfo === "Essential Plan" ? false : true,
      empPage: <Form16NotificationToEmp />
    },

    {
      name: "TDS",
      tooltipName: "Employee Declarations",
      count: typeof countTDS === "number" ? countTDS : 0,
      color: "#51E8FD",
      url: tdsRoute,
      url2: "/notification/income-tax-details",
      visible:
        orgData?.organisation?.packageInfo === "Essential Plan" ? false : true,
      page: <DeclarationPage />,
      empPage: <IncomeTaxNotification />,
    },
    {
      name: "Job Position",
      tooltipName: "Job Position Requests",
      count: typeof jobPositionCount === "number" ? jobPositionCount : 0,
      color: "#51E8FD",
      url: "/job-position-to-mgr",
      url2: "/job-position-to-emp",
      visible:
        orgData?.organisation?.packageInfo ===
          ("Essential Plan" || "Basic Plan")
          ? false
          : true,
      page: <JobPositionNotificaitonToMgr />,
      empPage: <JobNotificationToEmp />,
    },
    {
      name: "Add Department",
      tooltipName: "Add Department Requests",
      count:
        typeof departmentNotificationCount === "number"
          ? departmentNotificationCount
          : 0,
      color: "#51E8FD",
      url: "/department-notification-approval",
      url2: "/department-notification-to-emp",
      visible: role === "Super-Admin" || role === "Delegate-Super-Admin" || role === "Department-Head" || role === "Delegate-Department-Head" || role === "HR" || role === "Department-Admin" || role === "Delegate-Department-Admin",
      page: <DepartmentNotification />,
      empPage: <DepartmentNotificationToEmp />,
    },
  ];
  return { dummyData };
};

export default useNotification;
