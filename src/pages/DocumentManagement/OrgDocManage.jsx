import { Button } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import useGetUser from "../../hooks/Token/useUser";
import DocPreviewModal from "./components/Modal";

const OrgDocManage = () => {
  const { authToken } = useGetUser();
  const [open, setOpen] = useState(false);
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState(""); // State to store the URL of the selected document
  const { data } = useQuery(`getdocsforemp`, async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/org/getdocsforemp`,
      {
        headers: { Authorization: authToken },
      }
    );
    console.log(response.data.documents);
    return response.data.documents;
  });

  const handleOpenModal = (documentUrl) => {
    setSelectedDocumentUrl(documentUrl);
    setOpen(true);
  };

  // Function to handle closing the modal

  return (
    <div className="w-full h-full p-5">
      <div
        style={{
          boxShadow:
            "0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)",
        }}
        className="w-[50%] h-auto pb-4 mt-11 m-auto rounded-lg relative pl-6 pr-6"
      >
        <div>
          <div
            style={{ borderBottom: "2px solid #b8b8b8" }}
            className="text-3xl w-full text-center py-3 mb-5"
          >
            Organisation Documents
          </div>
          {data?.map((document, idx) => (
            <div
              key={idx}
              style={{
                boxShadow:
                  "0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)",
              }}
              className="w-[500px] h-[60px] px-4 m-auto flex gap-6 items-center justify-between mb-4"
            >
              <div className="text-lg">{document.title}</div>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleOpenModal(document.url)}
              >
                SHOW
              </Button>
            </div>
          ))}
        </div>
        <DocPreviewModal
          fileData={selectedDocumentUrl}
          setOpenState={setOpen}
          openState={open}
        />
      </div>
    </div>
  );
};

export default OrgDocManage;
