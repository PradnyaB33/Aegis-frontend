import { zodResolver } from "@hookform/resolvers/zod";
import { FactoryOutlined, Numbers } from "@mui/icons-material";
import { Button } from "@mui/material";
import moment from "moment";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../../components/Modal/component";
import { packagesArray } from "../../../AddOrganisation/components/data";
import useManageSubscriptionMutation from "./subscription-mutaiton";

const UpgradePackage = ({ handleClose, open, organisation }) => {
  const [amount, setAmount] = React.useState(0);
  const { verifyPromoCodeMutation, mutate } = useManageSubscriptionMutation();

  const packageSchema = z.object({
    employeeToAdd: z
      .string()
      .min(0)
      .refine(
        (value) => {
          // spaces not aloud
          value = value.replace(/\s/g, "");
          // check if value is not empty
          return (
            value.length > 0 && !isNaN(Number(value)) && Number(value) >= 0
          );
        },
        { message: "Employee to add should be a greater than 0" }
      ),

    packageInfo: z.object({
      value: z.string(),
      label: z.string(),
      isDisabled: z.boolean().optional(),
    }),
    promoCode: z.string().optional(),
    paymentType: z.enum(["Phone_Pay", "RazorPay"]),
    discount: z.number().optional(),
    packages: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .optional(),
  });

  const { control, formState, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      employeeToAdd: "0",
      packageInfo: {
        value: organisation?.packageInfo,
        label: organisation?.packageInfo,
        isDisabled: false,
      },
      paymentType: undefined,
      discount: 0,
    },
    resolver: zodResolver(packageSchema),
  });

  const { errors } = formState;

  async function onSubmit(data) {
    mutate({
      count: data?.employeeToAdd,
      packageName: data?.packageInfo?.value,
      totalPrice: amount,
      paymentType: data?.paymentType,
      organisationId: organisation?._id,
    });
  }

  const packageInfo = watch("packageInfo").value;
  const employeeToAdd = Number(watch("employeeToAdd"));
  const expirationDate = organisation?.subscriptionDetails?.expirationDate;
  const paymentType = watch("paymentType");

  const promoCode = watch("discount");

  useEffect(() => {
    let perDayValue = 0;
    const getPackagesPrice = packagesArray
      .filter((item) =>
        watch("packages")?.find((pkg) => item?.value === pkg.value)
      )
      .reduce((acc, item) => acc + item.price, 0);
    console.log(`🚀 ~ getPackagesPrice:`, getPackagesPrice);
    let remainingDays = moment(expirationDate).diff(moment(), "days");
    if (packageInfo === "Basic Plan") {
      perDayValue = 0.611;
    } else if (packageInfo === "Intermediate Plan") {
      perDayValue = 0.944;
    } else {
      perDayValue = 1.277;
    }
    // apply discount if promo code is valid
    let discountedToMinus =
      perDayValue * employeeToAdd * remainingDays * (promoCode / 100);

    let addedAmountIfRazorPay =
      perDayValue *
      employeeToAdd *
      remainingDays *
      (paymentType === "RazorPay" ? 0.02 : 0);
    setAmount(
      Math.round(
        getPackagesPrice +
          perDayValue * employeeToAdd * remainingDays -
          discountedToMinus +
          addedAmountIfRazorPay
      )
    );
  }, [
    employeeToAdd,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    watch("packages"),
    watch,
    packageInfo,
    expirationDate,
    promoCode,
    paymentType,
  ]);

  return (
    <ReusableModal
      heading={"Upgrade Subscription"}
      open={open}
      onClose={handleClose}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="overflow-auto h-full gap-4 flex-col flex"
      >
        <div className="flex flex-col">
          <AuthInputFiled
            name="employeeToAdd"
            icon={Numbers}
            control={control}
            type="number"
            placeholder="Employee To Add "
            label="Employee To Add *"
            errors={errors}
            error={errors.employeeToAdd}
            descriptionText={"Here you can add number of employee to add"}
          />
          <AuthInputFiled
            name="packageInfo"
            icon={Numbers}
            control={control}
            type="select"
            placeholder="Package Name "
            label="Package Name *"
            errors={errors}
            error={errors.packageInfo}
            options={[
              { value: "Enterprise Plan", label: "Enterprise Plan" },
              { value: "Intermediate Plan", label: "Intermediate Plan" },
              {
                value: "Basic Plan",
                label: "Basic Plan",
                isDisabled:
                  organisation?.packageInfo === "Intermediate Plan"
                    ? true
                    : false,
              },
            ]}
            descriptionText={"Select your package to upgrade"}
          />

          <AuthInputFiled
            name="paymentType"
            icon={FactoryOutlined}
            className={"mb-4"}
            control={control}
            type="naresh-select"
            placeholder="Select your Merchant"
            label="Payment Gateway *"
            errors={errors}
            error={errors.paymentType}
            options={[
              { value: "Phone_Pay", label: "Phone_Pay" },
              { value: "RazorPay", label: "RazorPay" },
            ]}
            descriptionText={"Additional 2% charges on every transaction"}
          />

          {packageInfo === "Enterprise Plan" && (
            <AuthInputFiled
              name="packages"
              icon={FactoryOutlined}
              control={control}
              type="select"
              isMulti={true}
              options={packagesArray}
              placeholder="Ex: Remote Task"
              label="Select Package Addition "
              errors={errors}
              error={errors.packages}
            />
          )}
          <AuthInputFiled
            name="promoCode"
            icon={Numbers}
            control={control}
            type="input-action"
            placeholder="#summer2021"
            label="Promo Code"
            errors={errors}
            readOnly={watch("discount") > 0}
            error={errors.promoCode}
            descriptionText={
              watch("discount")
                ? `You will get ${watch(
                    "discount"
                  )}% discount on your total amount.`
                : ""
            }
            onInputActionClick={(value) => {
              verifyPromoCodeMutation({ promoCode: value, setValue });
            }}
            onInputActionClear={() => {
              setValue("discount", 0);
              setValue("promoCode", "");
            }}
          />
        </div>
        <div className="gap-4 flex w-full">
          <Button
            variant="contained"
            disabled={amount === 0}
            type="submit"
            className="!w-full"
          >
            Pay {amount} Rs
          </Button>
        </div>
      </form>
    </ReusableModal>
  );
};

export default UpgradePackage;
