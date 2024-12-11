import { Tab } from "@headlessui/react";
import React from "react";
import RightSideTable from "../components/Dashboard/RightSideTable";
import TabelSkeleton from "../components/GoalTable/Skelton/TabelSkeleton";

const SingleEmployeeTab = () => {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  // const user = UserProfile().getCurrentUser();
  // const role = UserProfile().useGetCurrentRole();
  // const authToken = useAuthToken();
  // const { fetchPerformanceSetup } = usePerformanceApi();
  // const { data: performance } = useQuery(["performancePeriod"], () =>
  //   fetchPerformanceSetup({ user, authToken })
  // );

  const tabArray = [
    {
      title: "Goals",
      component: <RightSideTable />,
      disabled: false,
    },
    {
      title: "Monitoring",
      component: <TabelSkeleton />,
      disabled: false,
    },

    {
      title: "Ratings",
      component: <TabelSkeleton />,
      disabled: false,
    },
    {
      title: "360 Feedback",
      component: <TabelSkeleton />,
      disabled: false,
    },
  ];
  return (
    <>
      {/* <div className="flex items-center justify-between px-8">
        <div className="w-full py-4  ">
          <h1 className="text-2xl ">Performance</h1>
          <p>Manage and organize goals setting</p>
        </div>
      </div> */}

      <div className="px-4 py-4">
        <Tab.Group>
          <Tab.List className=" mb-3 flex w-max space-x-1 rounded-xl bg-gray-100 p-1">
            {tabArray.map((tab, index) => (
              <Tab
                disabled={tab.disabled}
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2 px-6 text-sm font-medium leading-5 whitespace-nowrap",
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
            <Tab.Panel>{/* <RightSideTable /> */}</Tab.Panel>
            <Tab.Panel>
              <TabelSkeleton />
            </Tab.Panel>
            {/* <Tab.Panel>Content 3</Tab.Panel> */}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};

export default SingleEmployeeTab;
