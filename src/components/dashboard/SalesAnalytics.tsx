import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { useGetChartDataQuery } from "../../store/api";
import { useUIStore } from "../../store/uiStore";
import sales from "/images/Dual-Sim-Signal-4--Streamline-Ultimate.svg";

// Custom tooltip component with hover circle
const CustomTooltip = ({
  active,
  payload,
  coordinate,
}: {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    payload: {
      month: string;
      value: number;
      refund: number;
      isHighlighted?: boolean;
    };
  }>;
  coordinate?: { x: number; y: number };
}) => {
  if (!active || !payload || !payload.length || !coordinate) {
    return null;
  }

  const refundData = payload.find((p) => p.dataKey === "refund");
  const valueData = payload.find((p) => p.dataKey === "value");

  // Determine which bar is being hovered based on the payload
  const isHoveringRefund = payload[0]?.dataKey === "refund";
  const activeData = isHoveringRefund ? refundData : valueData;

  if (!activeData) return null;

  // Always show "Income" instead of showing refund
  const tooltipLabel = "Income";
  const value = valueData?.value || 0; // Always show the income value

  // Calculate tooltip position with proper boundaries and centering
  const tooltipWidth = 80;
  const tooltipHeight = 50;

  // Position tooltip above the bar
  let tooltipX = coordinate.x - tooltipWidth / 2;
  let tooltipY = coordinate.y - tooltipHeight - 15;

  // Ensure tooltip stays within reasonable bounds
  tooltipX = Math.max(
    10,
    Math.min(tooltipX, window.innerWidth - tooltipWidth - 10)
  );
  tooltipY = Math.max(10, tooltipY);

  return (
    <div className="relative pointer-events-none">
      {/* Tooltip */}
      <div
        className="bg-white text-secondary-200 text-xs px-2 py-1 border border-gray-200 rounded shadow-lg z-20"
        style={{
          position: "fixed",
          left: `${tooltipX + 283}px`,
          top: `${tooltipY + 240}px`,
          width: `${tooltipWidth}px`,
          textAlign: "left",
        }}
      >
        <div className="text-[10px] mb-1 opacity-70 text-left">
          {tooltipLabel}:
        </div>
        <div className="font-semibold text-[12px] text-left">
          ${value?.toLocaleString() || 0}
        </div>
      </div>

      {/* Hover circle indicator - positioned on the bar */}
      <div
        className="w-[16px] h-[16px] rounded-full z-30 bg-secondary-200 border-2 border-white"
        style={{
          position: "fixed",
          left: `${coordinate.x + 328}px`,
          top: `${coordinate.y + 220}px`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

const SalesAnalytics: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<"month" | "year">("month");
  const { data: response, isLoading, error } = useGetChartDataQuery();
  const { addNotification } = useUIStore();

  React.useEffect(() => {
    if (error) {
      addNotification("error", "Failed to load chart data");
    }
  }, [error, addNotification]);

  // Transform the API response to chart data format
  const chartData = React.useMemo(() => {
    if (!response?.data) return [];

    const apiData = response.data;

    if (timePeriod === "month" && apiData.monthly) {
      return apiData.monthly.map((item, index) => ({
        month: item.month,
        value: item.revenue,
        refund: Math.round(item.revenue * 0.15), // Mock refund as 15% of revenue
        isHighlighted: index === (apiData.monthly?.length || 1) - 1, // Highlight current month
      }));
    }

    if (timePeriod === "year" && apiData.daily) {
      return apiData.daily.map((item, index) => ({
        month: item.label,
        value: item.revenue,
        refund: Math.round(item.revenue * 0.15),
        isHighlighted: index === (apiData.daily?.length || 1) - 1, // Highlight today
      }));
    }

    return [];
  }, [response?.data, timePeriod]);

  const handleTimePeriodChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTimePeriod(event.target.value as "month" | "year");
  };

  if (isLoading) {
    return (
      <div className="lg:col-span-2 bg-white w-[617px] h-[364px] rounded-[8px] p-4 border border-white-200 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:col-span-2 bg-white w-[617px] h-[364px] rounded-[8px] p-4 border border-white-200 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg
              className="w-8 h-8 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Failed to load chart data</p>
        </div>
      </div>
    );
  }
  return (
    <div className="lg:col-span-2 bg-white w-[617px] h-[364px] rounded-[8px] p-4 border border-white-200 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <img src={sales} alt="" />
          <h3 className="opacity-80 text-secondary-200"> Sale Analytics</h3>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-[14px] h-[14px] bg-gray-300 rounded-[2px]"></div>
            <span className="text-secondary-200 opacity-80">Refund</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-[14px] h-[14px] bg-blue-400 rounded-[2px]"></div>
            <span className="text-secondary-200 opacity-80">Checkout</span>
          </div>
          <div className="relative ml-10">
            <select
              className="appearance-none bg-white border border-white-200 rounded-[8px] px-[10px] py-2 text-sm text-secondary-200 pr-6 focus:outline-none cursor-pointer"
              value={timePeriod}
              onChange={handleTimePeriodChange}
            >
              <option value="month">Last 6 Months</option>
              <option value="year">Last 7 Days</option>
            </select>
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-200 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 0, left: -15, bottom: 40 }}
          >
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#A3A3A3" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#A3A3A3" }}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `${value / 1000}k`;
                }
                return value.toString();
              }}
              domain={[0, "dataMax"]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
              position={{ x: 0, y: 0 }}
            />
            {/* First bar (Refund) - Background/wider bar */}
            <Bar
              dataKey="refund"
              radius={[50, 50, 50, 50]}
              barSize={37}
              fill="#E5E7EB"
              stroke="none"
            />
            {/* Second bar (Checkout) - Foreground/narrower bar */}
            <Bar
              dataKey="value"
              radius={[50, 50, 50, 50]}
              barSize={37}
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isHighlighted ? "#4169E1" : "#93C5FD"}
                  stroke="none"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesAnalytics;
