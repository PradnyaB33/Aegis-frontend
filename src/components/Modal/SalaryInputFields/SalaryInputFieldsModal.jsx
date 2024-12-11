import { zodResolver } from "@hookform/resolvers/zod";
import { Abc, Description, Money } from "@mui/icons-material";
import { Badge, Box, Button, CircularProgress, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";

export let salaryComponentArray = [
  { label: "Basic", value: "Basic" },
  { label: "HRA", value: "HRA" },
  { label: "DA", value: "DA" },
  { label: "Variable allowance", value: "Variable allowance" },
  { label: "Special allowance", value: "Special allowance" },
  { label: "Travel allowance", value: "Travel allowance" },
  { label: "Food allowance", value: "Food allowance" },
  { label: "Sales allowance", value: "Sales allowance" },
];

export let salaryDeductionArray = [
  { label: "PF", value: "PF" },
  { label: "ESIC", value: "ESIC" },
  { label: "TDS", value: "TDS" },
  { label: "Professional Tax", value: "Professional Tax" },
];

const style = {
  position: "absolute",
  height: "80vh",
  minHeight: "80vh",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
  overflow: "auto",
};

const SalaryInputFieldsModal = ({ handleClose, open, id, salaryId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const descriptionElementRef = React.useRef(null);

  useEffect(
    () => {
      if (open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
          descriptionElement.focus();
        }
      }
    },
    // eslint-disable-next-line
    [open]
  );

  // Get Query
  const { data: empTypeslist } = useQuery("empTypes", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/employment-types-organisation/${id}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  });

  const SalaryTemplateSchema = z.object({
    name: z.string().min(3, { message: "required" }),
    desc: z.string().optional(),
    empTypes: z.object({
      label: z.string(),
      value: z.string(),
    }),
    income: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .nonempty({ message: "required" }),
    deductions: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .nonempty({ message: "required" }),
  });

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SalaryTemplateSchema),
    defaultValues: {
      name: undefined,
      income: [],
      deductions: [],
      empTypes: {},
    },
  });

  const { isFetching } = useQuery(
    ["empType", salaryId],
    async () => {
      if (open && salaryId !== null) {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/salary-template/${salaryId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        return response.data;
      }
    },
    {
      onSuccess: (data) => {
        setValue("name", data.SalarTemplates?.name);
        setValue("desc", data.SalarTemplates?.desc);

        const empType = empTypeslist?.empTypes?.find(
          (item) => item.value === data.SalarTemplates?.item?._id
        );
        if (empType) {
          setValue("empTypes", { label: empType.title, value: empType._id });
        }

        // const values = data?.SalarTemplates
        //   ? data?.SalarTemplates?.salaryStructure.map((item) => ({
        //       label: item?.salaryComponent,
        //       value: item?.salaryComponent,
        //     }))
        //   : [];

        // setValue("salaryStructure", values);
        // Set income and deductions (previous values)
        const incomeComponents =
          data.SalarTemplates?.income.map((component) => ({
            label: component,
            value: component,
          })) || [];
        const deductionComponents =
          data.SalarTemplates?.deductions.map((component) => ({
            label: component,
            value: component,
          })) || [];

        setValue("income", incomeComponents);
        setValue("deductions", deductionComponents);
      },
      enabled: open && salaryId !== null && salaryId !== undefined,
    }
  );

  useEffect(
    () => {
      if (!open) {
        reset({
          name: "",
          salaryStructure: [],
          empTypes: {},
          desc: "",
        });
      }
    },
    // eslint-disable-next-line
    [open]
  );

  const onSubmit = async (data) => {
    if (salaryId) {
      EditSalaryTemplate.mutate(data);
    } else {
      AddSalaryInputs.mutate(data);
    }
  };

  const queryClient = useQueryClient();

  const AddSalaryInputs = useMutation(
    async (data) => {
      let newdata = {
        income: data.income.map((item) => {
          return item.value;
        }),
        deductions: data.deductions.map((item) => {
          return item.value;
        }),
        empType: data.empTypes.value,
        name: data.name,
        desc: data.desc,
      };
      await axios.post(
        `${process.env.REACT_APP_API}/route/salary-template-org/${id}`,
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
        queryClient.invalidateQueries("salaryTemplates");
        handleClose();
        handleAlert(true, "success", "Salary Template generated succesfully.");
      },

      onError: (err) => {
        handleAlert(true, "error", ` error ${err}`);
      },
    }
  );

  const EditSalaryTemplate = useMutation(
    async (data) => {
      let newdata = {
        income: data.income.map((item) => {
          return item.value;
        }),
        deductions: data.deductions.map((item) => {
          return item.value;
        }),
        empType: data.empTypes.value,
        name: data.name,
        desc: data.desc,
      };
      await axios.put(
        `${process.env.REACT_APP_API}/route/salary-template/${salaryId}`,
        newdata,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: async () => {
        handleAlert(true, "success", "Salary Template updated succesfully.");
        handleClose();
        await queryClient.invalidateQueries("salaryTemplates");
      },
      onError: (err) => {
        handleAlert(true, "error", err?.response?.data?.error);
      },
    }
  );

  return (
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
        <div className="flex w-full justify-between py-4 items-center  px-4">
          <h1 className="text-xl pl-2 font-semibold font-sans">
            {salaryId ? "Edit Salary Template" : "Create Salary Template"}
          </h1>
        </div>

        {isFetching ? (
          <CircularProgress />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-5 space-y-4 mt-4"
          >
            <AuthInputFiled
              name="name"
              icon={Abc}
              control={control}
              type="text"
              placeholder="Template Name"
              label="Enter Template Name *"
              readOnly={false}
              maxLimit={35}
              errors={errors}
              error={errors.name}
            />
            <AuthInputFiled
              name="desc"
              icon={Description}
              control={control}
              type="textarea"
              placeholder="Description"
              label="Enter Description"
              readOnly={false}
              max={250}
              maxLimit={250}
              errors={errors}
              error={errors.desc}
            />
            <AuthInputFiled
              name="empTypes"
              icon={Badge}
              options={empTypeslist?.empTypes?.map((item, id) => {
                return {
                  label: item.title,
                  value: item._id,
                };
              })}
              control={control}
              type="select"
              placeholder="Employment Type"
              label="Select Employment Type "
              readOnly={false}
              maxLimit={15}
              errors={errors}
              error={errors.empTypes}
            />

            {/* in update this will removed  */}
            {/* <AuthInputFiled
              name="salaryStructure"
              icon={Money}
              control={control}
              type="autocomplete"
              optionlist={salaryComponentArray}
              placeholder="Salary Component"
              label="Enter Salary Component *"
              readOnly={false}
              maxLimit={15}
              errors={errors}
              error={errors.salaryStructure}
            /> */}

            <AuthInputFiled
              name="income"
              icon={Money}
              control={control}
              type="autocomplete"
              optionlist={salaryComponentArray}
              placeholder="Salary Component"
              label="Enter Income Component *"
              readOnly={false}
              maxLimit={15}
              errors={errors}
              error={errors.salaryStructure}
            />

            <AuthInputFiled
              name="deductions"
              icon={Money}
              control={control}
              type="autocomplete"
              optionlist={salaryDeductionArray}
              placeholder="Salary Component"
              label="Enter Deductions Component *"
              readOnly={false}
              maxLimit={15}
              errors={errors}
              error={errors.salaryStructure}
            />

            <div className="flex justify-end gap-2">
              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>
              {salaryId ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={EditSalaryTemplate.isLoading}
                >
                  {EditSalaryTemplate.isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Apply"
                  )}
                </Button>
              ) : (
                <Button
                  type="submit"
                  // onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  disabled={AddSalaryInputs.isLoading}
                >
                  {AddSalaryInputs.isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    "submit"
                  )}
                </Button>
              )}
            </div>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default SalaryInputFieldsModal;
