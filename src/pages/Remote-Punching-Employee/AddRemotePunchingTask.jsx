import React, { useState } from "react";
import ReusableModal from "../../components/Modal/component";
import RemotePunchingTaskForm from "./components/RemotePunchingTaskForm";
import GetAddedTask from "./components/GetAddedTask";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../components/BasicButton";

const AddRemotePunchingTask = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <BoxComponent>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <HeadingOneLineInfo
                        heading="Remote Punching Task"
                        info="You can assign remote punching task"
                    />
                    <BasicButton
                        title="Add task to employee"
                        onClick={() => setOpen(true)}
                    />
                </div>



                <div className="mt-2 sm:mt-0">

                    <div>
                        <GetAddedTask />
                    </div>
                    <ReusableModal
                        className="h-[600px]"
                        open={open}
                        heading={"Add Remote Punching Task"}
                        subHeading={"Here you can add remote punching task"}
                        onClose={() => setOpen(false)}
                    >
                        <RemotePunchingTaskForm onClose={() => setOpen(false)} />
                    </ReusableModal>
                </div>
            </BoxComponent>
        </>
    );
};

export default AddRemotePunchingTask;
