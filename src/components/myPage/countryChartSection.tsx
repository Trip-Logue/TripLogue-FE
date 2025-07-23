import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  Title,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { TooltipItem, ChartOptions } from 'chart.js';
import { useMemo } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 차트 데이터 (나중에 실제 데이터로 교체)
const dummyChartData = {
  visitedCountries: [
    { name: '일본', count: 3 },
    { name: '프랑스', count: 2 },
    { name: '이탈리아', count: 4 },
    { name: '미국', count: 2 },
    { name: '태국', count: 5 },
  ],
};

export default function CountryChartSection() {
  const chartData = useMemo(
    () => ({
      labels: dummyChartData.visitedCountries.map((c) => c.name),
      datasets: [
        {
          label: '기록 횟수',
          data: dummyChartData.visitedCountries.map((c) => c.count),
          backgroundColor: ['#ffb3c1', '#a2d2ff', '#ffc8dd', '#caffbf', '#b5ead7'],
          borderRadius: 8,
        },
      ],
    }),
    [],
  );

  const chartOptions: ChartOptions<'bar'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: '국가별 기록 횟수',
          font: { size: 18, weight: 'bold' },
          color: '#333',
          align: 'start',
        },
        legend: {
          display: true,
          position: 'top',
          labels: { font: { size: 14 }, color: '#555' },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          bodyFont: { size: 14 },
          titleFont: { size: 16, weight: 'bold' },
          callbacks: {
            label: function (context: TooltipItem<'bar'>) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y + '회';
              }
              return label;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#666', font: { size: 12 } },
          title: { display: true, font: { size: 14, weight: 'bold' }, color: '#444' },
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(200, 200, 200, 0.3)' },
          ticks: {
            color: '#666',
            font: { size: 12 },
            stepSize: 1,
            precision: 0,
            callback: function (value: string | number) {
              return value + '회';
            },
          },
          title: { display: true, font: { size: 14, weight: 'bold' }, color: '#444' },
        },
      },
    }),
    [],
  );

  return (
    <section className='h-96 w-full'>
      <Bar data={chartData} options={chartOptions} />
    </section>
  );
}
