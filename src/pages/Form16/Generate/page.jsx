import React from "react";

const GenerateForm16 = () => {
  return (
    <>
      <section className="p-4 flex flex-col w-full items-center justify-center">
        <article className="w-[70%]">
          <header>
            <div className="grid place-items-center mb-2">
              <h1 className="text-2xl font-bold leading-none">FORM NO. 16</h1>
              <p className="text-sm">[See rule 31(1)(a)] </p>
            </div>
            <h6 className="font-bold text-center leading-none">
              Certificate under Section 203 of the Income-tax Act, 1961 for tax
              deducted at source on salary
            </h6>

            <h1 className="text-center mt-2 text-lg font-bold leading-none">
              PART A
            </h1>
          </header>

          <article className="my-4 border-2  border-black">
            {/* Step 1  */}
            <div className="grid grid-cols-2 border-b-2  border-black">
              <h1 className="text-center text-sm p-1">Certificate No</h1>
              <h1 className="text-center text-sm p-1 border-l-2 border-black">
                Last Updated on
              </h1>
            </div>
            <div className="grid grid-cols-2 border-b-2  border-black">
              <h1 className="text-center text-sm p-1">123444</h1>
              <h1 className="text-center text-sm p-1 border-l-2 border-black">
                12 Nov 2023
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

            <div className="grid grid-cols-2 border-b-2  border-black">
              <h1 className="text-center text-sm p-1">Test One</h1>
              <h1 className="text-center text-sm p-1 border-l-2 border-black">
                Employee one
              </h1>
            </div>

            <>
              <div className="grid grid-cols-2 border-b-2  border-black">
                <div className="grid grid-cols-2">
                  <h1 className="text-center text-sm p-1 ">
                    PAN No. of the Deductor
                  </h1>
                  <h1 className="text-center text-sm p-1 border-l-2 border-black">
                    TAN No. of the Deductor
                  </h1>
                </div>

                <div className="grid grid-cols-2 ">
                  <h1 className="text-center text-sm p-1 border-x-2 border-black">
                    PAN of the Employee
                  </h1>
                  <h1 className="text-center text-sm p-1 ">
                    Employee Reference No. provided by the Employer (If
                    available)
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b-2  border-black">
                <div className="grid grid-cols-2">
                  <h1 className="text-center text-sm p-1 ">PABF1234B</h1>
                  <h1 className="text-center text-sm p-1 border-l-2 border-black">
                    PABF1234B
                  </h1>
                </div>
                <div className="grid grid-cols-2 ">
                  <h1 className="text-center text-sm p-1 border-x-2 border-black">
                    PCBF1234B
                  </h1>
                  <h1 className="text-center text-sm p-1 ">PCBF1234B</h1>
                </div>
              </div>
            </>

            {/* Step 4 Before Qurters */}
            <article className="grid grid-cols-2 border-b-2  border-black">
              <aside>
                <h1 className="pr-2">
                  Acknowledgement Nos. of all quarterly statements of TDS under
                  sub-section (3) of section 200 as provided by TIN Facilitation
                  Centre or NSDL web-site{" "}
                </h1>
              </aside>
              <div className="grid grid-cols-2 ">
                <h1 className="text-center text-sm p-1 border-x-2 border-black">
                  Period
                </h1>
                <h1 className="text-center text-sm p-1 ">Assessment year</h1>
              </div>
            </article>

            {/* Step 4 Before Qurters */}

            {/* Step 5  Qurters */}
            <article className="grid grid-cols-2 border-b-2  border-black">
              <aside className="grid grid-cols-1">
                <h1 className="text-center text-sm p-1 ">CIT (CDS)</h1>
                {/* <h1 className="text-center text-sm p-1 border-l-2 border-black">
                  Acknowledgement No.
                </h1> */}
              </aside>
              <div className="grid grid-cols-2 ">
                <aside className="grid grid-cols-2 border-black border-l-2">
                  <h1 className="text-center text-sm p-1 ">From</h1>
                  <h1 className="text-center text-sm p-1 border-l-2 border-black">
                    To
                  </h1>
                </aside>
                <span className="border-l-2 border-black"></span>
              </div>
            </article>

            {Array.from({ length: 4 }).map((_, index) => (
              <article className="grid grid-cols-2 border-b-[1.5px]  border-black">
                <aside className="grid grid-cols-1">
                  <h1 className="text-center text-sm p-1 ">-</h1>
                  {/* <h1 className="text-center text-sm p-1 border-l-[1.5px]  border-black">
                    -
                  </h1> */}
                </aside>
                <div className="grid grid-cols-2 ">
                  <aside className="grid grid-cols-2 border-black border-l-[1.5px] ">
                    <h1 className="text-center text-sm p-1 ">-</h1>
                    <h1 className="text-center text-sm p-1 border-l-[1.5px]  border-black">
                      -
                    </h1>
                  </aside>
                  <span className="border-l-2 border-black"></span>
                </div>
              </article>
            ))}

            {/* Step 5  Qurters */}

            <header className="text-center  p-2 font-bold">
              Summary of amount paid/credited and tax deducted at source thereon
              in respect of the employee
            </header>
          </article>
        </article>
      </section>
    </>
  );
};

export default GenerateForm16;
