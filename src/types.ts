export interface CommonBtnProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

export interface CommonInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
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
}

export type MyMapProps = {
  mapRef: React.RefObject<google.maps.Map | null>;
  places: PlaceInfo[];
};
