// Header.tsx
import React from "react";

const Header = ({ totalSteps, step, goToStep, stepper }) => {
  const stepLabels = Array.from({ length: totalSteps }, (_, index) =>
    (index + 1).toString()
  );

  return (
    <div className="!w-full !flex gap-1">
      {stepper?.length > 0 ? (
        stepper?.map((data, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <button
                disabled={step - 1 < index + 1 ? true : false}
                onClick={() => goToStep(index + 1)}
                className={` transition-bg duration-600 ease-in-out cursor-pointer  flex items-center gap-2 flex-col border-gray-200 !text-xs rounded-full md:p-2 p-[8px] border-[.5px] first-letter:

             ${
               step < index + 1 ? "!bg-white" : "!bg-[#1414fe]"
             } disabled:text-gray-500 disabled:cursor-not-allowed`}
              >
                {data?.icon ? (
                  <data.icon
                    className={`  ${
                      step < index + 1 ? "" : "!text-white"
                    } !text-md md:!text-md  !font-thin `}
                  />
                ) : (
                  <h1
                    className={`  ${
                      step < index + 1 ? "" : "!text-white"
                    } !text-lg text-center !font-thin w-[24px]`}
                  >
                    {index + 1}
                  </h1>
                )}
              </button>
              <h1
                className={`w-max hidden md:block  ${
                  step < index + 1 ? "!text-black" : "!text-[#1414fe]"
                }`}
              >
                {data?.label}
              </h1>
            </div>

            {index < totalSteps - 1 && (
              <div
                className={`!w-full !h-2 ${
                  step - 1 < index + 1 ? "!bg-gray-200" : "!bg-primary"
                } !flex m-auto  !rounded-md`}
              ></div>
            )}
          </React.Fragment>
        ))
      ) : (
        <>
          {stepLabels.map((label, index) => (
            <>
              <div
                onClick={() => goToStep(index + 1)}
                className={`cursor-pointer justify-center  flex items-center p-6 text-lg !h-0 !w-0 gap-2 flex-col  border-gray-200 rounded-full  border-[.5px] first-letter:
             ${
               step < index + 1
                 ? "!bg-white text-black"
                 : "!bg-primary text-white"
             }
            
            `}
              >
                {label}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`!w-full !h-2 ${
                    step - 1 < index + 1 ? "!bg-gray-200" : "!bg-primary"
                  } !flex m-auto  !rounded-md`}
                ></div>
              )}
            </>
          ))}
        </>
      )}
    </div>
  );
};

export default Header;
