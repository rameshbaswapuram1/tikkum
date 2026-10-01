export type WorkspaceRole =
  | "admin"
  | "merchant"
  | "picker"
  | "driver"
  | "customer";

export type WorkspaceRoleInfo = {
  id: WorkspaceRole;
  label: string;
  description: string;
};

export const workspaceRoles: WorkspaceRoleInfo[] = [
  {
    id: "admin",
    label: "Super admin",
    description: "Platform, billing & fleet",
  },
  { id: "merchant", label: "Merchant", description: "Store & live orders" },
  { id: "picker", label: "Picker", description: "Pick and pack" },
  { id: "driver", label: "Driver", description: "Routes & earnings" },
  { id: "customer", label: "Customer", description: "Shop local" },
];
