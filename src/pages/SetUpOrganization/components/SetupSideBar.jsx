import {
  AddLocationAltOutlined,
  BeachAccessOutlined,
  EventAvailableOutlined,
  PersonAddAlt1Outlined,
  West,
} from "@mui/icons-material";
import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const SetupSideBar = ({ children }) => {
  const location = useLocation();
  const { id } = useParams("");

  const data = [
    { 
      label: "Create Roles",
      icon: PersonAddAlt1Outlined,
      href: `/setup/add-roles/${id}`,
      active: location.pathname === `/setup/add-roles/${id}`,
    },
    {
      label: "Create Leave Types",
      icon: BeachAccessOutlined,

      href: `/organisation/${id}/setup/leave-types`,
      active: location.pathname === `/organisation/${id}/setup/leave-types`,
    },
    {
      label: "Public Holidays",
      icon: BeachAccessOutlined,
      href: "/",
      active: location.pathname === "",
    },
    {
      label: "Create Shift",
      icon: EventAvailableOutlined,
      href: "/",
      active: location.pathname === "",
    },
    {
      label: "Add Location",
      icon: AddLocationAltOutlined,
      href: "/",
      active: location.pathname === "",
    },
  ];

  return (
    <>
      <section ction className="  bg-gray-50 min-h-screen w-full">
        <header className="text-xl w-full pt-6 bg-white shadow-md  font-semibold p-4">
          <Link to={"/"}>
            <West className="mx-4 !text-xl" />
          </Link>
          Organization Setup page
        </header>
        <article className="py-4 px-8 w-full h-full flex gap-4">
          <aside className="w-[20%] h-max flex flex-col items-center shadow-md justify-center bg-white">
            <div className="p-4 border-b-[.5px] w-full border-gray-300">
              <h1 className="!text-lg tracking-wide">Setup</h1>
            </div>

            {data.map((item, id) => (
              <Link
                to={item.href}
                key={id}
                className={`group ${
                  item.active && "bg-sky-100 !text-blue-500"
                }  hover:bg-sky-100 transition-all  flex w-full items-center text-gray-700   gap-4 px-4 py-3 cursor-pointer `}
              >
                <item.icon className="!text-2xl  group-hover:!text-blue-500 !font-thin " />
                <h1 className="group-hover:!text-blue-500 ">{item.label}</h1>
              </Link>
            ))}
          </aside>
          {children}
        </article>
      </section>
    </>
  );
};

export default SetupSideBar;
