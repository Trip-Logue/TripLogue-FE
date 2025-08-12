import { useRef, useState, useEffect } from 'react';
import MyMap from './myMap';
import SearchBar from './serchBar';
import RecordModal from './recordModal';
import useAuthStore from '@/hooks/useAuthStore';
import useTravelStore from '@/hooks/useTravelStore';
import type { PlaceInfo } from '@/types';
import { toast } from 'react-toastify';

export default function MainMap() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [places, setPlaces] = useState<PlaceInfo[]>([]);

  const { user } = useAuthStore();
  const { getRecordsByUser, travelRecords } = useTravelStore();

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
        photos: record.photos, // 사진 배열 추가
        recordId: record.id, // 여행 기록 ID 추가
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
        // useTravelStore의 deleteRecord 호출
        const { deleteRecord } = useTravelStore.getState();
        deleteRecord(recordId);
        toast.success('여행 기록이 삭제되었습니다.');
      }
    };

    window.addEventListener('deleteTravelRecord', handleDeleteTravelRecord as EventListener);

    return () => {
      window.removeEventListener('deleteTravelRecord', handleDeleteTravelRecord as EventListener);
    };
  }, []);

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
    // 모달이 닫힌 후 여행 기록이 추가되었을 수 있으므로 places를 다시 가져옴
    updatePlaces();
  };

  return (
    <>
      <div className='relative w-full h-full'>
        <SearchBar
          onSearch={handleSearch}
          className='absolute top-2 left-40 z-10 bg-white rounded-lg px-4 py-2 h-13 w-90 '
        />
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
