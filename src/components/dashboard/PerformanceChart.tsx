import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceChart: React.FC = () => {
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Game Quality Rating',
        data: [80, 75, 82, 88],
        borderColor: 'rgb(30, 64, 175)',
        backgroundColor: 'rgba(30, 64, 175, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Mental Focus',
        data: [65, 70, 78, 85],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Tilt Frequency',
        data: [45, 30, 20, 15],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      },
    ],
  };

  return <Line options={options} data={data} height={80} />;
};

export default PerformanceChart;