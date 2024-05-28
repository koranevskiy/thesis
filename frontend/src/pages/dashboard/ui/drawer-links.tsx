import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { AppRoutesEnum } from "src/shared/router/app-routes.enum.ts";
import { useLocation, useNavigate } from "react-router-dom";

const links = [
  { path: AppRoutesEnum.Dashboard, name: "Дэшборд" },
  { path: AppRoutesEnum.DashboardCreateCamera, name: "Добавить камеру" },
];

export const DrawerLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <List>
      {links.map(({ path, name }, index) => (
        <ListItem key={path} disablePadding>
          <ListItemButton
            onClick={() => navigate(path)}
            color="white"
            sx={[location.pathname === path && { background: "rgba(125,203,243,0.21)" }]}
          >
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
