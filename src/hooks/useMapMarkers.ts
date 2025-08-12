import { useRef, useCallback } from 'react';
import type { PlaceInfo } from '@/types';
import { getInfoWindowContent } from '@/components/map/popupHTML';

interface UseMapMarkersProps {
  mapInstance: React.RefObject<google.maps.Map | null>;
}

export const useMapMarkers = ({ mapInstance }: UseMapMarkersProps) => {
  const markers = useRef<Map<string, google.maps.Marker>>(new Map());

  const createMarker = useCallback(
    (place: PlaceInfo, onDelete?: (id: string) => void) => {
      if (!mapInstance.current) return null;

      const id = crypto.randomUUID();
      const marker = new google.maps.Marker({
        position: place.location,
        map: mapInstance.current,
        title: place.name,
        icon: {
          url:
            'data:image/svg+xml;charset=UTF-8,' +
            encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="#EF4444" stroke="#DC2626" stroke-width="1.5"/>
            <circle cx="12" cy="10" r="3" fill="#FFFFFF" stroke="#DC2626" stroke-width="1"/>
            <circle cx="12" cy="10" r="1.5" fill="#EF4444"/>
          </svg>
        `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32),
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: getInfoWindowContent({
          id,
          title: place.title,
          date: place.date,
          memo: place.memo,
          location: place.name,
          country: place.country,
          imageUrl: place.photos && place.photos.length > 0 ? place.photos[0].src : undefined,
        }),
        maxWidth: 350,
        pixelOffset: new google.maps.Size(0, -15),
      });

      marker.addListener('click', () => {
        infoWindow.open({
          anchor: marker,
          map: mapInstance.current!,
        });

        google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
          const deleteBtn = document.getElementById(`delete-${id}`);
          if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
              if (window.confirm('정말로 이 여행 기록을 삭제하시겠습니까?')) {
                marker.setMap(null);
                markers.current.delete(id);
                infoWindow.close();
                onDelete?.(id);
              }
            });
          }

          const editBtn = document.getElementById(`edit-${id}`);
          if (editBtn) {
            editBtn.addEventListener('click', () => {
              console.log('Edit clicked for:', id);
              alert('편집 기능은 개발 중입니다.');
            });
          }

          const shareBtn = document.getElementById(`share-${id}`);
          if (shareBtn) {
            shareBtn.addEventListener('click', () => {
              console.log('Share clicked for:', id);
              if (navigator.share) {
                navigator.share({
                  title: place.title,
                  text: place.memo || '여행 기록을 공유합니다.',
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(
                  `${place.title} - ${place.memo || '여행 기록을 공유합니다.'}`,
                );
                alert('링크가 클립보드에 복사되었습니다!');
              }
            });
          }
        });
      });

      markers.current.set(id, marker);
      return { id, marker };
    },
    [mapInstance],
  );

  const createMarkersFromPlaces = useCallback(
    (places: PlaceInfo[], onDelete?: (id: string) => void) => {
      if (!mapInstance.current) return;

      // 기존 마커들 제거
      clearAllMarkers();

      // 새로운 마커들 생성
      places.forEach((place) => {
        createMarker(place, onDelete);
      });
    },
    [mapInstance, createMarker],
  );

  const addMarker = useCallback(
    (place: PlaceInfo, onDelete?: (id: string) => void) => {
      return createMarker(place, onDelete);
    },
    [createMarker],
  );

  const removeMarker = useCallback((id: string) => {
    const marker = markers.current.get(id);
    if (marker) {
      marker.setMap(null);
      markers.current.delete(id);
    }
  }, []);

  const clearAllMarkers = useCallback(() => {
    markers.current.forEach((marker) => marker.setMap(null));
    markers.current.clear();
  }, []);

  const getMarkers = useCallback(() => {
    return Array.from(markers.current.entries());
  }, []);

  const getMarkerCount = useCallback(() => {
    return markers.current.size;
  }, []);

  return {
    createMarker,
    createMarkersFromPlaces,
    addMarker,
    removeMarker,
    clearAllMarkers,
    getMarkers,
    getMarkerCount,
  };
};
