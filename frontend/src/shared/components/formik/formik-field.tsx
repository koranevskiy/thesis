import { FormikContextType } from "formik";
import { TextFieldProps } from "@mui/material/TextField/TextField";
import { FC } from "react";
import { TextField } from "@mui/material";

export const FormikField: FC<FormikFieldProps> = ({ formik, ...rest }) => {
  const error = rest.name.split(".").reduce((prev, curr) => {
    return prev?.[curr];
  }, formik.errors as any);

  return (
    <TextField {...rest} {...formik.getFieldProps(rest.name)} error={!!error} helperText={(error as string) ?? ""} />
  );
};

type FormikFieldProps = TextFieldProps & {
  formik: FormikContextType<any>;
  name: string;
};
