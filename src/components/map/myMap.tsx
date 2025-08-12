import { useEffect, useRef, useState } from 'react';
import type { PlaceInfo } from '@/types';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useMapMarkers } from '@/hooks/useMapMarkers';
import RecordModal from './recordModal';

interface MyMapProps {
  mapRef: React.RefObject<google.maps.Map | null>;
  places: PlaceInfo[];
}

export default function MyMap({ mapRef, places }: MyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLng | null>(null);

  const { createMarkersFromPlaces, addMarker } = useMapMarkers({ mapInstance });
  const { moveToCurrentLocation } = useCurrentLocation({ mapInstance });

  // 현재 위치로 이동하고 모달 열기
  const handleCurrentLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );

          // 현재 위치로 이동
          moveToCurrentLocation();

          // 위치 저장하고 모달 열기
          setCurrentLocation(location);
          setIsModalOpen(true);
        },
        (error) => {
          console.error('현재 위치를 가져올 수 없습니다:', error);
          alert('현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        }
      );
    } else {
      alert('이 브라우저에서는 Geolocation을 지원하지 않습니다.');
    }
  };


  const handleModalSubmit = (data: { title: string; date: string; memo: string; images?: File[] }) => {
    if (!currentLocation) return;

    
    const imageUrls = data.images && data.images.length > 0
      ? data.images.map((file) => URL.createObjectURL(file))
      : undefined;

    const newPlace: PlaceInfo = {
      name: data.title,
      location: currentLocation,
      title: data.title,
      date: data.date,
      memo: data.memo,
      imageUrls,
    };

    addMarker(newPlace, (deletedId) => {
      console.log(`저장된 위치 마커 ${deletedId}가 삭제되었습니다`);
    });

    setIsModalOpen(false);
    setCurrentLocation(null);
  };

  // 모달 닫기
  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentLocation(null);
  };

  useEffect(() => {
    if (!containerRef.current || mapInstance.current) return;

    const map = new google.maps.Map(containerRef.current, {
      center: { lat: 37.5665, lng: 126.978 },
      zoom: 12,
    });

    mapInstance.current = map;
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!places || !mapInstance.current) return;
    createMarkersFromPlaces(places);
  }, [places, createMarkersFromPlaces]);

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
      <button
        onClick={handleCurrentLocationClick}
        className="absolute top-15 left-3 z-50 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white border-none rounded-lg cursor-pointer text-sm font-medium shadow-lg transition-colors duration-200"
      >
        현재 위치
      </button>
      
      <RecordModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        selectedPlace={currentLocation ? { name: '현재 위치' } : null}
      />
    </div>
  );
}
