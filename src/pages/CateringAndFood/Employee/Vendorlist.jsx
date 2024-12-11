
// import axios from 'axios';
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import useAuthToken from '../../../hooks/Token/useAuth';
// import hrmsImg from '../../../assets/hrmsImg.png';
// import foodbagroundimage from '../../../assets/foodbagroundimage.webp';
// import useCartStore from './useCartStore';
// import { FaMapMarkerAlt } from 'react-icons/fa';
// import ReusableModal from '../../../components/Modal/component';
// import LocationSelector from './LocationSelector';
// import BoxComponent from '../../../components/BoxComponent/BoxComponent';


// const Vendorlist = () => {
//   const [vendors, setVendors] = useState([]);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [locationName, setLocationName] = useState('');
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const authToken = useAuthToken();
//   const { clearCart } = useCartStore();

//   const fetchVendors = useCallback(async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/vendor/fetchvendor`, {
//         headers: {
//           Authorization: authToken,
//         },
//       });
//       setVendors(response.data.vendors || []);
//     } catch (error) {
//       console.error('Error fetching vendors:', error);
//     }
//   }, [authToken]);

//   useEffect(() => {
//     fetchVendors();
//   }, [fetchVendors]);

//   useEffect(() => {
//     clearCart();
//   }, [clearCart]);

//   const getLocationName = async (latitude, longitude) => {
//     try {
//       const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
//       const displayName = response.data.address.state_district;
//       setLocationName(displayName);
//     } catch (error) {
//       console.error("Error fetching location name:", error);
//     }
//   };

//   const filterVendorsByLocation = (latitude, longitude) => {
//     const filtered = vendors.filter(vendor => {
//       const vendorLat = parseFloat(vendor.latitude);
//       const vendorLon = parseFloat(vendor.longitude);
//       const distance = haversineDistance(latitude, longitude, vendorLat, vendorLon);
//       return distance < 40; // Filter vendors within 11 km
//     });
//     setFilteredVendors(filtered);
//   };

//   const haversineDistance = (lat1, lon1, lat2, lon2) => {
//     const toRad = (value) => (value * Math.PI) / 180;
//     const R = 6371; // Radius of the Earth in km
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);
//     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//               Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//               Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in km
//   };

//   const handleSearch = () => {
//     const lowercasedSearchTerm = searchTerm.toLowerCase();
//     const filtered = vendors.filter(vendor => vendor.companyname.toLowerCase().includes(lowercasedSearchTerm));
//     setFilteredVendors(filtered);
//   };

//   const handleLocationSelect = (lat, lng) => {
//     setCurrentLocation({ lat, lng });
//     getLocationName(lat, lng);
//     filterVendorsByLocation(lat, lng);
//     closeLocationModal();
//   };

//   const openLocationModal = () => {
//     setModalIsOpen(true);
//   };

//   const closeLocationModal = () => {
//     setModalIsOpen(false);
//   };

//   return (
//     <BoxComponent>
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="relative h-[50vh] mb-4">
//         <img src={foodbagroundimage} alt="Background" className="w-full h-full object-cover " />
//         <div className="absolute top-24 left-44 right-44 p-4 flex flex-col sm:flex-row items-center bg-white bg-opacity-75 rounded-md shadow-md">
//           <button 
//             onClick={openLocationModal} 
//             className="mr-2 sm:mb-0 p-2 bg-blue-500 text-white rounded-full"
//             title="Select location"
//           >
//             <FaMapMarkerAlt />
//           </button>
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search vendors..."
//             className="p-2 border w-full border-gray-300 rounded-l-md"
//           />
//           <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded-r-md">
//             Search
//           </button>
//         </div>
//       </div>

//       <div className="text-center mb-4">
//         {currentLocation && <p>Current Location: {locationName}</p>}
//       </div>

