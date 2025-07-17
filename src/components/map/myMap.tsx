import { useEffect, useRef } from "react";
import type { PlaceInfo } from "@/types";

interface MyMapProps {
  mapRef: React.RefObject<google.maps.Map | null>;
  places: PlaceInfo[];
}

export default function MyMap({ mapRef, places }: MyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markers = useRef<Map<string, google.maps.Marker>>(new Map());

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

    markers.current.forEach((marker) => marker.setMap(null));
    markers.current.clear();

    places.forEach((place) => {
      const id = crypto.randomUUID();
      const marker = new google.maps.Marker({
        position: place.location,
        map: mapInstance.current!,
        title: place.name,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="max-width: 200px">
            <h1>${place.name}</h1>
            <h2>${place.date}</h2>
            <button id="delete-${id}" className="text-red-400" >삭제</button>        
        </div>`,
      });

      marker.addListener("click", () => {
        infoWindow.open({
          anchor: marker,
          map: mapInstance.current!,
        });

        google.maps.event.addListenerOnce(infoWindow, "domready", () => {
          const btn = document.getElementById(`delete-${id}`);
          btn?.addEventListener("click", () => {
            marker.setMap(null);
            markers.current.delete(id);
          });
        });
      });

      markers.current.set(id, marker);
    });
  }, [places]);

  return <div ref={containerRef} style={{ width: "100%", height: "500px" }} />;
}
