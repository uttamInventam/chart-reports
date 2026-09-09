import { Device } from '@/types/device';

export const mockDevices: Device[] = [
  {
    id: 'dev-001',
    name: 'Server Alpha',
    status: 'Online',
    location: 'Data Center 1 - Rack A',
    lastUpdated: new Date().toISOString(),
    metrics: [
      { month: 'Jan', cpuUsage: 45, memoryUsage: 60, bandwidth: 120 },
      { month: 'Feb', cpuUsage: 50, memoryUsage: 62, bandwidth: 135 },
      { month: 'Mar', cpuUsage: 55, memoryUsage: 65, bandwidth: 150 },
      { month: 'Apr', cpuUsage: 60, memoryUsage: 70, bandwidth: 165 },
      { month: 'May', cpuUsage: 62, memoryUsage: 72, bandwidth: 180 },
      { month: 'Jun', cpuUsage: 58, memoryUsage: 68, bandwidth: 145 },
    ],
  },
  {
    id: 'dev-002',
    name: 'Router Beta',
    status: 'Maintenance',
    location: 'Branch Office - Floor 2',
    lastUpdated: new Date(Date.now() - 3600000 * 24).toISOString(),
    metrics: [
      { month: 'Jan', cpuUsage: 25, memoryUsage: 30, bandwidth: 800 },
      { month: 'Feb', cpuUsage: 28, memoryUsage: 32, bandwidth: 820 },
      { month: 'Mar', cpuUsage: 40, memoryUsage: 45, bandwidth: 950 },
      { month: 'Apr', cpuUsage: 85, memoryUsage: 80, bandwidth: 1200 },
      { month: 'May', cpuUsage: 90, memoryUsage: 85, bandwidth: 1250 },
      { month: 'Jun', cpuUsage: 30, memoryUsage: 35, bandwidth: 850 },
    ],
  },
  {
    id: 'dev-003',
    name: 'IoT Gateway Gamma',
    status: 'Online',
    location: 'Warehouse - Zone 4',
    lastUpdated: new Date(Date.now() - 3600000 * 2).toISOString(),
    metrics: [
      { month: 'Jan', cpuUsage: 15, memoryUsage: 20, bandwidth: 15 },
      { month: 'Feb', cpuUsage: 16, memoryUsage: 21, bandwidth: 18 },
      { month: 'Mar', cpuUsage: 15, memoryUsage: 20, bandwidth: 16 },
      { month: 'Apr', cpuUsage: 18, memoryUsage: 22, bandwidth: 20 },
      { month: 'May', cpuUsage: 17, memoryUsage: 21, bandwidth: 19 },
      { month: 'Jun', cpuUsage: 16, memoryUsage: 20, bandwidth: 17 },
    ],
  },
  {
    id: 'dev-004',
    name: 'Firewall Delta',
    status: 'Online',
    location: 'Data Center 1 - Rack B',
    lastUpdated: new Date(Date.now() - 3600000 * 5).toISOString(),
    metrics: [
      { month: 'Jan', cpuUsage: 35, memoryUsage: 40, bandwidth: 500 },
      { month: 'Feb', cpuUsage: 38, memoryUsage: 42, bandwidth: 520 },
      { month: 'Mar', cpuUsage: 42, memoryUsage: 48, bandwidth: 580 },
      { month: 'Apr', cpuUsage: 40, memoryUsage: 45, bandwidth: 550 },
      { month: 'May', cpuUsage: 45, memoryUsage: 50, bandwidth: 600 },
      { month: 'Jun', cpuUsage: 41, memoryUsage: 47, bandwidth: 570 },
    ],
  },
];