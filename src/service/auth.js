import axiosInstance from "./apiCall";

export const loginUser = async (data) => {
  const response = await axiosInstance.post("/auth/v1/sign_in", data);
  return response.data;
};

export const logOutUser = async () =>  {
  const response = await axiosInstance.delete("/auth/v1/sign_out");
  return response.data;
};