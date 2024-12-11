import { zodResolver } from "@hookform/resolvers/zod";
import {
  Business,
  Contacts,
  CropDin,
  DriveFileRenameOutline,
  Flag,
  PinDrop,
  RecentActors,
  SouthAmerica,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { City, Country, State } from "country-state-city";
import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../../components/Modal/component";

const LocationAdd = ({ open, onClose, addLocationMutation }) => {
  const { organisationId } = useParams();
  const formSchema = z.object({
    country: z.string(),
    state: z.string(),
    city: z.string(),
    shortName: z.string(),
    continent: z.string(),
    pinCode: z.string().regex(/^\d{6}$/, "Pin code must be 6 digits"),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    organizationId: z.string(),
  });

  const { handleSubmit, formState, watch, control, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationId: organisationId,
    },
  });

  const closedAndReset = () => {
    onClose();
    reset();
  };
  const { errors } = formState;
  console.log(`🚀 ~ file: location-edit.jsx:30 ~ errors:`, errors);
  const onSubmit = async (data) => {
    console.log(data);
    addLocationMutation({ data, onClose: closedAndReset });
  };

  const selectedCountryCode = Country.getAllCountries().find(
    (country) => country.name === watch("country")
  )?.isoCode;

  const stateCode = State.getStatesOfCountry(selectedCountryCode)?.find(
    (state) => state.name === watch("state")
  )?.isoCode;

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      heading={"Add Location"}
      subHeading={"Add a new location to your organisation"}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <AuthInputFiled
          name="continent"
          icon={SouthAmerica}
          control={control}
          type="naresh-select"
          placeholder="Continent"
          label="Continent *"
          errors={errors}
          error={errors.continent}
          options={[
            { label: "Asia", value: "Asia" },
            { label: "Africa", value: "Africa" },
            { label: "Europe", value: "Europe" },
            { label: "North America", value: "North America" },
            { label: "South America", value: "South America" },
            { label: "Australia", value: "Australia" },
            { label: "Antarctica", value: "Antarctica" },
          ]}
        />
        <AuthInputFiled
          name="country"
          icon={Flag}
          control={control}
          type="naresh-select"
          placeholder="Country"
          label="Country *"
          errors={errors}
          error={errors.country}
          options={Country.getAllCountries().map((country) => ({
            label: country.name,
            value: country.name,
          }))}
        />
        <AuthInputFiled
          name="state"
          icon={CropDin}
          control={control}
          type="naresh-select"
          placeholder="State"
          label="State *"
          errors={errors}
          error={errors.state}
          options={State.getStatesOfCountry(selectedCountryCode)?.map(
            (state) => ({
              label: state.name,
              value: state.name,
            })
          )}
        />
        <AuthInputFiled
          name="city"
          icon={Business}
          control={control}
          type="naresh-select"
          placeholder="City"
          label="City *"
          errors={errors}
          error={errors.city}
          options={City.getCitiesOfState(selectedCountryCode, stateCode).map(
            (city) => ({
              label: city.name,
              value: city.name,
            })
          )}
        />
        <AuthInputFiled
          name="shortName"
          icon={DriveFileRenameOutline}
          control={control}
          type="text"
          placeholder="Short Name"
          label="Short Name *"
          errors={errors}
          error={errors.shortName}
        />
        <AuthInputFiled
          name="pinCode"
          icon={PinDrop}
          control={control}
          type="number"
          placeholder="Pin Code"
          label="Pin Code *"
          errors={errors}
          error={errors.pinCode}
        />
        <AuthInputFiled
          name="addressLine1"
          icon={Contacts}
          control={control}
          type="text"
          placeholder="Address Line 1"
          label="Address Line 1 *"
          errors={errors}
          error={errors.addressLine1}
        />
        <AuthInputFiled
          name="addressLine2"
          icon={RecentActors}
          control={control}
          type="text"
          placeholder="Address Line 2"
          label="Address Line 2"
          errors={errors}
          error={errors.addressLine2}
        />
        <Button fullWidth type="submit" variant="contained" color="primary">
          Add Location
        </Button>
      </form>
    </ReusableModal>
  );
};

export default LocationAdd;
