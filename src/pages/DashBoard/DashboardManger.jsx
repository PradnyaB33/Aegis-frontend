import {
  AccessTime,
  EventAvailable,
  EventBusy,
  Groups,
} from "@mui/icons-material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../../hooks/UserData/useUser";
import SuperAdminCard from "./Components/Card/superadmin/SuperAdminCard";
import ManagerEmployeeChart from "./Components/Custom/ManagerEmployeeChart";
import EmployeeLeaveRequest from "./Components/List/EmployeLeaveReqest";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import { Grid } from "@mui/material";

const DashboardManger = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams("");
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();

  // const cardSize = "w-72 h-28 "; // Adjust card size here  
  const cardSize = "w-66 h-30 "; // Adjust card size here

  const [selectedyear, setSelectedYear] = useState({
    value: new Date().getFullYear(),
    label: new Date().getFullYear(),
  });

  const getAllEmployeeForManger = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/countofEmployees`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  };

  const { data: EmployeeDataOfManager } = useQuery(
    "employeeData",
    getAllEmployeeForManger
  );

  const getManagerAttendenceChart = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/getManagerEmployeeAttendence/${user._id}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  };

  useQuery(["manager-attendece"], getManagerAttendenceChart);

  const { data: managerShift } = useQuery({
    queryKey: ["deptEmployeeOnShift"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getManagerShifts/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    },
  });

  const { data: managerAttendence, } =
    useQuery({
      queryKey: ["deptEmployeeAbsent"],
      queryFn: async () => {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/route/leave/getTodaysAbsentUnderManager/${organisationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return data;
      },
    });

  return (
    <BoxComponent>
      <HeadingOneLineInfo
        heading={"Manager Dashboard"}
        info={
          "Manage and review employee attendance and leave management"
        }
      />

      <Grid container spacing={4}>
        <Grid item xs={6} sm={4} md={3}>
          <SuperAdminCard
            icon={Groups}
            title={"Subordinates"}
            data={
              EmployeeDataOfManager?.data[0]?.reporteeIds?.length ?? 0
            }
            className="bg-[#CFF2FC]"
            cardSize={cardSize}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <SuperAdminCard
            icon={AccessTime}
            title={"Shift Allowance"}
            data={managerShift ?? 0}
            className="bg-[#FFF2DC]"
            cardSize={cardSize}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <SuperAdminCard
            icon={EventAvailable}
            data={
              EmployeeDataOfManager?.data[0]?.reporteeIds?.length -
              managerAttendence ?? 0
            }
            className="bg-[#D8FAE7]"
            title={"Present Today"}
            cardSize={cardSize}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <SuperAdminCard
            icon={EventBusy}
            data={managerAttendence ?? 0}
            className="bg-[#FFF6C5]"
            title={"Today's Leave"}
            cardSize={cardSize}
          />
        </Grid>
      </Grid>
      <div className="w-full md:gap-4 md:space-y-0 space-y-3 mt-6 flex md:flex-row flex-col ">
        <div className="w-[100%] md:w-[50%]">
          <ManagerEmployeeChart
            EmployeeDataOfManager={EmployeeDataOfManager}
            selectedyear={selectedyear}
            setSelectedYear={setSelectedYear}
          />
        </div>
        <div className="w-[100%] md:w-[50%]">
          <EmployeeLeaveRequest />
        </div>
      </div>
    </BoxComponent>
  );
};

export default DashboardManger;













