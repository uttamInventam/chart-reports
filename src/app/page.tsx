"use client";

import { useState, useRef, useEffect } from "react";
import { ipqcDevices } from "@/lib/ipqcDevices";
import { generatePDF } from "@/lib/pdf-export";
import dynamic from "next/dynamic";
import { FileDown, Server, Activity, BarChart2 } from "lucide-react";
import { toPng } from 'html-to-image';

const DynamicChart = dynamic(() => import("@/components/DynamicChart"), { ssr: false });

export default function Home() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(ipqcDevices[0].id);
  const [activeTab, setActiveTab] = useState<string>(ipqcDevices[0].availableCharts[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const selectedDevice = ipqcDevices.find((d) => d.id === selectedDeviceId) || ipqcDevices[0];

  useEffect(() => {
    if (!selectedDevice.availableCharts.includes(activeTab)) {
      setActiveTab(selectedDevice.availableCharts[0]);
    }
  }, [selectedDevice, activeTab]);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      if (!chartRef.current) return;
      const chartBase64 = await toPng(chartRef.current, { cacheBust: true, backgroundColor: '#ffffff' });
      await generatePDF(selectedDevice, activeTab, chartBase64);
    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header and Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">IPQC Device Reporting</h1>
              <p className="text-sm text-gray-500">Monitor and export in-process quality control metrics</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="w-full sm:w-80">
              <label htmlFor="device-select" className="sr-only">Select Device</label>
              <select
                id="device-select"
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                {ipqcDevices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Generating...
                </>
              ) : (
                <>
                  <FileDown size={18} />
                  Export PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                <Server size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{selectedDevice.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>ID: {selectedDevice.id}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${
                      selectedDevice.status === 'Online' ? 'bg-green-500' :
                      selectedDevice.status === 'Offline' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></span>
                    {selectedDevice.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{selectedDevice.location}</p>
              <p className="text-xs text-gray-500" suppressHydrationWarning>Updated: {new Date(selectedDevice.lastUpdated).toLocaleString()}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 border-b border-gray-100">
              <BarChart2 size={18} className="text-gray-400" />
              {selectedDevice.availableCharts.map((chartType) => (
                <button
                  key={chartType}
                  onClick={() => setActiveTab(chartType)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                    activeTab === chartType
                      ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {chartType}
                </button>
              ))}
            </div>

            <div className="w-full flex justify-center" ref={chartRef}>
              <DynamicChart 
                data={selectedDevice.metrics} 
                specs={selectedDevice.specs} 
                chartType={activeTab} 
                unit={selectedDevice.unit} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
