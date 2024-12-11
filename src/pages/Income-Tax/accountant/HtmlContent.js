const HtmlContent = (data) => {
  const grossArray = [
    {
      name: "Gross Salary",
      declaration: [
        {
          sr: "(a)",
          title: "Salary as per provisions contained in section 17(1)",
          rs1: data?.gross_salary,
          rs2: "-",
        },
        {
          sr: "(b)",
          title: "Value of perquisites u/s 17(2) as per Form No. 12BA",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(c)",
          title:
            "Profits in lieu of salary under section 17(3) (as per Form No. 12BA, if applicable)",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(d)",
          title: "Total",
          rs1: data?.total_gross_salary ?? 0,
          rs2: "-",
        },
        {
          sr: "(e)",
          title:
            "Reported total amount of salary received from other employer(s)",
          rs1: "-",
          rs2: "-",
        },
      ],
    },
    {
      name: "Less: Allowances to the extent exempt under section 10",
      declaration: [
        {
          sr: "(a)",
          title: "Travel concession or assistance under section 10(5)",
          rs1: data?.travel ?? 0,
          rs2: "-",
        },
        {
          sr: "(b)",
          title: "Death-cum-retirement gratuity under section 10(10)",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(c)",
          title: "Commuted value of pension under section 10(10A)",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(d)",
          title:
            "Cash equivalent of leave salary encashment under section 10(10AA)",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(e)",
          title: "House rent allowance under section 10(13A)",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(f)",
          title:
            "Amount of any other exemption under section 10 [Note: Break-up to be prepared by the employer and issued to the employee]while applicable, before furnishing the details of Part B to the employee",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(g)",
          title: "Total amount of exemption under section 10",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(h)",
          title:
            "Total amount of exemption claimed under section 10 [2(a) + 2(b) + 2(c) + 2(d) + 2(e) + 2(g)]",
          rs1: "-",
          rs2: "-",
        },
      ],
    },
    {
      name: "Total amount of salary received from current employer(s) [1(d) - 2(h)]",
      declaration: [],
    },
    {
      name: "Less: Declaration under section 16",
      declaration: [
        {
          sr: "(a)",
          title: "Standard Deduction under section 16(ia)",
          rs1: 75000,
          rs2: "-",
        },
        {
          sr: "(b)",
          title: "Entertainment allowance under section 16(ii)",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(c)",
          title: "Tax on employment under section 16(iii)",
          rs1: "-",
          rs2: "-",
        },
      ],
    },
    {
      name: "Total amount of deduction under section 16 [4(a) + 4(b) + 4(c)]",
      declaration: [],
    },
    {
      name: "Income chargeable under the head 'Salaries' [3 + 1(e)-5)]",
      declaration: [],
    },
    {
      name: "Add: Any other income reported by the employee under section 192(2B)",
      declaration: [
        {
          sr: "(a)",
          title:
            "Income (or admissible loss) from house property reported by the employee offered for TDS",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(b)",
          title: "Income under the head 'Other sources' offered for TDS",
          rs1: "-",
          rs2: "-",
        },
      ],
    },
    {
      name: "Total amount of other income reported by the employee  [7(a) + 7(b)]",
      declaration: [],
    },
    {
      name: "Gross total income (6 + 8)",
      declaration: [],
    },
    {
      name: "Deductions under Chapter VI-A",
      declaration: [
        {
          sr: "(a)",
          title:
            "Deductions in respect of life insurance premia, contributions to provident fund, etc. under section 80C",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(b)",
          title:
            "Deductions in respect of contributions to certain pension funds under section 80CCC",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(c)",
          title:
            "Deductions in respect of contribution by taxpayer to pension scheme under section 80CCD(1B)",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(d)",
          title: "Total deductions under section 80C, 80CCC and 80CCD(1)",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(e)",
          title:
            "Deductions in respect of amount paid/deposited to notified pension scheme under section 80CCD(1B)",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(f)",
          title:
            "Deductions in respect of contribution by employer to pension scheme under section 80CCD(2)",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(g)",
          title:
            "Deduction in repeat of health insurance premia under section 80D",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(h)",
          title:
            "Deduction in respect of interest on loan taken for higher education under section 80E",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(i)",
          title:
            "Total deductions in respect of donations to certain funds, charitable institutions, etc. under section 80G",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(j)",
          title:
            "Deductions in respect of interest on deposits in savings account under section 80TTA",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(k)",
          title:
            "Amount deductible under any other provision(s) of Chapter VI-A",
          rs1: "-",
          rs2: "-",
        },
        {
          sr: "(l)",
          title:
            "Total of amount deductible under any other provision(s) of Chapter VI-A",
          rs1: "-",
          rs2: "-",
        },
      ],
    },
    {
      name: "Aggregate of deductible amount under Chapter VI-A   [10(d) + 10(e) + 10(f) + 10(g) + 10(h) + 10(i) + 10(j) + 10(k) + 10(l)]",
      declaration: [],
      amount: 0,
    },
    {
      name: "Total taxable income (9 - 11)",
      declaration: [],
      amount: data?.total_taxable_income ?? 0,
    },
    {
      name: "Tax on total income",
      declaration: [],
      amount: 0,
    },
    {
      name: "Rebate under section 87A , if applicable",
      declaration: [],
      amount: 0,
    },
    {
      name: "Surcharge, if applicable",
      declaration: [],
      amount: 0,
    },
    {
      name: "Health and education cess",
      declaration: [],
      amount: data?.cess ?? 0,
    },
    {
      name: "Tax payable (13 + 14 + 15 + 16)",
      declaration: [],
      amount: data?.taxPayble ?? 0,
    },
    {
      name: "Less: Relief under section 89",
      declaration: [],
      amount: 0,
    },
    {
      name: "Net tax payable (17 - 18)",
      declaration: [],
      amount: 0,
    },
  ];
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Form 16</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;

    }
    .header, .article {
     
      padding: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: .5px solid black;
      text-align: start;
      padding: 8px;
      font-size: 0.875rem;
    }
   
    @media print {
      .page-break {
        page-break-before: always;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <section>
      <article style="width: 100%; ">
        <header style="width: 100%">
          <div style="text-align: center; ">
            <h4 style="font-weight: 500; font-size: 1.25rem; font-weight: bold; padding: 10px; margin: 0px; line-height: 1;">
              FORM NO. 16
            </h4>
          </div>
          <h4 style="font-weight: 500; font-weight: bold; text-align: center; border-bottom: 2px solid black; padding: 10px; margin: 0px;">
            Certificate under Section 203 of the Income-tax Act, 1961 for tax deducted at source on salary
          </h4>
          <h4 style="font-weight: 500; text-align: center; font-size: 1.125rem; padding: 10px; margin: 0px; font-weight: bold;">
            PART B
          </h4>
        </header>
        <article>
          <table>
            <tr>
              <td colspan="2" >Certificate No: ${data.certificateNo}</td>
              <td colspan="2"  >Last Updated on: ${data.lastUpdated}</td>
            </tr>
            <tr>
              <td colspan="2" >Name and address of the Employer</td>
              <td colspan="2"  class="border-left ">Name and designation of the Employee</td>
            </tr>
            <tr style="height: 80px;">
              <td colspan="2"  >${data.name}<br />${data.address}</td>
              <td colspan="2"  class="border-left">Employee one</td>
            </tr>
            <tr>
              <td >PAN No. of the Deductor</td>
              <td class="border-left" colspan="2">TAN No. of the Deductor</td>
              <td  class="border-left">PAN of the Employee</td>
            </tr>
            <tr>
              <td >${data.emr_pan}</td>
              <td class="border-left" colspan="2">PABF1234B</td>
              <td  class="border-left">${data.emp_pan}</td>
            </tr>
            <tr>
              <td  ">CIT (CDS)</td>
              <td class="border-left" colspan="2">Assessment year</td>
              <td class="border-left"  >Period with the Employer</td>
            </tr>
            <tr>
              <td  border-bottom: 0px;">-</td>
              <td  class="border-left">-</td>
              <td  class="border-left">-</td>
            </tr>
          </table>
        </article>
      </article>
      <main style="margin-top: 16px; width: 100%; border: 2px solid black;">
        <header>
          <h4 style="font-weight: 500; text-align: center; padding: 10px; margin: 0px;">
            Details of salary paid and income and tax deducted
          </h4>
        </header>
        <table>
          <tr class="border: 0 px;">
            <th></th>
            <th colspan="4" style="width: 60%;" class="border-right">Details of salary paid and income and tax deducted</th>
            <th colspan="3" style="width: 15%;">Rs</th>
            <th colspan="3" style="width: 15%;" class="border-left">Rs</th>
          </tr>
          ${grossArray
            .map(
              (ele, i) => `
            <tr class="border: none;">
              <td class="border: 0px;" >${i + 1}</td>
              <td  colspan="${i >= 10 ? 7 : 11}" class="text-left ">${
                ele.name
              }</td>
              ${
                i >= 10
                  ? `<td style="width: 30%; " class="border-left"> ${ele?.amount} </td>`
                  : ""
              }
            </tr>
            ${ele.declaration
              .map(
                (dec, j) => `
              <tr>
                <td >${dec.sr}</td>
                <td colspan="4" style="width: 70%;" class="border-left">${dec.title}</td>
                <td colspan="3" style="width: 15%;" class="border-left">${dec.rs1}</td>
                <td  colspan="3" style="width: 15%;" class="border-left">${dec.rs2}</td>
              </tr>
            `
              )
              .join("")}
          `
            )
            .join("")}
        </table>
      </main>
      <main style="margin-top: 16px; width: 100%; border: 2px solid black;">
        <header style="border-bottom: 2px solid black;">
          <h4 style="font-weight: 500; text-align: center; padding: 10px; margin: 0px;">
            Verification
          </h4>
        </header>
      </main>
    </section>
  </div>
</body>
</html>
`;
};

export default HtmlContent;
