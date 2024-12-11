import { Box, Modal } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import DOMPurify from "dompurify";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
  maxHeight: "80vh",
};

const PreviewCommunicationModal = ({ handleClose, open, data }) => {
   console.log(data);
   const sanitizedSubject = DOMPurify.sanitize(data?.subject);
   const sanitizedBody = DOMPurify.sanitize(data?.body);
   const sanitizedSignature = DOMPurify.sanitize(data?.signature);
  
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
        >
          <div className="flex justify-between py-4 items-center px-4">
            <h1 className="text-xl pl-5 font-semibold font-sans">Preview</h1>
            <CloseIcon onClick={handleClose} />
          </div>

          <div className="px-10 space-y-4 mt-4">
            {data && data !== undefined && data !== null && (
              <div>
                <p style={{ fontWeight: "bold" }}>Communication Type:</p>
                <p>
                  {data?.communication?.map((item) => item?.label).join(", ")}
                </p>
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>From:</p>
                <p>{data?.from}</p>
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>To:</p>
                <p>{data?.to?.map((item) => item.label).join(", ")}</p>
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>CC:</p>
                <p>{data?.cc?.map((item) => item.label).join(", ")}</p>
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>BCC:</p>
                <p>{data?.bcc?.map((item) => item.label).join(", ")}</p>
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                  Subject:
                </p>
                <div dangerouslySetInnerHTML={{ __html: sanitizedSubject }}></div>
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>Body:</p>
                <div dangerouslySetInnerHTML={{ __html: sanitizedBody }}></div>
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                  Valediction:
                </p>
                <p>{data?.valediction}</p>
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                  Signature:
                </p>
                <div dangerouslySetInnerHTML={{ __html: sanitizedSignature }}></div>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default PreviewCommunicationModal;
