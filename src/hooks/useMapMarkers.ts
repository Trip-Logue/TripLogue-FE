import { useRef, useCallback } from 'react';
import type { PlaceInfo } from '@/types';
import { getInfoWindowContent } from '@/components/map/popupHTML';

interface UseMapMarkersProps {
  mapInstance: React.RefObject<google.maps.Map | null>;
}

export const useMapMarkers = ({ mapInstance }: UseMapMarkersProps) => {
  const markers = useRef<Map<string, google.maps.Marker>>(new Map());

  const createMarker = useCallback((place: PlaceInfo, onDelete?: (id: string) => void) => {
    if (!mapInstance.current) return null;

    const id = crypto.randomUUID();
    const marker = new google.maps.Marker({
      position: place.location,
      map: mapInstance.current,
      title: place.name,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: getInfoWindowContent({
        id,
        title: place.title,
        date: place.date,
        memo: place.memo,
      }),
    });

    marker.addListener('click', () => {
      infoWindow.open({
        anchor: marker,
        map: mapInstance.current!,
      });

      google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
        const btn = document.getElementById(`delete-${id}`);
        btn?.addEventListener('click', () => {
          marker.setMap(null);
          markers.current.delete(id);
          onDelete?.(id);
        });
      });
    });

    markers.current.set(id, marker);
    return { id, marker };
  }, [mapInstance]);

  const createMarkersFromPlaces = useCallback((places: PlaceInfo[], onDelete?: (id: string) => void) => {
    if (!mapInstance.current) return;

    // 기존 마커들 제거
    clearAllMarkers();

    // 새로운 마커들 생성
    places.forEach((place) => {
      createMarker(place, onDelete);
    });
  }, [mapInstance, createMarker]);

  const addMarker = useCallback((place: PlaceInfo, onDelete?: (id: string) => void) => {
    return createMarker(place, onDelete);
  }, [createMarker]);

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
