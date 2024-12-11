import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Business,
  EmojiEmotions,
  LocationOn,
  Money,
  LocationSearching,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import BasicButton from "../../../../components/BasicButton";
import useSubscriptionGet from "../../../../hooks/QueryHook/Subscription/hook";
import { useParams } from "react-router-dom";



const organizationSchema = z.object({
  allowance: z.boolean(),
  allowanceQuantity: z.string().refine(
    (doc) => {
      return Number(doc) >= 0 && Number(doc) < 100000;
    },
    {
      message: "The Allowance Quantity must be between 0 and 1,00,000",
    }
  ),
  dualWorkflow: z.boolean(),
  geoFencing: z.boolean(),
  faceRecognition: z.boolean(),
  geoFencingFullskape: z.boolean(),
  notifyWhatsApp: z.boolean().optional(),
});
const MiniForm = ({ data, mutate }) => {
  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      allowance: data?.remotePunchingObject?.allowance || false,
      allowanceQuantity: data?.remotePunchingObject?.allowanceQuantity
        ? `${data?.remotePunchingObject?.allowanceQuantity}`
        : "0",
      dualWorkflow: data?.remotePunchingObject?.dualWorkflow || false,
      geoFencing: data?.remotePunchingObject?.geoFencing || false,
      faceRecognition: data?.remotePunchingObject?.faceRecognition || false,
      geoFencingFullskape: data?.remotePunchingObject?.geoFencingFullskape || false,
      notifyWhatsApp: data?.remotePunchingObject?.notifyWhatsApp || false,
    },
    resolver: zodResolver(organizationSchema),
  });

  const { errors } = formState;

  const onSubmit = (formData) => {
    // Include all conditional fields in the payload
    const payload = {
      ...formData,
      allowanceQuantity: Number(formData.allowanceQuantity), // Convert to number
      // geoFencingFullskape: formData.geoFencingFullskape || false,
      // notifyWhatsApp: formData.geoFencingFullskape || false
    };
    mutate(payload);
  };

  const isAllowanceEnabled = watch("allowance");

  const { organisationId } = useParams();
  const { data: subscriptionData } = useSubscriptionGet({ organisationId });
  const isFullskapePlan = subscriptionData?.organisation?.packageInfo === "Fullskape Plan";

  // return (
  //   <form onSubmit={handleSubmit(onSubmit)}>
  //     <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 p-4 gap-4">
  //       <AuthInputFiled
  //         name="dualWorkflow"
  //         icon={Business}
  //         control={control}
  //         type="checkbox"
  //         placeholder="Dual Workflow"
  //         label="Dual Workflow"
  //         errors={errors}
  //         error={errors.dualWorkflow}
  //         descriptionText={
  //           "Enabling workflow ensures account approval after manager's approval otherwise added directly as allowance."
  //         }
  //       />
  //       <AuthInputFiled
  //         name="allowance"
  //         icon={PriceChangeOutlinedIcon}
  //         control={control}
  //         type="checkbox"
  //         placeholder="Enable Extra Allowance"
  //         label="Enable Extra Allowance"
  //         errors={errors}
  //         error={errors.allowance}
  //         descriptionText={
  //           "Enabling allowance will allow the employee to get extra amount."
  //         }
  //       />
  //       <AuthInputFiled
  //         name="geoFencing"
  //         icon={LocationOn}
  //         control={control}
  //         type="checkbox"
  //         placeholder="Geo Fencing"
  //         label="Geo Fencing"
  //         errors={errors}
  //         error={errors.geoFencing}
  //         descriptionText={
  //           "Enabling Geo Fencing will allow the employee to punch in only from the allowed location."
  //         }
  //       />
  //       <AuthInputFiled
  //         name="faceRecognition"
  //         icon={EmojiEmotions}
  //         control={control}
  //         type="checkbox"
  //         placeholder="Geo Fencing Face Recognition"
  //         label="Geo Fencing Face Recognition"
  //         errors={errors}
  //         error={errors.faceRecognition}
  //         descriptionText={
  //           "Enabling Face Recognition will allow the employee to geo fencing in only after face recognition."
  //         }
  //       />
  //       <AuthInputFiled
  //         name="geoFencingFullskape"
  //         icon={LocationSearching}
  //         control={control}
  //         type="checkbox"
  //         placeholder="Geo Fencing with Fullskape"
  //         label="Geo Fencing with Fullskape"
  //         errors={errors}
  //         error={errors.geoFencingFullskape}
  //         descriptionText={
  //           "Enabling Fullskape will allow notifications via WhatsApp."
  //         }
  //       />
  //       {isAllowanceEnabled && (
  //         <AuthInputFiled
  //           name="allowanceQuantity"
  //           icon={Money}
  //           control={control}
  //           type="number"
  //           placeholder="Allowance"
  //           label="Allowance *"
  //           errors={errors}
  //           error={errors.allowanceQuantity}
  //         />
  //       )}
  //       {isFullskapeEnabled && (
  //         <AuthInputFiled
  //           name="notifyWhatsApp"
  //           control={control}
  //           type="checkbox"
  //           placeholder="WhatsApp Notification"
  //           label="Receive Notification on WhatsApp"
  //           errors={errors}
  //           error={errors.notifyWhatsApp}
  //         />
  //       )}
  //     </div>
  //     <div className="w-full flex justify-end">
  //       <BasicButton type="submit" title="Apply For Changes" />
  //     </div>
  //   </form>
  // );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 p-4 gap-4">
        
      <AuthInputFiled
              name="geoFencing"
              icon={LocationOn}
              control={control}
              type="checkbox"
              placeholder="Geo Fencing"
              label="Geo Fencing"
              errors={errors}
              error={errors.geoFencing}
              descriptionText={
                "Enabling Geo Fencing will allow the employee to punch in only from the allowed location."
              }
            />

        {isFullskapePlan ? (
          <>
            <AuthInputFiled
              name="geoFencingFullskape"
              icon={LocationSearching}
              control={control}
              type="checkbox"
              placeholder="Geo Fencing with Fullskape"
              label="Geo Fencing with Fullskape"
              errors={errors}
              error={errors.geoFencingFullskape}
              descriptionText={
                "Enabling Fullskape will allow notifications via WhatsApp."
              }
            />
           
            <AuthInputFiled
              name="notifyWhatsApp"
              control={control}
              type="checkbox"
              placeholder="WhatsApp Notification"
              label="Receive Notification on WhatsApp"
              errors={errors}
              error={errors.notifyWhatsApp}
            />
          </>
        ) : (
          <>
            <AuthInputFiled
              name="dualWorkflow"
              icon={Business}
              control={control}
              type="checkbox"
              placeholder="Dual Workflow"
              label="Dual Workflow"
              errors={errors}
              error={errors.dualWorkflow}
              descriptionText={
                "Enabling workflow ensures account approval after manager's approval otherwise added directly as allowance."
              }
            />
            <AuthInputFiled
              name="allowance"
              icon={PriceChangeOutlinedIcon}
              control={control}
              type="checkbox"
              placeholder="Enable Extra Allowance"
              label="Enable Extra Allowance"
              errors={errors}
              error={errors.allowance}
              descriptionText={
                "Enabling allowance will allow the employee to get extra amount."
              }
            />
            {isAllowanceEnabled && (
              <AuthInputFiled
                name="allowanceQuantity"
                icon={Money}
                control={control}
                type="number"
                placeholder="Allowance"
                label="Allowance *"
                errors={errors}
                error={errors.allowanceQuantity}
              />
            )}
            <AuthInputFiled
              name="faceRecognition"
              icon={EmojiEmotions}
              control={control}
              type="checkbox"
              placeholder="Geo Fencing Face Recognition"
              label="Geo Fencing Face Recognition"
              errors={errors}
              error={errors.faceRecognition}
              descriptionText={
                "Enabling Face Recognition will allow the employee to geo fencing in only after face recognition."
              }
            />
          </>
        )}
      </div>
      <div className="w-full flex justify-end">
        <BasicButton type="submit" title="Apply For Changes" />
      </div>
    </form>
  );
  
};

export default MiniForm;
