import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card } from '../components/Card';

ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutChart = ({ title, subtitle, labels, data, colors }) => (
  <Card className="p-5">
    <div className="mb-4">
      <h3 className="section-title">{title}</h3>
      <p className="section-copy">{subtitle}</p>
    </div>
    <div className="h-64">
      <Doughnut
        data={{
          labels,
          datasets: [
            {
              label: title,
              data,
              backgroundColor: colors,
              borderWidth: 0,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: 'rgba(148, 163, 184, 0.9)',
              },
            },
          },
        }}
      />
    </div>
  </Card>
);
