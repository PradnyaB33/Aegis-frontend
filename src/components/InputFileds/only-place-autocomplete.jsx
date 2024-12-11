import { ErrorMessage } from "@hookform/error-message";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import PlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-places-autocomplete";
import Select from "react-select";

const OnlyPlaceAutoComplete = ({
  className,
  error,
  label,
  control,
  name,
  readOnly,
  Icon,
  placeholder,
  errors,
  apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  center,
}) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [address, setAddress] = useState("");
  const handleSelect = async (option, onChange) => {
    if (option === null) {
      onChange({
        address: "",
        position: center,
      });
    } else {
      const response = await geocodeByPlaceId(option.placeId);

      onChange({
        address: option?.description,
        position: response[0]?.geometry?.location?.toJSON(),
      });
    }
  };

  useEffect(() => {
    let script;
    // Check if script is already loaded
    if (!window.google) {
      script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
    // Cleanup function
    return () => {
      if (script) {
        document.body.removeChild(script);
      }
    };
    // eslint-disable-next-line
  }, []);
  if (!scriptLoaded) {
    return "Loading Script"; // or return a loading spinner
  }
  const handleChange = (address) => {
    setAddress(address);
  };
  return (
    <div className={`space-y-1 min-w-11  ${className}`}>
      <label
        htmlFor={name}
        className={`${
          error && "text-red-500"
        } font-semibold text-gray-500 text-md`}
      >
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        id={name}
        render={({ field }) => (
          <>
            <div
              className={`${
                readOnly && "bg-[ghostwhite]"
              } flex rounded-md px-2 border-gray-200 border-[.5px] bg-white items-center`}
            >
              {Icon && <Icon className="text-gray-700" />}
              <PlacesAutocomplete
                value={address}
                onChange={handleChange}
                onSelect={(value) => handleSelect(value, field.onChange)}
              >
                {({ getInputProps, suggestions, loading }) => {
                  return (
                    <Select
                      isLoading={loading}
                      placeholder={placeholder}
                      defaultValue={{ label: "Select...", value: address }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          borderWidth: "0px",
                          boxShadow: "none",
                        }),
                      }}
                      className={`${
                        readOnly && "bg-[ghostwhite]"
                      } bg-white min-w-44 w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                      components={{
                        IndicatorSeparator: () => null,
                      }}
                      options={suggestions}
                      getOptionLabel={(option) => option.description}
                      getOptionValue={(option) => option.placeId}
                      autoFocus
                      onInputChange={(value) => {
                        getInputProps().onChange({
                          target: { value: value },
                        });
                      }}
                      filterOption={false}
                      onChange={(value) => {
                        handleSelect(value, field.onChange);
                        //   field.onChange(value);
                      }}
                      isClearable={true}
                      isSearchable={true}
                    />
                  );
                }}
              </PlacesAutocomplete>
            </div>
          </>
        )}
      />
      <div className="h-4 !mb-1">
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <p className="text-sm text-red-500">{message}</p>
          )}
        />
      </div>
    </div>
  );
};

export default OnlyPlaceAutoComplete;
