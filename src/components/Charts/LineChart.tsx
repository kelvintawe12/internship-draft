import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
const LineChart = ({
  chartView
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  // Mock data for the chart
  const labels = Array.from({
    length: 30
  }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 29 + i);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  });
  const ordersData = Array.from({
    length: 30
  }, () => Math.floor(Math.random() * 50) + 10);
  const revenueData = ordersData.map(orders => orders * (Math.floor(Math.random() * 5000) + 5000));
  useEffect(() => {
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const ctx = chartRef.current.getContext('2d');
    // Create datasets based on selected view
    let datasets = [];
    if (chartView === 'orders' || chartView === 'combined') {
      datasets.push({
        label: 'Orders',
        data: ordersData,
        borderColor: '#000000',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        tension: 0.4,
        fill: chartView !== 'combined'
      });
    }
    if (chartView === 'revenue' || chartView === 'combined') {
      datasets.push({
        label: 'Revenue (RWF)',
        data: revenueData,
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: chartView !== 'combined',
        yAxisID: 'y1'
      });
    }
    // Create chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                family: 'sans-serif'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
              family: 'sans-serif'
            },
            bodyFont: {
              family: 'sans-serif'
            },
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.dataset.label === 'Revenue (RWF)') {
                  label += new Intl.NumberFormat('en-US').format(context.parsed.y) + ' RWF';
                } else {
                  label += context.parsed.y;
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                family: 'sans-serif'
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              font: {
                family: 'sans-serif'
              }
            }
          },
          y1: chartView === 'combined' ? {
            position: 'right',
            beginAtZero: true,
            grid: {
              display: false
            },
            ticks: {
              callback: function (value) {
                return value / 1000 + 'k RWF';
              },
              font: {
                family: 'sans-serif'
              }
            }
          } : undefined
        }
      }
    });
    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartView]);
  return <canvas ref={chartRef} />;
};
export default LineChart;