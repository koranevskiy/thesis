import { observer } from "mobx-react-lite";
import { FC, PropsWithChildren, useState, MouseEvent } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Avatar } from "src/shared/components/avatar/avatar.tsx";
import { useFetch } from "src/shared/hooks/use-fetch.ts";
import { flowResult } from "mobx";
import RootModel from "src/shared/models/root.model.ts";
import { Outlet } from "react-router-dom";
import { AppBar, DrawerHeader, Main, drawerWidth } from "./ui/drawer-blocks";
import { DrawerLinks } from "src/pages/dashboard/ui/drawer-links.tsx";

export const DashboardLayout: FC<PropsWithChildren> = observer(({ children }) => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { isLoading, execute: logout } = useFetch({
    requestCb: async () => flowResult(RootModel.authModel.logout()),
  });
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const onLogout = async () => {
    await logout();
    handleClose();
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // @ts-ignore
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" flexGrow={1}>
            Панель управления
          </Typography>
          <Avatar user={RootModel.userModel.user!} onClick={handleClick} />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={onLogout} disabled={isLoading}>
              {isLoading ? "Выходим..." : "Выйти"}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <DrawerLinks />
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Box>
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
});
