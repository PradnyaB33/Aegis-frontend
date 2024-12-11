import { useMutation, useQuery, useQueryClient } from "react-query";
import useAuthToken from "../../hooks/Token/useAuth";
import axios from "axios";

const useHook = () => {
  const authToken = useAuthToken();
  const queryClient = useQueryClient();

  // get notification
  const getNotification = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    };
    let data = await axios.get(
      `${process.env.REACT_APP_API}/route/notification`,
      config
    );
    return data.data;
  };

  const { data } = useQuery({
    queryKey: ["notification"],
    queryFn: getNotification,
  });

  // accept request
  const AcceptRequest = async (doc) => {
    console.log(doc);

    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    };

    let response = await axios.post(
      `${process.env.REACT_APP_API}/route${doc.backend_link}${doc._id}`,
      {
        status: "approved",
      },
      config
    );
    console.log("response", response);
    return doc;
  };
  const { mutate } = useMutation({
    mutationFn: AcceptRequest,
    onSuccess: async (data) => {
      console.log("mutation", data);
      queryClient.invalidateQueries({ queryKey: ["notification"] });
    },
    onError: async (data) => {
      console.log("error", data);
    },
  });

  // login
  const LoginUser = async (doc) => {
    console.log(doc);

    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let response = await axios.post(
      `${process.env.REACT_APP_API}/route/employee/login`,
      doc,
      config
    );
    console.log("response", response);
    return doc;
  };

  const { mutate: loginMutate } = useMutation({
    mutationFn: LoginUser,
    onSuccess: async (data) => {
      console.log("mutation", data);
    },
    onError: async (data) => {
      console.log("error", data);
    },
  });

  return { data, mutate, loginMutate };
};

export default useHook;
