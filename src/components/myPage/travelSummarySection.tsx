import SummaryCard from '@/components/myPage/summaryCard';
import type { TravelSummarySectionProps } from '@/types';

export default function TravelSummarySection({ travelRecords }: TravelSummarySectionProps) {
  // 여행 기록 통계 계산
  const totalRecords = travelRecords.length;
  const visitedCountries = new Set(travelRecords.map((record) => record.country)).size;

  // 최근 여행 기록 찾기
  const latestRecord =
    travelRecords.length > 0
      ? travelRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      : null;

  const latestTravel = latestRecord
    ? `${latestRecord.date} / ${latestRecord.location}`
    : '기록 없음';

  return (
    <section className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      <SummaryCard label='총 기록 수' value={`${totalRecords}회`} />
      <SummaryCard label='여행한 나라' value={`${visitedCountries}개국`} />
      <SummaryCard label='최근 여행' value={latestTravel} />
      <SummaryCard
        label='총 사진 수'
        value={`${travelRecords.reduce((sum, record) => sum + record.photos.length, 0)}장`}
      />
    </section>
  );
}
