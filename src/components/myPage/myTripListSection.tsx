import { useState } from 'react';
import TripCard from '@/components/commons/tripCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const dummyTrips = [
  { title: '2024 오사카 여행', date: '2024-06-24', description: '사카사카오사카' },
  {
    title: '제주도 여름 여행',
    date: '2025-07-15',
    description: '제주도에서 빼놓을 수 없는 푸른 바다와 맛있는 음식',
  },
  { title: '서울 당일치기', date: '2024-07-20', description: '한강에서 시원한 바람 맞으며 힐링' },
  { title: '부산 해운대 여행', date: '2023-08-10', description: '탁 트인 해운대에서 휴식' },
  {
    title: '도쿄 쇼핑 투어',
    date: '2025-01-05',
    description: '신주쿠, 시부야를 중심으로 즐거운 쇼핑',
  },
  { title: '강릉 바다 드라이브', date: '2024-05-01', description: '동해 바다 따라 드라이브 코스' },
  { title: '경주 역사 탐방', date: '2023-11-20', description: '천년 고도 경주의 유적지 탐방' },
];

const CARDS_PER_PAGE = 3;
const CARD_WIDTH_PX = 256;
const CARD_GAP_PX = 16;

const CARD_HEIGHT_PX = 192;
const ARROW_VERTICAL_OFFSET = 2;

export default function MyTripListSection() {
  const [startIndex, setStartIndex] = useState(0);

  const showPrevCards = () => {
    setStartIndex((prevIndex) => Math.max(0, prevIndex - CARDS_PER_PAGE));
  };

  const showNextCards = () => {
    setStartIndex((prevIndex) => {
      const remainingCards = dummyTrips.length - (prevIndex + CARDS_PER_PAGE);
      if (remainingCards > 0 && remainingCards < CARDS_PER_PAGE) {
        return prevIndex + remainingCards;
      } else if (remainingCards <= 0) {
        return prevIndex;
      } else {
        return prevIndex + CARDS_PER_PAGE;
      }
    });
  };

  const showArrows = dummyTrips.length > CARDS_PER_PAGE;
  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + CARDS_PER_PAGE < dummyTrips.length;
  const desiredVisibleWidth = CARD_WIDTH_PX * CARDS_PER_PAGE + CARD_GAP_PX * (CARDS_PER_PAGE - 1);
  const totalViewportWidth = desiredVisibleWidth + 40 * 2;

  return (
    <section>
      <h3 className='text-lg font-semibold mb-4'>나의 여행 기록</h3>
      <div
        className='relative overflow-hidden'
        style={{
          maxWidth: `${totalViewportWidth}px`,
          margin: '0 auto',
          minHeight: `${CARD_HEIGHT_PX + ARROW_VERTICAL_OFFSET}px`,
        }}>
        <div
          className='flex space-x-4 transition-transform duration-300 ease-in-out px-10'
          style={{
            transform: `translateX(-${startIndex * (CARD_WIDTH_PX + CARD_GAP_PX)}px)`,
            width: `${dummyTrips.length * (CARD_WIDTH_PX + CARD_GAP_PX) + 40 * 2}px`,
          }}>
          {dummyTrips.map((trip, index) => (
            <TripCard
              key={index}
              title={trip.title}
              date={trip.date}
              description={trip.description}
            />
          ))}
        </div>

        {showArrows && (
          <>
            <button
              onClick={showPrevCards}
              disabled={!canGoPrev}
              className={`absolute top-1/2 -translate-y-1/2 left-0 z-10 bg-white p-2 rounded-full shadow-md ${
                !canGoPrev ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}>
              <ChevronLeft className='w-6 h-6 text-gray-700' />
            </button>
            <button
              onClick={showNextCards}
              disabled={!canGoNext}
              className={`absolute top-1/2 -translate-y-1/2 right-0 z-10 bg-white p-2 rounded-full shadow-md ${
                !canGoNext ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}>
              <ChevronRight className='w-6 h-6 text-gray-700' />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
