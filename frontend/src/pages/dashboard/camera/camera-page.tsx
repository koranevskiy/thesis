import { useParams } from "react-router-dom";
import { useFetch } from "src/shared/hooks/use-fetch.ts";
import { flowResult } from "mobx";
import RootModel from "src/shared/models/root.model.ts";
import { useEffect } from "react";
import { Spinner } from "src/shared/components/spinner/spinner.tsx";
import { Button, Grid, Typography } from "@mui/material";

export const CameraPage = () => {
  const cameraModel = RootModel.cameraModel;
  const { camera_id } = useParams<{ camera_id: string }>();
  const { isLoading, execute } = useFetch({
    requestCb: async camera_id => flowResult(cameraModel.getCameraById(camera_id)),
  });

  useEffect(() => {
    (async () => {
      cameraModel.setCurrentCamera(null);
      const { response } = await execute(camera_id);
      if (response) {
        cameraModel.setCurrentCamera(response);
      }
    })();
  }, [camera_id]);

  if (isLoading) {
    return <Spinner size={300} />;
  }

  if (!cameraModel.currentCamera) {
    return (
      <Typography variant="h3" color="error">
        Не удалось загрузить камеру
      </Typography>
    );
  }

  return (
    <Grid container>
      <Grid item xs={8} mb={5}>
        <Typography variant="h4" fontWeight={700}>
          {cameraModel.currentCamera.camera_name}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography>UUID: {cameraModel.currentCamera.uuid_name}</Typography>
      </Grid>
      <Grid item xs={12} container columnGap={4}>
        <Grid item xs={7} height={400} sx={{ background: "black" }}></Grid>
        <Grid xs={4} item justifySelf="center" alignContent="center">
          <Button variant="outlined" color="secondary">
            Запустить камеру
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
