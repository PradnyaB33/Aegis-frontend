export const reportTypeOptions = [
  {
    label: "Attendance Data",
    value: "Attendence",
  },
  {
    label: "Salary Data",
    value: "salary",
  },
  {
    label: "TDS Challan",
    value: "tds",
  },
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const getTDSYearsOptions = () => {
  const currentYear = new Date().getFullYear();
  const optionList = [];

  for (let year = currentYear; year >= currentYear - 5; year--) {
    const label = `${year}-${year + 1}`;
    optionList.push({ label, value: label });
  }

  return optionList;
};

const getOptions = () => {
  const options = [];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // getMonth() returns a zero-based value (where zero indicates the first month of the year)

  for (let year = currentYear - 5; year <= currentYear; year++) {
    for (let month = 1; month <= 12; month++) {
      // For the current year, do not add months that are in the future
      if (year === currentYear && month > currentMonth) {
        break;
      }
      options.push({
        label: `${monthNames[month + 1]}-${year}`,
        value: { year, month },
      });
    }
  }

  return options.reverse();
};

export const ReportYearsOptions = getOptions();
