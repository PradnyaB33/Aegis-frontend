import { DeleteOutlined, EditOutlined, Search } from "@mui/icons-material";
import { IconButton, Pagination, Stack } from "@mui/material";
import React, { useState } from "react";
import BasicButton from "../../../components/BasicButton";
import useFunctions from "../hooks/useFunctions";
import InvestmentTableSkeleton from "./InvestmentTableSkeleton";
import ViewPDFModal from "./viewPDFModal";

const InvestmentTable = ({ setOpen, investments, isFetching, empId }) => {
  const {
    setSearch,
    setPage,
    page,
    setDeleteConfirm,
    setEditOpen,
    setOpenRegimeModal,
    setPdf,
  } = useFunctions();
  const [focusedInput, setFocusedInput] = useState("");

  return (
    <>
      <div className="flex gap-4">
        {/* input field */}

        <div className={`space-y-1  min-w-[300px] md:min-w-[40vw] w-max `}>
          <div
            onFocus={() => {
              setFocusedInput("search");
            }}
            onBlur={() => setFocusedInput(null)}
            className={` ${
              focusedInput === "search"
                ? "outline-blue-500 outline-3 border-blue-500 border-[2px] "
                : "outline-none border-gray-200 border-[.5px]"
            } flex  rounded-md items-center px-2   bg-white py-3 md:py-[6px]`}
            // className="flex  rounded-md items-center px-2   bg-white py-3 md:py-[6px] outline-none border-gray-200 border-[.5px]"
          >
            <Search className="text-gray-700 md:text-lg !text-[1em]" />
            <input
              type={"text"}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={"Search goals"}
              className={`border-none bg-white w-full outline-none px-2  `}
              formNoValidate
            />
          </div>
        </div>

        {!window.location.pathname.includes("employee") && (
          <div className="gap-2 flex  w-full justify-end">
            <button
              type="button"
              onClick={() => setOpenRegimeModal(true)}
              className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-2 mr-4 !text-sm font-semibold text-slate-600 bg-white hover:bg-gray-50 focus-visible:outline-gray-500 border"
            >
              Change Regime
            </button>
            <BasicButton
              type="button"
              title={"Create Declaration"}
              onClick={() => setOpen(true)}
            />
            {/* <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-2 mr-4 !text-sm font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
            >
              Create Declaration
            </button> */}
          </div>
        )}
      </div>

      <div className=" w-full my-2 overflow-x-auto">
        {isFetching ? (
          <InvestmentTableSkeleton />
        ) : (
          <div className="overflow-auto ">
            <table className="w-full table-auto  border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
              <thead className="border-b bg-gray-100 font-bold">
                <tr className="!font-semibold ">
                  <th scope="col" className="!text-left px-2 w-max py-3 ">
                    Sr. No
                  </th>
                  <th scope="col" className="py-3 px-2 ">
                    Investment Name
                  </th>

                  <th scope="col" className="py-3 px-2 ">
                    Declaration
                  </th>

                  <th scope="col" className="py-3 px-2 ">
                    Approved Amount
                  </th>

                  <th scope="col" className="py-3 px-2 ">
                    Proofs
                  </th>

                  <th scope="col" className=" py-3 px-2 ">
                    Status
                  </th>

                  {!window.location.pathname.includes("employee") && (
                    <th scope="col" className=" py-3 px-2 ">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {investments?.investments?.length <= 0 ? (
                  <tr>
                    <td
                      colSpan="100%"
                      className="p-4 text-lg text-center leading-none font-medium"
                    >
                      <h1>No Data Found</h1>
                    </td>
                  </tr>
                ) : (
                  investments?.investments?.map((inv, id) => (
                    <tr
                      className={` hover:bg-gray-50 bg-white  !font-medium  w-max border-b `}
                    >
                      <td className="!text-left   py-4    px-2 w-[70px]  ">
                        {id + 1}
                      </td>

                      <td className="  text-left !p-0 !w-[250px]  ">
                        <p
                          className={`
                        px-2 md:w-full w-max`}
                        >
                          {inv?.name}
                        </p>
                      </td>

                      <td className=" px-2 text-left w-[200px]  ">
                        {inv.declaration}
                      </td>
                      <td className=" px-2 text-left w-[200px]  ">
                        {inv.amountAccepted}
                      </td>
                      <td className=" text-left w-[200px]  ">
                        <div
                          // onClick={() => handlePDF(item.proof)}
                          className="px-2 flex gap-2 items-center h-max w-max  cursor-pointer"
                        >
                          {/* <Article className="text-blue-500" /> */}
                          {inv?.proof ? (
                            <button
                              type="button"
                              onClick={() => setPdf(inv?.proof)}
                              className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 mr-4 !text-sm font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
                            >
                              View Proof
                            </button>
                          ) : (
                            <h1>No proof found</h1>
                          )}
                        </div>
                      </td>
                      <td className=" text-left w-[200px]  ">{inv?.status}</td>
                      {!window.location.pathname.includes("employee") && (
                        <td className="flex gap-2 text-left mt-2">
                          <IconButton
                            color="primary"
                            size="small"
                            aria-label="edit"
                            onClick={() => setEditOpen(inv)}
                          >
                            <EditOutlined />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            aria-label="delete"
                            onClick={() => setDeleteConfirm(inv)}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <Stack
              direction={"row"}
              className="border-[.5px] border-gray-200 bg-white  border-t-0 px-4 py-2 h-full  items-center w-full justify-between "
            >
              <div>
                <h1>
                  Showing {page} to {investments?.totalPages} of{" "}
                  {investments?.totalGoals} entries
                </h1>
              </div>
              <Pagination
                count={investments?.totalPages}
                page={page}
                color="primary"
                shape="rounded"
                onChange={(event, value) => setPage(value)}
              />
            </Stack>
          </div>
        )}
      </div>
      <ViewPDFModal />
    </>
  );
};

export default InvestmentTable;
