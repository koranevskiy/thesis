import { AppRouter } from "src/app/router/router.tsx";
import { CssBaseline } from "@mui/material";
import { ErrorDialog } from "src/app/error-dialog.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const App = () => {
  return (
    <ErrorDialog>
      <CssBaseline />
      <ToastContainer />
      <AppRouter />
    </ErrorDialog>
  );
};
