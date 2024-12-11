import { Box, Modal } from "@mui/material";
import React from "react";
import { packageArray } from "../../../utils/Data/data";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  width: "80vw",
  height: "80vh",
};

const PackageInfo = ({ handleClose, open, setPackage, billedPackage }) => {
  console.log();
  return (
    <Modal
      keepMounted={false}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 shadow-md outline-none rounded-md flex flex-col overflow-auto"
      >
        <table className="min-w-full bg-white text-left text-sm font-light">
          <thead className="border-b bg-brand-primary-blue/brand-primary-blue-1 font-bold text-lg dark:border-neutral-500 sticky top-0 text-brand/primary-blue">
            <tr className="!font-bold text-lg">
              <th scope="col" className="px-6 py-3">
                Packages
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Essential
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Basic
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Intermediate
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Enterprise
              </th>
            </tr>
          </thead>
          <tbody className="overflow-y-scroll h-full">
            {packageArray.map((doc, key) => {
              return (
                <tr
                  key={key}
                  className={`bg-gray-50 border-b dark:border-neutral-500 font-bold`}
                >
                  <td className="whitespace-nowrap px-6 py-2 font-bold">
                    {doc.packageName}
                  </td>
                  <td
                    className={`whitespace-nowrap px-6 py-2 text-center ${
                      doc.Essential === "✓" ? "text-black" : "text-red-600"
                    }`}
                  >
                    {doc.Essential === "✓" ? "✓" : "X"}
                  </td>
                  <td
                    className={`whitespace-nowrap px-6 py-2 text-center ${
                      doc.Basic === "✓" ? "text-black" : "text-red-600"
                    }`}
                  >
                    {doc.Basic === "✓" ? "✓" : "X"} 
                  </td>
                  <td
                    className={`whitespace-nowrap px-6 py-2 text-center ${
                      doc.Intermediate === "✓" ? "text-black" : "text-red-600"
                    }`}
                  >
                    {doc.Intermediate === "✓" ? "✓" : "X"}
                  </td>
                  <td
                    className={`whitespace-nowrap px-6 py-2 text-center ${
                      doc.Enterprise === "✓" ? "text-black" : "text-red-600"
                    }`}
                  >
                    {doc.Enterprise === "✓" ? "✓" : "X"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </Modal>
  );
};

export default PackageInfo;
