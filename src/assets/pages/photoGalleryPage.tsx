import Layout from '@/layouts/layout';
import { useState, useEffect, useCallback } from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight, Search, Heart } from 'lucide-react';
import type { Photo } from '@/types';
import PhotoDetailModal from '@/components/photoGallery/photoDetailModal';

const dummyPhotos: Photo[] = [
  {
    id: '1',
    src: 'https://i3n.news1.kr/system/photos/2021/8/9/4915365/high.jpg',
    title: '스위스 알프스 여행',
    date: '2024-05-10',
    location: '스위스',
    tags: ['자연', '산', '해외'],
    isFavorite: false,
    description: '알프스에서 요들송을 불러보았는가?',
  },
  {
    id: '2',
    src: 'https://lh3.googleusercontent.com/proxy/xs68oKSzL8VcmXDbenPKtJvmupDIFQ3WELrq94xwudZGJPpVETG15hJmoz8552105TctgVuyyp66xIz1Z3LXOPuCc0Swqvsa',
    title: '하와이에서 휴양',
    date: '2023-07-20',
    location: '하와이',
    tags: ['바다', '노을', '해외'],
    isFavorite: true,
    description: '하와이에 가면 하와하와하게 된다.',
  },
  {
    id: '3',
    src: 'https://i.namu.wiki/i/01w_GKnxX6kSW1RCjdhNCteGfNs7fvCu8iADwRhRSv1RpC891O4KuFNslDgDpSNg7wUFRqWap7JCTF9fWGCJftUBKyfsY8Mledfqd_jZ783xX9O55A8aW-0S4gDlUo4cvs-_gg04qfMPCxNhScFlAg.webp',
    title: '캐나다 벤프? 라던데',
    date: '2024-03-15',
    location: '캐나다',
    tags: ['자연', '해외'],
    isFavorite: false,
    description: '여기는 산 좋고 물 좋은 벤프라지요',
  },
  {
    id: '4',
    src: 'https://tourimage.interpark.com/BBS/Tour/FckUpload/201404/6353433153040709340.jpg',
    title: '맨해튼에 가다',
    date: '2024-06-01',
    location: '미국',
    tags: ['도시', '야경', '해외'],
    isFavorite: true,
    description: '빌딩숲이지만 이렇게 예쁠 수가...',
  },
  {
    id: '5',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYU5VKeEFJVLvaL13mnIh2ft4lYIHLFt52Mw&s',
    title: '아타카마에서 살아남기',
    date: '2023-02-28',
    location: '칠레',
    tags: ['자연', '사막', '해외'],
    isFavorite: false,
    description: '덥다... 개덥다...',
  },
  {
    id: '6',
    src: 'https://i.namu.wiki/i/yZeKOQ6x8chba-r0OwsmZtUZEsGFGm-WGPAZyDd2b4mrdYypGDuIsavmRomoEo9XRsv0B3NuG8oP_GalDsfmpw.webp',
    title: '홍 대',
    date: '2024-01-05',
    location: '한국',
    tags: ['일상', '국내'],
    isFavorite: true,
    description: '언제 와도 홍대앤 사람 무쟈게 많다... ',
  },
  {
    id: '7',
    src: 'https://cdn.pixabay.com/photo/2019/11/12/22/35/iceland-4622194_1280.jpg',
    title: '아이슬란드 폭포😯',
    date: '2024-04-20',
    location: '아이슬란드',
    tags: ['자연', '폭포', '해외'],
    isFavorite: true,
    description: '이거 진짜 레알 정말 레전드 절경',
  },
  {
    id: '8',
    src: 'https://i.namu.wiki/i/Hv7CGkkeF468Z5SEPS3f0JWmbmlvaNGZCmxPV1raYLwhT9pDAm9NH0RqJ-GPmGSkrjjyG-GuHbFNsjtoG9mvpw.webp',
    title: '얘 시부야, 시부야 갈래?',
    date: '2025-01-05',
    location: '일본',
    tags: ['도시', '쇼핑', '해외'],
    isFavorite: false,
    description: '여기 한국인가...? 한국인이 왜이리 많어',
  },
  {
    id: '9',
    src: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/b0/a5/51/20161119-091045-largejpg.jpg?w=2400&h=-1&s=1',
    title: '살짝 이른 강릉 바다',
    date: '2024-05-01',
    location: '한국',
    tags: ['바다', '국내'],
    isFavorite: true,
    description: '강릉 바다는 언제 와도 좋네',
  },
];

const NextArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <div
    onClick={onClick}
    className='absolute top-1/2 right-3 -translate-y-1/2 z-20 cursor-pointer flex items-center justify-center w-10 h-10 bg-white shadow-lg rounded-full hover:bg-gray-100 transition'>
    <ChevronRight className='h-6 w-6 text-gray-700' />
  </div>
);

const PrevArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <div
    onClick={onClick}
    className='absolute top-1/2 left-3 -translate-y-1/2 z-20 cursor-pointer flex items-center justify-center w-10 h-10 bg-white shadow-lg rounded-full hover:bg-gray-100 transition'>
    <ChevronLeft className='h-6 w-6 text-gray-700' />
  </div>
);

export default function PhotoGalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>(dummyPhotos);
  const [selectedFilter, setSelectedFilter] = useState<'year' | 'tag' | 'favorite'>('year');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedPhotoIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedPhotoIndex]);

  const availableYears = [
    'All',
    ...new Set(photos.map((photo) => new Date(photo.date).getFullYear().toString())),
  ].sort((a, b) => {
    if (a === 'All') return -1;
    if (b === 'All') return 1;
    return parseInt(b) - parseInt(a);
  });
  const availableTags = ['All', ...new Set(photos.flatMap((photo) => photo.tags))].sort();

  const filteredPhotos = photos
    .filter((photo) => {
      if (selectedFilter === 'year' && selectedYear !== 'All') {
        if (new Date(photo.date).getFullYear().toString() !== selectedYear) return false;
      }
      if (selectedFilter === 'tag' && selectedTag !== 'All') {
        if (!photo.tags.includes(selectedTag)) return false;
      }
      if (selectedFilter === 'favorite' && !photo.isFavorite) return false;

      if (debouncedSearch) {
        const term = debouncedSearch.toLowerCase();
        const matches =
          photo.title.toLowerCase().includes(term) ||
          photo.location.toLowerCase().includes(term) ||
          photo.tags.some((tag) => tag.toLowerCase().includes(term)) ||
          (photo.description && photo.description.toLowerCase().includes(term));
        if (!matches) return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const toggleFavorite = useCallback((id: string) => {
    setPhotos((prev) =>
      prev.map((photo) => (photo.id === id ? { ...photo, isFavorite: !photo.isFavorite } : photo)),
    );
  }, []);

  const deletePhoto = useCallback((id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
    setSelectedPhotoIndex(null);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    draggable: false,
    autoplay: false,
    accessibility: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Layout>
      <div className='container mx-auto px-4 py-8 max-w-7xl'>
        <h1 className='text-3xl font-bold text-gray-800 mb-8 text-center'>사진 모아보기</h1>

        <div className='relative mb-8'>
          <input
            type='text'
            placeholder='제목, 장소, 태그, 설명 검색...'
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
        </div>

        <div className='flex justify-center gap-4 mb-8 border-b pb-4'>
          {['year', 'tag', 'favorite'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter as 'year' | 'tag' | 'favorite')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                selectedFilter === filter
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}>
              {filter === 'year' ? '연도별' : filter === 'tag' ? '태그별' : '즐겨찾기'}
            </button>
          ))}
        </div>

        {selectedFilter === 'year' && (
          <div className='flex justify-center gap-3 mb-8 flex-wrap'>
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedYear === year
                    ? 'bg-blue-400 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {year}
              </button>
            ))}
          </div>
        )}
        {selectedFilter === 'tag' && (
          <div className='flex justify-center gap-3 mb-8 flex-wrap'>
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-400 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {tag}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <p className='text-center text-gray-500'>로딩 중...</p>
        ) : filteredPhotos.length > 0 ? (
          <div className='relative'>
            <Slider {...sliderSettings}>
              {filteredPhotos.map((photo, index) => (
                <div key={photo.id} className='px-2'>
                  <div
                    className='bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer'
                    onClick={() => setSelectedPhotoIndex(index)}>
                    <img src={photo.src} className='w-full h-64 object-cover' />
                    <div className='p-4 flex justify-between items-center'>
                      <div>
                        <h3 className='font-semibold text-lg text-gray-900 truncate'>
                          {photo.title}
                        </h3>
                        <p className='text-sm text-gray-600'>{photo.date}</p>
                      </div>
                      <button
                        className='transition-transform hover:scale-125 cursor-pointer'
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(photo.id);
                        }}>
                        <Heart
                          className={`h-6 w-6 ${
                            photo.isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <div className='text-center py-12 text-gray-500'>
            <p className='mb-4'>선택하신 조건에 해당하는 사진이 없습니다.</p>
            <button className='px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600'>
              사진 업로드하기
            </button>
          </div>
        )}
      </div>

      {selectedPhotoIndex !== null && (
        <PhotoDetailModal
          photo={filteredPhotos[selectedPhotoIndex]}
          onClose={() => setSelectedPhotoIndex(null)}
          onPrev={() =>
            setSelectedPhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
          }
          onNext={() =>
            setSelectedPhotoIndex((prev) =>
              prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : prev,
            )
          }
          hasPrev={selectedPhotoIndex > 0}
          hasNext={selectedPhotoIndex < filteredPhotos.length - 1}
          toggleFavorite={toggleFavorite}
          onDelete={deletePhoto}
        />
      )}
    </Layout>
  );
}