//       <h1 className="text-4xl font-bold text-center mb-8">
//         {filteredVendors.length > 0 
//           ? `All Vendors Available in ${locationName}` 
//           : 'All Vendors in India'}
//       </h1>
//       <div className="flex flex-wrap justify-center">
//         {(filteredVendors.length > 0 ? filteredVendors : vendors).map(vendor => (
//           <Link
//             key={vendor._id}
//             to={`/vendors/restaurantmenu/${vendor._id}`}
//             className="max-w-xs rounded-lg overflow-hidden shadow-lg m-4 transform transition-transform hover:scale-105 hover:shadow-2xl"
//           >
//             <img className="w-full h-32 object-cover" src={hrmsImg} alt="Vendor" />
//             <div className="px-4 py-3 bg-white">
//               <h2 className="font-bold text-lg mb-1 text-gray-800">{vendor.companyname}</h2>
//               <p className="text-gray-600 text-sm">{vendor.address}</p>
//             </div>
//             <div className="px-4 pt-2 pb-2 bg-gray-50">
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#vendor</span>
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#services</span>
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#contact</span>
//             </div>
//           </Link>
//         ))}
//       </div>

//       {/* ReusableModal for selecting location */}
//       <ReusableModal
//         open={modalIsOpen}
//         onClose={closeLocationModal}
//         heading="Select Location"
//         subHeading="Choose your preferred location."
//       >
//         <LocationSelector onLocationSelect={handleLocationSelect} />
//       </ReusableModal>
//     </div>
//     </BoxComponent>
//   );
// };

// export default Vendorlist;














// import axios from 'axios';
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import useAuthToken from '../../../hooks/Token/useAuth';
// import hrmsImg from '../../../assets/hrmsImg.png';
// import foodbagroundimage from '../../../assets/foodbagroundimage.webp';
// import useCartStore from './useCartStore';
// import { FaMapMarkerAlt } from 'react-icons/fa';
// import ReusableModal from '../../../components/Modal/component';
// import LocationSelector from './LocationSelector';
// import BoxComponent from '../../../components/BoxComponent/BoxComponent';


// const Vendorlist = () => {
//   const [vendors, setVendors] = useState([]);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [locationName, setLocationName] = useState('');
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const authToken = useAuthToken();
//   const { clearCart } = useCartStore();

//   const fetchVendors = useCallback(async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/vendor/fetchvendor`, {
//         headers: {
//           Authorization: authToken,
//         },
//       });
//       setVendors(response.data.vendors || []);
//     } catch (error) {
//       console.error('Error fetching vendors:', error);
//     }
//   }, [authToken]);

//   useEffect(() => {
//     fetchVendors();
//   }, [fetchVendors]);

//   useEffect(() => {
//     clearCart();
//   }, [clearCart]);

//   const getLocationName = async (latitude, longitude) => {
//     try {
//       const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
//       const displayName = response.data.address.state_district;
//       setLocationName(displayName);
//     } catch (error) {
//       console.error("Error fetching location name:", error);
//     }
//   };

//   const filterVendorsByLocation = (latitude, longitude) => {
//     const filtered = vendors.filter(vendor => {
//       const vendorLat = parseFloat(vendor.latitude);
//       const vendorLon = parseFloat(vendor.longitude);
//       const distance = haversineDistance(latitude, longitude, vendorLat, vendorLon);
//       return distance < 40; // Filter vendors within 11 km
//     });
//     setFilteredVendors(filtered);
//   };

//   const haversineDistance = (lat1, lon1, lat2, lon2) => {
//     const toRad = (value) => (value * Math.PI) / 180;
//     const R = 6371; // Radius of the Earth in km
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);
//     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//               Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//               Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in km
//   };

//   const handleSearch = () => {
//     const lowercasedSearchTerm = searchTerm.toLowerCase();
//     const filtered = vendors.filter(vendor => vendor.companyname.toLowerCase().includes(lowercasedSearchTerm));
//     setFilteredVendors(filtered);
//   };

//   const handleLocationSelect = (lat, lng) => {
//     setCurrentLocation({ lat, lng });
//     getLocationName(lat, lng);
//     filterVendorsByLocation(lat, lng);
//     closeLocationModal();
//   };

