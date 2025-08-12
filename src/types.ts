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
  photos?: Photo[]; // 사진 배열 추가
  recordId?: string; // 여행 기록 ID 추가
}

export type MyMapProps = {
  mapRef: React.RefObject<google.maps.Map | null>;
  places: PlaceInfo[];
};

export interface RecordModalProps {
  open: boolean;
  onClose: () => void;
  selectedPlace: { name: string; location: google.maps.LatLng } | null;
}

// 여행 기록 데이터 타입 (사진 모아보기와 연동)
export interface TravelRecordData {
  id: string;
  userId: string;
  title: string;
  date: string;
  location: string;
  latitude: number;
  longitude: number;
  country: string;
  memo: string;
  photos: Photo[];
  createdAt: string;
  updatedAt: string;
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
  onConfirm?: () => void;
}

export interface UserProfileSectionProps {
  openEditProfile: () => void;
  profileImageUrl?: string | null;
  userName: string;
}

export interface AccountSettingsSectionProps {
  openChangePassword: () => void;
  openWithdrawal: () => void;
}

export type TripCardProps = {
  title: string;
  date?: string;
  description?: string;
  location?: string;
  country?: string;
  photoCount?: number;
};

export interface TravelSummarySectionProps {
  travelRecords: TravelRecordData[];
}

export interface CountryChartSectionProps {
  travelRecords: TravelRecordData[];
}

export interface MyTripListSectionProps {
  travelRecords: TravelRecordData[];
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
  travelRecordId?: string; // 여행 기록과 연결
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

export interface ErrorPageProps {
  errorCode: number;
  message: string;
}

export interface PrivateRouteProps {
  children: React.ReactNode;
}

// 사용자 정보 타입
export interface User {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// 검색 결과로 나올 유저 타입 (가정)
export interface SearchUser {
  user_id: number;
  name: string;
  profile_image?: string;
}

// 내 친구 목록 타입
export interface Friend {
  friend_id: number;
  friend_name: string;
  profile_image?: string;
}

// 보낸 친구 요청 타입
export interface SentRequest {
  friendship_id: number;
  friend_id: number;
  friend_name: string;
  request_date: string;
}

// 받은 친구 요청 타입
export interface ReceivedRequest {
  friendship_id: number;
  user_id: number;
  name: string;
  request_date: string;
  profile_image?: string;
}
