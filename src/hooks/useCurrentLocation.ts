import { useRef, useCallback } from 'react';

interface UseCurrentLocationProps {
  mapInstance: React.RefObject<google.maps.Map | null>;
  onLocationFound?: (location: { lat: number; lng: number }) => void;
  onLocationMove?: () => void; // 내 위치로 이동할 때 호출될 콜백
}

export const useCurrentLocation = ({
  mapInstance,
  onLocationFound,
  onLocationMove,
}: UseCurrentLocationProps) => {
  const currentLocationMarker = useRef<google.maps.Marker | null>(null);

  const moveToCurrentLocation = useCallback(() => {
    if (!mapInstance.current) return;

    if (navigator.geolocation) {
      // 더 정확한 위치를 얻기 위한 옵션 설정
      const options = {
        enableHighAccuracy: true, // 높은 정확도 활성화
        timeout: 10000, // 10초 타임아웃
        maximumAge: 0, // 캐시된 위치 정보 사용하지 않음 (항상 새로운 위치 요청)
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          console.log('현재 위치 정확도:', position.coords.accuracy, '미터');

          // 이전 현재 위치 마커 제거
          if (currentLocationMarker.current) {
            currentLocationMarker.current.setMap(null);
          }

          // 새로운 현재 위치 마커 생성 (Lucide React MapPin 스타일)
          currentLocationMarker.current = new google.maps.Marker({
            position: currentLocation,
            map: mapInstance.current!,
            title: '현재 위치',
            icon: {
              url:
                'data:image/svg+xml;charset=UTF-8,' +
                encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="#3B82F6" stroke="#1E40AF" stroke-width="1.5"/>
                  <circle cx="12" cy="10" r="3" fill="#FFFFFF" stroke="#1E40AF" stroke-width="1"/>
                  <circle cx="12" cy="10" r="1.5" fill="#3B82F6"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 32),
            },
            zIndex: 999, // 다른 마커들보다 낮은 z-index
          });

          mapInstance.current!.setCenter(currentLocation);
          mapInstance.current!.setZoom(15);

          // 내 위치로 이동했음을 알림
          onLocationMove?.();

          // 위치를 찾았을 때 콜백 호출 (기록창을 열기 위해)
          onLocationFound?.(currentLocation);
        },
        (error) => {
          console.error('현재 위치를 가져올 수 없습니다:', error);
          let errorMessage = '현재 위치를 가져올 수 없습니다.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다.';
              break;
            case error.TIMEOUT:
              errorMessage = '위치 요청 시간이 초과되었습니다. 다시 시도해주세요.';
              break;
            default:
              errorMessage = '위치 권한을 확인해주세요.';
          }

          alert(errorMessage);
        },
        options,
      );
    } else {
      alert('이 브라우저에서는 Geolocation을 지원하지 않습니다.');
    }
  }, [mapInstance, onLocationFound]);

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