//   const openLocationModal = () => {
//     setModalIsOpen(true);
//   };

//   const closeLocationModal = () => {
//     setModalIsOpen(false);
//   };

//   return (
// <BoxComponent>
//   <div className="min-h-screen bg-gray-100 p-6">

//     {/* Hero Section with Background Overlay */}
//     <div className="relative h-[70vh] mb-12 rounded-xl overflow-hidden shadow-xl">
//       <img
//         src={foodbagroundimage}
//         alt="Background"
//         className="w-full h-full object-cover opacity-75"
//       />
//       <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
//         <div className="flex flex-col sm:flex-row items-center bg-white bg-opacity-90 rounded-xl shadow-2xl p-8 w-full sm:w-[85%] lg:w-[65%]">
          
//           {/* Location Button */}
//           <button
//             onClick={openLocationModal}
//             className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full shadow-lg mb-4 sm:mb-0 sm:mr-6 transition-all transform hover:scale-110 hover:shadow-2xl"
//             title="Select location"
//           >
//             <FaMapMarkerAlt size={28} />
//           </button>

//           {/* Search Bar */}
//           <div className="flex w-full mt-4 sm:mt-0">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search vendors..."
//               className="p-4 w-full border border-gray-300 rounded-l-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//             />
//             <button
//               onClick={handleSearch}
//               className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-r-xl shadow-lg transition-all transform hover:scale-110"
//             >
//               Search
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Location Info */}
//     <div className="text-center mb-10">
//       {currentLocation && (
//         <p className="text-lg text-gray-800 font-medium">
//           Current Location: <span className="font-semibold text-blue-600">{locationName}</span>
//         </p>
//       )}
//     </div>

//     {/* Page Title */}
//     <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 text-gray-900 tracking-tight">
//       {filteredVendors.length > 0
//         ? `Vendors Available in ${locationName}`
//         : 'Explore All Vendors in India'}
//     </h1>

//     {/* Vendor Cards Grid */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//       {(filteredVendors.length > 0 ? filteredVendors : vendors).map((vendor) => (
//         <Link
//           key={vendor._id}
//           to={`/vendors/restaurantmenu/${vendor._id}`}
//           className="group flex flex-col items-center bg-white rounded-2xl shadow-lg transition-all transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:border hover:border-blue-400"
//         >
//           <img
//             className="w-full h-48 object-cover rounded-t-2xl"
//             src={hrmsImg}
//             alt="Vendor"
//           />
//           <div className="p-6 w-full text-center">
//             <h2 className="font-semibold text-xl text-gray-800 mb-2">{vendor.companyname}</h2>
//             <p className="text-gray-500 text-sm">{vendor.address}</p>
//           </div>
//         </Link>
//       ))}
//     </div>

//     {/* Reusable Modal for selecting location */}
//     <ReusableModal
//       open={modalIsOpen}
//       onClose={closeLocationModal}
//       heading="Select Location"
//       subHeading="Choose your preferred location."
//     >
//       <LocationSelector onLocationSelect={handleLocationSelect} />
//     </ReusableModal>

//   </div>
// </BoxComponent>


// );
// };



// export default Vendorlist;






import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useAuthToken from '../../../hooks/Token/useAuth';
// import hrmsImg from '../../../assets/hrmsImg.png'; // Default image
import Fish from '../../../assets/Fish.jpg';
import foodbagroundimage from '../../../assets/foodbagroundimage.webp';
import useCartStore from './useCartStore';
import { FaMapMarkerAlt } from 'react-icons/fa';
import ReusableModal from '../../../components/Modal/component';
import LocationSelector from './LocationSelector';
import BoxComponent from '../../../components/BoxComponent/BoxComponent';

