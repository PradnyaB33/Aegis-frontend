import { Tab } from "@headlessui/react";
import React from "react";
import Select from "react-select";
// import { Link } from "react-router-dom";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import useHook from "../../hooks/UserProfile/useHook";
import useFunctions from "./hooks/useFunctions";
import CalculationTab from "./tabs/CalculationTab";
import InvestmentTab from "./tabs/InvestmentTab";

const SelectYearInputField = ({ tdsYearOptions }) => {
  const { setFySelect, fySelect } = useFunctions();
  return (
    <div className={`min-w-[300px] w-max`}>
      <div
        className={`flex outline-none h-max border-gray-200 border-[.5px] rounded-md items-center px-2 bg-white`}
      >
        <Select
          aria-errormessage=""
          placeholder={"Select FY year"}
          styles={{
            control: (styles) => ({
              ...styles,
              borderWidth: "0px",
              boxShadow: "none",
            }),
          }}
          value={fySelect}
          onChange={(value) => setFySelect(value)}
          className={`bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
          options={tdsYearOptions}
        />
      </div>
    </div>
  );
};

const generateFinancialYearOptions = (joiningDate) => {
  const options = [];
  const currentYear = new Date().getFullYear();
  const joining = new Date(joiningDate);
  const joiningYear = joining.getFullYear();
  const joiningMonth = joining.getMonth() + 1; // getMonth() is zero-based

  // Financial year starts in April
  const startYear = joiningMonth < 4 ? joiningYear - 1 : joiningYear;

  for (let year = startYear; year <= currentYear; year++) {
    options.push({
      value: `${year}-${year + 1}`,
      label: `${year}-${year + 1}`,
    });
  }

  return options;
};

const IncomeTaxPage = () => {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const { UserInformation } = useHook();

  const employeeJoiningDate = UserInformation?.joining_date; // Example joining date
  const tdsYearOptions = generateFinancialYearOptions(employeeJoiningDate);

  const tabArray = [
    {
      title: "Investment Proofs",
      disabled: false,
    },
    {
      title: "TDS calculation",
      disabled: false,
    },
  ];

  return (
    <>
      <BoxComponent>
        <HeadingOneLineInfo
          heading={"Income Tax"}
          info={"Manage your tds declarations "}
        />
        <div className="justify-between ">
          <Tab.Group>
            <div className="flex justify-between items-center">
              <Tab.List className=" mb-3 flex w-max space-x-1 rounded-xl bg-gray-200 p-1">
                {tabArray?.map((tab, index) => (
                  <Tab
                    key={index}
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
              </Tab.List>
              <SelectYearInputField tdsYearOptions={tdsYearOptions} />
            </div>
            <Tab.Panels>
              <Tab.Panel>
                <InvestmentTab />
              </Tab.Panel>
              <Tab.Panel>
                <CalculationTab />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </BoxComponent>
    </>
  );
};

export default IncomeTaxPage;
