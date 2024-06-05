import { useParams } from "react-router-dom";
import { useFetch } from "src/shared/hooks/use-fetch.ts";
import { useEffect, useState } from "react";
import { Grid, Modal, Paper, Typography } from "@mui/material";
import { flowResult } from "mobx";
import { observer } from "mobx-react-lite";
import "./style.css";
import { Bar } from "react-chartjs-2";
import { DetectionModel } from "./detection.model";
import { MediaCard } from "src/pages/dashboard/detector/ui/media-card.tsx";
import DetectionChart from "src/pages/dashboard/detector/ui/detection-chart.tsx";

export const DetectorPage = observer(() => {
  const [model] = useState(() => new DetectionModel());
  const { camera_id } = useParams<{ camera_id: string }>();
  const { isLoading, execute } = useFetch({
    requestCb: async (camera_id: number) => flowResult(model.getDetections(camera_id)),
  });

  useEffect(() => {
    let stop = false;
    const longPool = async () => {
      await execute(camera_id);
      await new Promise(resolve => setTimeout(resolve, 10000));
      if (!stop) {
        longPool();
      }
    };
    longPool();
    return () => {
      stop = true;
    };
  }, [camera_id]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h5" textAlign="center">
          Детектор | Анализ
        </Typography>
      </Grid>
      <Grid container item xs={12} columnSpacing={2} rowSpacing={4}>
        {model.detections.length ? (
          model.detections.map(secret => <MediaCard detection={secret} key={secret.detection_id} model={model} />)
        ) : (
          <Typography>Нет данных</Typography>
        )}
      </Grid>
      {model.currentDetection && (
        <Modal
          open={!!model.currentDetection?.detection_id}
          onClose={() => model.setCurrentDetection(null)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 5,
          }}
        >
          <Paper
            sx={{
              height: "90%",
              overflow: "auto",
            }}
          >
            <Grid container columnSpacing={3} p={2}>
              <Grid item container xs={6}>
                <Grid item xs={12}>
                  <Typography fontWeight={700}>Оригинальный кадр</Typography>
                </Grid>
                <Grid item xs={12}>
                  <img
                    className="img"
                    src={model.currentDetection?.original_image_link?.replace?.(
                      "http://nginx",
                      import.meta.env.VITE_PROXY_URL
                    )}
                  />
                </Grid>
              </Grid>
              <Grid item container xs={6}>
                <Grid item xs={12}>
                  <Typography fontWeight={700}>Обработанный кадр</Typography>
                </Grid>
                <Grid item xs={12}>
                  <img
                    className="img"
                    src={model.currentDetection?.annotated_image_link?.replace?.(
                      "http://nginx",
                      import.meta.env.VITE_PROXY_URL
                    )}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" textAlign="center">
                  График точности обнаружения объектов:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {model.currentDetection?.char_data?.length ? (
                  <DetectionChart detections={model.currentDetection.char_data} />
                ) : (
                  "Нет данных"
                )}
              </Grid>
            </Grid>
          </Paper>
        </Modal>
      )}
    </Grid>
  );
});
