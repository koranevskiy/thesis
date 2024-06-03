import { useParams } from "react-router-dom";
import { useFetch } from "src/shared/hooks/use-fetch.ts";
import { flowResult } from "mobx";
import RootModel from "src/shared/models/root.model.ts";
import { useEffect, useState } from "react";
import { Spinner } from "src/shared/components/spinner/spinner.tsx";
import { Button, Grid, IconButton, Modal, Paper, Typography } from "@mui/material";
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

  const {
    isLoading: isVideoInspectLoading,
    execute: inspectVideo,
    data: videoInspection,
  } = useFetch({
    requestCb: async camera_id => CameraService.inspectVideo(camera_id),
  });

  const { isLoading: isCameraRunLoading, execute: runCameraContainer } = useFetch({
    requestCb: async camera_id => CameraService.startVideo(camera_id),
  });

  const { isLoading: isCameraStopLoading, execute: stopCameraContainer } = useFetch({
    requestCb: async camera_id => CameraService.stopVideo(camera_id),
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

  useEffect(() => {
    let timer: number;
    const inspect = async () => {
      timer = setTimeout(async () => {
        await inspectVideo(camera_id);
        inspect();
      }, 4000);
    };
    inspect();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [camera_id]);

  const onCameraStartContainers = async () => {
    const { response, error } = await startCameraContainers(camera_id);
    if (response) {
      toast.success("Контейнеры камеры успешно запущены");
      console.log(response);
    }
    console.log({ response, error });
  };

  const onCameraRun = async () => {
    const { response } = await runCameraContainer(camera_id);
    if (response) {
      toast.success("Контейнер камеры успешно запущен!");
    } else {
      toast.error("Не удалось запустить контейнер камеры");
    }
  };

  const onCameraStop = async () => {
    const { response } = await stopCameraContainer(camera_id);
    if (response) {
      toast.success("Контейнер камеры успешно остановлен!");
    } else {
      toast.error("Не удалось остановить контейнер камеры");
    }
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
            Имя камеры: {cameraModel.currentCamera.camera_name}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>UUID: {cameraModel.currentCamera.uuid_name}</Typography>
        </Grid>
        <Grid item xs={12} container columnGap={4}>
          <Grid item xs={7} height={400} sx={{ background: "black" }}></Grid>
          <Grid xs={4} item container justifySelf="center" alignContent="center" gap={2}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onCameraStartContainers}
              disabled={isCameraStartLoading || !!videoInspection}
              fullWidth
            >
              Создать и запустить контейнеры камеры
            </Button>
            <Button
              fullWidth
              variant="contained"
              disabled={!videoInspection || videoInspection?.State?.Running || isCameraRunLoading}
              onClick={onCameraRun}
            >
              Запустить контейнер камеры
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              disabled={!videoInspection || !videoInspection?.State?.Running || isCameraStopLoading}
              onClick={onCameraStop}
            >
              Остановить контейнер камеры
            </Button>
            <Button onClick={onRedirectToMinioConsole} variant="outlined" fullWidth>
              Перейти в Minio Console
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12} container columnGap={4}>
          <Grid item xs={6} container minHeight={300}>
            {videoInspection && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h5">Состояние видео контейнера камеры:</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Состояние:
                    <Typography
                      variant="h6"
                      component="span"
                      color={videoInspection.State.Running ? "success.main" : "error"}
                    >
                      {videoInspection.State.Running ? " Работает" : " Отключен"}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Время прошлого запуска:{" "}
                    <Typography variant="h6" component="span">
                      {videoInspection.State.FinishedAt
                        ? new Date(videoInspection.State.FinishedAt).toLocaleString()
                        : ""}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Время прошлой остановки:{" "}
                    <Typography variant="h6" component="span">
                      {new Date(videoInspection.State.StartedAt).toLocaleString()}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Дата создания контейнеров камеры: {new Date(videoInspection.Created).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Ошибки в контейнере:{" "}
                    <Typography component="span" color="error">
                      {videoInspection.State.Error}
                    </Typography>{" "}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Код выхода контейнера: {videoInspection.State.ExitCode} </Typography>
                </Grid>
              </>
            )}
          </Grid>
          <Grid xs={5} item container justifySelf="center" alignContent="center" gap={2}>
            <Grid item xs={12}>
              <Typography variant="h5">Конфиг камеры:</Typography>
            </Grid>
            <Grid item xs={12} overflow="auto" border={1} borderRadius={2} p={2}>
              <pre>{JSON.stringify(cameraModel.currentCamera.config, null, 4)}</pre>
            </Grid>
          </Grid>
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
