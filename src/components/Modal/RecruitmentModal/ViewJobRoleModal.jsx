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

const ViewJobRoleModal = ({ handleClose, open, data }) => {
  console.log(data);
  const jobDescription = DOMPurify.sanitize(data?.job_description);
  const rolesResponsibility = DOMPurify.sanitize(data?.role_and_responsibility);

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
            <h1 className="text-xl pl-5 font-semibold font-sans">
              Job Details
            </h1>
            <CloseIcon onClick={handleClose} />
          </div>

          <div className="px-10 space-y-4 mt-4">
            {data && data !== undefined && data !== null && (
              <div>
                <p> {data?.experience_level}</p>
                <p>{2}</p>
                <p>{data?.from}</p>
                <p>{data?.location_name?.city}</p>
                <p>
                  {data?.required_skill.map((skill) => skill.label).join(", ")}
                </p>
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                  Job description:
                </p>
                <div dangerouslySetInnerHTML={{ __html: jobDescription }}></div>
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                  Roles and Responsibility:
                </p>
                <div
                  dangerouslySetInnerHTML={{ __html: rolesResponsibility }}
                ></div>
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                  Industry Type:
                </p>
                <p>It Software</p>
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                  Department:
                </p>
                <p>{data?.department_name?.departmentName}</p>
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>Role:</p>
                <p>{data?.position_name}</p>
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                  Employement Type:
                </p>
                <p>{data?.job_type?.label}</p>
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                  Job Level:
                </p>
                <p>{data?.job_level?.label}</p>
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                  Education:
                </p>
                <p>{data?.education}</p>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ViewJobRoleModal;
