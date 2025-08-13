import Layout from '@/layouts/layout';
import { useState, useEffect, useCallback, useMemo } from 'react';
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
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
  AlertTriangle,
  ChevronFirst,
  ChevronLast,
} from 'lucide-react';
import type { TravelRecordData } from '@/types';
import PhotoDetailModal from '@/components/photoGallery/photoDetailModal';
import useAuthStore from '@/hooks/useAuthStore';
import useTravelStore from '@/hooks/useTravelStore';
import { toast } from 'react-toastify';

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

const RECORDS_PER_PAGE = 5; // 한 페이지당 표시할 여행 기록 수

export default function PhotoGalleryPage() {
  const [travelRecords, setTravelRecords] = useState<TravelRecordData[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'year' | 'tag' | 'favorite'>('year');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: 'record' | 'photo';
    id: string;
    name: string;
  } | null>(null);

  const { user } = useAuthStore();
  const { getRecordsByUser, deleteRecord, deletePhoto, updatePhotoFavorite } = useTravelStore();

  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 사용자의 여행 기록에서 사진 가져오기
  useEffect(() => {
    if (user) {
      const userRecords = getRecordsByUser(user.id);
      setTravelRecords(userRecords);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [user, getRecordsByUser]);

  useEffect(() => {
    if (selectedPhotoIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedPhotoIndex]);

  // 검색어나 필터가 변경되면 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedFilter, selectedYear, selectedTag]);

  const availableYears = [
    'All',
    ...new Set(travelRecords.map((record) => new Date(record.date).getFullYear().toString())),
  ].sort((a, b) => {
    if (a === 'All') return -1;
    if (b === 'All') return 1;
    return parseInt(b) - parseInt(a);
  });

  const allTags = travelRecords.flatMap((record) => record.photos.flatMap((photo) => photo.tags));
  const availableTags = ['All', ...new Set(allTags)].sort();

  const filteredRecords = useMemo(() => {
    return travelRecords
      .filter((record) => {
        if (selectedFilter === 'year' && selectedYear !== 'All') {
          if (new Date(record.date).getFullYear().toString() !== selectedYear) return false;
        }
        if (selectedFilter === 'tag' && selectedTag !== 'All') {
          if (!record.photos.some((photo) => photo.tags.includes(selectedTag))) return false;
        }
        if (selectedFilter === 'favorite') {
          if (!record.photos.some((photo) => photo.isFavorite)) return false;
        }

        if (debouncedSearch) {
          const term = debouncedSearch.toLowerCase();
          const matches =
            record.title.toLowerCase().includes(term) ||
            record.location.toLowerCase().includes(term) ||
            record.country.toLowerCase().includes(term) ||
            record.photos.some(
              (photo) =>
                photo.tags.some((tag) => tag.toLowerCase().includes(term)) ||
                (photo.description && photo.description.toLowerCase().includes(term)),
            );
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [travelRecords, selectedFilter, selectedYear, selectedTag, debouncedSearch]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredRecords.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;
  const currentPageRecords = filteredRecords.slice(startIndex, endIndex);

  const toggleFavorite = useCallback(
    (photoId: string) => {
      updatePhotoFavorite(
        photoId,
        !travelRecords.flatMap((record) => record.photos).find((photo) => photo.id === photoId)
          ?.isFavorite,
      );

      // 로컬 상태도 업데이트
      setTravelRecords((prev) =>
        prev.map((record) => ({
          ...record,
          photos: record.photos.map((photo) =>
            photo.id === photoId ? { ...photo, isFavorite: !photo.isFavorite } : photo,
          ),
        })),
      );

      toast.success('즐겨찾기가 업데이트되었습니다.');
    },
    [travelRecords, updatePhotoFavorite],
  );

  const handleDeletePhoto = useCallback(
    (photoId: string) => {
      deletePhoto(photoId);

      // 로컬 상태도 업데이트
      setTravelRecords((prev) =>
        prev.map((record) => ({
          ...record,
          photos: record.photos.filter((photo) => photo.id !== photoId),
        })),
      );

      // PhotoDetailModal 닫기
      setSelectedPhotoIndex(null);
      setSelectedRecordIndex(null);

      // 삭제 확인 모달 닫기
      setShowDeleteConfirm(null);

      toast.success('사진이 삭제되었습니다.');
    },
    [deletePhoto],
  );

  const handleDeleteRecord = useCallback(
    (recordId: string) => {
      deleteRecord(recordId);

      // 로컬 상태도 업데이트
      setTravelRecords((prev) => prev.filter((record) => record.id !== recordId));

      toast.success('여행 기록이 삭제되었습니다.');
      setShowDeleteConfirm(null);
    },
    [deleteRecord],
  );

  // PhotoDetailModal에서 사진 삭제 시 확인 모달을 표시하는 함수
  const handlePhotoDeleteRequest = useCallback(
    (photoId: string) => {
      // PhotoDetailModal 닫기
      setSelectedPhotoIndex(null);
      setSelectedRecordIndex(null);

      // 사진 정보 찾기
      const photo = travelRecords
        .flatMap((record) => record.photos)
        .find((photo) => photo.id === photoId);

      if (photo) {
        setShowDeleteConfirm({
          type: 'photo',
          id: photoId,
          name: photo.title || '사진',
        });
      }
    },
    [travelRecords],
  );

  // PhotoDetailModal에서 직접 사진 삭제하는 함수 (중복 모달 없이)
  const handlePhotoDeleteDirect = useCallback(
    (photoId: string) => {
      // PhotoDetailModal 닫기
      setSelectedPhotoIndex(null);
      setSelectedRecordIndex(null);

      // 사진 삭제
      deletePhoto(photoId);

      // 로컬 상태도 업데이트
      setTravelRecords((prev) =>
        prev.map((record) => ({
          ...record,
          photos: record.photos.filter((photo) => photo.id !== photoId),
        })),
      );
    },
    [deletePhoto],
  );

  const toggleCardExpansion = (recordIndex: number) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(recordIndex)) {
        newSet.delete(recordIndex);
      } else {
        newSet.add(recordIndex);
      }
      return newSet;
    });
  };

  const openPhotoDetail = (recordIndex: number, photoIndex: number) => {
    setSelectedRecordIndex(recordIndex);
    setSelectedPhotoIndex(photoIndex);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

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

  if (!user) {
    return (
      <Layout>
        <div className='mx-auto m-7 rounded-xl justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50'>
          <div className='w-240 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
            <div className='text-center py-20'>
              <Camera className='mx-auto text-gray-300 mb-6' size={64} />
              <h2 className='text-2xl font-bold text-gray-700 mb-4'>로그인이 필요합니다</h2>
              <p className='text-gray-500 mb-6'>사진 갤러리를 이용하려면 먼저 로그인해주세요.</p>
              <button className='px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200'>
                로그인하기
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const totalPhotos = travelRecords.reduce((sum, record) => sum + record.photos.length, 0);

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
                <div className='mt-6'>
                  <span className='inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm'>
                    총 {totalPhotos}장의 사진
                  </span>
                </div>
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
              ) : filteredRecords.length > 0 ? (
                <>
                  <div className='space-y-6'>
                    {currentPageRecords.map((record, recordIndex) => (
                      <div key={record.id} className='bg-gray-50 rounded-xl p-6'>
                        {/* 여행 기록 헤더 */}
                        <div className='flex items-center justify-between mb-4'>
                          <div className='flex-1'>
                            <h3 className='text-xl font-bold text-gray-900 mb-1'>{record.title}</h3>
                            <div className='flex items-center gap-4 text-sm text-gray-600'>
                              <span className='flex items-center gap-1'>
                                <Calendar size={14} />
                                {record.date}
                              </span>
                              <span className='flex items-center gap-1'>
                                <MapPin size={14} />
                                {record.location}, {record.country}
                              </span>
                              <span className='flex items-center gap-1'>
                                <Camera size={14} />
                                {record.photos.length}장
                              </span>
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() => toggleCardExpansion(recordIndex)}
                              className='p-2 hover:bg-gray-200 rounded-lg transition-colors'>
                              {expandedCards.has(recordIndex) ? (
                                <ChevronUp size={20} />
                              ) : (
                                <ChevronDown size={20} />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                setShowDeleteConfirm({
                                  type: 'record',
                                  id: record.id,
                                  name: record.title,
                                })
                              }
                              className='p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors'>
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>

                        {/* 사진 슬라이더 */}
                        {expandedCards.has(recordIndex) && (
                          <div className='relative'>
                            <Slider {...sliderSettings}>
                              {record.photos.map((photo, photoIndex) => (
                                <div key={photo.id} className='px-2'>
                                  <div
                                    className='bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer border border-gray-100'
                                    onClick={() => openPhotoDetail(recordIndex, photoIndex)}>
                                    <div className='relative'>
                                      <img
                                        src={photo.src}
                                        className='h-64 object-cover'
                                        alt={photo.title}
                                      />
                                      <div className='absolute top-3 right-3 flex gap-2'>
                                        <button
                                          className='transition-transform hover:scale-125 cursor-pointer p-2 bg-white/80 rounded-full backdrop-blur-sm'
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(photo.id);
                                          }}>
                                          <Heart
                                            className={`h-5 w-5 ${
                                              photo.isFavorite
                                                ? 'text-red-500 fill-red-500'
                                                : 'text-gray-400'
                                            }`}
                                          />
                                        </button>
                                        <button
                                          className='transition-transform hover:scale-125 cursor-pointer p-2 bg-white/80 rounded-full backdrop-blur-sm text-red-600 hover:bg-red-100'
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handlePhotoDeleteRequest(photo.id);
                                          }}>
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </div>
                                    <div className='p-4'>
                                      <h4 className='font-bold text-lg text-gray-900 truncate mb-2'>
                                        {photo.title}
                                      </h4>
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
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 페이지네이션 */}
                  {totalPages > 1 && (
                    <div className='mt-8 flex items-center justify-center gap-2'>
                      <button
                        onClick={() => goToPage(1)}
                        disabled={currentPage === 1}
                        className='p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
                        <ChevronFirst size={16} />
                      </button>
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className='p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
                        <ChevronLeft size={16} />
                      </button>

                      <div className='flex gap-1'>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => goToPage(pageNum)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-purple-500 text-white'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}>
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className='p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
                        <ChevronRight size={16} />
                      </button>
                      <button
                        onClick={() => goToPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className='p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
                        <ChevronLast size={16} />
                      </button>
                    </div>
                  )}

                  {/* 페이지 정보 */}
                  <div className='mt-4 text-center text-sm text-gray-500'>
                    {filteredRecords.length > 0 && (
                      <span>
                        {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} /{' '}
                        {filteredRecords.length}개의 여행 기록
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className='text-center py-12 text-gray-500'>
                  <Camera className='mx-auto text-gray-300 mb-4' size={48} />
                  <p className='mb-4 text-lg'>선택하신 조건에 해당하는 사진이 없습니다.</p>
                  <p className='mb-6 text-sm text-gray-400'>
                    지도에서 여행 기록을 추가하면 사진이 여기에 표시됩니다.
                  </p>
                  <button className='px-6 py-3 bg-purple-500 text-white rounded-xl shadow-lg hover:bg-purple-600 transition-all duration-200 hover:shadow-xl flex items-center gap-2 mx-auto'>
                    <Plus size={20} />
                    여행 기록 추가하기
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2 bg-red-100 rounded-full'>
                <AlertTriangle className='text-red-600' size={24} />
              </div>
              <h3 className='text-xl font-bold text-gray-900'>삭제 확인</h3>
            </div>
            <p className='text-gray-600 mb-6'>
              {showDeleteConfirm.type === 'record'
                ? `"${showDeleteConfirm.name}" 여행 기록을 삭제하시겠습니까?`
                : `"${showDeleteConfirm.name}" 사진을 삭제하시겠습니까?`}
              <br />
              <span className='text-red-600 font-medium'>이 작업은 되돌릴 수 없습니다.</span>
            </p>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'>
                취소
              </button>
              <button
                onClick={() => {
                  if (showDeleteConfirm.type === 'record') {
                    handleDeleteRecord(showDeleteConfirm.id);
                  } else {
                    handleDeletePhoto(showDeleteConfirm.id);
                  }
                }}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPhotoIndex !== null && selectedRecordIndex !== null && (
        <PhotoDetailModal
          photo={currentPageRecords[selectedRecordIndex].photos[selectedPhotoIndex]}
          onClose={() => {
            setSelectedPhotoIndex(null);
            setSelectedRecordIndex(null);
          }}
          onPrev={() =>
            setSelectedPhotoIndex((prev) => {
              if (prev !== null && prev > 0) return prev - 1;
              return prev;
            })
          }
          onNext={() =>
            setSelectedPhotoIndex((prev) => {
              const currentRecord = currentPageRecords[selectedRecordIndex];
              if (prev !== null && prev < currentRecord.photos.length - 1) return prev + 1;
              return prev;
            })
          }
          hasPrev={selectedPhotoIndex > 0}
          hasNext={selectedPhotoIndex < currentPageRecords[selectedRecordIndex].photos.length - 1}
          toggleFavorite={toggleFavorite}
          onDelete={handlePhotoDeleteDirect}
        />
      )}
    </Layout>
  );
}
