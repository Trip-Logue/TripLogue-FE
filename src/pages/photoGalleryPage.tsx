import Layout from '@/layouts/layout';
import { useState, useEffect, useCallback } from 'react';
import Slider from 'react-slick';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Heart,
  Camera,
  Filter,
  Calendar,
  MapPin,
} from 'lucide-react';
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
    className='absolute top-1/2 right-3 -translate-y-1/2 z-20 cursor-pointer flex items-center justify-center w-12 h-12 bg-white shadow-lg rounded-full hover:bg-gray-100 transition-all duration-200 hover:shadow-xl'>
    <ChevronRight className='h-6 w-6 text-gray-700' />
  </div>
);

const PrevArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <div
    onClick={onClick}
    className='absolute top-1/2 left-3 -translate-y-1/2 z-20 cursor-pointer flex items-center justify-center w-12 h-12 bg-white shadow-lg rounded-full hover:bg-gray-100 transition-all duration-200 hover:shadow-xl'>
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
    slidesToShow: 3,
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
      <div className='mx-auto m-7 rounded-xl justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50'>
        <div className='w-240 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
          {/* Hero Section */}
          <header className='mb-12'>
            <div className='relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-3xl shadow-2xl p-8 lg:p-12'>
              <div className='absolute inset-0 bg-black/10'></div>
              <div className='relative z-10 text-center'>
                <div className='flex items-center justify-center gap-4 mb-4'>
                  <div className='p-3 bg-white/20 rounded-2xl backdrop-blur-sm'>
                    <Camera className='text-white' size={32} />
                  </div>
                  <h1 className='text-4xl lg:text-5xl font-bold text-white tracking-tight'>
                    사진 모아보기
                  </h1>
                </div>
                <p className='text-xl text-purple-100 max-w-2xl mx-auto'>
                  여행의 특별한 순간들을 아름다운 사진으로 기록하고 추억해보세요
                </p>
              </div>
              <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl'></div>
              <div className='absolute bottom-0 left-0 w-24 h-24 bg-pink-400/20 rounded-full blur-2xl'></div>
            </div>
          </header>

          {/* Search Section */}
          <section className='mb-8'>
            <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
              <div className='relative'>
                <Search
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
                  size={20}
                />
                <input
                  type='text'
                  placeholder='제목, 장소, 태그, 설명 검색...'
                  className='w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-200 hover:bg-white'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Filter Section */}
          <section className='mb-8'>
            <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
              <div className='flex items-center gap-3 mb-6'>
                <Filter className='text-purple-600' size={20} />
                <h2 className='text-xl font-bold text-gray-900'>필터 옵션</h2>
              </div>

              <div className='flex justify-center gap-4 mb-6 border-b pb-4'>
                {[
                  { key: 'year', label: '연도별', icon: Calendar },
                  { key: 'tag', label: '태그별', icon: MapPin },
                  { key: 'favorite', label: '즐겨찾기', icon: Heart },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFilter(key as 'year' | 'tag' | 'favorite')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      selectedFilter === key
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>

              {selectedFilter === 'year' && (
                <div className='flex justify-center gap-3 flex-wrap'>
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                        selectedYear === year
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
                      {year}
                    </button>
                  ))}
                </div>
              )}

              {selectedFilter === 'tag' && (
                <div className='flex justify-center gap-3 flex-wrap'>
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                        selectedTag === tag
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Photos Section */}
          <section>
            <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
              {isLoading ? (
                <div className='text-center py-12'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4'></div>
                  <p className='text-gray-500'>사진을 불러오는 중...</p>
                </div>
              ) : filteredPhotos.length > 0 ? (
                <div className='relative'>
                  <Slider {...sliderSettings}>
                    {filteredPhotos.map((photo, index) => (
                      <div key={photo.id} className='px-2'>
                        <div
                          className='bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer border border-gray-100'
                          onClick={() => setSelectedPhotoIndex(index)}>
                          <div className='relative'>
                            <img src={photo.src} className='h-64 object-cover' alt={photo.title} />
                            <div className='absolute top-3 right-3'>
                              <button
                                className='transition-transform hover:scale-125 cursor-pointer p-2 bg-white/80 rounded-full backdrop-blur-sm'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(photo.id);
                                }}>
                                <Heart
                                  className={`h-5 w-5 ${
                                    photo.isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                          <div className='p-4'>
                            <h3 className='font-bold text-lg text-gray-900 truncate mb-2'>
                              {photo.title}
                            </h3>
                            <div className='flex items-center gap-2 text-sm text-gray-600 mb-2'>
                              <Calendar size={14} />
                              {photo.date}
                            </div>
                            <div className='flex items-center gap-2 text-sm text-gray-600 mb-3'>
                              <MapPin size={14} />
                              {photo.location}
                            </div>
                            <div className='flex flex-wrap gap-1'>
                              {photo.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className='px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full'>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              ) : (
                <div className='text-center py-12 text-gray-500'>
                  <Camera className='mx-auto text-gray-300 mb-4' size={48} />
                  <p className='mb-4 text-lg'>선택하신 조건에 해당하는 사진이 없습니다.</p>
                  <button className='px-6 py-3 bg-purple-500 text-white rounded-xl shadow-lg hover:bg-purple-600 transition-all duration-200 hover:shadow-xl'>
                    사진 업로드하기
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
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
