import { useRef, useCallback } from 'react';

interface UseCurrentLocationProps {
  mapInstance: React.RefObject<google.maps.Map | null>;
  addMarker?: (place: any, onDelete?: (id: string) => void) => { id: string; marker: google.maps.Marker } | null;
}

export const useCurrentLocation = ({ mapInstance, addMarker }: UseCurrentLocationProps) => {
  const currentLocationMarker = useRef<google.maps.Marker | null>(null);

  const moveToCurrentLocation = useCallback(() => {
    if (!mapInstance.current) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // 이전 현재 위치 마커 제거
          if (currentLocationMarker.current) {
            currentLocationMarker.current.setMap(null);
          }

          // 새로운 현재 위치 마커 생성
          currentLocationMarker.current = new google.maps.Marker({
            position: currentLocation,
            map: mapInstance.current!,
            title: '현재 위치',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#4285f4" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 24),
              anchor: new google.maps.Point(12, 12),
            },
          });

          mapInstance.current!.setCenter(currentLocation);
          mapInstance.current!.setZoom(15);

          // addMarker 함수가 제공되면 현재 위치를 저장된 장소로도 추가
          if (addMarker) {
            const now = new Date();
            const dateString = now.toISOString().split('T')[0];
            const timeString = now.toTimeString().split(' ')[0];

            const newPlace = {
              name: `현재 위치 (${timeString})`,
              location: currentLocation,
              title: `현재 위치 - ${dateString}`,
              date: dateString,
              memo: `현재 위치를 ${timeString}에 저장했습니다.`,
            };

            addMarker(newPlace, (deletedId) => {
              console.log(`저장된 위치 마커 ${deletedId}가 삭제되었습니다`);
            });
          }
        },
        (error) => {
          console.error('현재 위치를 가져올 수 없습니다:', error);
          alert('현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        }
      );
    } else {
      alert('이 브라우저에서는 Geolocation을 지원하지 않습니다.');
    }
  }, [mapInstance, addMarker]);

  const clearCurrentLocationMarker = useCallback(() => {
    if (currentLocationMarker.current) {
      currentLocationMarker.current.setMap(null);
      currentLocationMarker.current = null;
    }
  }, []);

  return {
    moveToCurrentLocation,
    clearCurrentLocationMarker,
  };
};
