import { Avatar, CircularProgress } from "@mui/material";
import axios from "axios";
import OrgTree from "react-org-tree";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import BoxComponent from "../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../components/HeadingOneLineInfo/HeadingOneLineInfo";
import useAuthToken from "../hooks/Token/useAuth";

export default function OrgChart() {
  const { organizationId } = useParams();
  const authToken = useAuthToken();
  const { data: orgChart, isLoading } = useQuery("orgChart", async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/getOrgTree/${organizationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return data;
  });

  const data = !isLoading ? orgChart : [];

  return (
    <>
      <BoxComponent>
        <HeadingOneLineInfo heading={"Organisation Hierarchy"} />
        <div className="">
          <div className="overflow-x-auto  ">
            {isLoading ? (
              <CircularProgress />
            ) : (
              <div className="flex overflow-x-auto  !bg-[#F9FAFC] w-full justify-center my-10">
                <div className="overflow-x-auto">
                  <OrgTree
                    expandAll={true}
                    data={data}
                    horizontal={false}
                    collapsable={true}
                    labelClassName="!p-0 !m-0 !shadow-none !bg-transparent"
                    renderContent={(data) => {
                      return (
                        <div
                          className={` border bg-white !text-gray-900 rounded-md !p-4  !px-12`}
                        >
                          <div className="flex  items-center gap-2">
                            <Avatar
                              src={data.image}
                              sx={{ width: 40, height: 40 }}
                            />
                            <div>
                              <h1 className=" flex text-lg font-medium gap-2">
                                {data.title}
                              </h1>
                              <p className="text-sm text-gray-600 ">
                                {data.name}
                              </p>
                              <p className="text-sm text-gray-600 ">
                                {data?.desg}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </BoxComponent>
    </>
  );
}
