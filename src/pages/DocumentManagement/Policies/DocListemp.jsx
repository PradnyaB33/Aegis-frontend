


import { DeleteOutline, EditOutlined, Visibility } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";



// Helper function to compare the applicableDate with today's date
const isActiveStatus = (applicableDate) => {
  const currentDate = new Date();
  const applicableDateObj = new Date(applicableDate);
  return applicableDateObj >= currentDate ? "Inactive" : "Active";
};

const DocListemp = ({ data, onEdit, onDelete, onViewPDF }) => {
  const handleEdit = (id) => {
    onEdit(id);
  };

  const handleDelete = (id) => {
    onDelete(id);
  };

  const handleViewPDF = (url) => {
    onViewPDF(url); // Calls the function passed via props to open the PDF URL
  };

  return (
    <div className="w-full">
      <div className="w-full"></div>
      <table className="min-w-full bg-white text-left !text-sm font-light">
        <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
          <tr className="!font-semibold">
            <th scope="col" className="!text-left pl-8 py-3 w-1/4">
              Sr. No
            </th>
            <th scope="col" className="py-3 w-1/4">
              Title
            </th>
            <th scope="col" className="py-3 w-1/4">
              Status
            </th>
    
            <th scope="col" className="py-3 w-1/4 !text-right pr-14">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, idx) => (
            <tr className="!font-medium border-b" key={idx}>
              <td className="!text-left pl-9 w-1/4">{idx + 1}</td>
              <td className="py-3 text-left w-1/4">{item.title}</td>
              <td className="py-3 text-left w-1/4">{isActiveStatus(item.applicableDate)}</td>
              <td className="text-right pr-4 w-1/4">
              <IconButton
                  color="primary"
                  aria-label="view"
                  onClick={() => handleViewPDF(item.url)} // Trigger PDF view when clicked
                >
                  <Visibility /> {/* Eye symbol */}
                </IconButton>
                <IconButton
                  color="primary"
                  aria-label="edit"
                  onClick={() => handleEdit(item._id)}
                >
                  <EditOutlined />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(item._id)}
                  aria-label="delete"
                >
                  <DeleteOutline />
                </IconButton>
              
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocListemp;
