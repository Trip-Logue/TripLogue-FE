import { useState } from 'react';
import {
  MapPin,
  Calendar,
  Camera,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronFirst,
  ChevronLast,
} from 'lucide-react';
import TripCard from './tripCard';
import type { TravelRecordData } from '@/types';

interface MyTripListSectionProps {
  travelRecords: TravelRecordData[];
  onDeleteRecord: (recordId: string) => void;
  showPagination: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalRecords: number;
  startIndex: number;
  endIndex: number;
}

export default function MyTripListSection({
  travelRecords,
  onDeleteRecord,
  showPagination,
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  startIndex,
  endIndex,
}: MyTripListSectionProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    recordId: string;
    recordTitle: string;
  } | null>(null);

  const handleDeleteClick = (recordId: string, recordTitle: string) => {
    setShowDeleteConfirm({ recordId, recordTitle });
  };

  const handleConfirmDelete = () => {
    if (showDeleteConfirm) {
      onDeleteRecord(showDeleteConfirm.recordId);
      setShowDeleteConfirm(null);
    }
  };

  const goToPage = (page: number) => {
    onPageChange(Math.max(1, Math.min(page, totalPages)));
  };

  if (totalRecords === 0) {
    return (
      <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
        <div className='text-center'>
          <MapPin className='mx-auto text-gray-300 mb-4' size={48} />
          <h3 className='text-xl font-bold text-gray-700 mb-2'>아직 여행 기록이 없습니다</h3>
          <p className='text-gray-500'>지도에서 여행 기록을 추가하면 여기에 표시됩니다.</p>
        </div>
      </div>
    );
  }

  const sortedRecords = [...travelRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
      <div className='flex items-center gap-3 mb-6'>
        <MapPin className='text-blue-600' size={24} />
        <h2 className='text-2xl font-bold text-gray-900'>내 여행 기록</h2>
        <span className='text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>
          총 {totalRecords}개
        </span>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {sortedRecords.map((record) => (
          <TripCard
            key={record.id}
            title={record.title}
            date={record.date}
            location={record.location}
            country={record.country}
            photoCount={record.photos.length}
            onDelete={() => handleDeleteClick(record.id, record.title)}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      {showPagination && (
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
                      ? 'bg-blue-500 text-white'
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
      {showPagination && (
        <div className='mt-4 text-center text-sm text-gray-500'>
          <span>
            {startIndex + 1}-{Math.min(endIndex, totalRecords)} / {totalRecords}개의 여행 기록
          </span>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2 bg-red-100 rounded-full'>
                <AlertTriangle className='text-red-600' size={24} />
              </div>
              <h3 className='text-xl font-bold text-gray-900'>여행 기록 삭제</h3>
            </div>
            <p className='text-gray-600 mb-6'>
              "{showDeleteConfirm.recordTitle}" 여행 기록을 삭제하시겠습니까?
              <br />
              <span className='text-red-600 font-medium'>
                이 작업은 되돌릴 수 없으며, 관련된 모든 사진도 함께 삭제됩니다.
              </span>
            </p>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'>
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
