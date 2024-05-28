import { AuthLayout } from "src/pages/auth/auth-layout.tsx";
import { Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useFetch } from "src/shared/hooks/use-fetch.ts";
import { flowResult } from "mobx";
import RootModel from "src/shared/models/root.model.ts";
import { useNavigate } from "react-router-dom";
import { AppRoutesEnum } from "src/shared/router/app-routes.enum.ts";

const initialValues = {
  email: "",
  password: "",
};

export const LoginPage = () => {
  const { execute: login, isLoading } = useFetch({
    requestCb: async params => flowResult(RootModel.authModel.login(params)),
  });

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    onSubmit: async formValues => {
      if (!formValues.password) {
        formik.setFieldError("password", "Введите пароль");
      }
      if (!formValues.email) {
        formik.setFieldError("email", "Введите email");
      }
      if (!formValues.email || !formValues.password) {
        return;
      }
      await login(formValues);
    },
  });

  const onRegClick = () => navigate(AppRoutesEnum.Register);

  return (
    <AuthLayout>
      <Stack justifyContent="center" height="100%" component="form" onSubmit={formik.handleSubmit}>
        <Stack gap={4}>
          <Stack gap={2.5}>
            <TextField
              label="Email"
              placeholder="Email"
              {...formik.getFieldProps("email")}
              error={!!formik.errors.email}
              helperText={formik.errors.email}
            />
            <TextField
              label="Пароль"
              placeholder="Пароль"
              type="password"
              {...formik.getFieldProps("password")}
              error={!!formik.errors.password}
              helperText={formik.errors.password}
            />
          </Stack>
          <Stack direction="row" gap={2} justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              sx={{
                flex: "1 1 auto",
              }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Загрузка..." : "Войти"}
            </Button>
            <Button
              sx={{
                flex: "1 1 auto",
              }}
              variant="outlined"
              disabled={isLoading}
              onClick={onRegClick}
            >
              Зарегистрироваться
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </AuthLayout>
  );
};
