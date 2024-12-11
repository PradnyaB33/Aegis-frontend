const sectionArray = [
  {
    label: "Salary",
    value: "Salary",
  },
  {
    label: "House",
    value: "House",
  },
  {
    label: "Others",
    value: "Others",
  },
  {
    label: "Deductions under chapter VI",
    value: "SectionDeduction",
  },
];

const SalaryArray = [
  {
    label: "Exemption on gratuity",
    value: "Exemption on gratuity",
  },
  {
    label: "Exemption on leave encashment",
    value: "Exemption on leave encashment",
  },
  {
    label: "Exemption on voluntary retirement",
    value: "Exemption on voluntary retirement",
  },
  {
    label: "Daily allowance",
    value: "Daily allowance",
  },
  {
    label: "Conveyance allowance",
    value: "Conveyance allowance",
  },
  {
    label: "Transport allowance for a specially-abled person",
    value: "Transport allowance for a specially-abled person",
  },
  {
    label: "Perquisites for official purposes",
    value: "Perquisites for official purposes",
  },
  // {
  //   name: "Taxable salary",
  //   amount: 0,
  //   proof: "",
  //   status: "Not Submitted",

  //   amountAccepted: 0,
  // },
  // {
  //   name: "Less : Professional Tax",
  //   amount: 0,
  //   proof: "",
  //   status: "Not Submitted",

  //   amountAccepted: 0,
  // },
  // {
  //   name: "Income taxable under the head Salaries",
  //   amount: 0,
  //   proof: "",
  // status: "Not Submitted",

  //
  // amountAccepted: 0,
  // },
];

const SelfHouseArray = [
  {
    label:
      "Interest on loan / borrowing taken for repairs, renewal, or reconstruction",
    value:
      "Interest on loan / borrowing taken for repairs, renewal, or reconstruction",
  },
  {
    label: "Before 1/4/99",
    value: "Before 1/4/99",
  },
  {
    label:
      "After 1/4/99 & completed after 5 years from the end of FY of borrowing",
    value:
      "After 1/4/99 & completed after 5 years from the end of FY of borrowing",
  },
  {
    label:
      "After 1/4/99 & completed within 5 years from the end of FY of borrowing",
    value:
      "After 1/4/99 & completed within 5 years from the end of FY of borrowing",
  },
];

const LetOutArray = [
  {
    label: "Rent of the property for the year",
    value: "Rent of the property for the year",
  },
  {
    label: "Less : Municipal taxes paid in the year",
    value: "Less : Municipal taxes paid in the year",
  },
  {
    label: "Less : Interest on housing loan",
    value: "Less : Interest on housing loan",
  },
];

const OthersArray = [
  {
    label: "Bank interest (SB account)",
    value: "Bank interest (SB account)",
  },
  {
    label: "Bank interest (term deposit)",
    value: "Bank interest (term deposit)",
  },
  {
    label: "NSC interest for the year",
    value: "NSC interest for the year",
  },
  {
    label: "Post office deposit",
    value: "Post office deposit",
  },
  {
    label: "Dividend",
    value: "Dividend",
  },
  {
    label: "Family pension",
    value: "Family pension",
  },
  {
    label: "Less : Deduction on family pension income sec. 57(IIA)",
    value: "Less : Deduction on family pension income sec. 57(IIA)",
  },
  {
    label: "Less : Gifts up to Rs. 50,000/- dec. 56(2)",
    value: "Less : Gifts up to Rs. 50,000/- dec. 56(2)",
  },
];

const section80c = [
  {
    label: "Public provident fund",
    value: "Public provident fund",
  },
  {
    label: "NSC investment ",
    value: "NSC investment ",
  },
  {
    label: "Housing loan principal repayment",
    value: "Housing loan principal repayment",
  },
  {
    label: "Sukanya samriddhi account",
    value: "Sukanya samriddhi account",
  },
  {
    label: "Tuition fees for 2 children",
    value: "Tuition fees for 2 children",
  },
  {
    label: "Tax saving fixed deposit in bank (5 years)",
    value: "Tax saving fixed deposit in bank (5 years)",
  },
  {
    label: "Tax saving bonds",
    value: "Tax saving bonds",
  },
  {
    label: "E.L.S.S (Tax saving mutual fund)",
    value: "E.L.S.S (Tax saving mutual fund)",
  },
  {
    label: "Pension plan from insurance companies/mutual funds (u/s 80CCC)",
    value: "Pension plan from insurance companies/mutual funds (u/s 80CCC)",
  },
  {
    label: "Contribution to NPS notified by the central government",
    value: "Contribution to NPS notified by the central government",
  },
  {
    label: "All contributions to agniveer corpus fund",
    value: "All contributions to agniveer corpus fund",
  },
];

const section80CCD = [
  {
    label: "Less: Additional deduction under sec 80CCD NPS (Max. ₹ 50,000/-)",
    value: "Less: Additional deduction under sec 80CCD NPS (Max. ₹ 50,000/-)",
  },
];

const otherSections = [
  {
    label: "Mediclaim insurance (self & dependent)",
    value: "Mediclaim insurance (self & dependent)",
  },
  {
    label: "Mediclaim insurance (Parents)",
    value: "Mediclaim insurance (Parents)",
  },
  {
    label: "Interest on education loan",
    value: "Interest on education loan",
  },
  {
    label: "Interest on home loan as per conditions mentioned",
    value: "Interest on home loan as per conditions mentioned",
  },
  {
    label: "Medical treatment of handicapped dependent",
    value: "Medical treatment of handicapped dependent",
  },
  {
    label: "Expenditure on selected medical treatment",
    value: "Expenditure on selected medical treatment",
  },
  {
    label: "80G, 80GGA, 80GGC donation to approved funds",
    value: "80G, 80GGA, 80GGC donation to approved funds",
  },
  {
    label: "For rent to an individual, not receiving HRA (File Form 10BA)",
    value: "For rent to an individual, not receiving HRA (File Form 10BA)",
  },
  {
    label: "SB interest received by normal citizen",
    value: "SB interest received by normal citizen",
  },
  {
    label: "Interest on SB Act. & deposits received by Sr. & very Sr. Citizen",
    value: "Interest on SB Act. & deposits received by Sr. & very Sr. Citizen",
  },
  {
    label: "Physically disable assesse",
    value: "Physically disable assesse",
  },
];

export {
  LetOutArray,
  OthersArray,
  SalaryArray,
  SelfHouseArray,
  otherSections,
  section80CCD,
  section80c,
  sectionArray,
};
