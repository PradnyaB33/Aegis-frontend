import { Button } from '@mui/material'
import React, { useState } from 'react'
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReusableModal from '../../../components/Modal/component';
import AcceptRejectTaskModal from './AcceptRejectTaskModal';

const TaskListEmployee = () => {

    const [open, setOpen] = useState(false);

    return (
        <div>
            <Button
                onClick={() => setOpen(true)}
                color="primary"
                variant="contained"
                className="!absolute bottom-13 right-12 !text-white"
            >
                <AssignmentIcon sx={{ mr: 1 }} className={`animate-pulse text-white`} />
                Tasks
            </Button>
            <ReusableModal
                className="h-[600px]"
                open={open}
                heading={"Task List"}
                subHeading={"Here you can see task list"}
                onClose={() => setOpen(false)}
            >
                <AcceptRejectTaskModal onClose={() => setOpen(false)} />
            </ReusableModal>
        </div>
    )
}

export default TaskListEmployee
