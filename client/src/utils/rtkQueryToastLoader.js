import toast from "react-hot-toast";

export const rtkQueryToastLoader = async (
  promise,
  loadingMessage,
  callback = () => {}
) => {
  await toast.promise(promise, {
    loading: loadingMessage,
    success: (data) => {
      return data.data.message;
    },
    error: (data) => {
      console.error("error", data);
      return data.error.data.message;
    },
  });

  callback();
};
