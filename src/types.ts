export interface CommonBtnProps {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
}

export interface CommonInputProps {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
}

export interface MarkerInfo {
  id: string;
  marker: google.maps.Marker;
  name: string;
}

export interface PlaceInfo {
  name: string;
  location: google.maps.LatLng;
  date: string;
  memo: string;
  title: string; // 제목 필드 추가
}

export type MyMapProps = {
  mapRef: React.RefObject<google.maps.Map | null>;
  places: PlaceInfo[];
};

export interface RecordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; date: string; memo: string }) => void;
  selectedPlace: { name: string } | null;
}

export interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
}

export interface SearchBarProps {
  onSearch: (place: google.maps.places.PlaceResult) => void;
  className : string;
}

export interface RegisterInputProps {
  id?: string;
  type?: 'text' | 'password' | 'email';
  className?: string;
  value: string;
  placeholder?: string;
  autoFocus?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}