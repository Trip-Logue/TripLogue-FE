import { useRef, useState } from "react";
import MyMap from "./myMap";
import SearchBar from "./serchBar";
import type { PlaceInfo } from "@/types";

export default function MainCompo() {
  const mapRef = useRef<google.maps.Map | null>(null);

  const [places, setPlaces] = useState<PlaceInfo[]>([]);

  const handleSearch = (place: google.maps.places.PlaceResult) => {
    if (!mapRef.current) return;
    const location = place.geometry?.location;
    if (!location) return;

    const newPlace: PlaceInfo = {
      name: place.name ?? "장소 이름 없음",
      location,
      date: new Date().toISOString(),
      memo: "",
    };

    setPlaces((prev) => [...prev, newPlace]);

    mapRef.current?.panTo(location);
    mapRef.current?.setZoom(15);
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />

      <MyMap mapRef={mapRef} places={places} />

      <div className="mt-4 p-2 border-t">
        <h3 className="text-lg font-bold mb-2">최근 선택한 장소</h3>
        <ul className="text-sm space-y-1">
          {places.map((p, i) => (
            <li key={i}> {p.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
