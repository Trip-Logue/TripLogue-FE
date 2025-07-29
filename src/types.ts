import type { ReactNode } from 'react';

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
  country?: string; // 나라 이름 필드 추가 (마이페이지 차트 활용 위함)
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
  className: string;
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

export interface LayoutProps {
  children: ReactNode;
  outerClassName?: string;
  sidebarClassName?: string;
}

export interface WithdrawalModalProps {
  onClose: () => void;
}

export interface UserProfileSectionProps {
  openEditProfile: () => void;
}

export interface AccountSettingsSectionProps {
  openChangePassword: () => void;
  openWithdrawal: () => void;
}

export type TripCardProps = {
  title: string;
  date?: string;
  description?: string;
};

export interface UserProfileSectionProps {
  openEditProfile: () => void;
  profileImageUrl?: string | null;
  userName: string;
}

export interface EditProfileModalProps {
  onClose: () => void;
  onProfileUpdate?: (newNickname: string, newProfileImageUrl: string | null) => void;
  currentNickname: string;
  currentProfileImageUrl: string | null;
}

export interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export interface Photo {
  id: string;
  src: string;
  title: string;
  date: string;
  location: string;
  tags: string[];
  isFavorite: boolean;
  description?: string;
}

export interface PhotoDetailModalProps {
  photo: Photo;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  toggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface ErrorPageProps   {
  errorCode : number;
  message : string;
}

export interface PrivateRouteProps  {
  children: React.ReactNode;
}