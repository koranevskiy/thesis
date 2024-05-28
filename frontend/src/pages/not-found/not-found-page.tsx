import { Stack, Typography } from "@mui/material";

export const NotFoundPage = () => {
  return (
    <Stack width="100%" height="100%" direction="column" alignContent="center" justifyContent="center">
      <Typography variant="h2" fontWeight={700} textAlign="center">
        404{" "}
        <Typography variant="h3" component="span">
          Page Not Found... Ops...
        </Typography>
      </Typography>
    </Stack>
  );
};
