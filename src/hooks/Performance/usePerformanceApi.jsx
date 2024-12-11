import axios from "axios";
import { create } from "zustand";

const usePerformanceApi = create((set) => ({
  isTimeFinish: undefined,
  setIsTimeFinish: (isTimeFinish) => set({ isTimeFinish }),
  dashboardData: undefined,
  setDashboardData: (dashboardData) => set({ dashboardData }),
  getPerformanceTable: async ({ role, authToken, organisationId }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/performance/getPerformanceTable/${role}/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response?.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  getEmployeePerformanceTable: async ({ authToken, empId }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/performance/getPerformanceTableForEmployee/${empId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response?.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  fetchPerformanceSetup: async ({ user, authToken }) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/performance/getSetup/${user.organizationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response?.data;
  },

  getEmployeePerformance: async ({ id, authToken }) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/performance/getEmployeeDashboard/${id}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response?.data;
  },
  getPerformanceDashboardTable: async ({ role, authToken }) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/performance/getPerformanceDashboard/${role}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return data;
  },

  changeStatus: async ({ status, empId, authToken }) => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API}/route/performance/changeRatingStatus`,
      {
        empId,
        status,
      },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return data;
  },
}));

export default usePerformanceApi;
