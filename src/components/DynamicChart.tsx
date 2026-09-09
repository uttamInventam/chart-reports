"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import { DeviceMetric, DeviceSpecs } from "../types/device";

interface DynamicChartProps {
  data: DeviceMetric[];
  specs?: DeviceSpecs;
  chartType: string;
  unit: string;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#6366f1",
];

export default function DynamicChart({
  data,
  specs,
  chartType,
  unit,
}: DynamicChartProps) {
  // Try to find the primary X and Y keys based on the data
  const keys = data.length > 0 ? Object.keys(data[0]) : [];
  const xKey = keys.includes("batchId")
    ? "batchId"
    : keys.includes("timePoint")
      ? "timePoint"
      : keys.includes("sizeRange")
        ? "sizeRange"
        : keys.includes("status")
          ? "status"
          : keys[0];
  const valueKeys = keys.filter(
    (k) => k !== xKey && typeof data[0][k] === "number",
  );
  const primaryYKey = valueKeys[0] || "value";

  const renderReferenceLines = () => {
    if (!specs) return null;
    return (
      <>
        {specs.target && (
          <ReferenceLine
            y={specs.target}
            stroke="green"
            strokeDasharray="3 3"
            label="Target"
          />
        )}
        {specs.lsl && (
          <ReferenceLine
            y={specs.lsl}
            stroke="red"
            strokeDasharray="3 3"
            label="LSL"
          />
        )}
        {specs.usl && (
          <ReferenceLine
            y={specs.usl}
            stroke="red"
            strokeDasharray="3 3"
            label="USL"
          />
        )}
        {specs.lcl && (
          <ReferenceLine
            y={specs.lcl}
            stroke="orange"
            strokeDasharray="3 3"
            label="LCL"
          />
        )}
        {specs.ucl && (
          <ReferenceLine
            y={specs.ucl}
            stroke="orange"
            strokeDasharray="3 3"
            label="UCL"
          />
        )}
      </>
    );
  };

  const wrapChart = (children: React.ReactNode) => (
    <div className="w-full h-64 sm:h-80 lg:h-96">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );

  switch (chartType) {
    case "Control":
      return wrapChart(
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis
            label={{ value: unit, angle: -90, position: "insideLeft" }}
            domain={["auto", "auto"]}
          />
          <Tooltip />
          <Legend />
          {renderReferenceLines()}
          <Line
            type="monotone"
            dataKey={primaryYKey}
            stroke="#3b82f6"
            activeDot={{ r: 8 }}
            name={primaryYKey}
          />
        </ComposedChart>,
      );

    case "Line":
      return wrapChart(
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis
            label={{ value: unit, angle: -90, position: "insideLeft" }}
            domain={["auto", "auto"]}
          />
          <Tooltip />
          <Legend />
          {specs?.target && (
            <ReferenceLine
              y={specs.target}
              stroke="green"
              strokeDasharray="3 3"
              label="Target"
            />
          )}
          <Line
            type="monotone"
            dataKey={primaryYKey}
            stroke="#3b82f6"
            activeDot={{ r: 8 }}
            name={primaryYKey}
          />
        </LineChart>,
      );

    case "Cumulative Line":
      const cumulativeData = data.reduce<{ sum: number; data: unknown[] }>(
        (acc, d) => {
          const sum = acc.sum + (Number(d[primaryYKey]) || 0);
          acc.data.push({ ...d, cumulativeValue: parseFloat(sum.toFixed(2)) });
          return { sum, data: acc.data };
        },
        { sum: 0, data: [] },
      ).data;
      return wrapChart(
        <LineChart
          data={cumulativeData}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis
            label={{ value: "Cumulative", angle: -90, position: "insideLeft" }}
            domain={["auto", "auto"]}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="cumulativeValue"
            stroke="#8b5cf6"
            activeDot={{ r: 8 }}
            name="Cumulative Total"
          />
        </LineChart>,
      );

    case "Multi-Vessel Line":
      return wrapChart(
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis label={{ value: unit, angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          {renderReferenceLines()}
          {valueKeys.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[i % COLORS.length]}
              name={key}
            />
          ))}
        </LineChart>,
      );

    case "Bar":
      return wrapChart(
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="10%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis label={{ value: unit, angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          {renderReferenceLines()}
          <Bar dataKey={primaryYKey} fill="#3b82f6" name={primaryYKey} />
        </BarChart>,
      );

    case "Histogram":
      return wrapChart(
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          barCategoryGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis label={{ value: unit, angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          {renderReferenceLines()}
          <Bar dataKey={primaryYKey} fill="#10b981" name={primaryYKey} />
        </BarChart>,
      );

    case "Box Plot":
      // Faked Box Plot using a min/max bar and a median scatter point
      const boxPlotData = data.map((d) => {
        const val = Number(d[primaryYKey]) || 0;
        const variance = val * 0.05; // 5% variance for a visually appealing box
        return {
          ...d,
          boxRange: [
            parseFloat((val - variance).toFixed(2)),
            parseFloat((val + variance).toFixed(2)),
          ],
          median: val,
        };
      });
      return wrapChart(
        <ComposedChart
          data={boxPlotData}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis
            label={{ value: unit, angle: -90, position: "insideLeft" }}
            domain={["auto", "auto"]}
          />
          <Tooltip />
          <Legend />
          {renderReferenceLines()}
          <Bar
            dataKey="boxRange"
            fill="#8884d8"
            name="Range (Min-Max)"
            barSize={20}
          />
          <Scatter dataKey="median" fill="#ff7300" name="Median" />
        </ComposedChart>,
      );

    case "Bullet":
      const bulletData = data.map((d) => {
        const val = Number(d[primaryYKey]) || 0;
        const maxR = (specs?.usl || specs?.target || val) * 1.2;
        return { ...d, maxRange: maxR };
      });
      return wrapChart(
        <ComposedChart
          layout="vertical"
          data={bulletData}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey={xKey} type="category" width={80} />
          <Tooltip />
          <Legend />
          {/* Background Bar representing the max scale */}
          <Bar
            dataKey="maxRange"
            fill="#e5e7eb"
            barSize={30}
            name="Max Range"
          />
          {/* Foreground Bar representing actual value */}
          <Bar
            dataKey={primaryYKey}
            fill="#3b82f6"
            barSize={12}
            name={primaryYKey}
          />
          {specs?.target && (
            <ReferenceLine
              x={specs.target}
              stroke="red"
              strokeWidth={3}
              label="Target"
            />
          )}
        </ComposedChart>,
      );

    case "Grouped Bar":
      return wrapChart(
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {renderReferenceLines()}
          {valueKeys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={COLORS[i % COLORS.length]}
              name={key}
            />
          ))}
        </BarChart>,
      );

    case "Stacked Bar":
      return wrapChart(
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {renderReferenceLines()}
          {valueKeys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={COLORS[i % COLORS.length]}
              name={key}
            />
          ))}
        </BarChart>,
      );

    case "Area":
      return wrapChart(
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {renderReferenceLines()}
          <Area
            type="monotone"
            dataKey={primaryYKey}
            stroke="#8b5cf6"
            fill="#c4b5fd"
            name={primaryYKey}
          />
        </AreaChart>,
      );

    case "Scatter":
      return wrapChart(
        <ScatterChart margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} name={xKey} />
          <YAxis
            dataKey={primaryYKey}
            name={primaryYKey}
            unit={unit}
            domain={["auto", "auto"]}
          />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend />
          {renderReferenceLines()}
          <Scatter name={primaryYKey} data={data} fill="#10b981" />
        </ScatterChart>,
      );

    case "Pie":
      return wrapChart(
        <PieChart>
          <Pie
            data={data}
            dataKey={primaryYKey}
            nameKey={xKey}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={100}
            fill="#82ca9d"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>,
      );

    case "Donut":
      return wrapChart(
        <PieChart>
          <Pie
            data={data}
            dataKey={primaryYKey}
            nameKey={xKey}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#82ca9d"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>,
      );

    case "Gauge": // Half pie chart
      return wrapChart(
        <PieChart>
          <Pie
            data={[
              {
                name: "Value",
                value: (data[data.length - 1]?.[primaryYKey] as number) || 0,
              },
              {
                name: "Empty",
                value:
                  (specs?.usl || 100) -
                  ((data[data.length - 1]?.[primaryYKey] as number) || 0),
              },
            ]}
            dataKey="value"
            cx="50%"
            cy="70%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={0}
          >
            <Cell fill="#3b82f6" />
            <Cell fill="#e5e7eb" />
          </Pie>
          <Tooltip />
        </PieChart>,
      );

    case "Radar":
      return wrapChart(
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey={xKey} />
          <PolarRadiusAxis />
          {valueKeys.map((key, i) => (
            <Radar
              key={key}
              name={key}
              dataKey={key}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.6}
            />
          ))}
          <Tooltip />
          <Legend />
        </RadarChart>,
      );

    case "KPI Card":
      const latestData = data[data.length - 1];
      return (
        <div className="w-full h-64 flex flex-col items-center justify-center bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm font-medium text-blue-600 mb-2 uppercase tracking-wide">
            Latest Status
          </p>
          <div className="text-6xl font-bold text-gray-900 mb-4">
            {latestData[primaryYKey]}{" "}
            <span className="text-2xl text-gray-500">{unit}</span>
          </div>
          <p className="text-gray-500 text-sm">
            Target: {specs?.target || "N/A"}
          </p>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-500">
            Chart type &quot;{chartType}&quot; not implemented yet.
          </p>
        </div>
      );
  }
}
