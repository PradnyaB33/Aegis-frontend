import { zodResolver } from "@hookform/resolvers/zod";
import { Email } from "@mui/icons-material";
import { Box, Button, Modal, Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";
import CloseIcon from "@mui/icons-material/Close";
import SubjectIcon from "@mui/icons-material/Subject";
import MessageIcon from "@mui/icons-material/Message";
import EditIcon from "@mui/icons-material/Edit";
import GroupIcon from "@mui/icons-material/Group";
import PreviewCommunicationModal from "./PreviewCommuncationModal";

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

const NewCommunication = ({ handleClose, open, organisationId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const [showSelectAll, setShowSelectAll] = useState(false);

  //for  Get Query to get communication type in organization
  const { data: communicationType } = useQuery(
    ["communication-type", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-communication`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  console.log("communicationType", communicationType);
  const communicationTypes = communicationType
    ? communicationType.map((type) => ({
        label: type.communication[0],
        value: type.communication[0],
        email: type.email,
      }))
    : [];

  //for  Get Query to get employee email of organization
  const { data: employee } = useQuery(
    ["employee", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/${organisationId}/get-emloyee`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.employees;
    }
  );

  console.log("employee", employee);
  const employeeEmail = employee
    ? employee.map((emp) => ({
        label: emp.email,
        value: emp.email,
      }))
    : [];

  const handleSelectAll = (fieldName) => {
    setValue(fieldName, employeeEmail);
  };

  const EmpCommunicationSchema = z.object({
    communication: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    from: z.string().email(),
    to: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    cc: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    bcc: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    subject: z.string(),
    body: z.string(),
    valediction: z.string(),
    signature: z.string(),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      communication: undefined,
      from: undefined,
      to: undefined,
      cc: undefined,
      bcc: undefined,
      subject: undefined,
      body: undefined,
      valediction: undefined,
      signature: undefined,
    },
    resolver: zodResolver(EmpCommunicationSchema),
  });

  const selectedCommunication = useWatch({ control, name: "communication" });
  useEffect(() => {
    if (selectedCommunication && selectedCommunication.length > 0) {
      setValue("from", selectedCommunication[0].email);
    } else {
      setValue("from", "");
    }
  }, [selectedCommunication, setValue]);

  useEffect(() => {
    if (!showSelectAll) {
      setValue("to", []);
    }
  }, [showSelectAll, setValue]);

  // for send
  const SendEmailCommunication = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/sendEmail-communication`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),

    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getEmailCommunication"] });
        handleClose();
        handleAlert(true, "success", " Send communication  successfully");
        reset();
      },
      onError: () => {},
    }
  );
  const onSubmit = async (data) => {
    try {
      await SendEmailCommunication.mutateAsync(data);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "An Error occurred send the communication");
    }
  };

  // for preview data
  const [previewCommunicationModal, setPreviewCommunicationModal] =
    useState(false);
  const [previewData, setPreviewData] = useState(null);
  const handleOpenPreviewCommunicationModal = (data) => {
    setPreviewCommunicationModal(true);
    setPreviewData(data);
  };
  const handleClosePreviewCommunicationModal = () => {
    setPreviewCommunicationModal(false);
  };

  // for save for latter
  const SaveForLatter = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/saveEmail-communication`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),

    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getEmailCommunication"] });
        handleClose();
        handleAlert(true, "success", "Saved communication successfully");
        reset();
      },
      onError: () => {},
    }
  );
  const handleSaveForLater = async (data) => {
    try {
      console.log(data);
      await SaveForLatter.mutateAsync(data);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "An Error occurred  to save communication");
    }
  };

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
          <div className="flex justify-between py-4 items-center  px-4">
            <h1 className="text-xl pl-2 font-semibold font-sans">
              New Communication
            </h1>
            <CloseIcon onClick={handleClose} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-5 space-y-4 mt-4">
              <div className="space-y-2 ">
                <div className="space-y-2 ">
                  <AuthInputFiled
                    name="communication"
                    icon={GroupIcon}
                    control={control}
                    type="autocomplete"
                    placeholder="Communication Type*"
                    label="Communication Type*"
                    readOnly={false}
                    maxLimit={15}
                    errors={errors}
                    error={errors.communication}
                    optionlist={communicationTypes ? communicationTypes : []}
                  />
                </div>
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="from"
                  icon={Email}
                  control={control}
                  type="text"
                  placeholder="From"
                  label="From "
                  errors={errors}
                  error={errors.from}
                />
              </div>

              <div className="space-y-2 ">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showSelectAll}
                      onChange={(e) => setShowSelectAll(e.target.checked)}
                    />
                  }
                  label="Do you want to select all employee emails?"
                />
              </div>

              {showSelectAll && (
                <div className="space-y-2 ">
                  <Button
                    variant="outlined"
                    onClick={() => handleSelectAll("to")}
                  >
                    Select All
                  </Button>
                </div>
              )}

              <div className="space-y-2 ">
                <AuthInputFiled
                  name="to"
                  icon={Email}
                  control={control}
                  type="autocomplete"
                  placeholder="To"
                  label="To"
                  readOnly={false}
                  maxLimit={15}
                  errors={errors}
                  error={errors.to}
                  optionlist={employeeEmail ? employeeEmail : []}
                />
              </div>

              <div className="space-y-2 ">
                <AuthInputFiled
                  name="cc"
                  icon={Email}
                  control={control}
                  type="autocomplete"
                  placeholder="CC"
                  label="CC"
                  errors={errors}
                  error={errors.cc}
                  optionlist={employeeEmail ? employeeEmail : []}
                />
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="bcc"
                  icon={Email}
                  control={control}
                  type="autocomplete"
                  placeholder="BCC"
                  label="BCC"
                  errors={errors}
                  error={errors.bcc}
                  optionlist={employeeEmail ? employeeEmail : []}
                />
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="subject"
                  icon={SubjectIcon}
                  control={control}
                  type="texteditors"
                  placeholder="Subject"
                  label="Subject"
                  errors={errors}
                  error={errors.subject}
                />
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="body"
                  icon={SubjectIcon}
                  control={control}
                  type="texteditor"
                  placeholder="Body"
                  label="Body"
                  errors={errors}
                  error={errors.body}
                />
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="valediction"
                  icon={MessageIcon}
                  control={control}
                  type="text"
                  placeholder="Valediction"
                  label="Valediction"
                  errors={errors}
                  error={errors.valediction}
                />
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="signature"
                  icon={EditIcon}
                  control={control}
                  type="texteditor"
                  placeholder="Signature"
                  label="Signature"
                  errors={errors}
                  error={errors.signature}
                />
              </div>
              <div className="flex gap-4 mt-4 justify-end">
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() =>
                    handleOpenPreviewCommunicationModal(getValues())
                  }
                >
                  Preview
                </Button>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => handleSaveForLater(getValues())}
                >
                  Save for later
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Send
                </Button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>

      <PreviewCommunicationModal
        handleClose={handleClosePreviewCommunicationModal}
        open={previewCommunicationModal}
        data={previewData}
      />
    </>
  );
};

export default NewCommunication;
