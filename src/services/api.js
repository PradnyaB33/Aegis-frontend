
import axios from "axios";
// const headers = {
//   "Content-Type": file.type,
// };

export const getSignedUrl = async () => {
  try {
    console.log("Requesting signed URL...");
    const resp = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/upload`
    );
    console.log("Signed URL response:", resp.data);
    return resp.data;
  } catch (error) {
    console.log("Error while calling the API:", error.message);
    return error.response ? error.response.data : { error: "Unknown error" };
  }
};


export const uploadFile = async (url, file) => {
  try {
    if (!url) {
      throw new Error("Signed URL is undefined or null");
    }

    const response = await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    if (response.status === 200) {
      return { Location: url };
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error while uploading file", error.message);
    throw error;
  }
};





