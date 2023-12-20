import axios from "axios";

export const FetchData = async (route) => {
  try {
    return (
      await axios.get(route, {
        withCredentials: true,
      })
    ).data;
  } catch (e) {
    console.log(e);
  }
};
export const PostData = async (route, data) => {
  try {
    const res = await axios.post(route, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res;
  } catch (e) {
    console.log(e.request, "post e");
    console.log(e.response, "post response");
    throw e;
  }
};
export const SIGNINCALL = async (route, data) => {
  try {
    await fetch(route, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  } catch (error) {
    console.log(error, "error")
  }
};
export const POSTCREDENTAILS = async (route, data) => {
  try {
    const res = await axios.post(route, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res;
  } catch (e) {
    console.log(e.request, "post e");
    console.log(e.response, "post response");
    throw e;
  }
};