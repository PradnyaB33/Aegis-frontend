import { PlayArrow } from "@mui/icons-material";
import { Dialog, DialogContent, Fab } from "@mui/material";
import React, { useState } from "react";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
import StopRemotePunching from "./StopRemotePunching";
import useLocationMutation from "./useLocationMutation";
import BasicButton from "../../../components/BasicButton";

export default function StartRemotePunch() {
    const { start, setStart, setStartTime } = useSelfieStore();

    //get user image
    const { getUserImage } = useLocationMutation();

    //state
    const [open, setOpen] = useState(false);

    //handle operate function for face capture
    const handleOperate = () => {
        setOpen(false);
        getUserImage.mutate();
        setStartTime();
    };

    return (
        <>
            {!start ? (
                <Fab
                    onClick={() => setOpen(true)}
                    color="primary"
                    variant="extended"
                    className="!absolute bottom-16 right-12  !text-white"
                >
                    <PlayArrow sx={{ mr: 1 }} className={`animate-pulse text-white`} />
                    Start Remote Punch
                </Fab>
            ) : (
                <StopRemotePunching {...{ setStart }} />
            )}

            {/*confirmation dialog box*/}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    <div className="w-full  text-red-500 ">
                        <h1 className="font-semibold text-2xl">Confirm Action</h1>
                    </div>
                    <h1 className="text-lg ">
                        Are you sure you want to start remote access?
                    </h1>
                    <div className="flex justify-end gap-2 mt-4">
                        <BasicButton title={"Yes"} onClick={handleOperate} />
                        <BasicButton title={"No"} onClick={() => setOpen(false)} color={"danger"} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}