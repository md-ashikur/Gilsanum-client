import React, { useState, useMemo } from "react";
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useGetChartDataQuery } from "../../store/api";
import { useUIStore } from "../../store/uiStore";
import sales from "/images/Dual-Sim-Signal-4--Streamline-Ultimate.svg";

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
  const chartData = useMemo(() => {
    if (!response?.data) return { categories: [], series: [] };

    const apiData = response.data;
    interface DataItem {
      month: string;
      value: number;
      refund: number;
      isHighlighted: boolean;
    }
    let rawData: DataItem[] = [];

    if (timePeriod === "month" && apiData.monthly) {
      rawData = apiData.monthly.map((item, index) => ({
        month: item.month,
        value: item.revenue,
        refund: Math.round(item.revenue * 0.15), // Mock refund as 15% of revenue
        isHighlighted: index === (apiData.monthly?.length || 1) - 1, // Highlight current month
      }));
    } else if (timePeriod === "year" && apiData.daily) {
      rawData = apiData.daily.map((item, index) => ({
        month: item.label,
        value: item.revenue,
        refund: Math.round(item.revenue * 0.15),
        isHighlighted: index === (apiData.daily?.length || 1) - 1, // Highlight today
      }));
    }

    return {
      categories: rawData.map(item => item.month),
      series: [
        {
          name: 'Checkout',
          data: rawData.map(item => item.value)
        },
        {
          name: 'Refund',
          data: rawData.map(item => item.refund)
        }
      ]
    };
  }, [response?.data, timePeriod]);

  // ApexCharts options
  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 280,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        speed: 800
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '37px',
        borderRadius: 18,
        borderRadiusApplication: 'around',
        dataLabels: {
          position: 'top'
        }
      }
    },
    colors: ['#B9CFF9', '#E5E7EB'],
    fill: {
      colors: ['#414FF4', '#E5E7EB'],
      type: 'solid'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: false
    },
    xaxis: {
      categories: chartData.categories,
      axisBorder: {
        show: true,
        color: '#E5E7EB'
      },
      axisTicks: {
        show: true,
        color: '#E5E7EB',
        height: 6
      },
      labels: {
        style: {
          colors: '#A3A3A3',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: '#A3A3A3',
          fontSize: '12px'
        },
        formatter: (value: number) => {
          if (value >= 1000) {
            return `${value / 1000}k`;
          }
          return value.toString();
        }
      }
    },
    grid: {
      show: true,
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    legend: {
      show: false
    },
    tooltip: {
      shared: false,
      intersect: true,
      custom: function({ series, seriesIndex, dataPointIndex }) {
        // Tooltip content
        if (seriesIndex === 0) {
          // Checkout column hovered (left side) - show income
          const checkoutValue = series[0][dataPointIndex];
          return `
            <div class=" bg-white text-gray-800 text-xs px-3 py-2 border border-gray-200 rounded shadow-lg">
              <div class="flex flex-col items-center">
                <span class="text-[12px] text-secondary-200 opacity-70 mr-2">Income:</span>
                <span class="font-semibold text-[14px] text-secondary-200">$${checkoutValue?.toLocaleString() || 0}</span>
              </div>

              
            </div>
          
          `;
        } else {
          // Refund column hovered (right side) - show refund
          const refundValue = series[1][dataPointIndex];
          return `
            <div class="bg-white text-gray-800 text-xs px-3 py-2 border border-gray-200 rounded shadow-lg">
              <div class="flex items-center">
                <span class="text-[10px] opacity-70 mr-2">Refund:</span>
                <span class="font-semibold text-[12px]">$${refundValue?.toLocaleString() || 0}</span>
              </div>
            </div>
          `;
        }
      },
      marker: {
        show: true,
        fillColors: ['#414FF4', '#E5E7EB']
      }
    },
    responsive: [{
      breakpoint: 1024,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '45px'
          }
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '11px'
            }
          }
        }
      }
    }, {
      breakpoint: 768,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '50px'
          }
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '10px'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '10px'
            }
          }
        }
      }
    }, {
      breakpoint: 640,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '60px'
          }
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '9px'
            },
            maxHeight: 40,
            offsetY: 5
          }
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '9px'
            }
          }
        },
        grid: {
          padding: {
            left: 5,
            right: 5
          }
        }
      }
    }]
  };

  const handleTimePeriodChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTimePeriod(event.target.value as "month" | "year");
  };

  if (isLoading) {
    return (
      <div className=" bg-white rounded-[8px] p-4 border border-white-200 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-[8px] p-4 border border-white-200 overflow-hidden flex items-center justify-center">
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
    <div className="lg:col-span-2 bg-white rounded-[8px] p-3 sm:p-4 border border-white-200 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <img src={sales} alt="" className="w-5 h-5 sm:w-6 sm:h-6" />
          <h3 className="opacity-80 text-secondary-200 text-sm sm:text-base">Sale Analytics</h3>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm w-full sm:w-auto">
          {/* Legend */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 sm:w-[14px] sm:h-[14px] bg-[#B9CFF9] rounded-[2px]"></div>
              <span className="text-secondary-200 opacity-80">Refund</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 sm:w-[14px] sm:h-[14px] bg-[#414FF4] rounded-[2px]"></div>
              <span className="text-secondary-200 opacity-80">Checkout</span>
            </div>
          </div>
          
          {/* Dropdown */}
          <div className="relative w-full sm:w-auto sm:ml-4 lg:ml-10">
            <select
              className="appearance-none bg-white border border-white-200 rounded-[8px] px-2 sm:px-[10px] py-2 text-xs sm:text-sm text-secondary-200 pr-6 sm:pr-6 focus:outline-none cursor-pointer w-full sm:w-auto"
              value={timePeriod}
              onChange={handleTimePeriodChange}
            >
              <option value="month">Last 6 Months</option>
              <option value="year">Last 7 Days</option>
            </select>
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-secondary-200 pointer-events-none"
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
      <div className="h-48 sm:h-56 lg:h-64 relative overflow-hidden">
        <Chart
          options={{
            ...chartOptions,
            chart: {
              ...chartOptions.chart,
              height: '100%'
            }
          }}
          series={chartData.series}
          type="bar"
          height="100%"
        />
      </div>
    </div>
  );
};

export default SalesAnalytics;
