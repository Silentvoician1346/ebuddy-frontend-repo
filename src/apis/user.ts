import { UsersProps } from "@/app/main/page";

interface ResponseAPI {
  data: any;
  status: number;
  message?: string;
}

export const getListUsers = async (token: string): Promise<ResponseAPI> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/fetch-user-data`, {
      method: "get",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        token,
      },
    });
    const responseJSON = await res.json();
    const result = {
      data: responseJSON.data,
      status: responseJSON.status,
    };
    return result;
  } catch (error) {
    const res = {
      data: [],
      status: 500,
      message: "Something's wrong.",
    };
    return res;
  }
};

export const updateOneUser = async (token: string, data: UsersProps): Promise<ResponseAPI> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/update-user-data`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      mode: "cors",
      body: JSON.stringify(data),
    });
    const responseJSON = await res.json();
    const result = {
      data: responseJSON.data,
      status: 200,
    };
    return result;
  } catch (error) {
    const res = {
      data: [],
      status: 500,
      message: "Something's wrong.",
    };
    return res;
  }
};
