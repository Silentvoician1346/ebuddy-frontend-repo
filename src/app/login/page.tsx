"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import "./login.css";
import { useForm } from "react-hook-form";
import FormError from "@/components/forms/error";
import { signIn } from "@/apis/firebase";
import { getListUsers } from "@/apis/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setNotificationState } from "@/store/notificationSlice";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const globalStateNotification = useSelector((state: RootState) => state.notification.message);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (props: any) => {
    const { email, password } = props;
    try {
      setIsLoading(true);
      dispatch(setNotificationState("logging in..."));
      const res = await signIn(email, password);
      if (res && res.user) {
        dispatch(setNotificationState("Login Success."));

        const token = await res.user.getIdToken();
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", res.user.refreshToken);
        setTimeout(() => {
          dispatch(setNotificationState(""));
          router.push("/main");
        }, 1000);
      } else {
        dispatch(setNotificationState("Authentication Failed."));

        setTimeout(() => {
          setIsLoading(false);
          dispatch(setNotificationState(""));
        }, 2000);
      }
    } catch (err) {
      dispatch(setNotificationState("Login Failed"));

      setTimeout(() => {
        setIsLoading(false);
        dispatch(setNotificationState(""));
      }, 2000);
    }
  };

  const handleGetUsers = async () => {
    try {
      dispatch(setNotificationState("fetching users..."));

      const token = localStorage.getItem("token");
      const res = await getListUsers(token ?? "");

      if (res.status === 200) {
        console.log("ress", res);
        dispatch(setNotificationState("Fetch Users success"));

        setTimeout(() => {
          dispatch(setNotificationState(""));
        }, 3000);
      } else if (res.status === 401) {
        dispatch(setNotificationState("Authentication Failed."));

        setTimeout(() => {
          dispatch(setNotificationState(""));
        }, 3000);
      } else {
        dispatch(setNotificationState("Fetch Users failed."));

        setTimeout(() => {
          dispatch(setNotificationState(""));
        }, 3000);
      }
    } catch (error) {
      dispatch(setNotificationState("Fetch Users failed."));

      setTimeout(() => {
        dispatch(setNotificationState(""));
      }, 3000);
    }
  };
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl className="login-section" fullWidth>
          <div>
            <TextField
              fullWidth
              variant="standard"
              label="email"
              type="email"
              {...register("email", { required: true, minLength: 8 })}
            />
            <FormError fullWidth error={errors.email} />
          </div>
          <div>
            <TextField
              fullWidth
              variant="standard"
              label="password"
              type="password"
              {...register("password", { required: true, minLength: 8 })}
            />
            <FormError fullWidth error={errors.password} />
          </div>

          <Button sx={{ marginTop: "16px" }} type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "logging in..." : "login"}
          </Button>
        </FormControl>
      </form>
      <Button
        sx={{ height: "160px", width: "160px", borderRadius: "600px" }}
        onClick={handleGetUsers}
        variant="contained"
      >
        Get Users
      </Button>
      <div className="row-notification">
        <Typography variant="h3">{`${globalStateNotification}`}</Typography>
      </div>
    </div>
  );
}
