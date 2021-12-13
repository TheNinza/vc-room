import toast from "react-hot-toast";

export const rtkQueryToastLoader = async (
  promise,
  loadingMessage,
  callback = async () => {},
  afterMessage = false
) => {
  let response;
  await toast.promise(promise, {
    loading: loadingMessage,
    success: (data) => {
      response = data;
      if (!afterMessage) callback(data);
      return data.data.message;
    },
    error: (data) => {
      console.error("error", data);
      return data?.error?.data?.message || "Error";
    },
  });

  if (afterMessage) await callback(response);
};
