import { useEffect, useState, type ChangeEvent } from "react";
import {
  Add,
  ArrowForward,
  AssignmentTurnedIn,
  Check,
  CheckCircle,
  ChevronRight,
  Close,
  Inventory2,
  LocalShipping,
  LocationOn,
  MoreHoriz,
  Pause,
  Payments,
  PersonAdd,
  PlayArrow,
  Route,
  Schedule,
  Storefront,
  TrendingUp,
} from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import {
  fleetZones,
  merchantOrders,
  packItems,
  routeStops,
  tenants,
  type DemoOrder,
  type DemoOrderStatus,
} from "../../data/demoOperations";
import type { WorkspaceRole } from "../../types/workspace";
import "./operations.css";
import "./operations-overrides.css";

const roleHeadings: Record<
  Exclude<WorkspaceRole, "customer">,
  { eyebrow: string; title: string; description: string }
> = {
  admin: {
    eyebrow: "PLATFORM CONTROL CENTER",
    title: "Good afternoon, Ramesh.",
    description:
      "A clear view of your marketplace, tenants, and shared delivery fleet.",
  },
  merchant: {
    eyebrow: "GREEN BASKET MARKET · MERCHANT PORTAL",
    title: "Your store, at a glance.",
    description: "Keep the shelves ready and every order moving.",
  },
  picker: {
    eyebrow: "FULFILMENT · PICK STATION 04",
    title: "Let's get this order right.",
    description: "A careful pick makes someone's day. Batch TK-2048 is ready.",
  },
  driver: {
    eyebrow: "TIKKUM FLEET · DRIVER APP",
    title: "Your next good run.",
    description:
      "Three local shops, two happy doorsteps. Route updated just now.",
  },
};

const orderProgression: DemoOrderStatus[] = [
  "New",
  "Accepted",
  "Packing",
  "Ready",
  "On route",
];

