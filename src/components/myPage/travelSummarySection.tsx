import SummaryCard from '@/components/commons/summaryCard';

export default function TravelSummarySection() {
  return (
    <section className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      <SummaryCard label='총 기록 수' value='16회' />
      <SummaryCard label='여행한 나라' value='5개국' />
      <SummaryCard label='최근 여행' value='2025.07.01 / 부산' />
    </section>
  );
}
