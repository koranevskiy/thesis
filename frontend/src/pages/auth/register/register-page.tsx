import { useFormik } from "formik";
import { AuthLayout } from "src/pages/auth/auth-layout.tsx";
import * as Yup from "yup";
import { Button, Stack, TextField } from "@mui/material";
import { FormikField } from "src/shared/components/formik/formik-field.tsx";
import { Link } from "react-router-dom";
import { AppRoutesEnum } from "src/shared/router/app-routes.enum.ts";

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
  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async values => {
      console.log(values);
    },
  });
  return (
    <AuthLayout>
      <Stack component="form" onSubmit={formik.handleSubmit} gap={2} height="100%" justifyContent="center">
        <Stack gap={3}>
          <FormikField name="firstName" placeholder="Имя" label="Имя" formik={formik} />
          <FormikField name="lastName" placeholder="Фамилия" label="Фамилия" formik={formik} />
          <FormikField name="middleName" placeholder="Отчество" label="Отчество" formik={formik} />
          <FormikField name="email" placeholder="Email" label="Email" formik={formik} />
          <FormikField type="password" placeholder="Пароль" label="Пароль" name="password" formik={formik} />
        </Stack>
        <Button type="submit" variant="outlined">
          Зарегистрироваться
        </Button>
        <Link to={AppRoutesEnum.Login}>Логин</Link>
      </Stack>
    </AuthLayout>
  );
};
