import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card } from '../components/Card';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export const LineChart = ({ title, subtitle, labels, data, borderColor, backgroundColor }) => (
  <Card className="p-5">
    <div className="mb-4">
      <h3 className="section-title">{title}</h3>
      <p className="section-copy">{subtitle}</p>
    </div>
    <div className="h-64">
      <Line
        data={{
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
        }}
        options={{
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
        }}
      />
    </div>
  </Card>
);
