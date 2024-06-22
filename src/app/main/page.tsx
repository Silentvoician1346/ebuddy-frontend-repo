"use client";

import { Box, Button, Checkbox, IconButton, TextField, Typography } from "@mui/material";
import "./main.css";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getListUsers, updateOneUser } from "@/apis/user";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setNotificationState } from "@/store/notificationSlice";

export interface UsersProps {
  id: string;
  name: string;
  role: string;
  remote: boolean;
}
const defaultUser: UsersProps = {
  id: "",
  name: "",
  remote: true,
  role: "",
};
function MainPage() {
  const router = useRouter();
  const globalStateNotification = useSelector((state: RootState) => state.notification.message);
  const dispatch = useDispatch();

  const [stateListUsers, setStateListUsers] = useState<UsersProps[]>([]);
  const [stateDetailUser, setStateDetailUser] = useState<UsersProps>(defaultUser);
  const [stateIsUpdating, setStateIsUpdating] = useState<boolean>(false);
  const [stateIsLoading, setStateIsLoading] = useState<boolean>(false);

  const handleGetUsers = async () => {
    try {
      dispatch(setNotificationState("fetching users..."));

      const token = localStorage.getItem("token");
      const res = await getListUsers(token ?? "");
      if (res.status === 200 && res.data) {
        setStateListUsers(res.data);
      } else if (res.status === 401) {
        dispatch(setNotificationState("Authentication failed"));
      } else {
        dispatch(setNotificationState("fetching users failed"));
      }

      setTimeout(() => {
        dispatch(setNotificationState(""));
      }, 3000);
    } catch (error) {
      dispatch(setNotificationState("Get List Users failed"));
    }
  };

  const handleOpenUpdateForm = (id: string) => {
    const userToUpdate = stateListUsers.find((u) => u.id === id);
    if (userToUpdate) {
      setStateDetailUser(userToUpdate);
      setStateIsUpdating(true);
    }
  };

  const handleCloseUpdateForm = () => {
    setStateDetailUser(defaultUser);
    setStateIsUpdating(false);
  };

  const handleSubmitUpdateForm = async (data: UsersProps) => {
    try {
      setStateIsLoading(true);
      dispatch(setNotificationState("Updating User..."));

      const token = localStorage.getItem("token");
      await updateOneUser(token ?? "", data);

      setStateIsUpdating(false);
      setStateDetailUser(defaultUser);
      dispatch(setNotificationState("Update User success"));

      const res = await getListUsers(token ?? "");
      if (res.data) {
        setStateListUsers(res.data);
      }

      setTimeout(() => {
        setStateIsLoading(false);
      }, 10);
      setTimeout(() => {
        dispatch(setNotificationState(""));
      }, 3000);
    } catch (error) {
      dispatch(setNotificationState("Update User failed"));
      setTimeout(() => {
        dispatch(setNotificationState(""));
      }, 3000);
      setTimeout(() => {
        setStateIsLoading(false);
      }, 10);
    }
  };

  const handleLogOut = () => {
    dispatch(setNotificationState("Logging Out..."));

    setTimeout(() => {
      localStorage.removeItem("token");
      router.push("/login");
    }, 2000);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 240 },
    { field: "role", headerName: "Role", width: 160 },
    {
      field: "remote",
      headerName: "Remote",
      width: 80,
      renderCell: (cell) => <Box> {cell.value.toString()}</Box>,
    },
    {
      field: "update",
      headerName: "Update",
      width: 80,
      renderCell: (cell) => (
        <IconButton onClick={() => handleOpenUpdateForm(cell.id.toString())}>
          <EditIcon color="info" />
        </IconButton>
      ),
    },
  ];

  return (
    <div className="main-container">
      <div className="header-section">
        <div className="status-section card">
          <div>Welcome to the Main Page!</div>
          <IconButton onClick={handleLogOut}>
            <PowerSettingsNewIcon color="error" />
          </IconButton>
        </div>
        <div className="action-section">
          <Button
            sx={{ height: "160px", width: "160px", borderRadius: "600px" }}
            onClick={handleGetUsers}
            variant="contained"
          >
            Get Users
          </Button>
        </div>
      </div>
      <div className="body-section">
        <div className="list-section">
          {stateListUsers.length > 0 && (
            <DataGrid
              rows={stateListUsers}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10]}
              loading={stateIsLoading}
              hideFooter
            />
          )}
        </div>
        {stateIsUpdating && (
          <div className="update-section">
            <TextField
              label="Name"
              value={stateDetailUser.name}
              onChange={(e) => setStateDetailUser({ ...stateDetailUser, name: e.target.value })}
            />
            <TextField
              label="Role"
              value={stateDetailUser.role}
              onChange={(e) => setStateDetailUser({ ...stateDetailUser, role: e.target.value })}
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography>Remote</Typography>
              <Checkbox
                checked={stateDetailUser.remote}
                onChange={() =>
                  setStateDetailUser({ ...stateDetailUser, remote: !stateDetailUser.remote })
                }
              />
            </Box>

            <div className="row-action">
              <Button onClick={handleCloseUpdateForm} variant="contained" color="error">
                cancel
              </Button>
              <Button onClick={() => handleSubmitUpdateForm(stateDetailUser)} variant="contained">
                apply
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="row-notification">
        <Typography variant="h3">{`${globalStateNotification}`}</Typography>
      </div>
    </div>
  );
}

export default MainPage;
