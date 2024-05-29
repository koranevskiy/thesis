import { CircularProgress, Stack } from "@mui/material";
import { FC } from "react";

export const Spinner: FC<SpinnerProps> = ({ size }) => {
  return (
    <Stack height="100%" width="100%" justifyContent="center" alignItems="center">
      <CircularProgress size={size} />
    </Stack>
  );
};

interface SpinnerProps {
  size?: number;
}
