import { FC } from "react";
import { Detection } from "src/shared/services/types/camera.type.ts";
import { observer } from "mobx-react-lite";
import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { DetectionModel } from "src/pages/dashboard/detector/detection.model.ts";

export const MediaCard: FC<{ detection: Detection; model: DetectionModel }> = observer(({ detection, model }) => {
  const preview_url = detection.original_image_link.replace("http://nginx", import.meta.env.VITE_PROXY_URL);
  return (
    <Grid item xs={3}>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia sx={{ height: 140 }} image={preview_url} title="green iguana" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Id: {detection.detection_id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Текст события: {detection.event_text}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={() => model.setCurrentDetection(detection)}
          >
            Посмотреть график объектов
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
});
