import React, { useState } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
// import Autocomplete from "react-google-autocomplete";

const LocationSearchInput = ({ field }) => {
  const [address, setAddress] = useState("");

  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

  return (
    <PlacesAutocomplete
      key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
        return (
          <div>
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "location-search-input",
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    </PlacesAutocomplete>
  );
};

export default LocationSearchInput;
