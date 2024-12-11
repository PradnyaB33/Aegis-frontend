import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../components/Modal/component";
import {
  LetOutArray,
  OthersArray,
  otherSections,
  SalaryArray,
  section80c,
  section80CCD,
  sectionArray,
  SelfHouseArray,
} from "../data";
import useCreateDeclaration from "../hooks/mutations/useCreateDeclaration";
import BasicButton from "../../../components/BasicButton";

const CreateModal = ({ open, setOpen, investments }) => {
  // zod schema
  const InvestmentSchema = z.object({
    name: z.object({
      label: z.string().nonempty({ message: "Label is required" }),
      value: z.string().nonempty({ message: "Value is required" }),
    }),
    sectionname: z.object({
      label: z.string(),
      value: z.string(),
    }),
    subsectionname: z.object({
      label: z.string(),
      value: z.string(),
    }),
    declaration: z.preprocess((val) => {
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.number().gt(0, { message: "Amount must be greater than zero" })),
    proof: z.instanceof(File).optional(),
  });

  // useFormHook
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(InvestmentSchema),
    defaultValues: {
      name: undefined,
      sectionname: undefined,
      declaration: undefined,
      proof: undefined,
      subsectionname: undefined,
    },
  });

  useEffect(() => {
    if (typeof open === "object") {
      console.log(open);
      setValue("name", { label: open?.name, value: open?.name });
      setValue("declaration", Number(open?.declaration));
      setValue("sectionname", {
        label: open?.sectionname,
        value: open?.sectionname,
      });
      setValue("subsectionname", {
        label: open?.subsectionname ?? "",
        value: open?.subsectionname ?? "",
      });
    }
    //eslint-disable-next-line
  }, [open]);

  const [sectionType, setSectionType] = React.useState([]);
  const [subSectionType, setSubSectionType] = React.useState([]);

  useEffect(
    () => {
      if (watch("sectionname")?.value === "Salary") {
        setSectionType(SalaryArray);
      }

      if (watch("sectionname")?.value === "Others") {
        setSectionType(OthersArray);
      }

      if (watch("sectionname")?.value === "House") {
        setSubSectionType([
          {
            label: "(A) Self Occupied Property (Loss)",
            value: "(A) Self Occupied Property (Loss)",
          },
          {
            label: "(B) Let out property",
            value: "(B) Let out property",
          },
          {
            label: "(C) Let out property",
            value: "(C) Let out property",
          },
        ]);
      }

      if (watch("sectionname")?.value === "SectionDeduction") {
        setSubSectionType([
          {
            label: "80C",
            value: "Section80",
          },
          {
            label: "80 CCD",
            value: "Section 80CCD NPS",
          },
          {
            label: "80D",
            value: "Section80 50000",
          },
        ]);
      }

      if (
        watch("sectionname")?.value === "House" &&
        watch("subsectionname")?.value === "(A) Self Occupied Property (Loss)"
      ) {
        setSectionType(SelfHouseArray);
      }

      if (
        watch("sectionname")?.value === "House" &&
        watch("subsectionname")?.value ===
        ("(C) Let out property" || "(B) Let out property")
      ) {
        setSectionType(LetOutArray);
      }

      if (
        watch("sectionname")?.value === "SectionDeduction" &&
        watch("subsectionname")?.label === "80C"
      ) {
        setSectionType(section80c);
      }
      if (
        watch("sectionname")?.value === "SectionDeduction" &&
        watch("subsectionname")?.label === "80 CCD"
      ) {
        setSectionType(section80CCD);
      }
      if (
        watch("sectionname")?.value === "SectionDeduction" &&
        watch("subsectionname")?.label === "80D"
      ) {
        setSectionType(otherSections);
      }

      if (typeof open !== "object") {
        setSectionType((prev) => {
          return prev?.filter((item) => {
            return !investments?.allInvestment?.some(
              (inv) => item?.value === inv?.name
            );
          });
        });
        setValue("name", { label: "", value: "" });
      }
    },
    // eslint-disable-next-line
    [watch("sectionname"), watch("subsectionname")]
  );

  useEffect(
    () => {
      if (
        (watch("sectionname") !== "House" ||
          watch("sectionname") !== "SectionDeduction") &&
        typeof open !== "object"
      ) {
        setValue("subsectionname", { label: "", value: "" });
      }
    }, // eslint-disable-next-line
    [watch("sectionname")]
  );

  const { createDeclarationMutation } = useCreateDeclaration();

  const onSubmit = (data) => {
    createDeclarationMutation.mutate(data);
  };

  return (
    <>
      <ReusableModal
        open={open}
        onClose={() => setOpen(false)}
        heading={
          typeof open !== "object"
            ? "Create Tax Declaration"
            : "Edit Tax Declaration"
        }
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="flex   w-full bg-white flex-col h-fit gap-1"
        >
          <AuthInputFiled
            name="sectionname"
            control={control}
            type="select"
            readOnly={typeof open === "object"}
            placeholder="Select Section Type"
            label="Select Section Type *"
            options={sectionArray}
            errors={errors}
            error={errors.sectionname}
          />

          {(watch("sectionname")?.value === "SectionDeduction" ||
            watch("sectionname")?.value === "House") && (
              <AuthInputFiled
                name="subsectionname"
                control={control}
                type="select"
                readOnly={typeof open === "object"}
                placeholder="Select Subsection Type"
                label="Select Subsection Type *"
                options={subSectionType}
                errors={errors}
                error={errors.subsectionname}
              />
            )}

          <AuthInputFiled
            name="name"
            control={control}
            type="select"
            placeholder="Select Declaration Type"
            readOnly={typeof open === "object"}
            label="Select Declaration Type *"
            options={sectionType}
            errors={errors}
            error={errors.name}
          />

          <AuthInputFiled
            name="declaration"
            control={control}
            type="string"
            placeholder="Enter Amount"
            label="Enter Amount *"
            errors={errors}
            error={errors.declaration}
          />

          <AuthInputFiled
            name="proof"
            control={control}
            type="Typefile"
            placeholder="Upload Proof"
            label="Upload Proof "
            errors={errors}
            error={errors.name}
          />

          <div className="flex gap-4 w-full justify-end">
            <BasicButton variant="outlined" title={"Cancel"} onClick={() => setOpen(false)} />
            <BasicButton type="Submit" title={"Submit"} />
          </div>
        </form>
      </ReusableModal>
    </>
  );
};

export default CreateModal;