function nextOrderStatus(status: DemoOrderStatus): DemoOrderStatus {
  return orderProgression[
    Math.min(orderProgression.indexOf(status) + 1, orderProgression.length - 1)
  ];
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function Metric({
  label,
  value,
  change,
  icon,
  tone = "green",
}: {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  tone?: string;
}) {
  return (
    <Paper elevation={0} className="ops-metric">
      <div className={`ops-metric-icon tone-${tone}`}>{icon}</div>
      <div className="ops-metric-label">{label}</div>
      <strong>{value}</strong>
      <span className="ops-metric-change">{change}</span>
    </Paper>
  );
}

function StatusChip({ status }: { status: string }) {
  const className = status.toLowerCase().replaceAll(" ", "-");
  return (
    <Chip
      size="small"
      label={status}
      className={`ops-status status-${className}`}
    />
  );
}

export function OperationsWorkspace({
  role,
}: {
  role: Exclude<WorkspaceRole, "customer">;
}) {
  const [orders, setOrders] = useState(merchantOrders);
  const [storeOpen, setStoreOpen] = useState(true);
  const [brandName, setBrandName] = useState("Green Basket Market");
  const [brandDraft, setBrandDraft] = useState("Green Basket Market");
  const [brandColor, setBrandColor] = useState("#4f7846");
  const [brandColorDraft, setBrandColorDraft] = useState("#4f7846");
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);
  const [hoursDialogOpen, setHoursDialogOpen] = useState(false);
  const [openingTime, setOpeningTime] = useState("10:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [inventory, setInventory] = useState([42, 28, 16, 9]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [timerRunning, setTimerRunning] = useState(false);
  const [completedStops, setCompletedStops] = useState<string[]>([]);
  const [proofs, setProofs] = useState<Record<string, string>>({});
  const [online, setOnline] = useState(true);
  const [newTenantOpen, setNewTenantOpen] = useState(false);
  const [tenantName, setTenantName] = useState("");
  const [tenantRows, setTenantRows] = useState(tenants);
  const [newDriverOpen, setNewDriverOpen] = useState(false);
  const [driverName, setDriverName] = useState("");
  const [driverZone, setDriverZone] = useState(fleetZones[0].name);
  const [driverRows, setDriverRows] = useState([
    { name: "Ravi Kumar", zone: "Jubilee Hills", status: "On route" },
    { name: "Sana Khan", zone: "Banjara Hills", status: "Available" },
  ]);

  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return;
    const timer = window.setInterval(
      () => setTimerSeconds((seconds) => Math.max(seconds - 1, 0)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [timerRunning, timerSeconds]);

  const heading =
    role === "merchant"
      ? {
          ...roleHeadings[role],
          eyebrow: `${brandName.toUpperCase()} · MERCHANT PORTAL`,
        }
      : roleHeadings[role];
  const toggleItem = (id: string) =>
    setCheckedItems((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  const advanceOrder = (id: string) =>
    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? { ...order, status: nextOrderStatus(order.status) }
          : order,
      ),
    );
  const toggleInventory = (index: number, change: number) =>
    setInventory((current) =>
      current.map((quantity, itemIndex) =>
        itemIndex === index ? Math.max(quantity + change, 0) : quantity,
      ),
    );
  const finishPickerOrder = () => setTimerRunning(false);
  const completeStop = (id: string) =>
    setCompletedStops((current) => [...current, id]);
  const addTenant = () => {
    const name = tenantName.trim();
    if (!name) return;
    setTenantRows((current) => [
      {
        name,
        category: "New store",
        plan: "Starter",
        orders: 0,
        status: "Review",
      },
      ...current,
    ]);
    setTenantName("");
    setNewTenantOpen(false);
  };
  const addDriver = () => {
    const name = driverName.trim();
    if (!name) return;
    setDriverRows((current) => [
      { name, zone: driverZone, status: "Verification pending" },
      ...current,
    ]);
    setDriverName("");
    setNewDriverOpen(false);
  };

  return (
    <div className={`ops-workspace ops-${role}`}>
      <header className="ops-header">
        <div className="ops-breadcrumb">
          TIKKUM <ChevronRight /> {heading.eyebrow}
        </div>
        <div className="ops-header-actions">
          <span className="ops-live">
            <i /> Live workspace
          </span>
          <IconButton aria-label="More workspace options">
            <MoreHoriz />
          </IconButton>
        </div>
      </header>
      <main className="ops-main">
        <div className="ops-page-heading">
          <div>
            <span className="ops-eyebrow">{heading.eyebrow}</span>
            <h1>{heading.title}</h1>
            <p>{heading.description}</p>
          </div>
          {role === "admin" && (
            <div className="ops-heading-actions">
              <Button
                className="ops-secondary-button"
                startIcon={<LocalShipping />}
                onClick={() => setNewDriverOpen(true)}
              >
                Onboard driver
              </Button>
              <Button
                className="ops-primary-button"
                startIcon={<PersonAdd />}
                onClick={() => setNewTenantOpen(true)}
              >
                Add a tenant
              </Button>
            </div>
          )}
          {role === "merchant" && (
            <div className="merchant-header-actions">
              <span className="merchant-hours-summary">
                {openingTime} – {closingTime}
              </span>
              <Button
                className="ops-secondary-button"
                onClick={() => {
                  setBrandDraft(brandName);
                  setBrandColorDraft(brandColor);
                  setBrandDialogOpen(true);
                }}
              >
                <i style={{ backgroundColor: brandColor }} />
                Branding
              </Button>
              <Button
                className="ops-secondary-button"
                onClick={() => setHoursDialogOpen(true)}
              >
                Store hours
              </Button>
              <Button
                className={`store-state-button ${storeOpen ? "store-open" : "store-closed"}`}
                onClick={() => setStoreOpen((open) => !open)}
              >
                <span />
                {storeOpen ? "Store is open" : "Store is paused"}
              </Button>
            </div>
          )}
          {role === "picker" && (
            <div className="picker-timer">
              <Schedule />
              <strong>{formatTime(timerSeconds)}</strong>
              <span>2 MIN TARGET</span>
            </div>
          )}
          {role === "driver" && (
            <Button
              className={`driver-state-button ${online ? "" : "driver-offline"}`}
              onClick={() => setOnline((current) => !current)}
            >
              <span />
              {online ? "You're online" : "You're offline"}
            </Button>
          )}
        </div>

        {role === "admin" && (
          <AdminDashboard
            tenants={tenantRows}
            drivers={driverRows}
            onAddTenant={() => setNewTenantOpen(true)}
            onAddDriver={() => setNewDriverOpen(true)}
          />
        )}
        {role === "merchant" && (
          <MerchantDashboard
            orders={orders}
            storeOpen={storeOpen}
            inventory={inventory}
            onAdvance={advanceOrder}
            onToggleInventory={toggleInventory}
          />
        )}
        {role === "picker" && (
          <PickerDashboard
            checkedItems={checkedItems}
            onToggle={toggleItem}
            timerRunning={timerRunning}
            timerSeconds={timerSeconds}
            onTimerToggle={() => setTimerRunning((running) => !running)}
            onFinish={finishPickerOrder}
          />
        )}
        {role === "driver" && (
          <DriverDashboard
            completedStops={completedStops}
            proofs={proofs}
            online={online}
            onCompleteStop={completeStop}
            onProof={(id, fileName) =>
              setProofs((current) => ({ ...current, [id]: fileName }))
            }
          />
        )}
      </main>

      <Dialog
        open={newTenantOpen}
        onClose={() => setNewTenantOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle className="tenant-dialog-title">
          Add a neighbourhood store
        </DialogTitle>
        <DialogContent>
          <p className="tenant-dialog-copy">
            Start onboarding. You can configure its plan, branding, and delivery
            zone next.
          </p>
          <TextField
            autoFocus
            fullWidth
            label="Store name"
            value={tenantName}
            onChange={(event) => setTenantName(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewTenantOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={addTenant}
            disabled={!tenantName.trim()}
          >
            Add store
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={newDriverOpen}
        onClose={() => setNewDriverOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle className="tenant-dialog-title">
          Onboard a fleet driver
        </DialogTitle>
        <DialogContent className="driver-dialog-content">
          <p className="tenant-dialog-copy">
            Add a driver to the shared fleet. They will appear as pending until
            verification is complete.
          </p>
          <TextField
            autoFocus
            fullWidth
            label="Driver name"
            value={driverName}
            onChange={(event) => setDriverName(event.target.value)}
          />
          <TextField
            select
            fullWidth
            label="Primary service zone"
            value={driverZone}
            onChange={(event) => setDriverZone(event.target.value)}
          >
            {fleetZones.map((zone) => (
              <MenuItem key={zone.name} value={zone.name}>
                {zone.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewDriverOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={addDriver}
            disabled={!driverName.trim()}
          >
            Add to fleet
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={brandDialogOpen}
        onClose={() => setBrandDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle className="tenant-dialog-title">
          Store branding
        </DialogTitle>
        <DialogContent className="driver-dialog-content">
          <p className="tenant-dialog-copy">
            Set the name and accent that customers see in your local storefront.
          </p>
          <TextField
            autoFocus
            fullWidth
            label="Store display name"
            value={brandDraft}
            onChange={(event) => setBrandDraft(event.target.value)}
          />
          <TextField
            fullWidth
            type="color"
            label="Brand accent"
            value={brandColorDraft}
            onChange={(event) => setBrandColorDraft(event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBrandDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (brandDraft.trim()) setBrandName(brandDraft.trim());
              setBrandColor(brandColorDraft);
              setBrandDialogOpen(false);
            }}
            disabled={!brandDraft.trim()}
          >
            Save branding
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={hoursDialogOpen}
        onClose={() => setHoursDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle className="tenant-dialog-title">Store hours</DialogTitle>
        <DialogContent className="hours-dialog-content">
          <p className="tenant-dialog-copy">
            Set today's hours. Your store can still be paused at any time.
          </p>
          <TextField
            label="Opens at"
            type="time"
            value={openingTime}
            onChange={(event) => setOpeningTime(event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Closes at"
            type="time"
            value={closingTime}
            onChange={(event) => setClosingTime(event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHoursDialogOpen(false)}>Done</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function AdminDashboard({
  tenants: tenantRows,
  drivers,
  onAddTenant,
  onAddDriver,
}: {
  tenants: typeof tenants;
  drivers: { name: string; zone: string; status: string }[];
  onAddTenant: () => void;
  onAddDriver: () => void;
}) {
  return (
    <>
      <div className="ops-metrics-grid">
        <Metric
          label="Platform revenue · MRR"
          value="₹8.42L"
          change="↑ 12.8% this month"
          icon={<Payments />}
        />
        <Metric
          label="Active tenants"
          value="128"
          change="↑ 8 onboarded this month"
          icon={<Storefront />}
          tone="orange"
        />
        <Metric
          label="Orders today"
          value="1,284"
          change="↑ 6.4% vs. yesterday"
          icon={<AssignmentTurnedIn />}
          tone="blue"
        />
        <Metric
          label="Fleet online"
          value="46 / 58"
          change="79% of drivers on shift"
          icon={<LocalShipping />}
          tone="lime"
        />
      </div>
      <div className="ops-admin-grid">
        <Paper elevation={0} className="ops-panel tenant-panel">
          <div className="ops-panel-heading">
            <div>
              <span className="ops-eyebrow">MERCHANT NETWORK</span>
              <h2>Tenant health</h2>
            </div>
            <Button onClick={onAddTenant} endIcon={<ArrowForward />}>
              All tenants
            </Button>
          </div>
          <div className="tenant-table-wrap">
            <table className="tenant-table">
              <thead>
                <tr>
                  <th>Store</th>
                  <th>Plan</th>
                  <th>Orders today</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tenantRows.map((tenant) => (
                  <tr key={tenant.name}>
                    <td>
                      <strong>{tenant.name}</strong>
                      <small>{tenant.category}</small>
                    </td>
                    <td>{tenant.plan}</td>
                    <td>{tenant.orders}</td>
                    <td>
                      <StatusChip status={tenant.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="add-tenant-row" onClick={onAddTenant}>
            <Add /> Onboard a local business
          </button>
        </Paper>
        <Paper elevation={0} className="ops-panel revenue-panel">
          <div className="ops-panel-heading">
            <div>
              <span className="ops-eyebrow">PLATFORM BILLING</span>
              <h2>Revenue, this week</h2>
            </div>
            <span className="period-label">Last 7 days⌄</span>
          </div>
          <div className="revenue-total">
            ₹2,14,650 <span>+8.2%</span>
          </div>
          <div className="revenue-chart" aria-label="Daily revenue chart">
            {[
              { d: "M", h: 37 },
              { d: "T", h: 57 },
              { d: "W", h: 44 },
              { d: "T", h: 74 },
              { d: "F", h: 61 },
              { d: "S", h: 92 },
              { d: "S", h: 69 },
            ].map((day, index) => (
              <div className="revenue-day" key={`${day.d}-${index}`}>
                <span
                  style={{ height: `${day.h}%` }}
                  className={index === 5 ? "bar-highlight" : ""}
                />
                <small>{day.d}</small>
              </div>
            ))}
          </div>
          <div className="revenue-legend">
            <span>
              <i className="legend-marketplace" /> Marketplace commission
            </span>
            <span>
              <i className="legend-plans" /> Tenant plans
            </span>
          </div>
        </Paper>
      </div>
      <div className="ops-admin-grid ops-admin-lower">
        <Paper elevation={0} className="ops-panel zone-panel">
          <div className="ops-panel-heading">
            <div>
              <span className="ops-eyebrow">FLEET MANAGEMENT · GEO-ZONES</span>
              <h2>Coverage around Hyderabad</h2>
            </div>
            <Button startIcon={<LocationOn />}>Manage zones</Button>
          </div>
          <div className="zone-list">
            {fleetZones.map((zone) => (
              <div className="zone-row" key={zone.name}>
                <span className="zone-pin">
                  <LocationOn />
                </span>
                <div className="zone-name">
                  <strong>{zone.name}</strong>
                  <small>{zone.active} drivers active</small>
                </div>
                <div className="zone-coverage">
                  <LinearProgress variant="determinate" value={zone.coverage} />
                  <small>{zone.coverage}% coverage</small>
                </div>
                <IconButton aria-label={`Edit ${zone.name} zone`} size="small">
                  <MoreHoriz />
                </IconButton>
              </div>
            ))}
          </div>
          <div className="zone-map-preview">
            <div className="map-roads" />
            <span className="map-place place-one">JUBILEE HILLS</span>
            <span className="map-place place-two">BANJARA HILLS</span>
            <span className="map-place place-three">MADHAPUR</span>
            <i className="map-dot map-dot-one" />
            <i className="map-dot map-dot-two" />
            <i className="map-dot map-dot-three" />
          </div>
        </Paper>
        <Paper elevation={0} className="ops-panel payout-panel">
          <div className="ops-panel-heading">
            <div>
              <span className="ops-eyebrow">PAYOUTS & INCENTIVES</span>
              <h2>Fleet earnings</h2>
            </div>
            <IconButton aria-label="Fleet earnings options">
              <MoreHoriz />
            </IconButton>
          </div>
          <div className="payout-highlight">
            <div className="payout-icon">
              <Payments />
            </div>
            <div>
              <small>Driver payouts · today</small>
              <strong>₹38,420</strong>
            </div>
            <Chip label="On schedule" size="small" />
          </div>
          <div className="split-row">
            <span>Driver share</span>
            <strong>78%</strong>
          </div>
          <LinearProgress
            variant="determinate"
            value={78}
            className="split-progress"
          />
          <div className="split-row">
            <span>Platform service fee</span>
            <strong>12%</strong>
          </div>
          <LinearProgress
            variant="determinate"
            value={12}
            className="split-progress split-fee"
          />
          <div className="incentive-card">
            <div>
              <TrendingUp />
              <strong>Peak-hour bonus</strong>
            </div>
            <p>+₹45 per completed delivery · 6:00–9:00 PM</p>
            <Button>Adjust incentive</Button>
          </div>
        </Paper>
      </div>
      <div className="fleet-admin-grid">
        <Paper elevation={0} className="ops-panel driver-roster-panel">
          <div className="ops-panel-heading">
            <div>
              <span className="ops-eyebrow">SHARED FLEET · DRIVER ROSTER</span>
              <h2>People on the move</h2>
            </div>
            <Button onClick={onAddDriver} startIcon={<PersonAdd />}>
              Onboard driver
            </Button>
          </div>
          <div className="driver-roster-list">
            {drivers.map((driver) => (
              <div className="driver-roster-row" key={driver.name}>
                <span className="driver-avatar">
                  {driver.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <div>
                  <strong>{driver.name}</strong>
                  <small>{driver.zone}</small>
                </div>
                <StatusChip status={driver.status} />
              </div>
            ))}
          </div>
        </Paper>
      </div>
    </>
  );
}

function MerchantDashboard({
  orders,
  storeOpen,
  inventory,
  onAdvance,
  onToggleInventory,
}: {
  orders: DemoOrder[];
  storeOpen: boolean;
  inventory: number[];
  onAdvance: (id: string) => void;
  onToggleInventory: (index: number, change: number) => void;
}) {
  const stockNames = [
    "Alphonso mangoes",
    "Farm eggs · 6 pack",
    "Fresh curd · 500 g",
    "Whole wheat bread",
  ];
  return (
    <>
      <div className="ops-metrics-grid merchant-metrics">
        <Metric
          label="Today's orders"
          value="24"
          change="6 need your attention"
          icon={<AssignmentTurnedIn />}
        />
        <Metric
          label="Sales today"
          value="₹18,640"
          change="↑ 14% vs. last Tuesday"
          icon={<Payments />}
          tone="orange"
        />
        <Metric
          label="Avg. prep time"
          value="8 min"
          change="Looking good · goal 10 min"
          icon={<Schedule />}
          tone="blue"
        />
        <Metric
          label="Items running low"
          value="3 items"
          change="Update stock before 2 PM"
          icon={<Inventory2 />}
          tone="lime"
        />
      </div>
      <div className="merchant-grid">
        <Paper elevation={0} className="ops-panel order-queue">
          <div className="ops-panel-heading">
            <div>
              <span className="ops-eyebrow">
                LIVE QUEUE · {storeOpen ? "ACCEPTING ORDERS" : "STORE PAUSED"}
              </span>
              <h2>Orders to take care of</h2>
            </div>
            <Chip
              label={`${orders.filter((order) => order.status !== "On route").length} active`}
              size="small"
              className="queue-count"
            />
          </div>
          <div className="order-list">
            {orders.map((order) => (
              <article className="merchant-order" key={order.id}>
                <div className="order-main">
                  <div className="order-id">
                    <strong>{order.id}</strong>
                    <span>{order.age}</span>
                  </div>
                  <div className="order-customer">
                    {order.customer} <span>·</span> ₹{order.total}
                  </div>
                  <p>{order.items.join(" · ")}</p>
                </div>
                <div className="order-actions">
                  <StatusChip status={order.status} />
                  {order.status !== "On route" && (
                    <Button
                      disabled={!storeOpen}
                      onClick={() => onAdvance(order.id)}
                    >
                      {order.status === "New"
                        ? "Accept order"
                        : order.status === "Ready"
                          ? "Request driver pickup"
                          : order.status === "Packing"
                            ? "Mark ready"
                            : "Start packing"}
                      <ArrowForward />
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
          <Button className="queue-footer-button">
            View all orders <ArrowForward />
          </Button>
        </Paper>
        <div className="merchant-side-column">
          <Paper elevation={0} className="ops-panel inventory-panel">
            <div className="ops-panel-heading">
              <div>
                <span className="ops-eyebrow">LOCAL INVENTORY</span>
                <h2>Quick stock check</h2>
              </div>
              <IconButton aria-label="Inventory options">
                <MoreHoriz />
              </IconButton>
            </div>
            {stockNames.map((name, index) => (
              <div className="stock-row" key={name}>
                <div>
                  <strong>{name}</strong>
                  <small>
                    {inventory[index] > 10
                      ? "In stock"
                      : inventory[index] > 0
                        ? "Running low"
                        : "Out of stock"}
                  </small>
                </div>
                <div className="stock-controls">
                  <IconButton
                    size="small"
                    aria-label={`Reduce ${name} stock`}
                    onClick={() => onToggleInventory(index, -1)}
                  >
                    <Close />
                  </IconButton>
                  <strong>{inventory[index]}</strong>
                  <IconButton
                    size="small"
                    aria-label={`Increase ${name} stock`}
                    onClick={() => onToggleInventory(index, 1)}
                  >
                    <Add />
                  </IconButton>
                </div>
              </div>
            ))}
            <Button className="inventory-link" endIcon={<ArrowForward />}>
              Manage full catalogue
            </Button>
          </Paper>
          <Paper elevation={0} className="ops-panel hours-panel">
            <div className="ops-panel-heading">
              <div>
                <span className="ops-eyebrow">STORE DETAILS</span>
                <h2>Hours & pickup</h2>
              </div>
              <IconButton aria-label="Store details options">
                <MoreHoriz />
              </IconButton>
            </div>
            <div className="today-hours">
              <span className="open-indicator" />
              <strong>
                {storeOpen ? "Open until 10:00 PM" : "Temporarily paused"}
              </strong>
              <span>Today · Edit hours</span>
            </div>
            <div className="pickup-status">
              <LocalShipping />
              <span>
                <strong>Shared fleet pickup</strong>
                <small>Driver dispatches when you mark an order ready</small>
              </span>
              <CheckCircle />
            </div>
          </Paper>
        </div>
      </div>
    </>
  );
}

function PickerDashboard({
  checkedItems,
  onToggle,
  timerRunning,
  timerSeconds,
  onTimerToggle,
  onFinish,
}: {
  checkedItems: string[];
  onToggle: (id: string) => void;
  timerRunning: boolean;
  timerSeconds: number;
  onTimerToggle: () => void;
  onFinish: () => void;
}) {
  const progress = Math.round((checkedItems.length / packItems.length) * 100);
  return (
    <div className="picker-layout">
      <Paper elevation={0} className="ops-panel picker-panel">
        <div className="picker-order-bar">
          <div>
            <span className="ops-eyebrow">
              GREEN BASKET MARKET · ORDER TK-2048
            </span>
            <h2>
              Ananya Reddy <span>·</span> 4 items
            </h2>
            <p>
              <LocationOn /> Jubilee Hills · deliver by 12:38 PM
            </p>
          </div>
          <Chip label="Priority batch" className="priority-chip" />
        </div>
        <div className="pick-progress-row">
          <span>
            <strong>
              {checkedItems.length} of {packItems.length}
            </strong>{" "}
            picked and checked
          </span>
          <strong>{progress}%</strong>
        </div>
        <LinearProgress
          variant="determinate"
          value={progress}
          className="pick-progress"
        />
        <div className="pick-list">
          {packItems.map((item) => {
            const done = checkedItems.includes(item.id);
            return (
              <button
                className={`pick-item ${done ? "pick-item-done" : ""}`}
                key={item.id}
                onClick={() => onToggle(item.id)}
              >
                <Checkbox checked={done} tabIndex={-1} disableRipple />
                <span className="pick-item-copy">
                  <strong>{item.name}</strong>
                  <small>{item.detail}</small>
                </span>
                <Chip
                  label={item.location}
                  size="small"
                  className="shelf-chip"
                />
                {done && <CheckCircle className="pick-done-icon" />}
              </button>
            );
          })}
        </div>
        <div className="picker-footer">
          <div className="timer-control">
            <Schedule />
            <strong>{formatTime(timerSeconds)}</strong>
            <span>PACK TARGET</span>
            <Button
              onClick={onTimerToggle}
              startIcon={timerRunning ? <Pause /> : <PlayArrow />}
            >
              {timerRunning ? "Pause" : "Start timer"}
            </Button>
          </div>
          <Button
            className="ops-primary-button finish-pack-button"
            disabled={checkedItems.length !== packItems.length}
            onClick={onFinish}
            endIcon={<Check />}
          >
            Mark packed · notify driver
          </Button>
        </div>
      </Paper>
      <Paper elevation={0} className="ops-panel picker-aside">
        <div className="aside-illustration">
          <Inventory2 />
        </div>
        <span className="ops-eyebrow">GOOD TO KNOW</span>
        <h2>One bag, one careful check.</h2>
        <p>
          Keep chilled items together, check produce for bruising, and seal the
          order before handing it off.
        </p>
        <div className="picker-tip">
          <CheckCircle />
          <span>
            <strong>Cold items last</strong>
            <small>Add the curd and eggs just before sealing.</small>
          </span>
        </div>
        <div className="picker-tip">
          <CheckCircle />
          <span>
            <strong>Driver is nearby</strong>
            <small>Ravi is 4 minutes from your store.</small>
          </span>
        </div>
      </Paper>
    </div>
  );
}

function DriverDashboard({
  completedStops,
  proofs,
  online,
  onCompleteStop,
  onProof,
}: {
  completedStops: string[];
  proofs: Record<string, string>;
  online: boolean;
  onCompleteStop: (id: string) => void;
  onProof: (id: string, fileName: string) => void;
}) {
  const completedCount = completedStops.length;
  return (
    <>
      <div className="ops-metrics-grid driver-metrics">
        <Metric
          label="Today's earnings"
          value="₹1,240"
          change="₹180 peak bonus included"
          icon={<Payments />}
        />
        <Metric
          label="Deliveries done"
          value="8"
          change="12 more to hit your goal"
          icon={<CheckCircle />}
          tone="orange"
        />
        <Metric
          label="Route progress"
          value={`${completedCount} / ${routeStops.length}`}
          change="3 shops · 2 customer stops"
          icon={<Route />}
          tone="blue"
        />
        <Metric
          label="Next incentive"
          value="₹250"
          change="Complete 4 more deliveries"
          icon={<TrendingUp />}
          tone="lime"
        />
      </div>
      <div className="driver-grid">
        <Paper elevation={0} className="ops-panel route-panel">
          <div className="ops-panel-heading">
            <div>
              <span className="ops-eyebrow">OPTIMIZED BATCH · 3.8 KM</span>
              <h2>Jubilee Hills loop</h2>
            </div>
            <Button startIcon={<Route />}>Route map</Button>
          </div>
          <div className="route-stop-list">
            {routeStops.map((stop, index) => {
              const complete = completedStops.includes(stop.id);
              const isPickup = stop.type === "Pickup";
              return (
                <article
                  className={`route-stop ${complete ? "route-stop-complete" : ""}`}
                  key={stop.id}
                >
                  <div className="route-timeline">
                    <span
                      className={`route-point ${isPickup ? "pickup-point" : "drop-point"}`}
                    >
                      {complete ? (
                        <Check />
                      ) : isPickup ? (
                        <Storefront />
                      ) : (
                        <LocationOn />
                      )}
                    </span>
                    {index < routeStops.length - 1 && (
                      <span className="route-connector" />
                    )}
                  </div>
                  <div className="route-stop-content">
                    <div className="route-stop-heading">
                      <span className="stop-type">
                        {stop.type} <i /> {stop.time}
                      </span>
                      <strong>{stop.name}</strong>
                      <small>{stop.address}</small>
                      <p>{stop.detail}</p>
                      {complete ? (
                        <Chip
                          icon={<Check />}
                          label={isPickup ? "Picked up" : "Delivered"}
                          size="small"
                          className="completed-chip"
                        />
                      ) : isPickup ? (
                        <Button
                          className="stop-action"
                          onClick={() => onCompleteStop(stop.id)}
                        >
                          Confirm pickup <ArrowForward />
                        </Button>
                      ) : (
                        <div className="proof-actions">
                          <Button
                            component="label"
                            className="proof-button"
                            startIcon={<AssignmentTurnedIn />}
                          >
                            {proofs[stop.id]
                              ? "Proof added"
                              : "Add delivery proof"}
                            <input
                              hidden
                              type="file"
                              accept="image/*"
                              capture="environment"
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                              ) => {
                                const file = event.target.files?.[0];
                                if (file) onProof(stop.id, file.name);
                              }}
                            />
                          </Button>
                          {proofs[stop.id] && (
                            <Button
                              className="stop-action"
                              onClick={() => onCompleteStop(stop.id)}
                            >
                              Mark delivered <ArrowForward />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Paper>
        <div className="driver-side-column">
          <Paper elevation={0} className="ops-panel earnings-panel">
            <div className="ops-panel-heading">
              <div>
                <span className="ops-eyebrow">TODAY · WED, SEP 30</span>
                <h2>Daily earnings</h2>
              </div>
              <IconButton aria-label="Earnings details">
                <MoreHoriz />
              </IconButton>
            </div>
            <strong className="earnings-total">₹1,240</strong>
            <div className="earning-line">
              <span>Base deliveries · 8</span>
              <strong>₹960</strong>
            </div>
            <div className="earning-line">
              <span>Peak-hour incentive</span>
              <strong>₹180</strong>
            </div>
            <div className="earning-line">
              <span>Customer tips</span>
              <strong>₹100</strong>
            </div>
            <div className="earnings-goal">
              <div>
                <span>Daily goal · ₹1,800</span>
                <strong>69%</strong>
              </div>
              <LinearProgress variant="determinate" value={69} />
            </div>
            <Button className="payout-request">
              View payout history <ArrowForward />
            </Button>
          </Paper>
          <Paper elevation={0} className="ops-panel driver-next-panel">
            <span className="ops-eyebrow">NEXT UP</span>
            <h2>Keep the momentum.</h2>
            <p>
              Finish 4 more deliveries to unlock your ₹250 daily streak bonus.
            </p>
            <LinearProgress variant="determinate" value={40} />
            <div>
              <span>8 complete</span>
              <span>12 delivery goal</span>
            </div>
            <Button startIcon={<LocalShipping />}>
              {online
                ? "Available for batches"
                : "Go online to receive batches"}
            </Button>
          </Paper>
        </div>
      </div>
    </>
  );
}
