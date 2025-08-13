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
import type { CountryChartSectionProps } from '@/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CountryChartSection({ travelRecords }: CountryChartSectionProps) {
  // 실제 여행 기록 데이터로 차트 데이터 생성
  const chartData = useMemo(() => {
    // 국가별 방문 횟수 계산
    const countryCounts = travelRecords.reduce((acc, record) => {
      const country = record.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 방문 횟수 순으로 정렬
    const sortedCountries = Object.entries(countryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10); // 상위 10개 국가만 표시

    const colors = [
      '#ffb3c1',
      '#a2d2ff',
      '#ffc8dd',
      '#caffbf',
      '#b5ead7',
      '#ffd6a5',
      '#caffc8',
      '#ffadad',
      '#a0c4ff',
      '#bdb2ff',
    ];

    return {
      labels: sortedCountries.map(([country]) => country),
      datasets: [
        {
          label: '기록 횟수',
          data: sortedCountries.map(([, count]) => count),
          backgroundColor: sortedCountries.map((_, index) => colors[index % colors.length]),
          borderRadius: 8,
        },
      ],
    };
  }, [travelRecords]);

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

  if (travelRecords.length === 0) {
    return (
      <section className='h-96 w-full flex items-center justify-center bg-gray-50 rounded-2xl'>
        <div className='text-center text-gray-500'>
          <p className='text-lg mb-2'>아직 여행 기록이 없습니다</p>
          <p className='text-sm'>지도에서 여행 기록을 추가하면 차트가 표시됩니다</p>
        </div>
      </section>
    );
  }

  return (
    <section className='h-96 w-full'>
      <Bar data={chartData} options={chartOptions} />
    </section>
  );
}
