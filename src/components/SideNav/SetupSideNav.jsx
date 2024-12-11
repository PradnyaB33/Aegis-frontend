// import { SettingsOutlined } from "@mui/icons-material";
// import React from "react";
// import { Link, useParams } from "react-router-dom";
// import useSetupSideNav from "../../hooks/Nav/useSetupSideNav";
// import Setup from "../../pages/SetUpOrganization/Setup";

// const SetupSideNav = () => {
//   const { organisationId } = useParams();
//   const { linkData } = useSetupSideNav({organisationId});

//   return (
//     <>
//       <aside className="flex md:hidden   h-max  flex-col items-center border-b justify-center bg-white">
//         <div className="px-4 py-3 gap-4 border-b-[.5px] flex w-full items-center border-gray-300">
//           <div className="rounded-full h-[30px] w-[30px] flex items-center justify-center">
//             <SettingsOutlined className="!text-md text-sky-400 hover:!rotate-180  cursor-pointer" />
//           </div>
//           <h1 className="!text-lg tracking-wide">Setup</h1>
//         </div>
//         {linkData?.map((item, id) => (
//           <Link
//             to={item?.href}
//             key={id}
//             className={`group  ${
//               item.active && "bg-sky-100 !text-blue-500"
//             } hover:bg-sky-100 transition-all  flex w-full items-center text-gray-700   gap-4 px-4 py-3 cursor-pointer `}
//           >
//             <item.icon className="!text-2xl  group-hover:!text-blue-500 !font-thin " />
//             <h1 className="group-hover:!text-blue-500 ">{item?.label} </h1>
//           </Link>
//         ))}
//       </aside>
//       <div className="hidden md:block">
//         <Setup>
//           <article className="SetupSection bg-white w-[80%]  shadow-md rounded-sm border flex items-center h-[80vh] justify-center">
//             <div className="p-4 flex items-center gap-3 w-full border-gray-300 justify-center">
//               <img className="h-[300px]" src="/setup.svg" alt="setup svg" />
//             </div>
//           </article>
//         </Setup>
//       </div>
//     </>
//   );
// };

// export default SetupSideNav;

import { SettingsOutlined } from "@mui/icons-material";
import React from "react";
import { Link, useParams } from "react-router-dom";
import useSetupSideNav from "../../hooks/Nav/useSetupSideNav";
import Setup from "../../pages/SetUpOrganization/Setup";

const SetupSideNav = () => {
  const { organisationId } = useParams();
  const { linkData } = useSetupSideNav({ organisationId });

  return (
    <>
      <aside className="md:hidden flex   h-max  flex-col items-center border-b justify-center bg-white">
        <div className="px-4 py-3 gap-4 border-b-[.5px] flex w-full items-center border-gray-300">
          <div className="rounded-full h-[30px] w-[30px] flex items-center justify-center">
            <SettingsOutlined className="!text-md text-sky-400 hover:!rotate-180  cursor-pointer" />
          </div>
          <h1 className="!text-lg tracking-wide">Setup</h1>
        </div>
        {linkData?.map((item, id) => (
          <Link
            to={item?.href}
            key={id}
            className={`group  ${item.active && "bg-sky-100 !text-blue-500"
              } hover:bg-sky-100 transition-all  flex w-full items-center text-gray-700   gap-4 px-4 py-3 cursor-pointer `}
          >
            <item.icon className="!text-2xl  group-hover:!text-blue-500 !font-thin " />
            <h1 className="group-hover:!text-blue-500 ">{item?.label} </h1>
          </Link>
        ))}
      </aside>
      <div className="md:block hidden">
        <Setup>
          <article className="SetupSection bg-white w-[80%]  shadow-md rounded-sm border flex items-center h-[80vh] justify-center">
            <div className="p-4 flex items-center gap-3 w-full border-gray-300 justify-center">
              <img className="h-[300px]" src="/setup.svg" alt="setup svg" />
            </div>
          </article>
        </Setup>
      </div>
    </>
  );
};

export default SetupSideNav;
