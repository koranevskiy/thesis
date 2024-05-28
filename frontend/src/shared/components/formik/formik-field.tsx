import { FormikContextType } from "formik";
import { TextFieldProps } from "@mui/material/TextField/TextField";
import { FC } from "react";
import { TextField } from "@mui/material";

export const FormikField: FC<FormikFieldProps> = ({ formik, ...rest }) => {
  return (
    <TextField
      {...rest}
      {...formik.getFieldProps(rest.name)}
      error={!!formik.errors[rest.name]}
      helperText={(formik.errors[rest.name] as string) ?? ""}
    />
  );
};

type FormikFieldProps = TextFieldProps & {
  formik: FormikContextType<any>;
  name: string;
};
