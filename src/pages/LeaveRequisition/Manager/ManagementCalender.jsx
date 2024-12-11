import React, { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import BasicButton from "../../../components/BasicButton";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import EmployeeListTable from "../../../components/date-picker/components/EmployeeListTable";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

import { useParams } from "react-router-dom";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import DeleteModal from "../components/DeleteModal";
import MachinePunch from "./MachinePunchModal";

const ManagementCalender = () => {
  // const localizer = momentLocalizer(moment);
  const [openDelete, setOpenDelete] = useState(null);
  const [open, setOpen] = useState(false);

  const handleMachineClose = () => {
    setOpen(false);
  };
  const { organisationId } = useParams();

  const { data: org } = useSubscriptionGet({
    organisationId: organisationId,
  });
  return (
    <BoxComponent>
      <div>
        <section className="p-4 md:px-8 px-2 bg-gray-50 md:min-h-[90vh] h-full  ">
          <div className="flex justify-between items-center">
            <HeadingOneLineInfo
              heading="View Employee Attendence"
              info="Here you can view your employee attendance"
            />
            {org?.organisation.isBiometric && (
              <BasicButton
                color={"success"}
                title={"Add Machine Punching"}
                onClick={() => {
                  setOpen(true);
                }}
              />
            )}
          </div>

          <EmployeeListTable />
        </section>

        <DeleteModal
          open={openDelete}
          handleClose={() => setOpenDelete(null)}
          subtitle={"Delete employee attedance"}
        />
      </div>
      <MachinePunch open={open} handleClose={handleMachineClose} />
    </BoxComponent>
  );
};

export default ManagementCalender;
