import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ReusableModal from '../../../components/Modal/component';
import AddDoneTaskModal from './AddDoneTaskModal';
import AddIcon from '@mui/icons-material/Add';
import useSelfieStore from '../../../hooks/QueryHook/Location/zustand-store';
import useLocationMutation from '../../../hooks/QueryHook/Location/mutation';

const AddVisitDetails = () => {

    const [open, setOpen] = useState(false);

    const { start, punchObjectId } = useSelfieStore();

    const { getUserLocation } = useLocationMutation();

    const { data, mutate } = getUserLocation;

    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {

        mutate();

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(

                (position) => {

                    setCurrentLocation({

                        latitude: position.coords.latitude,

                        longitude: position.coords.longitude,

                    });

                },

                (error) => console.error("Error getting location:", error)

            );

        }

    }, [mutate]);

    return (
        <div>
            <Button

                onClick={() => setOpen(true)}

                color="primary"

                variant="contained"

                className="!fixed bottom-40 right-8 !text-white"

                disabled={!start}
            >
                <AddIcon sx={{ mr: 1 }} className={`animate-pulse text-white`} />

                Add visit details
            </Button>
            <ReusableModal

                className='h-[700px]'

                open={open}

                heading={"Add Task Status"}

                subHeading={"Here you can add task status"}

                onClose={() => setOpen(false)}
            >
                <AddDoneTaskModal

                    onClose={() => setOpen(false)}

                    userLocationData={data}

                    currentLocation={currentLocation} // Pass current location

                    punchObjectId={punchObjectId}

                />
            </ReusableModal>
        </div>

    );

};

export default AddVisitDetails;

