import { ErrorMessage } from "@hookform/error-message";
import { Close, Send, Visibility, VisibilityOff } from "@mui/icons-material";
import { Avatar, Button, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import moment from "moment";
import { default as React, useMemo } from "react";
import Autocomplete, { usePlacesWidget } from "react-google-autocomplete";
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import Select, { components } from "react-select";
import CreatableSelect from "react-select/creatable";
import Datepicker from "react-tailwindcss-datepicker";
import useEmpState from "../../hooks/Employee-OnBoarding/useEmpState";
import useAuthentication from "../../pages/SignUp/useAuthentication";
import PlaceAutoComplete from "./places-autocomplete";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import Autocomplete from "react-google-autocomplete";

export const CustomOption = ({ data, ...props }) => (
  <components.Option {...props}>
    <div className="flex gap-2">
      <Avatar
        sx={{ width: 30, height: 30 }}
        src={data.image}
        alt={data.label}
      />
      {data.label}
    </div>
  </components.Option>
);

const AuthInputFiled = ({
  label,
  name,
  isMulti,
  icon: Icon,
  optionlist,
  type,
  errors,
  error,
  control,
  maxLimit,
  readOnly = false,
  placeholder,
  options,
  disabled,
  min,
  max,
  className,
  visible,
  setVisible,
  center,
  descriptionText,
  value,
  autoComplete,
  onInputActionClick,
  onInputActionClear,
  isClearable = false,
  useRange = false,
  asSingle = true,
  shouldDisableDate,
}) => {
  const [focusedInput, setFocusedInput] = React.useState(null);
  const { updateField } = useEmpState();
  const { setCountryCode } = useAuthentication();
  


  const handleFocus = (fieldName) => {
    setFocusedInput(fieldName);
  };
  const { ref } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: (place) => console.log(place),
  });

  // specify modules to be included
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ font: [] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],

          [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
          [{ direction: "rtl" }],
          [{ size: ["small", false, "large", "huge"] }],
          ["link", "image", "video"],
          ["clean"],
        ],

        // handlers: {
        //   image: handleClick,
        // },
        history: {
          delay: 500,
          maxStack: 100,
          userOnly: true,
        },
      },
    }),
    []
  );

  if (type === "empselect") {
    return (
      <>
        <div className={`space-y-1 w-full ${className}`}>
          <label
            htmlFor={name}
            className={`${error && "text-red-500"
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
                  className={`${readOnly && "bg-[ghostwhite]"
                    } flex rounded-md px-2 border-gray-200 border-[.5px] bg-white items-center`}
                >
                  <Icon className="text-gray-700 text-sm" />
                  <Select
                    aria-errormessage=""
                    placeholder={placeholder}
                    isMulti={isMulti}
                    components={{
                      Option: CustomOption,
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        borderWidth: "0px",
                        boxShadow: "none",
                      }),
                    }}
                    className={`${readOnly && "bg-[ghostwhite]"
                      } bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                    options={options}
                    value={field?.value}
                    onChange={(value) => {
                      updateField(name, value);
                      field.onChange(value);
                    }}
                  />
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
      </>
    );
  }

  if (type === "calender") {
    return (
      <>
        <div className={`space-y-1 w-full ${className}`}>
          <label
            htmlFor={name}
            className={`${error && "text-red-500"
              } font-semibold text-gray-500 text-md`}
          >
            {label}
          </label>

          <Controller
            control={control}
            name={name}
            id={name}
            render={({ field }) => (
              <div
                className={` flex rounded-md px-2 py-2 border-gray-200 border-[.5px] bg-white items-center`}
              >
                {Icon && <Icon className="text-gray-700 mr-2 text-sm" />}
                <Datepicker
                  inputClassName={"border-none w-full outline-none"}
                  useRange={useRange}
                  asSingle={asSingle ?? "false"}
                  popoverDirection="down"
                  readOnly={true}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  minDate={min}
                  value={field.value}
                />
              </div>
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
      </>
    );
  }

  if (type === "select") {
    return (
      <>
        <div className={`space-y-1 w-full  ${className}`}>
          <label
            htmlFor={name}
            className={`${error && "text-red-500"
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
                  className={`${readOnly && "bg-[ghostwhite]"
                    } flex rounded-md  border-gray-200 border-[.5px] bg-white items-center gap-2`}
                >
                  {Icon && <Icon className="text-gray-700 " />}
                  <Select
                    isClearable={isClearable}
                    id={name}
                    isDisabled={readOnly}
                    placeholder={placeholder}
                    isMulti={isMulti}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        borderWidth: "0px",
                        boxShadow: "none",
                      }),
                      placeholder: (styles) => ({
                        ...styles,
                        padding: "0 10px", // Add padding to the input field
                      }),
                      input: (styles) => ({
                        ...styles,
                        padding: "0 10px", // Add padding to the input field
                      }),
                    }}
                    className={`${readOnly && "bg-[ghostwhite]"
                      } bg-white w-full !outline-none  !shadow-none !border-none !border-0`}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    options={options}
                    value={field?.value}
                    onChange={(value) => {
                      if (value === null) {
                        updateField(name, value);
                        field.onChange({ value: undefined, label: undefined });
                      } else {
                        updateField(name, undefined);
                        field.onChange(value);
                      }
                    }}
                  />
                </div>
              </>
            )}
          />

          <div className="h-4 !mb-1">
            <p className="text-xs pl-2">{descriptionText}</p>
            <ErrorMessage
              errors={errors}
              name={name}
              render={({ message }) => (
                <p className="text-sm text-red-500">{message}</p>
              )}
            />
          </div>

          {/* <div className="h-4 !mb-1">
            <ErrorMessage
              errors={errors}
              name={name}
              render={({ message }) => (
                <p className="text-sm text-red-500">{message}</p>
              )}
            />
          </div> */}
        </div>
      </>
    );
  }

  if (type === "naresh-select") {
    return (
      <>
        <div className={`space-y-1 w-full  ${className}`}>
          <label
            htmlFor={name}
            className={`${error && "text-red-500"
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
                  className={`${readOnly && "bg-[ghostwhite]"
                    } flex rounded-md px-2 border-gray-200 border-[.5px] bg-white items-center`}
                >
                  <Icon className="text-gray-700" />
                  <Select
                    aria-errormessage=""
                    placeholder={placeholder}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        borderWidth: "0px",
                        boxShadow: "none",
                      }),
                    }}
                    defaultInputValue={field.value}
                    className={`${readOnly && "bg-[ghostwhite]"
                      } bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    options={
                      options ||
                      moment
                        .months()
                        .map((month, index) => ({ label: month, value: month }))
                    }
                    onChange={(value) => {
                      field.onChange(value.value);
                    }}
                  />
                </div>
              </>
            )}
          />
          <div className="h-full !mb-1">
            <p className="text-xs pl-2">{descriptionText}</p>
            <ErrorMessage
              errors={errors}
              name={name}
              render={({ message }) => (
                <p className="text-sm text-red-500">{message}</p>
              )}
            />
          </div>
        </div>
      </>
    );
  }
  if (type === "mutltiselect") {
    return (
      <>
        <div className={`space-y-1 w-full  ${className}`}>
          <label
            htmlFor={name}
            className={`${error && "text-red-500"
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
                  className={`${readOnly && "bg-[ghostwhite]"
                    } flex rounded-md px-2 border-gray-200 border-[.5px] bg-white items-center`}
                >
                  <Icon className="text-gray-700" />
                  <Select
                    aria-errormessage="error"
                    placeholder={placeholder}
                    closeMenuOnSelect={false} // Prevent closing on select
                    isMulti
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        borderWidth: "0px",
                        boxShadow: "none",
                      }),
                    }}
                    className={`${readOnly && "bg-[ghostwhite]"
                      } bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    options={options}
                    onChange={(value) => {
                      field.onChange(
                        value.map((item) => {
                          return item.value;
                        })
                      );
                    }}
                  />
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
      </>
    );
  }
  // if (type === "multiselect") {
  //   return (
  //     <>
  //       <div className={`space-y-1 w-full  ${className}`}>
  //         <label
  //           htmlFor={name}
  //           className={`${
  //             error && "text-red-500"
  //           } font-semibold text-gray-500 text-md`}
  //         >
  //           {label}
  //         </label>
  //         <Controller
  //           control={control}
  //           name={name}
  //           id={name}
  //           render={({ field }) => (
  //             <>
  //               <div
  //                 className={`${
  //                   readOnly && "bg-[ghostwhite]"
  //                 } flex rounded-md px-2 border-gray-200 border-[.5px] bg-white items-center`}
  //               >
  //                 <Icon className="text-gray-700" />
  //                 <Select
  //                   aria-errormessage="error"
  //                   placeholder={placeholder}
  //                   isMulti
  //                   closeMenuOnSelect={false} // Prevent closing on select
  //                   styles={{
  //                     control: (styles) => ({
  //                       ...styles,
  //                       borderWidth: "0px",
  //                       boxShadow: "none",
  //                     }),
  //                   }}
  //                   className={`${
  //                     readOnly && "bg-[ghostwhite]"
  //                   } bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
  //                   components={{
  //                     IndicatorSeparator: () => null,
  //                   }}
  //                   options={options}
  //                   value={field?.value}
  //                   onChange={(value) => {
  //                     field.onChange(value);
  //                   }}
  //                 />
  //               </div>
  //             </>
  //           )}
  //         />
  //         <div className="h-4 !mb-1">
  //           <ErrorMessage
  //             errors={errors}
  //             name={name}
  //             render={({ message }) => (
  //               <p className="text-sm text-red-500">{message}</p>
  //             )}
  //           />
  //         </div>
  //       </div>
  //     </>
  //   );
  // }

  if (type === "location-picker") {
    return (
      <PlaceAutoComplete
        {...{
          className,
          error,
          label,
          control,
          name,
          readOnly,
          Icon,
          placeholder,
          options,
          errors,
          center,
          value,
          descriptionText,
        }}
      />
    );
  }
  if (type === "not-select") {
    return (
      <div className={`space-y-1 w-full relative  ${className}`}>
        <label
          htmlFor={name}
          className={`${error && "text-red-500"
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
                className={`${readOnly && "bg-[ghostwhite]"
                  } flex rounded-md px-2 border-gray-200 border-[.5px] bg-white py-[6px]`}
              >
                <Icon className="text-gray-700" />

                <Autocomplete
                  apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                  ref={ref}
                  value={field.value}
                  rows={2}
                  placeholder="Search Places ..."
                  className={`location-search-input ${readOnly && "bg-[ghostwhite]"
                    } border-none bg-white w-full outline-none px-2`}
                  {...field}
                />
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
  }

  if (type === "autocomplete") {
    return (
      <>
        <div className={`space-y-1 w-full  ${className}`}>
          <label
            htmlFor={name}
            className={`${error && "text-red-500"
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
                  className={`${readOnly && "bg-[ghostwhite]"
                    } flex rounded-md px-2 border-gray-200 border-[.5px] !bg-white items-center`}
                >
                  <Icon className="text-gray-700" />
                  <CreatableSelect
                    aria-errormessage="error"
                    options={optionlist}
                    placeholder={placeholder}
                    isMulti
                    isDisabled={readOnly}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        borderWidth: "0px",
                        boxShadow: "none",
                        background: "white",
                      }),
                      menuList: (base) => ({
                        ...base,
                        backgroundColor: "white !important",
                      }),
                    }}
                    className={`${readOnly && "bg-[ghostwhite]"
                      } bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    value={field?.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
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
      </>
    );
  }

  if (type === "checkbox") {
    return (
      <div className={`space-y-1 w-full  ${className}`}>
        <Controller
          control={control}
          name={name}
          id={name}
          render={({ field }) => (
            <div
              className={`${readOnly && "bg-[ghostwhite]"
                } border-gray-200 border-[.5px] bg-white items-center gap-2`}
            >
              {Icon && <Icon className="text-gray-700" />}
              <input
                checked={field.value}
                type={type}
                readOnly={readOnly}
                id={name}
                placeholder={placeholder}
                className={`${readOnly && "bg-[ghostwhite]"
                  } border-none bg-white outline-none px-2`}
                autoComplete={autoComplete ?? "on"}
                {...field}
                disabled={disabled}
                formNoValidate
                shouldDisableDate={shouldDisableDate}
              />
              <label
                htmlFor={name}
                className={`${error && "text-red-500"
                  } font-semibold text-gray-500 text-md`}
              >
                {label}{" "}
                {name === "isChecked" && (
                  <Link
                    target="blank"
                    to="/terms-policy-cookies"
                    className="font-semibold text-blue-500 hover:underline text-md  "
                  >
                    Terms and Conditions
                  </Link>
                )}
              </label>
            </div>
          )}
        />
        <div className="h-4 !mb-1">
          <p className="text-xs pl-2">{descriptionText}</p>
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
  }

  if (type === "Typefile") {
    return (
      <div className={`space-y-1  ${className}`}>
        <label
          htmlFor={name}
          className={`${error && "text-red-500"
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
                onFocus={() => {
                  handleFocus(name);
                }}
                onBlur={() => setFocusedInput(null)}
                className={`${readOnly && "bg-[ghostwhite]"} ${focusedInput === name
                  ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                  : "outline-none border-gray-200 border-[.5px]"
                  } flex  rounded-md items-center px-2   bg-white py-1 md:py-[6px]`}
              >
                {Icon && (
                  <Icon className="text-gray-700 md:text-lg !text-[1em]" />
                )}
                <input
                  type="file"
                  // accept={accept}
                  id="logo_url"
                  maxLength={maxLimit && maxLimit}
                  readOnly={readOnly}
                  placeholder={placeholder}
                  className={`${readOnly && "bg-[ghostwhite]"
                    } border-none bg-white w-full outline-none px-2  `}
                  // {...field}
                  // value={field?.value}
                  onChange={(e) => {
                    field.onChange(e.target.files[0]);
                    console.log(e.target.files[0]);
                  }}
                  formNoValidate
                />
              </div>
            </>
          )}
        />
        <div className="h-4 w-[200px]  !z-50   !mb-1">
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-sm mb-4 relative !bg-white  text-red-500">
                {message}
              </p>
            )}
          />
        </div>
      </div>
    );
  }
  if (type === "textarea") {
    return (
      <div className={`space-y-1  ${className}`}>
        <label
          htmlFor={name}
          className={`${error && "text-red-500"
            } font-semibold  text-gray-500 text-md`}
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
                onFocus={() => {
                  handleFocus(name);
                }}
                onBlur={() => setFocusedInput(null)}
                className={`${readOnly && "bg-[ghostwhite]"} ${focusedInput === name
                  ? "border-blue-500 border-[2px]"
                  : "border-gray-200 border-[.5px]"
                  } flex rounded-md items-center px-2   bg-white py-1 md:py-[6px]`}
              >
                <textarea
                  type={type}
                  rows={3}
                  maxLength={maxLimit && maxLimit}
                  readOnly={readOnly}
                  placeholder={placeholder}
                  className={`${readOnly && "bg-[ghostwhite]"
                    } border-none bg-white w-full outline-none px-2`}
                  {...field}
                  formNoValidate
                  shouldDisableDate={shouldDisableDate}
                />
              </div>
            </>
          )}
        />
        <div className="h-4 w-[200px]  !z-50   !mb-1">
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-sm mb-4 relative  text-red-500">
                {message}
              </p>
            )}
          />
        </div>
      </div>
    );
  }

  if (type === "texteditor") {
    return (
      <div className={`space-y-1 mb-4 h-70 ${className}`}>
        <label
          htmlFor={name}
          className={`${error && "text-red-500"
            } font-semibold  text-gray-500 text-md`}
        >
          {label}
        </label>
        <Controller
          control={control}
          name={name}
          id={name}
          render={({ field }) => (
            <>
              <ReactQuill
                theme="snow"
                value={field.value}
                readOnly={readOnly}
                className={`h-40 ${className}`}
                onChange={field.onChange}
                modules={modules}
              />
            </>
          )}
        />
        <div className="h-4 w-[200px]  !mt-20 !z-50   !mb-4">
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-sm mb-4 relative !bg-white  text-red-500">
                {message}
              </p>
            )}
          />
        </div>
      </div>
    );
  }

  if (type === "textEditor") {
    return (
      <>
        <div>
          <label
            htmlFor={name}
            className={`${error && "text-red-500"
              } font-semibold text-gray-500 text-md `}
          >
            {label}
          </label>
          <Controller
            control={control}
            name={name}
            id={name}
            render={({ field }) => (
              <div>
                <ReactQuill
                  theme="snow"
                  value={field.value}
                  readOnly={readOnly}
                  onChange={field.onChange}
                  modules={modules}
                  style={{ backgroundColor: "white" }}
                />
              </div>
            )}
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-sm text-red-500">{message}</p>
            )}
          />
        </div>
      </>
    );
  }

  if (type === "time") {
    return (
      <div className={`space-y-1 min-w-11 ${className}`}>
        <label
          htmlFor={name}
          className={`${error && "text-red-500"
            } font-semibold text-gray-500 text-md`}
        >
          {label}
        </label>
        <Controller
          control={control}
          name={name}
          id={name}
          render={({ field }) => {
            return (
              <div
                onFocus={() => {
                  handleFocus(name);
                }}
                onBlur={() => setFocusedInput(null)}
                className={`${readOnly && "bg-[ghostwhite]"} ${focusedInput === name
                  ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                  : "outline-none border-gray-200 border-[.5px]"
                  } flex  rounded-md items-center px-2   bg-white py-1 md:py-[6px]`}
              >
                {Icon && (
                  <Icon className="text-gray-700 md:text-lg !text-[1em]" />
                )}
                <input
                  type={
                    type === "password" ? (visible ? "text" : "password") : type
                  }
                  maxLength={maxLimit && maxLimit}
                  readOnly={readOnly}
                  value={field.value}
                  placeholder={placeholder}
                  className={`${readOnly && "bg-[ghostwhite]"
                    } border-none bg-white w-full outline-none px-2  `}
                  autoComplete={autoComplete ?? "on"}
                  {...field}
                  formNoValidate
                />
                {type === "password" && (
                  <button
                    type="button"
                    onClick={() => setVisible(visible === true ? false : true)}
                  >
                    {visible ? (
                      <Visibility className="text-gray-700" />
                    ) : (
                      <VisibilityOff className="text-gray-700" />
                    )}
                  </button>
                )}
              </div>
            );
          }}
        />
        <div className="h-4 w-max !z-50   !mb-1">
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-sm mb-4 absolute !bg-white  text-red-500 px-2">
                {message}
              </p>
            )}
          />
        </div>
      </div>
    );
  }

  if (type === "contact") {
    return (
      <div className={`space-y-1  ${className}`}>
        <label
          htmlFor={name}
          className={`${error && "text-red-500"
            } font-semibold text-gray-500 text-md`}
        >
          {label}
        </label>
        <Controller
          control={control}
          name={name}
          id={name}
          render={({ field }) => {
            return (
              <div
                onFocus={() => {
                  handleFocus(name);
                }}
                onBlur={() => setFocusedInput(null)}
                className={`${readOnly && "bg-[ghostwhite]"} ${focusedInput === name
                  ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                  : "outline-none border-gray-200  border-[.5px]"
                  } flex  rounded-md items-center   bg-white  `}
              >
                <PhoneInput
                  country={"in"}
                  onChange={(value, data, event, formattedValue) => {
                    field.onChange(value.slice(data.dialCode.length));
                    setCountryCode(data.dialCode);
                  }}
                  value={value}
                  containerStyle={{
                    height: "100%",
                    width: "auto",
                    padding: "3px 0",
                    margin: "0px",
                  }}
                  inputStyle={{
                    paddingLeft: "50px",
                    paddingRight: "0px !important",
                    outline: "none",
                    border: "none",
                  }}
                  inputProps={{
                    name: field.name,
                    id: field.id,
                    placeholder: placeholder,
                    className: `md:py-[6px]`,
                  }}
                />
              </div>
            );
          }}
        />
        <div className="h-4 w-max !z-50   !mb-1">
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-sm mb-4 relative !bg-white  text-red-500">
                {message}
              </p>
            )}
          />
        </div>
      </div>
    );
  }

  if (type === "rounded-text-field") {
    return (
      <div className={`space-y-1 min-w-11 ${className}`}>
        <label
          htmlFor={name}
          className={`${error && "text-red-500"
            } font-semibold text-gray-500 text-md`}
        >
          {label}
        </label>
        <Controller
          control={control}
          name={name}
          id={name}
          render={({ field }) => {
            return (
              <div
                onFocus={() => {
                  handleFocus(name);
                }}
                onBlur={() => setFocusedInput(null)}
                className={`${readOnly && "bg-[ghostwhite]"} ${focusedInput === name
                  ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                  : "outline-none border-gray-200 border-[.5px]"
                  } flex items-center px-2 bg-white py-1 md:py-[6px] rounded-full`}
              >
                {Icon && (
                  <Icon className="text-gray-700 md:text-lg !text-[1em]" />
                )}
                <input
                  type={type}
                  maxLength={maxLimit && maxLimit}
                  readOnly={readOnly}
                  value={field.value}
                  placeholder={placeholder}
                  className={`${readOnly && "bg-[ghostwhite]"
                    } border-none bg-white w-full outline-none px-2  `}
                  {...field}
                  autoComplete={autoComplete ?? "on"}
                  formNoValidate
                  shouldDisableDate={shouldDisableDate}
                />
              </div>
            );
          }}
        />
        <div className="h-4 w-max !z-50   !mb-1">
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-sm mb-4 relative !bg-white  text-red-500">
                {message}
              </p>
            )}
          />
        </div>
      </div>
    );
  }

  if (type === "input-action") {
    return (
      <div className={`space-y-1 min-w-11 ${className}`}>
        <label
          htmlFor={name}
          className={`${error && "text-red-500"
            } font-semibold text-gray-500 text-md`}
        >
          {label}
        </label>
        <Controller
          control={control}
          name={name}
          id={name}
          render={({ field }) => {
            return (
              <div
                onFocus={() => {
                  handleFocus(name);
                }}
                onBlur={() => setFocusedInput(null)}
                className={` ${focusedInput === name
                  ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                  : "outline-none border-gray-200 border-[.5px]"
                  } flex  rounded-md items-center px-2   bg-white py-1 md:py-[6px] ${readOnly && "!bg-gray-200"
                  }`}
              >
                {Icon && (
                  <Icon className=" text-gray-700 md:text-lg !text-[1em]" />
                )}
                <input
                  type={
                    type === "password" ? (visible ? "text" : "password") : type
                  }
                  min={min}
                  max={max}
                  maxLength={maxLimit && maxLimit}
                  readOnly={readOnly}
                  value={field.value}
                  placeholder={placeholder}
                  className={`!flex-3 border-none bg-white w-full outline-none px-2  ${readOnly && "!bg-gray-200"
                    }`}
                  autoComplete={autoComplete ?? "on"}
                  {...field}
                  formNoValidate
                />
                <div className="!w-fit !flex-1">
                  {!readOnly ? (
                    <Button
                      variant="contained"
                      type="button"
                      onClick={onInputActionClick.bind(this, field.value)}
                      className="!min-w-9 !text-white"
                      disabled={
                        field?.value?.trim().length !== 0 ? readOnly : true
                      }
                    >
                      <Send className="md:text-lg !text-[1em]" />
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="error"
                      type="button"
                      onClick={onInputActionClear}
                      className="!min-w-9 !text-white"
                    >
                      <Close className="md:text-lg !text-[1em]" />
                    </Button>
                  )}
                </div>
              </div>
            );
          }}
        />
        <p className="text-xs w-full h-fit">{descriptionText}</p>
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <p className="text-sm mb-4 w-full h-full !bg-white  text-red-500">
              {message}
            </p>
          )}
        />
        {/* </div> */}
      </div>
    );
  }



  if (type === "Password1") {
    return (
      <div className={`space-y-1 min-w-11`}>
        <label
          htmlFor={name}

          className={`${error && 'text-red-500'
            } font-semibold text-gray-500 text-md`}
        >
          {label}

          {/* Info Icon with Tooltip */}
          <Tooltip
            title="Password must be 8 to 16 characters long, contain at least one lowercase letter, and include at least one number (required). 
 Password may contain at least one uppercase letter (optional).
 Password may include one special character (optional)"
            arrow
          >
            <span className="cursor-pointer ml-2">
              <InfoOutlinedIcon className="text-gray-500 !text-[16px]" />
            </span>
          </Tooltip>


        </label>

        <Controller
          control={control}
          name={name}
          id={name}
          render={({ field }) => {
            return (
              <div
                onFocus={() => handleFocus(name)}
                onBlur={() => setFocusedInput(null)}

                className={`${focusedInput === name
                    ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                    : "outline-none border-gray-200 border-[.5px]"
                  } flex rounded-md items-center px-2 bg-white py-1 md:py-[6px]`}

              >
                {Icon && <Icon className="text-gray-700 md:text-lg !text-[1em]" />}
                <input
                  type={visible ? 'text' : 'password'}
                  min={min}
                  max={max}
                  maxLength={maxLimit}
                  readOnly={readOnly}
                  value={field.value}
                  placeholder={placeholder}
                  className="!flex-3 border-none bg-white w-full outline-none px-2"
                  autoComplete={autoComplete ?? "on"}
                  {...field}
                  formNoValidate
                />

                {/* Eye icon to toggle password visibility */}
                <button
                  type="button"
                  onClick={() => setVisible((prev) => !prev)}
                  className="ml-2"
                >
                  {visible ? (
                    <Visibility className="text-gray-700" />
                  ) : (
                    <VisibilityOff className="text-gray-700" />
                  )}
                </button>
              </div>
            );
          }}
        />

        <p className="text-xs w-full h-fit">{descriptionText}</p>

        {error && (
          <p className="text-sm mb-4 w-full h-full !bg-white text-red-500">
            {error.message}
          </p>
        )}
      </div>
    );
  }



  if (type === "week-input") {
    return (
      <div
        className={`space-y-1 w-full !overflow-auto mb-4 ${className}`}
        style={{ width: "100%", justifyContent: "center", gap: "2px" }}
      >
        <label
          className={`${errors.selectedDays && "text-red-500"
            } font-semibold text-gray-500 text-md`}
          htmlFor="demo-simple-select-label"
        >
          {label}
        </label>
        <Controller
          control={control}
          name={name}
          id={name}
          render={({ field }) => (
            <ToggleButtonGroup
              value={field.value}
              onChange={(event, newSelectedDays) => {
                field.onChange(newSelectedDays);
              }}
              aria-label={name}
              className="mt-2 w-max !space-x-5"
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              {(optionlist || [])?.map((day) => (
                <ToggleButton
                  key={day.label}
                  value={day.value}
                  className="!rounded-full !border-[2px] !border-gray-200 !text-xs font-semibold"
                  style={{
                    width: "35px",
                    height: "35px",
                    padding: "2px",
                    backgroundColor: field?.value?.includes(day?.value)
                      ? "#1976d2"
                      : "transparent",
                    color: field?.value?.includes(day?.value)
                      ? "white"
                      : "black",
                  }}
                >
                  {day.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        />
        <div className="h-fit min-h-6 w-full">
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-sm relative !bg-white  text-red-500">
                {message}
              </p>
            )}
          />
        </div>
      </div>
    );
  }
  return (
    <div className={`space-y-1 min-w-11 ${className}`}>
      <label
        htmlFor={name}
        className={`${error && "text-red-500"
          } font-semibold text-gray-500 text-md`}
      >
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        id={name}
        render={({ field }) => {
          return (
            <div
              onFocus={() => {
                handleFocus(name);
              }}
              onBlur={() => setFocusedInput(null)}
              className={` ${focusedInput === name
                ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                : "outline-none border-gray-200 border-[.5px]"
                } flex  rounded-md items-center px-2   bg-white py-1 md:py-[6px] ${readOnly && "!bg-gray-200"
                }`}
            >
              {Icon && (
                <Icon className="text-gray-700 md:text-lg !text-[1em]" />
              )}
              <input
                type={
                  type === "password" ? (visible ? "text" : "password") : type
                }
                min={min}
                max={max}
                onKeyDown={(evt) => {
                  if (type === "number") {
                    evt.key === "e" && evt.preventDefault();
                  }
                }}
                maxLength={`${maxLimit}`}
                readOnly={readOnly}
                disabled={disabled}
                value={field.value}
                placeholder={placeholder}
                className={` border-none bg-white w-full outline-none px-2  ${readOnly && "!bg-gray-200"
                  }`}
                autoComplete={autoComplete ?? "on"}
                {...field}
                formNoValidate
              />

              {type === "password" && (
                <button
                  type="button"
                  onClick={() => setVisible(visible === true ? false : true)}
                >
                  {visible ? (
                    <Visibility className="text-gray-700" />
                  ) : (
                    <VisibilityOff className="text-gray-700" />
                  )}
                </button>
              )}
            </div>
          );
        }}
      />
      <p className="text-xs w-full h-fit">{descriptionText}</p>
      <div className="min-h-4 h-auto !mb-1">
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <p className=" text-sm mb-4 h-max   text-red-500">{message}</p>
          )}
        />
      </div>

      {/* </div> */}
    </div>
  );
};

export default AuthInputFiled;
