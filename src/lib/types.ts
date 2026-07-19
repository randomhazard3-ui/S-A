// Core domain types, modelled on section 7 (Data Model and Data Ownership)
// of the Developer Specification. Mirrors the mandatory core entities:
// Organisation, User/Membership, Property, Location, Asset/Asset Type,
// Fault Template, Work Order/Visit, Document/Revision, Scan/Asset Anchor,
// PPM Template/Schedule/Completion, BMS Connector/Telemetry Point/Alarm,
// Audit Event/Notification.

export type Role =
  | "SA_SUPER_ADMIN"
  | "SA_OPERATIONS"
  | "SA_ENGINEER"
  | "CUSTOMER_PORTFOLIO_ADMIN"
  | "CUSTOMER_SITE_MANAGER"
  | "CONTRACTOR_ADMIN"
  | "CONTRACTOR_ENGINEER"
  | "READ_ONLY_AUDITOR";

export interface Organisation {
  id: string;
  name: string;
  billingPlan: "MVP" | "Standard" | "Enterprise";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organisationId: string;
  initials: string;
}

export type ComplianceRisk = "on-track" | "due-soon" | "overdue";

export interface Property {
  id: string;
  organisationId: string;
  name: string;
  addressLine1: string;
  town: string;
  postcode: string;
  propertyType: "Office" | "Retail" | "Industrial" | "Residential" | "Mixed use";
  status: "active" | "onboarding" | "inactive";
  openJobs: number;
  compliancePercent: number;
  complianceRisk: ComplianceRisk;
  slaRisk: boolean;
  documentsDue: number;
  lastActivity: string;
  responsibleManager: string;
  region: string;
  heroImage?: string;
  scan?: ScanInfo;
}

export interface Location {
  id: string;
  propertyId: string;
  parentId: string | null;
  kind: "floor" | "room" | "zone";
  name: string;
}

export type AssetLifecycleCondition = "good" | "fair" | "poor" | "unknown";

export interface Asset {
  id: string;
  propertyId: string;
  locationId: string;
  locationLabel: string;
  assetType: string;
  system: string;
  tagCode: string;
  manufacturer?: string;
  model?: string;
  serial?: string;
  installDate?: string;
  expectedLifeYears?: number;
  condition: AssetLifecycleCondition;
  criticality: "low" | "medium" | "high" | "life-safety";
  nextServiceDue?: string;
  maintenanceContractor?: string;
  status: "in-service" | "faulty" | "decommissioned";
  /** Scan/Asset Anchor (section 7, 9.4) — provider-specific 3D/floor-plan
   * position, stored separately from the asset record itself so the portal
   * never depends on a single 3D provider. Percentage coordinates on the
   * property's current floor-plan image. */
  anchor?: { x: number; y: number };
}

export interface ScanInfo {
  provider: "Matterport" | "Polycam" | "Three.js custom scene";
  capturedAt: string;
  status: "current" | "superseded" | "processing";
  coordinateSystem: string;
  sourceFiles: string;
}

export interface FaultOption {
  code: string;
  label: string;
  suggestedPriority: WorkOrderPriority;
  trade: string;
}

export const ASSET_FAULT_MENU: Record<string, FaultOption[]> = {
  Sink: [
    { code: "SINK_NO_HOT_WATER", label: "No hot water", suggestedPriority: "NORMAL", trade: "Plumbing" },
    { code: "SINK_NO_COLD_WATER", label: "No cold water", suggestedPriority: "NORMAL", trade: "Plumbing" },
    { code: "SINK_BLOCKAGE", label: "Blockage", suggestedPriority: "NORMAL", trade: "Plumbing" },
    { code: "SINK_LEAK", label: "Leak", suggestedPriority: "URGENT", trade: "Plumbing" },
    { code: "SINK_DAMAGED_TAP", label: "Damaged tap", suggestedPriority: "LOW", trade: "Plumbing" },
    { code: "SINK_DAMAGED_BASIN", label: "Damaged basin", suggestedPriority: "LOW", trade: "Plumbing" },
  ],
  "AHU (Air Handling Unit)": [
    { code: "AHU_NO_HEATING", label: "No heating", suggestedPriority: "URGENT", trade: "HVAC" },
    { code: "AHU_NO_COOLING", label: "No cooling", suggestedPriority: "NORMAL", trade: "HVAC" },
    { code: "AHU_UNUSUAL_NOISE", label: "Unusual noise", suggestedPriority: "LOW", trade: "HVAC" },
    { code: "AHU_FAULT_CODE", label: "Fault code on panel", suggestedPriority: "URGENT", trade: "HVAC" },
  ],
  "Fire Door": [
    { code: "DOOR_NOT_CLOSING", label: "Not self-closing", suggestedPriority: "URGENT", trade: "Fabric / Life Safety" },
    { code: "DOOR_SEAL_DAMAGED", label: "Intumescent seal damaged", suggestedPriority: "URGENT", trade: "Fabric / Life Safety" },
    { code: "DOOR_HARDWARE_FAULT", label: "Hardware fault", suggestedPriority: "NORMAL", trade: "Fabric / Life Safety" },
  ],
  "Emergency Lighting": [
    { code: "EL_NOT_ILLUMINATING", label: "Not illuminating", suggestedPriority: "URGENT", trade: "Electrical" },
    { code: "EL_BATTERY_FAULT", label: "Battery fault indicator", suggestedPriority: "URGENT", trade: "Electrical" },
  ],
  "Lift / Elevator": [
    { code: "LIFT_OUT_OF_SERVICE", label: "Out of service", suggestedPriority: "URGENT", trade: "Lifts" },
    { code: "LIFT_UNUSUAL_NOISE", label: "Unusual noise / vibration", suggestedPriority: "NORMAL", trade: "Lifts" },
    { code: "LIFT_DOOR_FAULT", label: "Door fault", suggestedPriority: "URGENT", trade: "Lifts" },
  ],
};

