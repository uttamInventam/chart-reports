export interface DeviceMetric {
  // Allow dynamic keys (e.g., batchId, value, vessel1, etc.)
  [key: string]: string | number;
}

export interface DeviceSpecs {
  target?: number;
  lsl?: number; // Lower Specification Limit
  usl?: number; // Upper Specification Limit
  lcl?: number; // Lower Control Limit
  ucl?: number; // Upper Control Limit
  [key: string]: number | undefined;
}

export interface Device {
  id: string;
  name: string;
  status: 'Online' | 'Offline' | 'Maintenance';
  location: string;
  lastUpdated: string;
  unit: string;
  availableCharts: string[];
  specs?: DeviceSpecs;
  metrics: DeviceMetric[];
}
