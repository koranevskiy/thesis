import { AppRouter } from "src/app/router/router.tsx";
import { CssBaseline } from "@mui/material";
import { ErrorDialog } from "src/app/error-dialog.tsx";

export const App = () => {
  return (
    <ErrorDialog>
      <CssBaseline />
      <AppRouter />
    </ErrorDialog>
  );
};
