import { observer } from "mobx-react-lite";
import { useFetch } from "src/shared/hooks/use-fetch.ts";
import { flowResult } from "mobx";
import RootModel from "src/shared/models/root.model.ts";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CircularProgress, Grid, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { AppRoutesEnum } from "src/shared/router/app-routes.enum.ts";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
export const HomePage = observer(() => {
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
        <Typography variant="h5">Детекторы</Typography>
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
                onClick={() => navigate(AppRoutesEnum.DashboardDetector + "/" + camera.camera_id)}
              >
                <Grid item xs={12} display="flex" flexDirection="row" alignItems="center" gap={2}>
                  <Typography fontWeight={700} fontSize={30}>
                    {camera.camera_name}
                  </Typography>
                  <GraphicEqIcon fontSize="large" color="primary" />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
    </Grid>
  );
});
