import { Info } from "@mui/icons-material";
import React, { useState } from "react";
import BasicButton from "../../../components/BasicButton";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import Setup from "../Setup";
import LocationAdd from "./components/location-add";
import LocationRow from "./components/location-row";
import useDepartmentLocation from "./hooks/useDepartmentLocation";

const OrganizationLocations = () => {
  const [open, setOpen] = useState(false);
  const {
    locationList,
    addLocationMutation,
    deleteLocationMutation,
    updateLocationMutation,
  } = useDepartmentLocation();
  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Location"
              info="Add organisation location here."
            />
            <BasicButton title="Add Location" onClick={() => setOpen(true)} />
          </div>
          {/* <IntlProvider locale="en"> */}
          {locationList && locationList?.length === 0 ? (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="text-2xl" />
                <h1 className="text-xl font-semibold">Add Location</h1>
              </article>
              <p>No location found. Please add a location.</p>
            </section>
          ) : (
            <div className=" xs:mt-3 sm:mt-3 md:mt-0">
              <table className="min-w-full bg-white  text-left !text-sm font-light">
                <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                  <tr className="!font-semibold">
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Sr. No
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Continent
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Country
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      State
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      City
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Short Name
                    </th>
                    <th scope="col" className=" !text-left pl-8 py-3">
                      Address
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {locationList?.map((location, index) => (
                    <LocationRow
                      {...{
                        location,
                        index,
                        deleteLocationMutation,
                        updateLocationMutation,
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <LocationAdd
            open={open}
            onClose={() => setOpen(false)}
            addLocationMutation={addLocationMutation}
          />
          {/* </IntlProvider> */}
        </div>
      </Setup>
    </BoxComponent>
  );
};

export default OrganizationLocations;
