import React from "react";
import { Link, useParams } from "react-router-dom";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import useSetupSideNav from "../../hooks/Nav/useSetupSideNav";

const Setup = ({ children }) => {
  const { organisationId } = useParams("");
  const { linkData } = useSetupSideNav({ organisationId });

  return (
    <BoxComponent sx={{ p: "0 !important" }}>
      <article className="flex">
        <aside className="h-[90vh] overflow-y-auto scroll md:flex !p-0 !m-0 hidden md:w-[25%] flex-col items-center w-full">
          <div className="w-full">
            <div className=" px-4 py-3 gap-4  border-r  border-b-[.5px] bg-gray-200 flex w-full items-center border-gray-300">
              <h1 className="!text-xl font-bold tracking-tighter">Setup</h1>
            </div>

            {linkData?.map((item, id) => {
              return (
                <Link
                  to={item?.href}
                  key={id}
                  className={` border-r  group ${item.active && "!bg-sky-100 !text-blue-500"
                    } ${item.isVisible !== true && "!hidden"
                    } hover:bg-sky-100 transition-all flex w-full items-center text-gray-700 gap-4 px-4 py-3 cursor-pointer`}
                >
                  <item.icon className="!text-2xl group-hover:!text-blue-500 !font-thin" />
                  <h1 className="group-hover:!text-blue-500">
                    {item?.label}
                  </h1>
                </Link>
              );
            })}
          </div>
        </aside>

        <div className="SetupSection  w-[100%] lg:!w-[80%] md:!w-[75%]   items-center">
          {children}
        </div>
      </article>
    </BoxComponent>
  );
};

export default Setup;
