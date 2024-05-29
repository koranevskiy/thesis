import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "src/pages/auth/login/login-page";
import { AppRoutesEnum } from "src/shared/router/app-routes.enum.ts";
import { NotFoundPage } from "src/pages/not-found/not-found-page.tsx";
import { HomePage } from "src/pages/dashboard/home/home-page.tsx";
import { ProtectedRoute } from "src/app/router/protected-route.tsx";
import { AuthRoute } from "src/app/router/auth-route.tsx";
import { RegisterPage } from "src/pages/auth/register/register-page.tsx";
import { AuthLayout } from "src/pages/auth/auth-layout.tsx";
import { DashboardLayout } from "src/pages/dashboard/dashboard-layout.tsx";
import { AddCameraPage } from "src/pages/dashboard/add-camera/add-camera-page.tsx";
import { CameraManagerPage } from "src/pages/dashboard/camera-manager/camera-manager-page.tsx";
import { CameraPage } from "src/pages/dashboard/camera/camera-page.tsx";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route element={<AuthLayout />}>
          <Route
            path={AppRoutesEnum.Login}
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            }
          />
          <Route
            path={AppRoutesEnum.Register}
            element={
              <AuthRoute>
                <RegisterPage />
              </AuthRoute>
            }
          />
        </Route>
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path={AppRoutesEnum.Dashboard} element={<HomePage />} />
          <Route path={AppRoutesEnum.DashboardCreateCamera} element={<AddCameraPage />} />
          <Route path={AppRoutesEnum.DashboardCameraManager} element={<CameraManagerPage />} />
          <Route path={`${AppRoutesEnum.DashboardCamera}/:camera_id`} element={<CameraPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
