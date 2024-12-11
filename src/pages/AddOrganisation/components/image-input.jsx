import { CameraAltOutlined } from "@mui/icons-material";
import React, { useRef, useState  ,useEffect} from "react";
 
const ImageInput = ({ field, className ,updatedLogo}) => {
  
  const displayImage = async (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      setSelectedImage(e?.target?.result); 
    }; 

    if (file) {
      if (typeof file !== "string") {
        reader?.readAsDataURL(file);
      }
    }
  };
  if (field?.value) {
    displayImage(field?.value);
  }
  // const [selectedImage, setSelectedImage] = useState(field?.value);
  const [selectedImage, setSelectedImage] = useState(
    updatedLogo || field?.value
  );

  useEffect(() => {
    if (updatedLogo) {
      setSelectedImage(updatedLogo); // Reflect new logo when updated
    }
  }, [updatedLogo]);
  const hiddenInputRef = useRef(null);
  const handleFileChange = (e) => {
    const file = e?.target?.files[0]; 

    displayImage(file);
  };

  return (
    <div
      className={`flex px-2 border-gray-200 border-[.5px] bg-[#f8f8ff59] py-[6px] items-center h-48 w-48 rounded-full justify-center !hover:bg-[ghostwhite] cursor-pointer transition-all !bg-cover ${className}`}
      style={{
        background: `linear-gradient(45deg, #f8f8ff59, #f8f8ff59), url(${
          typeof selectedImage !== "object"
            ? selectedImage?.includes("data:image")
              ? `${selectedImage}`
              : `${selectedImage}?v=${Date.now()}`
            : selectedImage
        })`,
      }}
      onClick={() => {
        hiddenInputRef.current.click();
      }}
    >
      <CameraAltOutlined className="!text-gray-700 !text-4xl" />
      <input
        type="file"
        accept="image/png,image/gif,image/jpeg,image/webp"
        id="logo_url"
        placeholder="placeholder"
        onChange={(e) => {
          field?.onChange(e?.target?.files[0]);
          handleFileChange(e);
        }}
        className="hidden"
        ref={hiddenInputRef}
      />
    </div>
  );
};

export default ImageInput;
