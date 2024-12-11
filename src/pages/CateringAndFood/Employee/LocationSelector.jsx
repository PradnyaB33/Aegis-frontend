

import React, { useState } from 'react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { FaMapMarkerAlt } from 'react-icons/fa';

const LocationSelector = ({ onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
    onLocationSelect(lat, lng);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setSelectedLocation({ lat: latitude, lng: longitude });
        onLocationSelect(latitude, longitude);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSearch = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        const { location } = results[0].geometry;
        const lat = location.lat();
        const lng = location.lng();
        setSelectedLocation({ lat, lng });
        onLocationSelect(lat, lng);
      } else {
        alert("Location not found");
      }
    });
  };

  return (
    <div className="flex flex-col items-center">
    <div className="flex mb-2 items-center">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a location"
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
  
      <div className="flex ml-2">
        <button 
          onClick={handleSearch} 
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Search
        </button>
  
        <button 
          onClick={handleUseCurrentLocation} 
          className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Use GPS to find nearest vendors"
        >
          <FaMapMarkerAlt className="inline-block mr-1" /> Use Current Location
        </button>
      </div>
    </div>

      {isLoaded && (
        <GoogleMap
          onClick={handleMapClick}
          center={selectedLocation || { lat: 20.5937, lng: 78.9629 }} // Default to India
          zoom={5}
          mapContainerStyle={{ width: '100%', height: '200px', marginTop: '10px' }}
        >
          {selectedLocation && <MarkerF position={selectedLocation} />}
        </GoogleMap>
      )}
    </div>
  );
};

export default LocationSelector;


