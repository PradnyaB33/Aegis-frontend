import { Tab } from "@headlessui/react";
import React from "react";
import { useQuery } from "react-query";
import usePerformanceApi from "../../../hooks/Performance/usePerformanceApi";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import GoalSettingTab from "../Tabs/GoalSettingTab";
import PerformanceDashboard from "../Tabs/PerformanceDashboard";
import ReviewTab from "../Tabs/ReviewTab";

const TestTab = () => {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const user = UserProfile().getCurrentUser();
  const role = UserProfile().useGetCurrentRole();
  const authToken = useAuthToken();
  const { fetchPerformanceSetup } = usePerformanceApi();
  const { data: performance } = useQuery(["performancePeriod"], () =>
    fetchPerformanceSetup({ user, authToken })
  );

  const tabArray = [
    {
      title: "Dashboard",
      component: <PerformanceDashboard />,
      disabled: false,
    },
    {
      title: "Goal Setting",
      component: <GoalSettingTab />,
      disabled: false,
    },
    // {
    //   title: "Monitoring",
    //   component: <GoalSettingTab />,
    //   disabled:
    //     performance?.stages !== "Monitoring stage/Feedback collection stage"
    //       ? true
    //       : false,
    // },
    // {
    //   title: "Add KRA",
    //   component: <GoalSettingTab />,
    //   disabled:
    //     performance?.stages !==
    //     "KRA stage/Ratings Feedback/Manager review stage"
    //       ? true
    //       : false,
    // },

    {
      title: "Review & Feedback",
      component: <ReviewTab />,
      disabled:
        performance?.stages ===
          "KRA stage/Ratings Feedback/Manager review stage" ||
        performance?.stages === "Employee acceptance/acknowledgement stage"
          ? false
          : true,
    },
  ];

  return (
    <>
      {/* <header className="text-lg w-full pt-6 bg-white border  p-4">
        <Link to={-1}>
          <West className="mx-4 !text-xl" />
        </Link>
        Performance Management
      </header> */}

      {/* <div className="flex items-center justify-between px-8">
        <div className="w-full py-4  ">
          <h1 className="text-2xl ">Performance</h1>
          <p>Manage and organize goals setting</p>
        </div>
      </div> */}

      <div className="min-h-[85vh] bg-gray-50">
        <Tab.Group>
          <Tab.List className=" mb-3 flex w-max space-x-1 rounded-xl bg-gray-200 p-1">
            {tabArray
              ?.filter((tab) => {
                if (role === "Employee" && tab?.title === "Review & Feedback") {
                  return null;
                }
                return tab;
              })
              ?.map((tab, index) => (
                <Tab
                  disabled={tab.disabled}
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 px-10 text-sm font-medium leading-5 whitespace-nowrap",
                      selected
                        ? "bg-white text-blue-700 shadow"
                        : "text-black hover:bg-gray-200 ",
                      tab.disabled &&
                        "cursor-not-allowed text-gray-400 hover:bg-gray-100"
                    )
                  }
                >
                  {tab?.title}
                </Tab>
              ))}
            {/* <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 px-10 text-sm font-medium leading-5 whitespace-nowrap",
                  selected
                    ? "bg-white text-blue-500 shadow"
                    : "text-black hover:bg-gray-200 "
                )
              }
            >
              Goal Setting
            </Tab> */}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <PerformanceDashboard />
            </Tab.Panel>
            <Tab.Panel>
              <GoalSettingTab />
            </Tab.Panel>
            {role !== "Employee" && (
              <Tab.Panel>
                <ReviewTab />
              </Tab.Panel>
            )}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};

export default TestTab;
