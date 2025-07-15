import Autocomplete from "./autoComplete";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (place: google.maps.places.PlaceResult) => void;
}) {
  return (
    <div className="mb-4">
      <Autocomplete onPlaceSelect={onSearch} />
    </div>
  );
}