export type WorkOrderPriority = "LOW" | "NORMAL" | "URGENT" | "CRITICAL";

export type WorkOrderStatus =
  | "New"
  | "Triaged"
  | "Assigned"
  | "Accepted"
  | "Scheduled"
  | "In progress"
  | "Awaiting parts"
  | "Quote required"
  | "Temporarily resolved"
  | "Completed"
  | "Customer review"
  | "Closed"
  | "Cancelled / duplicate";

export const WORK_ORDER_STATUSES: WorkOrderStatus[] = [
  "New",
  "Triaged",
  "Assigned",
  "Accepted",
  "Scheduled",
  "In progress",
  "Awaiting parts",
  "Quote required",
  "Temporarily resolved",
  "Completed",
  "Customer review",
  "Closed",
  "Cancelled / duplicate",
];

export interface WorkOrderEvent {
  id: string;
  timestamp: string;
  actor: string;
  description: string;
}

export interface WorkOrder {
  id: string;
  reference: string;
  organisationId: string;
  propertyId: string;
  propertyName: string;
  locationLabel: string;
  assetId: string | null;
  assetLabel: string | null;
  faultCode: string;
  faultLabel: string;
  description: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  slaTargetHours: number;
  raisedBy: string;
  raisedAt: string;
  assignedTo?: string;
  scheduledFor?: string;
  trade: string;
  events: WorkOrderEvent[];
}

export type DocumentCategory =
  | "Drawing"
  | "Schematic"
  | "Survey"
  | "Report"
  | "Certificate"
  | "Isolation record"
  | "O&M manual";

export type DocumentVisibility = "internal" | "contractor" | "customer";

export interface PortalDocument {
  id: string;
  propertyId: string;
  title: string;
  category: DocumentCategory;
  version: string;
  revisionDate: string;
  reviewDate?: string;
  author: string;
  visibility: DocumentVisibility;
  status: "current" | "superseded" | "unverified";
  fileType: "PDF" | "DOCX" | "XLSX" | "DWG" | "Image";
}

export type PPMFrequency =
  | "Daily"
  | "Weekly"
  | "Monthly"
  | "Quarterly"
  | "Six-monthly"
  | "Annual";

export interface PPMTask {
  id: string;
  propertyId: string;
  assetId: string;
  assetLabel: string;
  taskName: string;
  frequency: PPMFrequency;
  contractor: string;
  dueDate: string;
  status: "scheduled" | "due-soon" | "overdue" | "completed" | "exception";
  category: "Fire" | "Water hygiene" | "HVAC" | "Electrical" | "General";
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  oldValue?: string;
  newValue?: string;
}

// Section 10 — BMS and IoT integration. The browser never talks to a BMS
// directly; this models the read-only data the integration layer publishes.

export type TelemetrySource = "BACnet/IP" | "MQTT" | "Vendor API" | "Niagara";

export interface TelemetryReading {
  t: string;
  v: number;
}

export interface TelemetryPoint {
  id: string;
  assetId: string;
  propertyId: string;
  label: string;
  unit: string;
  source: TelemetrySource;
  lastUpdated: string;
  freshness: "live" | "delayed" | "stale";
  readings: TelemetryReading[];
}

export type AlarmSeverity = "info" | "warning" | "critical";

export interface Alarm {
  id: string;
  assetId: string;
  propertyId: string;
  propertyName: string;
  assetLabel: string;
  message: string;
  severity: AlarmSeverity;
  raisedAt: string;
  status: "active" | "acknowledged" | "converted" | "resolved";
  source: TelemetrySource;
}

// Section 5.11 — Notifications and communications.

export type NotificationChannel = "email" | "sms" | "teams";

export interface NotificationItem {
  id: string;
  type:
    | "work_order.created"
    | "work_order.status_changed"
    | "visit.completed"
    | "document.expiring"
    | "ppm.overdue"
    | "bms.alarm_received";
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  href?: string;
}

export interface NotificationPreference {
  eventType: NotificationItem["type"];
  label: string;
  email: boolean;
  sms: boolean;
  teams: boolean;
}

// Section 5.9 — Contractor and engineer workspace.

export interface ContractorCompany {
  id: string;
  name: string;
  trades: string[];
  serviceAreas: string[];
  insuranceExpiry: string;
  competenceDocuments: number;
  approved: boolean;
  responseRate: number;
  firstTimeFixRate: number;
}

export interface Quotation {
  id: string;
  workOrderId: string;
  workOrderReference: string;
  contractor: string;
  amount: number;
  version: number;
  status: "requested" | "submitted" | "approved" | "rejected";
  submittedAt?: string;
  notes: string;
}
