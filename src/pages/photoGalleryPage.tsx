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
  ChevronDown,
  ChevronUp,
  Trash2,
  AlertTriangle,
  ChevronFirst,
  ChevronLast,
  Tag,
} from 'lucide-react';
import type { TravelRecordData, Photo } from '@/types';
import PhotoDetailModal from '@/components/photoGallery/photoDetailModal';
import PhotoCard from '@/components/photoGallery/PhotoCard';
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

const ITEMS_PER_PAGE = 6; // 페이지당 아이템 수 (카드 뷰, 레코드 뷰 공통)

export default function PhotoGalleryPage() {
  const { user } = useAuthStore();
  const allTravelRecords = useTravelStore((state) => state.travelRecords);
  const { deleteRecord, deletePhoto, updatePhotoFavorite } = useTravelStore();

  const travelRecords = useMemo(
    () => (user ? allTravelRecords.filter((r) => r.userId === user.id) : []),
    [allTravelRecords, user],
  );

  const [selectedFilter, setSelectedFilter] = useState<'year' | 'tag' | 'favorite'>('year');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentPhotoList, setCurrentPhotoList] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: 'record' | 'photo';
    id: string;
    name: string;
  } | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedPhoto]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedFilter, selectedYear, selectedTag]);

  const availableYears = useMemo(
    () =>
      [
        'All',
        ...new Set(travelRecords.map((record) => new Date(record.date).getFullYear().toString())),
      ].sort((a, b) => {
        if (a === 'All') return -1;
        if (b === 'All') return 1;
        return parseInt(b) - parseInt(a);
      }),
    [travelRecords],
  );

  const availableTags = useMemo(
    () =>
      [
        'All',
        ...new Set(travelRecords.flatMap((record) => record.photos.flatMap((photo) => photo.tags))),
      ].sort(),
    [travelRecords],
  );

  const filteredRecords = useMemo(() => {
    return travelRecords
      .filter((record) => {
        if (selectedFilter === 'year' && selectedYear !== 'All') {
          return new Date(record.date).getFullYear().toString() === selectedYear;
        }
        if (selectedFilter === 'favorite') {
          return record.photos.some((photo) => photo.isFavorite);
        }
        if (selectedFilter === 'tag' && selectedTag !== 'All') {
          return record.photos.some((photo) => photo.tags.includes(selectedTag));
        }
        if (debouncedSearch) {
          const term = debouncedSearch.toLowerCase();
          return (
            record.title.toLowerCase().includes(term) ||
            record.location.toLowerCase().includes(term) ||
            record.country.toLowerCase().includes(term) ||
            record.photos.some(
              (photo) =>
                photo.tags.some((tag) => tag.toLowerCase().includes(term)) ||
                (photo.description && photo.description.toLowerCase().includes(term)),
            )
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [travelRecords, selectedFilter, selectedYear, selectedTag, debouncedSearch]);

  const filteredPhotosByTag = useMemo(() => {
    if (selectedFilter !== 'tag' || selectedTag === 'All') {
      return [];
    }
    let photos = travelRecords.flatMap((r) => r.photos).filter((p) => p.tags.includes(selectedTag));
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      photos = photos.filter(
        (photo) =>
          photo.title.toLowerCase().includes(term) ||
          photo.location.toLowerCase().includes(term) ||
          photo.tags.some((tag) => tag.toLowerCase().includes(term)) ||
          (photo.description && photo.description.toLowerCase().includes(term)),
      );
    }
    return photos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [travelRecords, selectedFilter, selectedTag, debouncedSearch]);

  const filteredPhotosByFavorite = useMemo(() => {
    if (selectedFilter !== 'favorite') {
      return [];
    }
    let photos = travelRecords.flatMap((r) => r.photos).filter((p) => p.isFavorite);
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      photos = photos.filter(
        (photo) =>
          photo.title.toLowerCase().includes(term) ||
          photo.location.toLowerCase().includes(term) ||
          photo.tags.some((tag) => tag.toLowerCase().includes(term)) ||
          (photo.description && photo.description.toLowerCase().includes(term)),
      );
    }
    return photos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [travelRecords, selectedFilter, debouncedSearch]);

  const isCardView =
    (selectedFilter === 'tag' && selectedTag !== 'All') || selectedFilter === 'favorite';

  const cardViewPhotos = useMemo(() => {
    if (selectedFilter === 'tag') return filteredPhotosByTag;
    if (selectedFilter === 'favorite') return filteredPhotosByFavorite;
    return [];
  }, [selectedFilter, filteredPhotosByTag, filteredPhotosByFavorite]);

  const totalItems = isCardView ? cardViewPhotos.length : filteredRecords.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageItems = isCardView
    ? cardViewPhotos.slice(startIndex, endIndex)
    : filteredRecords.slice(startIndex, endIndex);

  const toggleFavoriteInModal = useCallback(
    (photoId: string) => {
      const photo = travelRecords.flatMap((r) => r.photos).find((p) => p.id === photoId);
      if (photo) {
        updatePhotoFavorite(photoId, !photo.isFavorite);
        toast.success('즐겨찾기가 업데이트되었습니다.');
      }
    },
    [travelRecords, updatePhotoFavorite],
  );

  const handleDeletePhotoInModal = useCallback(
    (photoId: string) => {
      deletePhoto(photoId);
      setSelectedPhoto(null);
      setShowDeleteConfirm(null);
      toast.success('사진이 삭제되었습니다.');
    },
    [deletePhoto],
  );

  const handleDeleteRecord = useCallback(
    (recordId: string) => {
      deleteRecord(recordId);
      setShowDeleteConfirm(null);
      toast.success('여행 기록이 삭제되었습니다.');
    },
    [deleteRecord],
  );

  const handlePhotoDeleteRequest = useCallback((photo: Photo) => {
    setShowDeleteConfirm({ type: 'photo', id: photo.id, name: photo.title || '사진' });
  }, []);

  const toggleCardExpansion = (recordId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(recordId)) {
        newSet.delete(recordId);
      } else {
        newSet.add(recordId);
      }
      return newSet;
    });
  };

  const openPhotoDetail = (photo: Photo, photoList: Photo[]) => {
    setCurrentPhotoList(photoList);
    setSelectedPhoto(photo);
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
        <div className='text-center py-20'>로그인이 필요합니다.</div>
      </Layout>
    );
  }

  const totalPhotos = travelRecords.reduce((sum, record) => sum + record.photos.length, 0);

  return (
    <Layout>
      <div className='mx-auto m-7 rounded-xl justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50'>
        <div className='w-240 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
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
            </div>
          </header>

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

          <section className='mb-8'>
            <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
              <div className='flex items-center gap-3 mb-6'>
                <Filter className='text-purple-600' size={20} />
                <h2 className='text-xl font-bold text-gray-900'>필터 옵션</h2>
              </div>
              <div className='flex justify-center gap-4 mb-6 border-b pb-4'>
                {[
                  { key: 'year', label: '연도별', icon: Calendar },
                  { key: 'tag', label: '태그별', icon: Tag },
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

          <section>
            <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
              {isLoading ? (
                <div className='text-center py-12'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4'></div>
                  <p>사진을 불러오는 중...</p>
                </div>
              ) : totalItems > 0 ? (
                <>
                  {isCardView ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                      {(currentPageItems as Photo[]).map((photo) => (
                        <PhotoCard
                          key={photo.id}
                          photo={photo}
                          onClick={() => openPhotoDetail(photo, cardViewPhotos)}
                          onToggleFavorite={() => toggleFavoriteInModal(photo.id)}
                          onDelete={() => handlePhotoDeleteRequest(photo)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className='space-y-6'>
                      {(currentPageItems as TravelRecordData[]).map((record) => (
                        <div key={record.id} className='bg-gray-50 rounded-xl p-6'>
                          <div className='flex items-center justify-between mb-4'>
                            <div className='flex-1'>
                              <h3 className='text-xl font-bold text-gray-900 mb-1'>
                                {record.title}
                              </h3>
                              <div className='flex items-center gap-4 text-sm text-gray-600'>
                                <span className='flex items-center gap-1'>
                                  <Calendar size={14} /> {record.date}
                                </span>
                                <span className='flex items-center gap-1'>
                                  <MapPin size={14} /> {record.location}, {record.country}
                                </span>
                                <span className='flex items-center gap-1'>
                                  <Camera size={14} /> {record.photos.length}장
                                </span>
                              </div>
                            </div>
                            <div className='flex items-center gap-2'>
                              <button
                                onClick={() => toggleCardExpansion(record.id)}
                                className='p-2 hover:bg-gray-200 rounded-lg transition-colors'>
                                {expandedCards.has(record.id) ? (
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
                          {expandedCards.has(record.id) && (
                            <div className='relative'>
                              <Slider {...sliderSettings}>
                                {record.photos.map((photo) => (
                                  <div key={photo.id} className='px-2'>
                                    <div
                                      className='bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer border border-gray-100'
                                      onClick={() => openPhotoDetail(photo, record.photos)}>
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
                                              toggleFavoriteInModal(photo.id);
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
                                              handlePhotoDeleteRequest(photo);
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
                  )}
                  {totalPages > 1 && (
                    <div className='mt-8 flex items-center justify-center gap-2'>
                      <button
                        onClick={() => goToPage(1)}
                        disabled={currentPage === 1}
                        className='p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50'>
                        <ChevronFirst size={16} />
                      </button>
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className='p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50'>
                        <ChevronLeft size={16} />
                      </button>
                      <span className='text-sm text-gray-700 font-medium'>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className='p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50'>
                        <ChevronRight size={16} />
                      </button>
                      <button
                        onClick={() => goToPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className='p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50'>
                        <ChevronLast size={16} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className='text-center py-12 text-gray-500'>
                  <Camera className='mx-auto text-gray-300 mb-4' size={48} />
                  <p className='mb-4 text-lg'>선택하신 조건에 해당하는 사진이 없습니다.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

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
                className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'>
                취소
              </button>
              <button
                onClick={() => {
                  if (showDeleteConfirm.type === 'record') {
                    handleDeleteRecord(showDeleteConfirm.id);
                  } else {
                    handleDeletePhotoInModal(showDeleteConfirm.id);
                  }
                }}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPhoto && (
        <PhotoDetailModal
          initialPhoto={selectedPhoto}
          photoList={currentPhotoList}
          onClose={() => setSelectedPhoto(null)}
          toggleFavorite={toggleFavoriteInModal}
          onDelete={handleDeletePhotoInModal}
        />
      )}
    </Layout>
  );
}