const Vendorlist = () => {
  const [vendors, setVendors] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const authToken = useAuthToken();
  const { clearCart } = useCartStore();

  const fetchVendors = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/route/vendor/fetchvendor`, {
        headers: {
          Authorization: authToken,
        },
      });
      setVendors(response.data.vendors || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  }, [authToken]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const getLocationName = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      const displayName = response.data.address.state_district;
      setLocationName(displayName);
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

  const filterVendorsByLocation = (latitude, longitude) => {
    const filtered = vendors.filter(vendor => {
      const vendorLat = parseFloat(vendor.latitude);
      const vendorLon = parseFloat(vendor.longitude);
      const distance = haversineDistance(latitude, longitude, vendorLat, vendorLon);
      return distance < 40; // Filter vendors within 40 km
    });
    setFilteredVendors(filtered);
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleSearch = () => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = vendors.filter(vendor => vendor.companyname.toLowerCase().includes(lowercasedSearchTerm));
    setFilteredVendors(filtered);
  };

  const handleLocationSelect = (lat, lng) => {
    setCurrentLocation({ lat, lng });
    getLocationName(lat, lng);
    filterVendorsByLocation(lat, lng);
    closeLocationModal();
  };

  const openLocationModal = () => {
    setModalIsOpen(true);
  };

  const closeLocationModal = () => {
    setModalIsOpen(false);
  };

  // Helper function to get the Shop Image URL from vendor documents
  const getShopImageUrl = (documents) => {
    const shopImageDoc = documents.find(doc => doc.selectedValue === "Shop Image");
    return shopImageDoc ? shopImageDoc.url : Fish; // Return the URL or default image
  };

  return (
    <BoxComponent>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Hero Section with Background Overlay */}
        <div className="relative h-[70vh] mb-12 rounded-xl overflow-hidden shadow-xl">
          <img
            src={foodbagroundimage}
            alt="Background"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
            <div className="flex flex-col sm:flex-row items-center bg-white bg-opacity-90 rounded-xl shadow-2xl p-8 w-full sm:w-[85%] lg:w-[65%]">
              {/* Location Button */}
              <button
                onClick={openLocationModal}
                className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full shadow-lg mb-4 sm:mb-0 sm:mr-6 transition-all transform hover:scale-110 hover:shadow-2xl"
                title="Select location"
              >
                <FaMapMarkerAlt size={28} />
              </button>

              {/* Search Bar */}
              <div className="flex w-full mt-4 sm:mt-0">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search vendors..."
                  className="p-4 w-full border border-gray-300 rounded-l-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  onClick={handleSearch}
                  className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-r-xl shadow-lg transition-all transform hover:scale-110"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="text-center mb-10">
          {currentLocation && (
            <p className="text-lg text-gray-800 font-medium">
              Current Location: <span className="font-semibold text-blue-600">{locationName}</span>
            </p>
          )}
        </div>

        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 text-gray-900 tracking-tight">
          {filteredVendors.length > 0
            ? `Vendors Available in ${locationName}`
            : 'Explore All Vendors in India'}
        </h1> 
       



        {/* Vendor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {(filteredVendors.length > 0 ? filteredVendors : vendors).map((vendor) => (
            <Link
              key={vendor._id}
              to={`/vendors/restaurantmenu/${vendor._id}`}
              className="group flex flex-col items-center bg-white rounded-2xl shadow-lg transition-all transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:border hover:border-blue-400"
            >
              {/* Vendor Image */}
              <img
                className="w-full h-48 object-cover rounded-t-2xl"
                src={getShopImageUrl(vendor.documents)} // Dynamic image based on availability
                alt={vendor.companyname}
              />
              <div className="p-6 w-full text-center">
                <h2 className="font-semibold text-xl text-gray-800 mb-2">{vendor.companyname}</h2>
                <p className="text-gray-500 text-sm">{vendor.address}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Reusable Modal for selecting location */}
        <ReusableModal
          open={modalIsOpen}
          onClose={closeLocationModal}
          heading="Select Location"
          subHeading="Choose your preferred location."
        >
          <LocationSelector onLocationSelect={handleLocationSelect} />
        </ReusableModal>
      </div>
    </BoxComponent>
  );
};

export default Vendorlist;
