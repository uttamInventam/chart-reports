import React, { forwardRef } from 'react';
import { Device } from '../types/device';
import dynamic from 'next/dynamic';

// Dynamically import the chart to avoid SSR issues with Recharts
const DynamicChart = dynamic(() => import('./DynamicChart'), { ssr: false });

interface ReportContainerProps {
  device: Device;
  activeChartType: string;
}

const ReportContainer = forwardRef<HTMLDivElement, ReportContainerProps>(
  ({ device, activeChartType }, ref) => {
    const dataKeys = device.metrics.length > 0 ? Object.keys(device.metrics[0]) : [];

    return (
      <div
        ref={ref}
        className="absolute left-[-9999px] top-[-9999px] bg-[#ffffff] text-[#000000] p-10 flex flex-col items-center"
        style={{ width: '210mm', minHeight: '297mm' }}
      >
        <div className="w-full flex flex-col items-center border-b-2 border-[#e5e7eb] pb-6 mb-8">
          <h1 className="text-3xl font-bold text-[#1f2937]">Company Name Inc.</h1>
          <h2 className="text-xl text-[#4b5563] mt-2">IPQC Device Performance Report</h2>
          <p className="text-sm text-[#6b7280] mt-4" suppressHydrationWarning>
            Generated on: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="w-full mb-8">
          <h3 className="text-2xl font-semibold mb-2">Device Details</h3>
          <div className="grid grid-cols-2 gap-4 text-lg">
            <div><strong>Name:</strong> {device.name}</div>
            <div><strong>ID:</strong> {device.id}</div>
            <div><strong>Status:</strong> {device.status}</div>
            <div><strong>Location:</strong> {device.location}</div>
            <div><strong>Measurement Unit:</strong> {device.unit}</div>
            <div><strong>Chart Type:</strong> {activeChartType}</div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center mb-12 flex-grow">
          <h3 className="text-2xl font-semibold mb-6">Performance Trend ({activeChartType})</h3>
          <div className="w-full flex justify-center">
            <DynamicChart data={device.metrics} specs={device.specs} chartType={activeChartType} unit={device.unit} />
          </div>
        </div>

        <div className="w-full">
          <h3 className="text-2xl font-semibold mb-4">Summary Table</h3>
          <table className="w-full text-left border-collapse border border-[#e5e7eb]">
            <thead>
              <tr className="bg-[#f3f4f6]">
                {dataKeys.map((key) => (
                  <th key={key} className="border border-[#e5e7eb] p-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {device.metrics.map((metric, idx) => (
                <tr key={idx}>
                  {dataKeys.map((key) => (
                    <td key={key} className="border border-[#e5e7eb] p-2">
                      {metric[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

ReportContainer.displayName = 'ReportContainer';

export default ReportContainer;
