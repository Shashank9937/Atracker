import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { useEffect, useRef } from 'react';
import { Card } from '../components/Card';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

export const LineChart = ({ title, subtitle, labels, data, borderColor, backgroundColor }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return undefined;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: title,
            data,
            borderColor,
            backgroundColor,
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            borderColor: 'rgba(148, 163, 184, 0.12)',
            borderWidth: 1,
            titleColor: '#f8fafc',
            bodyColor: '#e2e8f0',
            padding: 12,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(148, 163, 184, 0.8)' },
          },
          y: {
            grid: { color: 'rgba(148, 163, 184, 0.12)' },
            ticks: { color: 'rgba(148, 163, 184, 0.8)' },
            border: { display: false },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [backgroundColor, borderColor, data, labels, title]);

  return (
    <Card className="p-5">
      <div className="mb-4">
        <h3 className="section-title">{title}</h3>
        <p className="section-copy">{subtitle}</p>
      </div>
      <div className="h-64">
        <canvas ref={canvasRef} />
      </div>
    </Card>
  );
};
