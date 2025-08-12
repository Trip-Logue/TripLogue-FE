import { useEffect, useRef } from 'react';
import type { PlaceInfo } from '@/types';
import { getInfoWindowContent } from './popupHTML';

interface MyMapProps {
  mapRef: React.RefObject<google.maps.Map | null>;
  places: PlaceInfo[];
}

export default function MyMap({ mapRef, places }: MyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markers = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoWindows = useRef<Map<string, google.maps.InfoWindow>>(new Map());
  const markerGroups = useRef<Map<string, string[]>>(new Map()); // 같은 위치의 마커들을 그룹화

  useEffect(() => {
    if (!containerRef.current || mapInstance.current) return;

    const map = new google.maps.Map(containerRef.current, {
      center: { lat: 37.5665, lng: 126.978 },
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    mapInstance.current = map;
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!places || !mapInstance.current) return;
    console.log('Creating markers for places:', places); // 디버깅 로그

    // 기존 마커들 제거
    markers.current.forEach((marker) => marker.setMap(null));
    markers.current.clear();
    infoWindows.current.clear();
    markerGroups.current.clear();

    // 같은 위치의 마커들을 그룹화
    const locationGroups = new Map<string, PlaceInfo[]>();
    places.forEach((place) => {
      const locationKey = `${place.location.lat()},${place.location.lng()}`;
      if (!locationGroups.has(locationKey)) {
        locationGroups.set(locationKey, []);
      }
      locationGroups.get(locationKey)!.push(place);
    });

    // 각 그룹별로 마커 생성
    locationGroups.forEach((groupPlaces, locationKey) => {
      if (groupPlaces.length === 1) {
        // 단일 마커
        createSingleMarker(groupPlaces[0]);
      } else {
        // 여러 마커가 같은 위치에 있는 경우
        createGroupMarker(groupPlaces, locationKey);
      }
    });

    console.log('Total markers created:', markers.current.size); // 디버깅 로그

    // 여행 기록이 있으면 첫 번째 기록으로 지도 중심 이동
    if (places.length > 0 && mapInstance.current) {
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => bounds.extend(place.location));

      // 모든 마커가 보이도록 지도 조정
      if (places.length === 1) {
        mapInstance.current.setCenter(places[0].location);
        mapInstance.current.setZoom(15);
      } else {
        mapInstance.current.fitBounds(bounds);
        // 너무 확대되지 않도록 최대 줌 레벨 제한
        google.maps.event.addListenerOnce(mapInstance.current, 'bounds_changed', () => {
          const currentZoom = mapInstance.current?.getZoom();
          if (mapInstance.current && currentZoom && currentZoom > 15) {
            mapInstance.current.setZoom(15);
          }
        });
      }
    }
  }, [places]);

  // 단일 마커 생성 함수
  const createSingleMarker = (place: PlaceInfo) => {
    const id = crypto.randomUUID();
    console.log('Creating single marker for place:', place.title, 'at position:', place.location);

    const marker = new google.maps.Marker({
      position: place.location,
      map: mapInstance.current!,
      title: `${place.title} - ${place.name}`,
      icon: {
        url:
          'data:image/svg+xml;charset=UTF-8,' +
          encodeURIComponent(`
          <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
            <!-- 핀 그림자 -->
            <ellipse cx="16" cy="38" rx="4" ry="1.5" fill="rgba(0,0,0,0.2)"/>
            
            <!-- 핀 몸체 (📍 스타일) -->
            <circle cx="16" cy="16" r="12" fill="#FF6B6B" stroke="#E74C3C" stroke-width="2"/>
            
            <!-- 핀 꼬리 (📌 스타일) -->
            <path d="M16 28 L20 40 L16 36 L12 40 Z" fill="#FF6B6B" stroke="#E74C3C" stroke-width="1"/>
            
            <!-- 핀 내부 원 -->
            <circle cx="16" cy="16" r="8" fill="#FFE66D" stroke="#F39C12" stroke-width="1.5"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 40),
        anchor: new google.maps.Point(16, 40),
      },
      zIndex: 1000,
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

    infoWindows.current.set(id, infoWindow);
    markers.current.set(id, marker);

    // 마커 클릭 이벤트
    marker.addListener('click', () => {
      handleMarkerClick(id, marker, infoWindow, place);
    });
  };

  // 그룹 마커 생성 함수 (여러 마커가 같은 위치에 있는 경우)
  const createGroupMarker = (groupPlaces: PlaceInfo[], locationKey: string) => {
    const groupId = crypto.randomUUID();
    const markerIds: string[] = [];

    console.log(`Creating group marker for ${groupPlaces.length} places at:`, locationKey);

    // 그룹 마커 생성 (숫자가 표시된 특별한 디자인)
    const groupMarker = new google.maps.Marker({
      position: groupPlaces[0].location,
      map: mapInstance.current!,
      title: `${groupPlaces.length}개의 여행 기록`,
      icon: {
        url:
          'data:image/svg+xml;charset=UTF-8,' +
          encodeURIComponent(`
          <svg width="40" height="48" viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
            <!-- 핀 그림자 -->
            <ellipse cx="20" cy="46" rx="5" ry="2" fill="rgba(0,0,0,0.2)"/>
            
            <!-- 핀 몸체 (그룹용 특별 디자인) -->
            <circle cx="20" cy="20" r="16" fill="#4A90E2" stroke="#357ABD" stroke-width="2.5"/>
            
            <!-- 핀 꼬리 -->
            <path d="M20 36 L26 48 L20 44 L14 48 Z" fill="#4A90E2" stroke="#357ABD" stroke-width="1.5"/>
            
            <!-- 핀 내부 원 -->
            <circle cx="20" cy="20" r="12" fill="#FFFFFF" stroke="#4A90E2" stroke-width="2"/>
            
            <!-- 숫자 표시 -->
            <text x="20" y="25" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#4A90E2">${groupPlaces.length}</text>
            
            <!-- 하이라이트 -->
            <circle cx="16" cy="16" r="3" fill="rgba(255,255,255,0.8)"/>
            
            <!-- 장식 점들 -->
            <circle cx="8" cy="8" r="1.5" fill="#4A90E2"/>
            <circle cx="32" cy="8" r="1.5" fill="#4A90E2"/>
            <circle cx="8" cy="32" r="1.5" fill="#4A90E2"/>
            <circle cx="32" cy="32" r="1.5" fill="#4A90E2"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 48),
        anchor: new google.maps.Point(20, 48),
      },
      zIndex: 1001, // 그룹 마커는 더 높은 z-index
    });

    // 각 여행 기록에 대한 정보창 생성
    groupPlaces.forEach((place, index) => {
      const id = crypto.randomUUID();
      markerIds.push(id);

      const infoWindow = new google.maps.InfoWindow({
        content: getGroupInfoWindowContent({
          id,
          title: place.title,
          date: place.date,
          memo: place.memo,
          location: place.name,
          country: place.country,
          imageUrl: place.photos && place.photos.length > 0 ? place.photos[0].src : undefined,
          currentIndex: index + 1,
          totalCount: groupPlaces.length,
        }),
        maxWidth: 350,
        pixelOffset: new google.maps.Size(0, -15),
      });

      infoWindows.current.set(id, infoWindow);
    });

    // 그룹 정보 저장
    markerGroups.current.set(groupId, markerIds);
    markers.current.set(groupId, groupMarker);

    // 그룹 마커 클릭 이벤트
    groupMarker.addListener('click', () => {
      handleGroupMarkerClick(groupId, groupPlaces, markerIds);
    });
  };

  // 단일 마커 클릭 처리
  const handleMarkerClick = (
    id: string,
    marker: google.maps.Marker,
    infoWindow: google.maps.InfoWindow,
    place: PlaceInfo,
  ) => {
    console.log('Single marker clicked:', place.title);

    const isOpen = infoWindow.get('map') !== null;

    if (isOpen) {
      infoWindow.close();
    } else {
      // 다른 정보창들 닫기
      infoWindows.current.forEach((iw) => {
        if (iw !== infoWindow) {
          iw.close();
        }
      });

      // 정보창 열기
      infoWindow.open({
        anchor: marker,
        map: mapInstance.current!,
      });

      // 정보창 내부 요소들에 이벤트 리스너 추가
      google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
        addInfoWindowEventListeners(id, place, marker, infoWindow);
      });
    }
  };

  // 그룹 마커 클릭 처리
  const handleGroupMarkerClick = (
    groupId: string,
    groupPlaces: PlaceInfo[],
    markerIds: string[],
  ) => {
    console.log('Group marker clicked, showing first record');

    // 다른 정보창들 닫기
    infoWindows.current.forEach((iw) => {
      iw.close();
    });

    // 첫 번째 여행 기록의 정보창 열기
    const firstInfoWindow = infoWindows.current.get(markerIds[0]);
    const groupMarker = markers.current.get(groupId);

    if (firstInfoWindow && groupMarker) {
      firstInfoWindow.open({
        anchor: groupMarker,
        map: mapInstance.current!,
      });

      // 정보창 내부 요소들에 이벤트 리스너 추가
      google.maps.event.addListenerOnce(firstInfoWindow, 'domready', () => {
        addGroupInfoWindowEventListeners(
          markerIds[0],
          groupPlaces[0],
          groupMarker,
          firstInfoWindow,
          groupPlaces,
          markerIds,
        );
      });
    }
  };

  // 단일 정보창 이벤트 리스너 추가
  const addInfoWindowEventListeners = (
    id: string,
    place: PlaceInfo,
    marker: google.maps.Marker,
    infoWindow: google.maps.InfoWindow,
  ) => {
    console.log('InfoWindow DOM ready');

    // 편집 버튼 이벤트 리스너
    const editBtn = document.getElementById(`edit-${id}`);
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        console.log('Edit clicked for:', id);
        alert('편집 기능은 개발 중입니다.');
      });
    }

    // 공유 버튼 이벤트 리스너
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

    // 삭제 버튼 이벤트 리스너
    const deleteBtn = document.getElementById(`delete-${id}`);
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (window.confirm('정말로 이 여행 기록을 삭제하시겠습니까?')) {
          const deleteEvent = new CustomEvent('deleteTravelRecord', {
            detail: { recordId: place.recordId || id },
          });
          window.dispatchEvent(deleteEvent);

          marker.setMap(null);
          markers.current.delete(id);
          infoWindows.current.delete(id);
          infoWindow.close();
        }
      });
    }
  };

  // 그룹 정보창 이벤트 리스너 추가
  const addGroupInfoWindowEventListeners = (
    currentId: string,
    currentPlace: PlaceInfo,
    marker: google.maps.Marker,
    infoWindow: google.maps.InfoWindow,
    groupPlaces: PlaceInfo[],
    markerIds: string[],
  ) => {
    console.log('Group InfoWindow DOM ready');

    // 이전/다음 버튼 이벤트 리스너
    const prevBtn = document.getElementById(`prev-${currentId}`);
    const nextBtn = document.getElementById(`next-${currentId}`);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const currentIndex = groupPlaces.findIndex(
          (place) => place.recordId === currentPlace.recordId,
        );
        if (currentIndex > 0) {
          const prevPlace = groupPlaces[currentIndex - 1];
          const prevId = markerIds[currentIndex - 1];
          const prevInfoWindow = infoWindows.current.get(prevId);

          if (prevInfoWindow) {
            infoWindow.close();
            prevInfoWindow.open({
              anchor: marker,
              map: mapInstance.current!,
            });

            google.maps.event.addListenerOnce(prevInfoWindow, 'domready', () => {
              addGroupInfoWindowEventListeners(
                prevId,
                prevPlace,
                marker,
                prevInfoWindow,
                groupPlaces,
                markerIds,
              );
            });
          }
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const currentIndex = groupPlaces.findIndex(
          (place) => place.recordId === currentPlace.recordId,
        );
        if (currentIndex < groupPlaces.length - 1) {
          const nextPlace = groupPlaces[currentIndex + 1];
          const nextId = markerIds[currentIndex + 1];
          const nextInfoWindow = infoWindows.current.get(nextId);

          if (nextInfoWindow) {
            infoWindow.close();
            nextInfoWindow.open({
              anchor: marker,
              map: mapInstance.current!,
            });

            google.maps.event.addListenerOnce(nextInfoWindow, 'domready', () => {
              addGroupInfoWindowEventListeners(
                nextId,
                nextPlace,
                marker,
                nextInfoWindow,
                groupPlaces,
                markerIds,
              );
            });
          }
        }
      });
    }

    // 기본 버튼들 이벤트 리스너
    addInfoWindowEventListeners(currentId, currentPlace, marker, infoWindow);
  };

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
}

