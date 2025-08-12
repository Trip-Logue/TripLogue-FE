import { useRef, useState, useEffect } from 'react';
import MyMap from './myMap';
import SearchBar from './serchBar';
import RecordModal from './recordModal';
import { MapPin } from 'lucide-react';
import useAuthStore from '@/hooks/useAuthStore';
import useTravelStore from '@/hooks/useTravelStore';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import type { PlaceInfo } from '@/types';
import { toast } from 'react-toastify';

export default function MainMap() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [places, setPlaces] = useState<PlaceInfo[]>([]);

  const { user } = useAuthStore();
  const { getRecordsByUser, travelRecords, deleteRecord } = useTravelStore();

  // 새로운 훅들 사용
  const { moveToCurrentLocation, clearCurrentLocationMarker } = useCurrentLocation({
    mapInstance: mapRef,
    onLocationFound: (location) => {
      // 현재 위치를 찾았을 때 기록창 열기
      const currentLocationPlace = {
        name: '현재 위치',
        geometry: {
          location: new google.maps.LatLng(location.lat, location.lng),
        },
      };
      setSelectedPlace(currentLocationPlace as google.maps.places.PlaceResult);
      setModalOpen(true);
    },
    onLocationMove: () => {
      // 내 위치로 이동했을 때 플래그 리셋 (MyMap 컴포넌트에서 처리)
      if (mapRef.current) {
        // MyMap 컴포넌트의 userMovedMap 플래그를 리셋하기 위해 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('resetUserMovedFlag'));
      }
    },
  });

  // 사용자의 여행 기록을 가져와서 지도에 표시할 places 배열로 변환
  const updatePlaces = () => {
    if (user) {
      const userRecords = getRecordsByUser(user.id);
      const placesData: PlaceInfo[] = userRecords.map((record) => ({
        name: record.location,
        location: new google.maps.LatLng(record.latitude, record.longitude),
        date: record.date,
        memo: record.memo,
        title: record.title,
        country: record.country,
        photos: record.photos,
        recordId: record.id,
      }));
      setPlaces(placesData);
    }
  };

  // 초기 로드 및 travelRecords 변경 시 places 업데이트
  useEffect(() => {
    updatePlaces();
  }, [user, travelRecords]);

  // 지도에서 여행 기록 삭제 이벤트 처리
  useEffect(() => {
    const handleDeleteTravelRecord = (event: CustomEvent) => {
      const { recordId } = event.detail;
      if (recordId) {
        deleteRecord(recordId);
        toast.success('여행 기록이 삭제되었습니다.');
      }
    };

    window.addEventListener('deleteTravelRecord', handleDeleteTravelRecord as EventListener);

    return () => {
      window.removeEventListener('deleteTravelRecord', handleDeleteTravelRecord as EventListener);
    };
  }, [deleteRecord]);

  const handleSearch = (place: google.maps.places.PlaceResult) => {
    if (!mapRef.current) return;
    const location = place.geometry?.location;
    if (!location) return;

    setSelectedPlace(place);
    setModalOpen(true);
    mapRef.current?.panTo(location);
    mapRef.current?.setZoom(15);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    // 모달이 닫힐 때 현재 위치 마커 정리
    clearCurrentLocationMarker();
    // 모달이 닫힌 후 여행 기록이 추가되었을 수 있으므로 places를 다시 가져옴
    updatePlaces();
  };

  const handleCurrentLocationClick = () => {
    moveToCurrentLocation();
  };

  return (
    <>
      <div className='relative w-full h-full'>
        <SearchBar
          onSearch={handleSearch}
          className='absolute top-2 left-40 z-10 bg-white rounded-lg px-4 py-2 h-13 w-90 '
        />

        {/* 내 위치 찾기 버튼 */}
        <button
          onClick={handleCurrentLocationClick}
          className='absolute top-2 right-16 z-10 bg-white rounded-lg px-4 py-2 shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-2'
          title='내 위치 찾기'>
          <MapPin className='w-5 h-5 text-blue-600' />
          <span className='text-sm font-medium text-gray-700'>내 위치</span>
        </button>

        <div>
          <MyMap mapRef={mapRef} places={places} />
        </div>
        <RecordModal
          open={modalOpen}
          onClose={handleModalClose}
          selectedPlace={
            selectedPlace && selectedPlace.geometry?.location
              ? {
                  name: selectedPlace.name ?? 'Unknown Place',
                  location: selectedPlace.geometry.location,
                }
              : null
          }
        />
      </div>
    </>
  );
}
