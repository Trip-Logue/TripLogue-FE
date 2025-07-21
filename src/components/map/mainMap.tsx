import { useRef, useState } from "react";
import MyMap from "./myMap";
import SearchBar from "./serchBar";
import RecordModal from "./recordModal";
import type { PlaceInfo } from "@/types";

export default function MainMap() {
  const mapRef = useRef<google.maps.Map | null>(null);

  const [places, setPlaces] = useState<PlaceInfo[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const handleSearch = (place: google.maps.places.PlaceResult) => {
    if (!mapRef.current) return;
    const location = place.geometry?.location;
    if (!location) return;
    setSelectedPlace(place);
    setModalOpen(true);
    mapRef.current?.panTo(location);
    mapRef.current?.setZoom(15);
  };

  const handleModalSubmit = ({
    title,
    date,
    memo,
  }: {
    title: string;
    date: string;
    memo: string;
  }) => {
    if (!selectedPlace || !selectedPlace.geometry?.location) return;
    const newPlace: PlaceInfo = {
      name: selectedPlace.name ?? "장소 이름 없음",
      location: selectedPlace.geometry.location,
      date,
      memo,
      title,
    };
    setPlaces((prev) => [...prev, newPlace]);
    setModalOpen(false);
    setSelectedPlace(null);
  };

  return (
    <>
      <div className="relative w-full h-full">
        
      <SearchBar onSearch={handleSearch} className="absolute top-2 left-40 z-10 bg-white rounded-lg px-4 py-2 h-13 w-90 " />
      <div>
      <MyMap mapRef={mapRef} places={places} />
      </div>
      <RecordModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        selectedPlace={
          selectedPlace ? { name: selectedPlace.name ?? "" } : null
        }
      />
      </div>
    </>
  );
}
