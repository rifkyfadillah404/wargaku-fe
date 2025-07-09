import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const PaymentStatusChart = ({ stats }) => {
  const data = {
    labels: ['Disetujui', 'Menunggu', 'Ditolak'],
    datasets: [
      {
        data: [
          stats.payments?.approved || 0,
          stats.payments?.pending || 0,
          stats.payments?.rejected || 0,
        ],
        backgroundColor: [
          '#10b981', // Green
          '#f59e0b', // Yellow
          '#ef4444', // Red
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <Card className="h-100">
      <CardHeader>
        <CardTitle className="d-flex align-items-center">
          <i className="bi bi-pie-chart me-2 text-primary"></i>
          Status Pembayaran
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '300px' }}>
          <Doughnut data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export const MonthlyPaymentChart = ({ monthlyData = [] }) => {
  const data = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Pembayaran (Rp)',
        data: monthlyData.map(item => item.amount),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Rp ${context.parsed.y.toLocaleString('id-ID')}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rp ' + value.toLocaleString('id-ID');
          }
        }
      }
    },
  };

  return (
    <Card className="h-100">
      <CardHeader>
        <CardTitle className="d-flex align-items-center">
          <i className="bi bi-bar-chart me-2 text-primary"></i>
          Pembayaran Bulanan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '300px' }}>
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};