// 그룹 정보창용 HTML 생성 함수
function getGroupInfoWindowContent({
  id,
  title,
  date,
  memo,
  location,
  country,
  imageUrl,
  currentIndex,
  totalCount,
}: {
  id: string;
  title: string;
  date: string;
  memo: string;
  location?: string;
  country?: string;
  imageUrl?: string;
  currentIndex: number;
  totalCount: number;
}) {
  return `
      <div style="background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%); border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); padding: 20px; min-width: 320px; max-width: 400px; color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        
        <!-- 헤더 섹션 -->
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="font-size: 1.3rem; font-weight: bold; margin-bottom: 6px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            🗺️ ${title}
          </div>
          <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 3px;">
            📅 ${date}
          </div>
          ${
            location
              ? `<div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 3px;">📍 ${location}</div>`
              : ''
          }
          ${
            country
              ? `<div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 8px;">🌍 ${country}</div>`
              : ''
          }
          <div style="font-size: 0.9rem; font-weight: 600; margin-bottom: 8px; color: #FFE66D;">
            📍 같은 위치의 여행 기록 ${currentIndex}/${totalCount}
          </div>
        </div>
        
        <!-- 메모 섹션 -->
        ${
          memo
            ? `
        <div style="background: rgba(255,255,255,0.15); border-radius: 10px; padding: 12px; margin-bottom: 16px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
          <div style="font-size: 0.9rem; line-height: 1.4; word-break: break-all; opacity: 0.95;">${memo}</div>
        </div>
        `
            : ''
        }
        
        <!-- 이미지 섹션 (사진이 있을 때만 표시) -->
        ${
          imageUrl
            ? `
        <div style="margin-bottom: 16px;">
          <img src="${imageUrl}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 10px; border: 2px solid rgba(255,255,255,0.3);" alt="여행 사진" />
        </div>
        `
            : ''
        }
        
        <!-- 네비게이션 버튼들 -->
        <div style="display: flex; gap: 6px; margin-bottom: 12px;">
          <button id="prev-${id}" style="flex: 1; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; font-size: 0.8rem; font-weight: 500; padding: 8px 0; cursor: pointer; color: white; transition: all 0.2s; backdrop-filter: blur(10px);" 
                  onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                  onmouseout="this.style.background='rgba(255,255,255,0.2)'"
                  ${currentIndex === 1 ? 'disabled' : ''}>
            ⬅️ 이전
          </button>
          <button id="next-${id}" style="flex: 1; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; font-size: 0.8rem; font-weight: 500; padding: 8px 0; cursor: pointer; color: white; transition: all 0.2s; backdrop-filter: blur(10px);" 
                  onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                  onmouseout="this.style.background='rgba(255,255,255,0.2)'"
                  ${currentIndex === totalCount ? 'disabled' : ''}>
            다음 ➡️
          </button>
        </div>
        
        <!-- 액션 버튼들 -->
        <div style="display: flex; gap: 6px; margin-top: 12px;">
          <button id="edit-${id}" style="flex: 1; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; font-size: 0.8rem; font-weight: 500; padding: 8px 0; cursor: pointer; color: white; transition: all 0.2s; backdrop-filter: blur(10px);" 
                  onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                  onmouseout="this.style.background='rgba(255,255,255,0.2)'">
            📝 편집
          </button>
          <button id="share-${id}" style="flex: 1; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; font-size: 0.8rem; font-weight: 500; padding: 8px 0; cursor: pointer; color: white; transition: all 0.2s; backdrop-filter: blur(10px);" 
                  onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                  onmouseout="this.style.background='rgba(255,255,255,0.2)'">
            🔗 공유
          </button>
          <button id="delete-${id}" style="flex: 1; display: flex; align-items: center; justify-content: center; background: rgba(231, 76, 60, 0.8); border: 1px solid rgba(231, 76, 60, 0.6); border-radius: 8px; font-size: 0.8rem; font-weight: 500; padding: 8px 0; cursor: pointer; color: white; transition: all 0.2s; backdrop-filter: blur(10px);" 
                  onmouseover="this.style.background='rgba(231, 76, 60, 1)'" 
                  onmouseout="this.style.background='rgba(231, 76, 60, 0.8)'">
            🗑️ 삭제
          </button>
        </div>
      </div>
    `;
}
