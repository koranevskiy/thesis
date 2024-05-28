import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";
import { AppRoutesEnum } from "src/shared/router/app-routes.enum.ts";
import { CircularProgress, Stack } from "@mui/material";
import { FC, PropsWithChildren } from "react";
import RootModel from "src/shared/models/root.model.ts";

export const ProtectedRoute: FC<PropsWithChildren> = observer(({ children }) => {
  if (!RootModel.authModel.isAuth && !RootModel.userModel.isUserLoading) {
    return <Navigate to={AppRoutesEnum.Login} />;
  }

  if (RootModel.userModel.isUserLoading) {
    return (
      <Stack height="100%" width="100%" justifyContent="center" alignItems="center">
        <CircularProgress size={200} />
      </Stack>
    );
  }
  return children;
});
