import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card } from '../components/Card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const BarChart = ({ title, subtitle, labels, data, backgroundColor, borderColor }) => (
  <Card className="p-5">
    <div className="mb-4">
      <h3 className="section-title">{title}</h3>
      <p className="section-copy">{subtitle}</p>
    </div>
    <div className="h-64">
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: title,
              data,
              backgroundColor,
              borderColor,
              borderWidth: 1,
              borderRadius: 10,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
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
