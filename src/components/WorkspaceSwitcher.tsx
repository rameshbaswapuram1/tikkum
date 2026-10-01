import {
  AdminPanelSettings,
  Inventory2,
  LocalShipping,
  ShoppingBag,
  Storefront,
} from "@mui/icons-material";
import { Tab, Tabs } from "@mui/material";
import { workspaceRoles, type WorkspaceRole } from "../types/workspace";
import "./workspace-switcher.css";

const roleIcons = {
  admin: AdminPanelSettings,
  merchant: Storefront,
  picker: Inventory2,
  driver: LocalShipping,
  customer: ShoppingBag,
};

type WorkspaceSwitcherProps = {
  value: WorkspaceRole;
  onChange: (role: WorkspaceRole) => void;
};

export function WorkspaceSwitcher({ value, onChange }: WorkspaceSwitcherProps) {
  return (
    <div className="workspace-switcher">
      <a className="suite-brand" href="#top" aria-label="Tikkum home">
        <span className="suite-brand-mark">t</span>
        <span>
          tikkum<span className="suite-brand-dot">.</span>
        </span>
      </a>
      <div className="switcher-label">WORKSPACE</div>
      <Tabs
        value={value}
        onChange={(_, role: WorkspaceRole) => onChange(role)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="Choose workspace"
        className="workspace-tabs"
      >
        {workspaceRoles.map(({ id, label }) => {
          const Icon = roleIcons[id];
          return (
            <Tab
              key={id}
              value={id}
              icon={<Icon />}
              iconPosition="start"
              label={label}
            />
          );
        })}
      </Tabs>
      <span className="preview-badge">DEMO WORKSPACES</span>
    </div>
  );
}
