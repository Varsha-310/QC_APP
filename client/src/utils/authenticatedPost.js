import instance from "../axios";
import { getUserToken } from "../utils/userAuthenticate";
const authenticatedPost = async (url, body, setData, setError) => {
  const headers = {
    Authorization: getUserToken(),
  };

  try {
    const res = await instance.post(url, body, { headers });

    if (res?.status === 200) {
      const resData = res.data;
      console.log(resData);
      // for invalid or unauthorized token
      if (resData?.code === 401) {
        throw new Error(
          "Authentication Failed: Unable to authenticate. Please log in again."
        );
      }
      if (resData?.code === 403) {
        throw new Error(
          "Session Expired: Your Session has expired. Please log in again."
        );
      }

      // for any other error
      if (resData?.code !== 200) {
        throw new Error("Network response was not OK.");
      }

      console.log(resData);
      setData(resData.data);
      //   return resData.data;
    } 

    // if (error.resonpose) {
    //   console.error("server error", error.resonpose.data);
    // } else if (error.request) {
    //   console.error("no response receieved", error.request);
    // } else {
    //   console.error("Error", error.message);
    // }

    // else {
    //   throw new Error("Network response was not OK.");
    // }
  } catch (error) {
    if (!navigator.onLine) {
      console.log("No internet connection!");
    } else {
      console.log(error);
    }
  }
};

export default authenticatedPost;
