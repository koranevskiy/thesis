import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Stack, Typography } from "@mui/material";
import { FormikField } from "src/shared/components/formik/formik-field.tsx";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutesEnum } from "src/shared/router/app-routes.enum.ts";
import { useFetch } from "src/shared/hooks/use-fetch.ts";
import { flowResult } from "mobx";
import RootModel from "src/shared/models/root.model.ts";
import { DefaultRole, RegisterDto } from "src/shared/services/types/auth.type.ts";

const initialValues = {
  firstName: "",
  lastName: "",
  middleName: "",
  email: "",
  password: "",
};

const schema = Yup.object().shape({
  firstName: Yup.string().max(20).min(1).required(),
  lastName: Yup.string().max(20).min(1).required(),
  middleName: Yup.string().max(20),
  email: Yup.string().email().required(),
  password: Yup.string().max(40).min(5).required(),
});

export const RegisterPage = () => {
  const { isLoading, execute } = useFetch({
    requestCb: async (dto: RegisterDto) => flowResult(RootModel.authModel.register(dto)),
  });
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async values => {
      const { error } = await execute(Object.assign({ role: DefaultRole.User }, values));
      if (error) {
        formik.setErrors(error.response?.data?.errors ?? {});
      } else {
        navigate(AppRoutesEnum.Login);
      }
    },
  });
  return (
    <Stack component="form" onSubmit={formik.handleSubmit} gap={2} height="100%" justifyContent="center">
      <Typography variant="h4">Регистрация</Typography>
      <Stack gap={3}>
        <FormikField name="firstName" placeholder="Имя" label="Имя" formik={formik} />
        <FormikField name="lastName" placeholder="Фамилия" label="Фамилия" formik={formik} />
        <FormikField name="middleName" placeholder="Отчество" label="Отчество" formik={formik} />
        <FormikField name="email" placeholder="Email" label="Email" formik={formik} />
        <FormikField type="password" placeholder="Пароль" label="Пароль" name="password" formik={formik} />
      </Stack>
      <Button type="submit" variant="outlined" disabled={isLoading}>
        Зарегистрироваться
      </Button>
      <Link to={AppRoutesEnum.Login}>Логин</Link>
    </Stack>
  );
};
