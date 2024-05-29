import { useEffect } from "react";
import { useFetch } from "src/shared/hooks/use-fetch.ts";
import { flowResult } from "mobx";
import RootModel from "src/shared/models/root.model.ts";
import { CircularProgress, Grid, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useNavigate } from "react-router-dom";
import { AppRoutesEnum } from "src/shared/router/app-routes.enum.ts";
export const CameraManagerPage = observer(() => {
  const { isLoading, execute } = useFetch({
    requestCb: async () => flowResult(RootModel.cameraModel.getCameras()),
  });

  const navigate = useNavigate();

  const cameraModel = RootModel.cameraModel;

  useEffect(() => {
    execute();
    return () => {
      cameraModel.setCameras([]);
    };
  }, []);

  if (isLoading) {
    return (
      <Stack justifyContent="center" alignItems="center">
        <CircularProgress size={350} />
      </Stack>
    );
  }

  return (
    <Grid container spacing={6}>
      <Grid item container xs={12} justifyContent="center">
        <Typography variant="h5">Менеджер камер</Typography>
      </Grid>
      {!!cameraModel.cameras.length &&
        cameraModel.cameras.map(camera => (
          <Grid item key={camera.camera_id} xs={4}>
            <Paper sx={{ p: 4 }} elevation={10}>
              <Grid
                container
                spacing={1}
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => navigate(AppRoutesEnum.DashboardCameraManager + "/" + camera.camera_id)}
              >
                <Grid item xs={12}>
                  <Typography fontWeight={700} fontSize={30}>
                    {camera.camera_name} <PhotoCameraIcon fontSize="large" />
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <Typography component="span" fontWeight={600}>
                      UUID:
                    </Typography>{" "}
                    {camera.uuid_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                  <Tooltip title={camera.config.rtsp_link}>
                    <Typography>{camera.config.rtsp_link}</Typography>
                  </Tooltip>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
    </Grid>
  );
});
