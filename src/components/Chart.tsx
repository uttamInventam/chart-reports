"use client";

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DeviceMetric } from '../types/device';

interface ChartProps {
  data: DeviceMetric[];
}

export default function Chart({ data }: ChartProps) {
  return (
    <div className="w-full h-64 sm:h-80 lg:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="cpuUsage"
            name="CPU Usage (%)"
            stroke="#3b82f6"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="memoryUsage"
            name="Memory Usage (%)"
            stroke="#10b981"
          />
          <Line
            type="monotone"
            dataKey="bandwidth"
            name="Bandwidth (Mbps)"
            stroke="#8b5cf6"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
