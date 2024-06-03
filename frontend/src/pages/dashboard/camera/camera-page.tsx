import { useParams } from "react-router-dom";
import { useFetch } from "src/shared/hooks/use-fetch.ts";
import { flowResult } from "mobx";
import RootModel from "src/shared/models/root.model.ts";
import { useEffect, useState } from "react";
import { Spinner } from "src/shared/components/spinner/spinner.tsx";
import { Button, Grid, IconButton, Modal, Typography } from "@mui/material";
import { toast } from "react-toastify";
import CameraService from "src/shared/services/camera.service.ts";
import CloseIcon from "@mui/icons-material/Close";

export const CameraPage = () => {
  const cameraModel = RootModel.cameraModel;
  const { camera_id } = useParams<{ camera_id: string }>();
  const [canGetMinio, setCanGetMinio] = useState(false);
  const { isLoading, execute } = useFetch({
    requestCb: async camera_id => flowResult(cameraModel.getCameraById(camera_id)),
  });

  const { isLoading: isCameraStartLoading, execute: startCameraContainers } = useFetch({
    requestCb: async camera_id => flowResult(cameraModel.startCameraContainers(camera_id)),
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

  const onCameraStartContainers = async () => {
    const { response, error } = await startCameraContainers(camera_id);
    if (response) {
      toast("Контейнеры камеры успешно запущены");
      console.log(response);
    }
    console.log({ response, error });
  };

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

  const onRedirectToMinioConsole = async () => {
    // console.log(camera_id);
    // await CameraService.redirectToMinioConsole(+camera_id!);
    // console.log('zxc');
    setCanGetMinio(true);
  };

  return (
    <>
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
            <Button
              variant="outlined"
              color="secondary"
              onClick={onCameraStartContainers}
              disabled={isCameraStartLoading}
            >
              Запустить контейнеры камеры
            </Button>
            <Button onClick={onRedirectToMinioConsole}>Перейти в Minio Console</Button>
          </Grid>
        </Grid>
        <Grid item xs={12} container columnGap={4}>
          <Grid item xs={7} height={400}></Grid>
          <Grid xs={4} item justifySelf="center" alignContent="center"></Grid>
        </Grid>
      </Grid>
      <Modal
        open={canGetMinio}
        onClose={() => setCanGetMinio(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <>
          <IconButton
            sx={{
              position: "fixed",
              top: 0,
              right: 0,
            }}
            onClick={() => setCanGetMinio(false)}
          >
            <CloseIcon fontSize="large" color="error" />
          </IconButton>
          <iframe src={"http://localhost/minio/ui"} width="90%" height="90%" frameBorder={0} />
        </>
      </Modal>
    </>
  );
};
