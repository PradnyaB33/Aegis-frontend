import { zodResolver } from "@hookform/resolvers/zod";
import {
  CropFree,
  FactoryOutlined,
  Inventory,
  Numbers,
  RecyclingRounded,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TestContext } from "../../../../State/Function/Main";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../../components/Modal/component";
import { packagesArray } from "../../../AddOrganisation/components/data";
import useManageSubscriptionMutation from "./subscription-mutaiton";

const RenewPackage = ({ handleClose, open, organisation }) => {
  const [amount, setAmount] = React.useState(0);
  const { verifyPromoCodeMutation, renewMutate } =
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
    packages: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .optional(),
  });

  const { control, formState, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      memberCount: `${organisation?.memberCount}`,
      packageInfo: {
        value: organisation?.packageInfo,
        label: organisation?.packageInfo,
      },
      paymentType: undefined,
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
    const getPackagesPrice = packagesArray
      .filter((item) =>
        watch("packages")?.find((pkg) => item?.value === pkg.value)
      )
      .reduce((acc, item) => acc + item.price, 0);

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
        getPackagesPrice +
          perDayValue * employeeToAdd * (cycleCount ?? 1) +
          addedAmountIfRazorPay -
          discountedToMinus
      )
    );
  }, [employeeToAdd, packageInfo, promoCode, paymentType, cycleCount, watch]);

  const { errors } = formState;

  async function onSubmit(data) {
    const upComingDate = new Date(
      organisation?.upcomingPackageInfo?.packageName
    );
    const currentDate = new Date();
    if (
      organisation?.upcomingPackageInfo?.packageName &&
      upComingDate > currentDate
    ) {
      console.log("testing it", organisation?.upcomingPackageInfo);
      // You already have a package waiting to be activated from January 06, 2024 to January 06, 2024. Please wait for it to happen.
      // January 06
      // moment(organisation?.upcomingPackageInfo?.endDate).format("")
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
      let packageStartDate = moment(
        organisation?.subscriptionDetails?.expirationDate
      );

      let packageEndDate = moment().add(3, "months");

      renewMutate({
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
    <ReusableModal
      heading={"Renew Subscription"}
      open={open}
      onClose={handleClose}
    >
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
            placeholder="Employee Count"
            label="Employee Count*"
            errors={errors}
            error={errors.memberCount}
            descriptionText={" Employee count you want to add in your package"}
          />
          <AuthInputFiled
            name="packageInfo"
            icon={Inventory}
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
              },
            ]}
            descriptionText={" Select the package you want to subscribe"}
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
            name="cycleCount"
            icon={RecyclingRounded}
            control={control}
            type="number"
            placeholder="Cycle count used for recycle your subscription"
            label="Cycle Count *"
            errors={errors}
            error={errors.cycleCount}
            descriptionText={
              "Selecting 2 means you'll be charged once for a 6-month subscription, covering two 3-month cycles."
            }
          />
          <AuthInputFiled
            name="paymentType"
            icon={FactoryOutlined}
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

          <AuthInputFiled
            name="promoCode"
            icon={CropFree}
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
            // disabled={organisation?.upcomingPackageInfo?.packageName}
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

export default RenewPackage;
