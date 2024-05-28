import { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { AppRoutesEnum } from "src/shared/router/app-routes.enum.ts";
import TokenService from "src/shared/services/token.service.ts";
import { CircularProgress, Stack } from "@mui/material";
import RootModel from "src/shared/models/root.model.ts";

export const AuthRoute: FC<PropsWithChildren> = observer(({ children }) => {
  const token = TokenService.getTokens();
  if (RootModel.authModel.isAuth && token.access_token) {
    return <Navigate to={AppRoutesEnum.Dashboard} />;
  }

  if (token.access_token && RootModel.userModel.isUserLoading) {
    return (
      <Stack height="100%" width="100%" justifyContent="center" alignItems="center">
        <CircularProgress size={200} />
      </Stack>
    );
  }

  return children;
});
