import { Tab } from "@headlessui/react";
import { useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs() {
  let [categories] = useState({
    Recent: [
      {
        id: 1,
        title: "Employee one has raised a leave request",
        date: "5h ago",
        status: "Pending",
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: "2h ago",
        status: "Accpted",
        shareCount: 2,
      },
    ],
    Archived: [
      {
        id: 1,
        title: "Is tech making coffee better or worse?",
        date: "Jan 7",
        status: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: "The most innovative things happening in coffee",
        date: "Mar 19",
        status: 24,
        shareCount: 12,
      },
    ],
  });

  return (
    <div className="w-full !h-max bg-gray-50 rounded-lg  shadow-lg max-w-md py-0  sm:px-0">
      {/* <h1 className="text-black text-xl px-3 mb-2">Notification</h1> */}
      <Tab.Group>
        <Tab.List className="flex px-3 py-2 space-x-1 rounded-xl bg-gray-200 p-1">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5  text-sm font-medium leading-5",

                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "!text-black hover:bg-gray-50 "
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((posts, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames("rounded-xl  bg-gray-50 p-3")}
            >
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="relative  rounded-md px-3 hover:bg-gray-100"
                  >
                    <h1 className="text-md  text-black font-medium leading-5">
                      {post.title}
                    </h1>

                    <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                      <li>{post.date}</li>
                      <li>&middot;</li>
                      <li>{post.status}</li>
                      {/* <li>&middot;</li> */}
                    </ul>

                    {post.status === "Pending" && (
                      <div className="flex gap-3 mt-3">
                        <button className="bg-red-500 p-1 px-2 rounded-md !text-xs">
                          Reject
                        </button>
                        <button className="bg-green-500 p-1 px-2 rounded-md !text-xs">
                          Accept
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
