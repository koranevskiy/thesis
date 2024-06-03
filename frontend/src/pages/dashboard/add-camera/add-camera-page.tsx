import { Button, Grid, Paper, Stack, Typography } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FormikField } from "src/shared/components/formik/formik-field.tsx";
import { useFetch } from "src/shared/hooks/use-fetch.ts";
import { CameraDto } from "src/shared/services/types/camera.type.ts";
import { flowResult } from "mobx";
import RootModel from "src/shared/models/root.model.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppRoutesEnum } from "src/shared/router/app-routes.enum.ts";

const schema = Yup.object().shape({
  camera_name: Yup.string().min(1).required(),
  config: Yup.object()
    .shape({
      rtsp_link: Yup.string().required(),
      minio_login: Yup.string().required(),
      minio_password: Yup.string().required(),
    })
    .required(),
});

const initialValues = {
  camera_name: "",
  config: {
    rtsp_link: "",
    minio_login: "",
    minio_password: "",
  },
};

export const AddCameraPage = () => {
  const { isLoading, execute } = useFetch({
    requestCb: async (dto: CameraDto) => flowResult(RootModel.cameraModel.addCamera(dto)),
  });

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async values => {
      const { error } = await execute(values);
      if (!error) {
        toast("Камера успешно добавлена, запустите ее в менеджере камер");
        navigate(AppRoutesEnum.DashboardCameraManager);
      }
    },
  });
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" align="center">
          Добавить камеру
        </Typography>
      </Grid>
      <Grid item xs={2} />
      <Grid item xs={8} alignSelf="center" justifySelf="center" component="form" onSubmit={formik.handleSubmit}>
        <Paper sx={{ p: 3 }}>
          <Grid container gap={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Конфиг камеры</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormikField fullWidth name="camera_name" label="Имя камеры" placeholder="Имя камеры" formik={formik} />
            </Grid>
            <Grid item xs={12}>
              <FormikField
                fullWidth
                name="config.rtsp_link"
                label="RTSP url"
                placeholder="RTSP url камеры"
                formik={formik}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Конфиг Minio S3</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormikField
                fullWidth
                name="config.minio_login"
                label="Minio логин"
                placeholder="Minio логин"
                formik={formik}
              />
            </Grid>
            <Grid item xs={12}>
              <FormikField
                fullWidth
                name="config.minio_password"
                label="Minio пароль"
                placeholder="Minio пароль"
                formik={formik}
              />
            </Grid>
            <Grid container item xs={12} justifyContent="center" direction="row">
              <Button color="secondary" type="submit" variant="contained" disabled={isLoading}>
                Добавить камеру
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={2} />
    </Grid>
  );
};
