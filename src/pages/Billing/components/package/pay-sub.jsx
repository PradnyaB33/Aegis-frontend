import { zodResolver } from "@hookform/resolvers/zod";
import {
  FactoryOutlined,
  Numbers,
  RecyclingRounded,
} from "@mui/icons-material";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TestContext } from "../../../../State/Function/Main";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../../components/Modal/component";
import useManageSubscriptionMutation from "./subscription-mutaiton";
import BasicButton from "../../../../components/BasicButton";

const PaySubscription = ({ handleClose, open, organisation }) => {
  const [amount, setAmount] = React.useState(0);
  const { verifyPromoCodeMutation, payMutate } =
    useManageSubscriptionMutation();
  const { handleAlert } = useContext(TestContext);

  const packageSchema = z.object({
    memberCount: z
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
    cycleCount: z.string().refine((doc) => Number(doc) > 0, {
      message: "Cycle Count is greater than 0",
    }),
  });

  const { control, formState, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      memberCount: `${organisation?.memberCount}`,
      packageInfo: {
        value: organisation?.packageInfo,
        label: organisation?.packageInfo,
      },
      paymentType: "RazorPay",
      discount: 0,
      cycleCount: `${organisation?.cycleCount}`,
    },
    resolver: zodResolver(packageSchema),
  });
  const packageInfo = watch("packageInfo").value;
  const employeeToAdd = Number(watch("memberCount"));
  const paymentType = watch("paymentType");
  const promoCode = watch("discount");
  const cycleCount = Number(watch("cycleCount"));

  useEffect(() => {
    let perDayValue = 0;
    if (packageInfo === "Basic Plan") {
      perDayValue = 55;
    } else if (packageInfo === "Intermediate Plan") {
      perDayValue = 85;
    } else {
      perDayValue = 115;
    }
    // apply discount if promo code is valid
    let discountedToMinus = perDayValue * employeeToAdd * (promoCode / 100);

    let addedAmountIfRazorPay =
      perDayValue * employeeToAdd * (paymentType === "RazorPay" ? 0.02 : 0);

    setAmount(
      Math.round(
        perDayValue * employeeToAdd * (cycleCount ?? 1) +
        addedAmountIfRazorPay -
        discountedToMinus
      )
    );
  }, [employeeToAdd, packageInfo, promoCode, paymentType, cycleCount]);

  const { errors } = formState;

  async function onSubmit(data) {
    if (organisation?.upcomingPackageInfo?.packageName) {
      // You already have a package waiting to be activated from January 06, 2024 to January 06,
      handleAlert(
        true,
        "warning",
        `You already have a package waiting to be activated from ${moment(
          organisation?.upcomingPackageInfo?.startDate
        ).format("MMMM DD, YYYY")} to ${moment(
          organisation?.upcomingPackageInfo?.endDate
        ).format("MMMM DD, YYYY")} please wait for it to be activated.`
      );
    } else {
      let packageStartDate = moment();

      let packageEndDate = packageStartDate.clone().add(3, "months");
      console.log(
        `🚀 ~ file: pay-sub.jsx:119 ~ packageStartDate:`,
        packageStartDate
      );
      console.log(
        `🚀 ~ file: pay-sub.jsx:117 ~ packageEndDate:`,
        packageEndDate
      );

      payMutate({
        memberCount: data?.memberCount,
        packageName: data?.packageInfo?.value,
        totalPrice: amount,
        paymentType: data?.paymentType,
        organisationId: organisation?._id,
        packageStartDate,
        packageEndDate,
      });
    }
  }

  return (
    <ReusableModal heading={"Payment"} open={open} onClose={handleClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="overflow-auto h-full gap-4 flex-col flex"
      >
        <div className="flex flex-col">
          <AuthInputFiled
            name="memberCount"
            icon={Numbers}
            control={control}
            type="number"
            placeholder="Employee To Add"
            label="Employee To Add *"
            errors={errors}
            error={errors.memberCount}
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
              { value: "Intermediate Plan", label: "Intermediate Plan" },
              {
                value: "Basic Plan",
                label: "Basic Plan",
              },
            ]}
          />
          <AuthInputFiled
            name="cycleCount"
            icon={RecyclingRounded}
            control={control}
            type="number"
            placeholder="Cycle count used for recycle your subscription"
            label="Cycle Count *"
            errors={errors}
            error={errors.cycleCount}
            descriptionText={
              "if you select 2 then you will be charged every 3 months subscription with 2 cycle it mean it will be 6 months subscription just amount will be charged one time."
            }
          />
          <AuthInputFiled
            name="paymentType"
            icon={FactoryOutlined}
            control={control}
            type="naresh-select"
            placeholder="Select Your Merchant"
            label="Payment Gateway *"
            errors={errors}
            error={errors.paymentType}
            options={[
              { value: "Phone_Pay", label: "Phone_Pay" },
              { value: "RazorPay", label: "RazorPay" },
            ]}
            descriptionText={"Additional 2% charges on every transaction"}
          />

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
          {/* <Button
            variant="contained"
            // disabled={organisation?.upcomingPackageInfo?.packageName}
            type="submit"
            className="!w-full"
          >
            Pay {amount} Rs
          </Button> */}
          <div className="w-full">
            <BasicButton className="!w-[100%]" type="submit" title={`Pay ₹ ${amount}`} />
          </div>

        </div>
      </form>
    </ReusableModal>
  );
};

export default PaySubscription;
