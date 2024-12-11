import {
  Article,
  Cancel,
  CheckCircle,
  Close,
  Info,
  Search,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import useIncomeTax from "../../../../hooks/IncomeTax/useIncomeTax";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";
import TDSDeclarationModel from "./components/TDSDeclarationModel";
import HeadingOneLineInfo from "../../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const DeclarationPage = () => {
  const authToken = useAuthToken();
  const { id } = useParams();
  const [investment, setInvestment] = useState({});
  const [isReject, setIsReject] = useState(false);
  const [pdf, setPdf] = useState(null);
  const { financialYear } = useIncomeTax();
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const queryClient = useQueryClient();
  const handlePDF = (id) => {
    setPdf(id);
  };

  const handleClosePDF = () => {
    setPdf(null);
  };

  const [searchEmp, setSearchEmp] = useState("");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setInvestment({});
  };

  const { data: empData, isLoading: empLoading } = useQuery({
    queryKey: ["AccoutantEmp"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getAllEmployeesUnderAccoutant/${role}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!role,
  });

  const { data: empTDSData, isLoading: empDataLoading } = useQuery({
    queryKey: ["EmpData", id],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getTDSWorkflow/${id}/${financialYear}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: id !== undefined,
    onSuccess: (data) => {
      queryClient.invalidateQueries("getAllInvestment");
    },
  });

  const handleDownload = (pdf) => { };

  return (
    <div>
      <section className="min-h-[90vh] flex">
        <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
          <div className="p-2 my-2 !py-2  ">
            <div className="space-y-2">
              <div
                className={`
                  flex  rounded-md items-center px-2 outline-none border-gray-200 border-[.5px]  bg-white py-1 md:py-[6px]`}
              >
                <Search className="text-gray-700 md:text-lg !text-[1em]" />

                <input
                  type={"test"}
                  onChange={(e) => setSearchEmp(e.target.value)}
                  placeholder={"Search Employee"}
                  className={`border-none w-full outline-none px-2  `}
                />
              </div>
            </div>
          </div>

          {empLoading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress />
            </div>
          ) : empData?.length < 1 ? (
            <h1 className="px-6 text-lg text-center">No declarations</h1>
          ) : (
            empData?.length > 0 &&
            empData
              ?.filter((item) => {
                return searchEmp
                  ? item.empId?.first_name
                    .toLowerCase()
                    .includes(searchEmp.toLowerCase()) ||
                  item.empId?.last_name
                    .toLowerCase()
                    .includes(searchEmp.toLowerCase())
                  : item.empId;
              })
              .map((ele) => (
                <Link
                  to={`/notification/income-tax/${ele.empId._id}`}
                  className={` px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50
                ${ele.empId._id === id &&
                    "bg-blue-500 text-white hover:!bg-blue-300 "
                    }
                `}
                >
                  <Avatar />
                  <div>
                    <h1 className="text-[1.2rem]">
                      {ele.empId?.first_name} {ele?.empId.last_name}
                    </h1>
                    <h1
                      className={`text-sm text-gray-500  ${ele.empId._id === id && "text-white"
                        }`}
                    >
                      {ele.empId.email}
                    </h1>
                  </div>
                </Link>
              ))
          )}
        </article>

        <article
          className={`md:w-[75%] w-full flex flex-col min-h-[90vh] border-l-[.5px]  bg-gray-50 ${!id && "md:!flex !hidden"
            }`}
        >
          <div className="px-4 pt-2">
            <HeadingOneLineInfo
              heading={"Employee Declarations"}
              info={
                "Here accoutant can able to view employee declarations and approvals"}
            /></div>
          {empDataLoading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress />
            </div>
          ) : id ? (
            empTDSData?.length <= 0 || empTDSData?.investment?.length <= 0 ? (
              <div className="flex px-4 w-full items-center my-4">
                <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                  <Info /> No declarations found
                </h1>
              </div>
            ) : (
              <>

                <div className="px-4 overflow-x-auto">
                  <table className=" table-auto border  border-collapse min-w-full bg-white  text-left  !text-sm font-light">
                    <thead className="border-b bg-gray-100  font-bold">
                      <tr className="!font-semibold ">
                        <th
                          scope="col"
                          className="!text-center px-2 leading-7 text-[16px] w-max py-3 border"
                        >
                          Sr. No
                        </th>
                        <th
                          scope="col"
                          className="py-3 leading-7 text-[16px] px-2 border"
                        >
                          Declaration Name
                        </th>

                        <th
                          scope="col"
                          className="py-3 leading-7 text-[16px] px-2 border"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="py-3 leading-7 text-[16px] px-2 border"
                        >
                          Proofs
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-2 leading-7 text-[16px] border"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {empTDSData?.investment?.map((item, itemIndex) => (
                        <tr
                          className={`!font-medium h-14 border-b 
                
                `}
                          key={itemIndex}
                        >
                          <td className="!text-center px-2 leading-7 text-[16px] w-[80px] border ">
                            {itemIndex + 1}
                          </td>
                          <td className="leading-7 text-[16px] truncate text-left w-[500px] border px-2">
                            <p>{item.name}</p>
                          </td>

                          <td className=" text-left !p-0 w-[200px] border ">
                            <p
                              className={`
                     
                        px-2 leading-7 text-[16px]`}
                            >
                              INR {parseFloat(item.declaration).toFixed(2)}
                            </p>
                          </td>
                          <td className=" text-left !p-0 w-[200px] border ">
                            <p
                              className={`
                     
                        px-2 leading-7 text-[16px]`}
                            >
                              {item.proof ? (
                                <div
                                  onClick={() => handlePDF(item.proof)}
                                  className="px-2 flex gap-2 items-center h-max w-max  cursor-pointer"
                                >
                                  <Article className="text-blue-500" />
                                  <h1>View Proof</h1>
                                </div>
                              ) : (
                                "No Proof Found"
                              )}
                            </p>
                          </td>
                          <td className=" text-left !px-2 w-[200px] border ">
                            <Tooltip title="Accept declaration">
                              <IconButton
                                onClick={() => {
                                  setInvestment(item);
                                  setOpen(true);
                                  setIsReject(false);
                                }}
                              >
                                <CheckCircle color="success" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject declaration">
                              <IconButton
                                onClick={() => {
                                  setInvestment(item);
                                  setOpen(true);
                                  setIsReject(true);
                                }}
                              >
                                <Cancel color="error" />
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )
          ) : (
            <div className="md:flex hidden  px-4 w-full items-center my-4">
              <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> Select employee to see their declarations
              </h1>

              {/* <img
                src="https://aegis-dev.s3.ap-south-1.amazonaws.com/remote-punching/65d86569d845df6738f87646/5f0cbf6977b8cc2f3661247706171db7"
                alt="none"
                height={500}
              /> */}
            </div>
          )}
        </article>
      </section>
      <TDSDeclarationModel
        open={open}
        empId={id}
        handleClose={handleClose}
        isReject={isReject}
        investment={investment}
      />

      <Dialog open={pdf !== null} onClose={handleClosePDF}>
        <DialogTitle className="flex justify-between items-center">
          <h1>Document</h1>
          <IconButton onClick={handleClosePDF}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="scrollt ">
            <object
              type="application/pdf"
              data={`${pdf}`}
              alt="none"
              aria-label="pdfSalary"
              className="min-h-[60vh] !w-[400px] "
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => handleDownload(pdf)}>
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeclarationPage;
