import React from "react";

const GenerateForm16B = () => {
  const grossArray = [
    {
      name: "Gross Salary",
      declaration: [
        {
          sr: "(a)",
          title: "Salary as per provisions contained in section 17(1)",
          rs1: "-",
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
          rs1: "-",
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
          rs1: "-",
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
          rs1: "-",
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
    },
    {
      name: "Total taxable income (9 - 11)",
      declaration: [],
    },
    {
      name: "Tax on total income",
      declaration: [],
    },
    {
      name: "Rebate under section 87A , if applicable",
      declaration: [],
    },
    {
      name: "Surcharge, if applicable",
      declaration: [],
    },
    {
      name: "Health and education cess",
      declaration: [],
    },
    {
      name: "Tax payable (13 + 14 + 15 + 16)",
      declaration: [],
    },
    {
      name: "Less: Relief under section 89",
      declaration: [],
    },
    {
      name: "Net tax payable (17 - 18)",
      declaration: [],
    },
  ];

  return (
    <section className="p-4 flex flex-col w-full items-center justify-center">
      <article className="w-[70%] border-2  border-black">
        <header>
          <div className="grid place-items-center border-b-2 border-black ">
            <h1 className="text-xl font-bold p-2 leading-none">FORM NO. 16</h1>
          </div>
          <h6 className="font-bold text-center border-b-2 border-black p-2">
            Certificate under Section 203 of the Income-tax Act, 1961 for tax
            deducted at source on salary
          </h6>

          <h1 className="text-center text-lg  border-b-2 border-black p-2 font-bold ">
            PART B
          </h1>
        </header>

        <article>
          {/* Step 1  */}
          <div className="grid grid-cols-2 border-b-2  border-black">
            <h1 className="text-center text-sm p-1">Certificate No: 123444</h1>
            <h1 className="text-center text-sm p-1 border-l-2 border-black">
              Last Updated on: 12 Nov 2023
            </h1>
          </div>

          {/* Step 1  */}

          <div className="grid grid-cols-2 border-b-2  border-black">
            <h1 className="text-center text-sm p-1">
              Name and address of the Employer{" "}
            </h1>
            <h1 className="text-center text-sm p-1 border-l-2 border-black">
              Name and designation of the Employee
            </h1>
          </div>

          <div className="grid grid-cols-2 border-b-2  h-20 border-black">
            <h1 className="text-center text-sm p-1">Test One</h1>
            <h1 className="text-center text-sm p-1 border-l-2 border-black">
              Employee one
            </h1>
          </div>

          <>
            <div className="grid grid-cols-3  border-b-2  border-black">
              <h1 className="text-center text-sm p-1 ">
                PAN No. of the Deductor
              </h1>
              <h1 className="text-center text-sm p-1 border-l-2 border-black">
                TAN No. of the Deductor
              </h1>
              <h1 className="text-center text-sm p-1 border-x-2 border-black">
                PAN of the Employee
              </h1>
            </div>

            <div className="grid grid-cols-3 border-b-2  border-black">
              <h1 className="text-center text-sm p-1 ">PABF1234B</h1>
              <h1 className="text-center text-sm p-1 border-l-2 border-black">
                PABF1234B
              </h1>
              <h1 className="text-center text-sm p-1 border-x-2 border-black">
                PCBF1234B
              </h1>
            </div>
          </>

          {/* Step   Qurters */}
          <article className="grid grid-cols-2 border-b-2  border-black">
            <aside className="grid grid-cols-1">
              <h1 className="text-center text-sm p-1 ">CIT (CDS)</h1>
              {/* <h1 className="text-center text-sm p-1 border-l-2 border-black">
                  Acknowledgement No.
                </h1> */}
            </aside>
            <div className="grid grid-cols-2 ">
              <span className="border-x-2 border-black text-center">
                Assessment year
              </span>

              <h1 className="text-center text-sm p-1 ">
                Period with the Employer
              </h1>
            </div>
          </article>

          {Array.from({ length: 4 }).map((_, index) => (
            <article className="grid grid-cols-2 border-b-[1.5px]  border-black">
              <aside className="grid grid-cols-1">
                <h1 className="text-center text-sm p-1 ">-</h1>
              </aside>
              <div className="grid grid-cols-2 ">
                <span className="border-l-2 border-black">-</span>
                <aside className="grid grid-cols-2 border-black border-l-[1.5px] ">
                  <h1 className="text-center text-sm p-1 ">-</h1>
                  <h1 className="text-center text-sm p-1 border-l-[1.5px]  border-black">
                    -
                  </h1>
                </aside>
              </div>
            </article>
          ))}
        </article>
      </article>

      <main className="mt-4 w-[70%] border-2  border-black">
        <header className="grid grid-cols-12 border-b-2 border-black">
          <h1 className="text-center col-span-8 p-1 border-r-2 border-black">
            Details of salary paid and income and tax deducted
          </h1>
          <p className="p-1 col-span-2">Rs</p>
          <p className="p-1 border-l-2 col-span-2 border-black">Rs</p>
        </header>

        {grossArray?.map((ele, i) => (
          <>
            <header className="grid grid-cols-12 border-b-2 border-black">
              <h1 className="text-center col-span-1 p-1">{i + 1}</h1>
              <h1
                className={`p-1 ${
                  i >= 10 ? "col-span-7" : "col-span-11"
                }  border-l-2 border-black`}
              >
                {ele?.name}
              </h1>
              {i >= 10 && (
                <h1 className={`p-1 col-span-4  border-l-2 border-black`}>
                  amount
                </h1>
              )}
            </header>

            {ele?.declaration?.map((dec, i) => (
              <aside
                key={i}
                className="grid grid-cols-12 border-b-2 border-black"
              >
                <h1 className="text-center col-span-1 p-1">{dec?.sr}</h1>
                <h1 className="p-1 col-span-7 border-l-2 border-black">
                  {dec?.title}
                </h1>
                <h1 className="p-1 col-span-2 border-l-2 border-black">
                  {dec?.rs1}
                </h1>
                <h1 className="p-1 col-span-2 border-l-2 border-black">
                  {dec?.rs2}
                </h1>
              </aside>
            ))}
          </>
        ))}
      </main>

      <main className="mt-4 w-[70%] border-2  border-black">
        <header className=" border-b-2 border-black">
          <h1 className="text-center  p-1">Verification</h1>
        </header>
      </main>
    </section>
  );
};

export default GenerateForm16B;
