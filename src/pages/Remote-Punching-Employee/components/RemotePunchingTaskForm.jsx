import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import { TestContext } from "../../../State/Function/Main";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Checkbox, FormControlLabel, Button } from "@mui/material";
import { Email } from "@mui/icons-material";
import dayjs from "dayjs";

const RemotePunchingTaskForm = ({ taskData, onClose }) => {
    const { handleAlert } = useContext(TestContext);
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { organisationId } = useParams();
    const queryCLient = useQueryClient();

    const [showSelectAll, setShowSelectAll] = useState(false);

    const formSchema = z.object({
        title: z.string().min(3, { message: "required" }),
        description: z.string(),
        taskName: z
            .array(
                z.object({
                    label: z.string(),
                    value: z.string(),
                })
            )
            .nonempty({ message: "required" }),
        to: z.array(
            z.object({
                label: z.string(),
                value: z.string(),
            })
        ),
        deadlineDate: z.string().min(1, { message: "Date is required" }),
    });

    const { control, formState: { errors }, handleSubmit, setValue, reset } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: undefined,
            description: undefined,
            taskName: [],
            to: undefined,
            deadlineDate: undefined,
        },
    });

    // Prefill form if taskData is provided (edit mode)
    useEffect(() => {
        if (taskData) {
            reset({
                title: taskData.title,
                description: taskData.description,
                taskName: taskData.taskName.map((task) => ({
                    label: task.taskName,
                    value: task.taskName,
                })),
                to: taskData.to,
                deadlineDate: dayjs(taskData.deadlineDate).format("YYYY-MM-DD"),
            });
        }
    }, [taskData, reset]);

    const onSubmit = (data) => {
        if (taskData) {
            EditTaskInputs.mutate(data);
        } else {
            AddTaskInputs.mutate(data);
        }
    };

    const AddTaskInputs = useMutation(
        async (data) => {
            let newdata = {
                description: data.description,
                title: data.title,
                taskName: data.taskName.map((item) => item.value),
                to: data.to?.map((option) => option),
                deadlineDate: data.deadlineDate,
            };
            await axios.post(
                `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}`,
                newdata,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
        },
        {
            onSuccess: () => {
                handleAlert(true, "success", "Task generated successfully.")
                onClose();
                queryCLient.invalidateQueries("addedTask")
            },
            onError: (err) => {
                handleAlert(true, "error", `Error: ${err}`);
            },
        }
    );

    const EditTaskInputs = useMutation(
        async (data) => {
            let updatedData = {
                description: data.description,
                title: data.title,
                taskName: data.taskName.map((item) => item.value),
                to: data.to?.map((option) => option),
                deadlineDate: data.deadlineDate,
            };
            await axios.put(
                `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}/${taskData._id}`,
                updatedData,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
        },
        {
            onSuccess: () => {
                handleAlert(true, "success", "Task updated successfully.");
                onClose();
                queryCLient.invalidateQueries("addedTask")
            },
            onError: (err) => {
                handleAlert(true, "error", `Error: ${err}`);
            },
        }
    );

    // Get employee data for the "to" field
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

    const employeeEmail = employee
        ? employee.map((emp) => ({
            label: emp.email,
            value: emp.email,
        }))
        : [];

    // Handle "Select All" functionality
    const handleSelectAll = async (fieldName) => {
        await setValue(fieldName, employeeEmail);
    };

    const handleClose = () => {
        onClose();
    };
    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center gap-4  h-[auto] "
            >
                <div className="w-full">
                    <AuthInputFiled
                        name="title"
                        control={control}
                        type="text"
                        placeholder="Title"
                        label="Enter Title*"
                        readOnly={false}
                        maxLimit={50}
                        errors={errors}
                        error={errors.title}
                    />
                    <AuthInputFiled
                        name="description"
                        control={control}
                        type="textarea"
                        placeholder="Description"
                        label="Enter Description*"
                        maxLimit={1000}
                        errors={errors}
                        error={errors.description}
                    />
                    <AuthInputFiled
                        name="taskName"
                        icon={AssignmentIcon}
                        control={control}
                        type="autocomplete"
                        placeholder="Add Task"
                        label="Add Task*"
                        readOnly={false}
                        maxLimit={15}
                        errors={errors}
                        error={errors.taskName}
                    />
                    <AuthInputFiled
                        name="deadlineDate"
                        control={control}
                        type="date"
                        placeholder="dd-mm-yyyy"
                        label="Date*"
                        errors={errors}
                        error={errors.deadlineDate}
                        min={new Date().toISOString().slice(0, 10)}
                    />
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
                    <AuthInputFiled
                        name="to"
                        icon={Email}
                        control={control}
                        type="autocomplete"
                        placeholder="To"
                        label="To*"
                        maxLimit={15}
                        errors={errors}
                        optionlist={employeeEmail ? employeeEmail : []}
                        error={!!errors.to}
                        helperText={errors.to ? errors.to.message : ""}
                    />
                    <div className="flex justify-end gap-2">
                        <Button color="error" variant="outlined" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained">
                            {taskData ? "Update" : "Submit"}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default RemotePunchingTaskForm;

