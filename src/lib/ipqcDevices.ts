import { Device } from '../types/device';

// Generate some sequential batch IDs
const generateBatches = (count: number) => Array.from({ length: count }, (_, i) => `B-${1000 + i}`);

// Deterministic pseudo-random number generator to prevent SSR hydration mismatches
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed + 123456) * 10000;
  return x - Math.floor(x);
};

export const ipqcDevices: Device[] = [
  {
    id: 'ipqc-001',
    name: 'Tablet Hardness Tester',
    unit: 'N',
    status: 'Online',
    location: 'Compression Rm 1',
    lastUpdated: new Date(1710000000000).toISOString(), // Fixed date to avoid hydration error
    availableCharts: ['Bar', 'Control', 'Line', 'Histogram', 'Box Plot', 'Scatter', 'Gauge'],
    specs: { target: 150, lsl: 130, usl: 170, lcl: 140, ucl: 160 },
    metrics: generateBatches(20).map((batch, i) => ({
      batchId: batch,
      value: Math.floor(pseudoRandom(100 + i) * (165 - 135 + 1)) + 135,
    })),
  },
  {
    id: 'ipqc-002',
    name: 'Friability Tester',
    unit: '%',
    status: 'Online',
    location: 'Compression Rm 2',
    lastUpdated: new Date(1710000000000).toISOString(),
    availableCharts: ['Gauge', 'Line', 'Bar', 'Bullet'],
    specs: { target: 0.5, usl: 1.0 },
    metrics: generateBatches(15).map((batch, i) => ({
      batchId: batch,
      value: parseFloat((pseudoRandom(200 + i) * 0.8).toFixed(2)),
    })),
  },
  {
    id: 'ipqc-003',
    name: 'Disintegration Test Apparatus',
    unit: 'min',
    status: 'Online',
    location: 'QC Lab A',
    lastUpdated: new Date(1710000000000).toISOString(),
    availableCharts: ['Bar', 'Control', 'Box Plot', 'Histogram'],
    specs: { target: 15, usl: 30 },
    metrics: generateBatches(15).map((batch, i) => ({
      batchId: batch,
      value: Math.floor(pseudoRandom(300 + i) * 10) + 10,
    })),
  },
  {
    id: 'ipqc-004',
    name: 'Dissolution Test Apparatus',
    unit: '% released',
    status: 'Online',
    location: 'QC Lab B',
    lastUpdated: new Date(1710000000000).toISOString(),
    availableCharts: ['Line', 'Area', 'Scatter', 'Multi-Vessel Line'],
    specs: { target: 85, lsl: 80 },
    metrics: ['5m', '10m', '15m', '30m', '45m', '60m'].map((timePoint, index) => {
      const base = Math.min(20 * (index + 1), 95);
      return {
        timePoint,
        vessel1: parseFloat((base + (pseudoRandom(401 + index) * 5 - 2)).toFixed(1)),
        vessel2: parseFloat((base + (pseudoRandom(402 + index) * 5 - 2)).toFixed(1)),
        vessel3: parseFloat((base + (pseudoRandom(403 + index) * 5 - 2)).toFixed(1)),
        vessel4: parseFloat((base + (pseudoRandom(404 + index) * 5 - 2)).toFixed(1)),
        vessel5: parseFloat((base + (pseudoRandom(405 + index) * 5 - 2)).toFixed(1)),
        vessel6: parseFloat((base + (pseudoRandom(406 + index) * 5 - 2)).toFixed(1)),
      };
    }),
  },
  {
    id: 'ipqc-005',
    name: 'Weight Variation Tester',
    unit: 'mg',
    status: 'Online',
    location: 'Compression Rm 1',
    lastUpdated: new Date(1710000000000).toISOString(),
    availableCharts: ['Control', 'Scatter', 'Box Plot', 'Histogram', 'Bar'],
    specs: { target: 500, lsl: 475, usl: 525, lcl: 485, ucl: 515 },
    metrics: generateBatches(30).map((batch, i) => ({
      batchId: batch,
      value: parseFloat((500 + (pseudoRandom(500 + i) * 30 - 15)).toFixed(1)),
    })),
  },
  {
    id: 'ipqc-006',
    name: 'Thickness/Diameter Tester',
    unit: 'mm',
    status: 'Maintenance',
    location: 'Compression Rm 2',
    lastUpdated: new Date(1710000000000 - 86400000).toISOString(),
    availableCharts: ['Control', 'Bar', 'Box Plot', 'Histogram'],
    specs: { target: 5.0, lsl: 4.8, usl: 5.2 },
    metrics: generateBatches(20).map((batch, i) => ({
      batchId: batch,
      value: parseFloat((5.0 + (pseudoRandom(600 + i) * 0.3 - 0.15)).toFixed(2)),
    })),
  },
  {
    id: 'ipqc-007',
    name: 'Leak Test Apparatus (Blister/Strip)',
    unit: 'Pass/Fail',
    status: 'Online',
    location: 'Packaging Line 1',
    lastUpdated: new Date(1710000000000).toISOString(),
    availableCharts: ['Pie', 'Donut', 'Stacked Bar', 'KPI Card'],
    specs: {},
    metrics: [
      { status: 'Pass', count: 950 },
      { status: 'Fail - Pin hole', count: 30 },
      { status: 'Fail - Seal', count: 20 }
    ],
  },
  {
    id: 'ipqc-008',
    name: 'pH Meter',
    unit: 'pH',
    status: 'Online',
    location: 'Liquid Prep Area',
    lastUpdated: new Date(1710000000000).toISOString(),
    availableCharts: ['Line', 'Gauge', 'Control', 'Bar'],
    specs: { target: 7.0, lsl: 6.5, usl: 7.5 },
    metrics: generateBatches(15).map((batch, i) => ({
      batchId: batch,
      value: parseFloat((7.0 + (pseudoRandom(800 + i) * 0.6 - 0.3)).toFixed(2)),
    })),
  },
  {
    id: 'ipqc-009',
    name: 'Viscosity Tester',
    unit: 'cP',
    status: 'Online',
    location: 'Ointment Line',
    lastUpdated: new Date(1710000000000).toISOString(),
    availableCharts: ['Line', 'Control', 'Bar', 'Box Plot'],
    specs: { target: 25000, lsl: 20000, usl: 30000 },
    metrics: generateBatches(10).map((batch, i) => ({
      batchId: batch,
      value: Math.floor(25000 + (pseudoRandom(900 + i) * 6000 - 3000)),
    })),
  },
  {
    id: 'ipqc-010',
    name: 'Moisture Analyzer (LOD)',
    unit: '%',
    status: 'Online',
    location: 'Granulation Rm 1',
    lastUpdated: new Date(1710000000000).toISOString(),
    availableCharts: ['Bar', 'Line', 'Control', 'Gauge'],
    specs: { target: 2.0, usl: 3.0, lsl: 1.0 },
    metrics: generateBatches(12).map((batch, i) => ({
      batchId: batch,
      value: parseFloat((2.0 + (pseudoRandom(1000 + i) * 0.8 - 0.4)).toFixed(2)),
    })),
  },
  {
    id: 'ipqc-011',
    name: 'Bulk & Tapped Density Tester',
    unit: 'g/mL',
    status: 'Online',
    location: 'Granulation Rm 2',
    lastUpdated: new Date(1710000000000).toISOString(),
    availableCharts: ['Grouped Bar', 'Stacked Bar', 'Line', 'Radar'],
    specs: { target: 0.6 },
    metrics: generateBatches(8).map((batch, i) => {
      const bulk = parseFloat((0.5 + pseudoRandom(1100 + i) * 0.1).toFixed(3));
      const tapped = parseFloat((bulk + pseudoRandom(1150 + i) * 0.15).toFixed(3));
      return {
        batchId: batch,
        bulkDensity: bulk,
        tappedDensity: tapped,
        carrsIndex: parseFloat((((tapped - bulk) / tapped) * 100).toFixed(1)),
      };
    }),
  },
  {
    id: 'ipqc-012',
    name: 'Assay / Content Uniformity (HPLC)',
    unit: '% assay',
    status: 'Offline',
    location: 'QC Lab Main',
    lastUpdated: new Date(1710000000000).toISOString(),
    availableCharts: ['Control', 'Histogram', 'Box Plot', 'Bar', 'Scatter'],
    specs: { target: 100, lsl: 95, usl: 105, lcl: 98, ucl: 102 },
    metrics: generateBatches(20).map((batch, i) => ({
      batchId: batch,
      value: parseFloat((100 + (pseudoRandom(1200 + i) * 6 - 3)).toFixed(1)),
    })),
  },
  {
    id: 'ipqc-013',
    name: 'Particle Size Analyzer',
    unit: 'µm',
    status: 'Online',
    location: 'Granulation Rm 1',
    lastUpdated: new Date(1710000000000).toISOString(),
    availableCharts: ['Histogram', 'Bar', 'Cumulative Line', 'Area'],
    specs: { target: 150 },
    metrics: [
      { sizeRange: '0-50', percentage: 5 },
      { sizeRange: '51-100', percentage: 15 },
      { sizeRange: '101-150', percentage: 40 },
      { sizeRange: '151-200', percentage: 25 },
      { sizeRange: '201-250', percentage: 10 },
      { sizeRange: '>250', percentage: 5 },
    ],
  },
  {
    id: 'ipqc-014',
    name: 'Torque Tester (Cap/Closure)',
    unit: 'N·cm',
    status: 'Online',
    location: 'Packaging Line 2',
    lastUpdated: new Date(1710000000000).toISOString(),
    availableCharts: ['Bar', 'Control', 'Box Plot', 'Histogram'],
    specs: { target: 15, lsl: 10, usl: 20 },
    metrics: generateBatches(15).map((batch, i) => ({
      batchId: batch,
      value: parseFloat((15 + (pseudoRandom(1400 + i) * 6 - 3)).toFixed(1)),
    })),
  },
  {
    id: 'ipqc-015',
    name: 'Vacuum Leak Test',
    unit: 'mbar drop',
    status: 'Online',
    location: 'Packaging Line 3',
    lastUpdated: new Date(1710000000000).toISOString(),
    availableCharts: ['Line', 'Area', 'Bar', 'Gauge'],
    specs: { target: 0, usl: 10 },
    metrics: generateBatches(20).map((batch, i) => ({
      batchId: batch,
      value: Math.floor(pseudoRandom(1500 + i) * 8), // drop in mbar
    })),
  },
];
