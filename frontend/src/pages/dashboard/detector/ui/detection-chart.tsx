import { Bar } from "react-chartjs-2";
import { FC } from "react";
import { DetectionObject } from "src/shared/services/types/camera.type.ts";
import { observer } from "mobx-react-lite";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DetectionsChart: FC<{ detections: DetectionObject[] }> = observer(({ detections }) => {
  const labels = detections.map(det => `ID: ${det.id}`);
  const confidences = detections.map(det => det.confidence);

  const groupedDetections = detections.reduce((acc, det) => {
    if (!acc[det.label]) {
      acc[det.label] = [];
    }
    acc[det.label].push(det.confidence);
    return acc;
  }, {} as any);

  const datasets = Object.keys(groupedDetections).map((label, index) => ({
    label: label,
    data: groupedDetections[label],
    backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.6)`,
    borderColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`,
    borderWidth: 1,
  }));

  const data = {
    labels: labels,
    datasets: datasets,
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
});

export default DetectionsChart;
