export interface DeviceMetric {
  month: string;
  cpuUsage: number;
  memoryUsage: number;
  bandwidth: number;
}

export interface Device {
  id: string;
  name: string;
  status: 'Online' | 'Offline' | 'Maintenance';
  location: string;
  lastUpdated: string;
  metrics: DeviceMetric[];
}
