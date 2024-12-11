import {
  CheckCircleOutlineOutlined,
  EventNote,
  PlayCircleOutlineOutlined,
  Warning,
} from "@mui/icons-material";
import { Box, Modal } from "@mui/material";
import React from "react";
import EmployeeTable from "./components/table";
import Modal1 from "./miniform/page1/page";
import useGetUpcomingTrainings from "./miniform/page1/use-query";
import Modal2 from "./miniform/page2/page";
import useGetOngoingTrainings from "./miniform/page2/use-query-page2";
import Modal3 from "./miniform/page3/page";
import useGetOverdueTrainings from "./miniform/page3/use-query-page3";
import Modal4 from "./miniform/page4/page";
import useGetCompletedTraining from "./miniform/page4/use-query-page3";
import TextFiledColumn from "./miniform/text-filed";
import useTrainingFormEmployee from "./my-training-use-query";

const MyTraining = () => {
  const { data, setPage, isLoading, page } = useTrainingFormEmployee();
  const { data: upcomingTraining } = useGetUpcomingTrainings();
  const { data: ongoingTraining } = useGetOngoingTrainings();
  const { data: overdueTraining } = useGetOverdueTrainings();
  const { data: completedTraining } = useGetCompletedTraining();
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);

  return (
    <div className="pt-14 p-8">
      <div className="flex flex-col gap-8 w-full border-b-2 border-dashed pb-8 mb-8">
        <h1 className="font-bold text-2xl">My Training</h1>
        <div className="flex justify-between w-full">
          <TextFiledColumn
            setOpen={setOpen}
            length={upcomingTraining?.data?.length}
            text={"Upcoming Trainings"}
            Icon={EventNote}
            className={"!bg-blue-500 !hover:bg-blue-600"}
          />
          <TextFiledColumn
            setOpen={setOpen2}
            length={ongoingTraining?.data?.length}
            text={"Ongoing Trainings"}
            className={"!bg-green-500 !hover:bg-screen-600"}
            Icon={PlayCircleOutlineOutlined}
          />
          <TextFiledColumn
            setOpen={setOpen3}
            length={overdueTraining?.data?.length}
            text={"Overdue training"}
            className={"!bg-red-500 !hover:bg-red-600"}
            Icon={Warning}
          />
          <TextFiledColumn
            setOpen={setOpen4}
            length={completedTraining?.data?.length}
            text={"Completed training"}
            className={"!bg-gray-500 !hover:bg-red-600"}
            Icon={CheckCircleOutlineOutlined}
          />
        </div>
      </div>
      <EmployeeTable
        data={data?.data}
        setPage={setPage}
        isLoading={isLoading}
        totalResult={data?.totalResults}
        page={page}
      />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] z-10 p-4 bg-white">
          <Modal1 />
        </Box>
      </Modal>
      <Modal
        open={open2}
        onClose={() => setOpen2(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] z-10 p-4 bg-white">
          <Modal2 />
        </Box>
      </Modal>
      <Modal
        open={open3}
        onClose={() => setOpen3(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] z-10 p-4 bg-white">
          <Modal3 />
        </Box>
      </Modal>
      <Modal
        open={open4}
        onClose={() => setOpen4(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] z-10 p-4 bg-white">
          <Modal4 />
        </Box>
      </Modal>
    </div>
  );
};

export default MyTraining;
