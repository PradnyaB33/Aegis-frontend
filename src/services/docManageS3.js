import axios from "axios";

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
export const getSignedUrlForDocs = async (token, data) => {
  try {
    console.log("Requesting signed URL...");
    const resp = await axios.post(
      `${process.env.REACT_APP_API}/route/employee/uploaddocs`,
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log("Signed URL response:", resp.data);
    return resp.data;
  } catch (error) {
    console.log("Error while calling the API:", error.message);
    return error.response ? error.response.data : { error: "Unknown error" };
  }
};

export const getSignedUrlForOrgDocs = async (token, data) => {
  try {
    console.log("docs data",data);
    console.log("Requesting signed URL...");
    const resp = await axios.post(
      `${process.env.REACT_APP_API}/route/org/uploaddocs`,
      data,
      {
        headers: {
          Authorization: token,
        },
      }
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
    console.log("url", url);
    console.log("file", file);

    if (!url) {
      throw new Error("Signed URL is undefined or null");
    }

    const response = await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    console.log("Upload file response", response);

    if (response.status === 200) {
      return { Location: url };
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error(
      "Error while uploading file",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
