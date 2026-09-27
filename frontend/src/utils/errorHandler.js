export const getError = (error) => {
  if (error?.response?.data?.message) {
    return error?.response?.data?.message;
  }
   if (error.code === "ECONNABORTED") {
    return "The request timed out. Please try again.";
  }

  if (!error.response) {
    return "Unable to connect to the server.";
  }

  return "Something went wrong. Please try again.";
};
