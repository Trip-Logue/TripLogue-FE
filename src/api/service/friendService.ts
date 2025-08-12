import type { Friend, ReceivedRequest, SearchUser } from '@/types';

// --- ⚙️ 더미 데이터베이스 ---

// 시스템에 있는 모든 유저 목록 (검색용)
const mockAllUsers: SearchUser[] = [
  { user_id: 1, name: '김철수', profile_image: '' },
  { user_id: 2, name: '박영희', profile_image: '' },
  { user_id: 3, name: '이지은', profile_image: '' },
  { user_id: 4, name: '최민준', profile_image: '' },
  { user_id: 5, name: '정수빈', profile_image: '' },
  { user_id: 6, name: '강현우', profile_image: '' },
  { user_id: 7, name: '조유리', profile_image: '' },
];

// 내 현재 친구 목록
let mockFriends: Friend[] = [
  { friend_id: 2, friend_name: '박영희', profile_image: '' },
  { friend_id: 3, friend_name: '이지은', profile_image: '' },
];

// 내가 받은 친구 요청 목록
let mockReceivedRequests: ReceivedRequest[] = [
  { friendship_id: 101, user_id: 4, name: '최민준', request_date: new Date().toISOString() },
  { friendship_id: 102, user_id: 5, name: '정수빈', request_date: new Date().toISOString() },
];

// 네트워크 지연 시뮬레이션 함수
const simulateNetwork = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
};

// --- 🧑‍💻 Mock API 함수들 ---

// 유저 검색
export const searchUsers = async (name: string): Promise<SearchUser[]> => {
  console.log(`[MOCK] 유저 검색: ${name}`);
  if (!name.trim()) return [];

  const lowerCaseName = name.toLowerCase();
  const results = mockAllUsers.filter((user) => {
    const isNotMe = user.user_id !== 1; // 내 아이디는 1이라고 가정
    const isNotFriend = !mockFriends.some((f) => f.friend_id === user.user_id);
    const isNameMatch = user.name.toLowerCase().includes(lowerCaseName);
    return isNotMe && isNotFriend && isNameMatch;
  });

  return simulateNetwork(results) as Promise<SearchUser[]>;
};

// 내 친구 목록 조회
export const getMyFriends = async (): Promise<Friend[]> => {
  console.log('[MOCK] 내 친구 목록 조회');
  return simulateNetwork(mockFriends) as Promise<Friend[]>;
};

// 받은 친구 요청 목록 조회
export const getReceivedRequests = async (): Promise<ReceivedRequest[]> => {
  console.log('[MOCK] 받은 친구 요청 목록 조회');
  return simulateNetwork(mockReceivedRequests) as Promise<ReceivedRequest[]>;
};

// 친구 요청 보내기
export const sendFriendRequest = async (friendId: number): Promise<{ message: string }> => {
  console.log(`[MOCK] 친구 요청 보내기: ${friendId}`);
  // 실제로는 서버에서 처리, 여기서는 성공 메시지만 반환
  return simulateNetwork({ message: '친구 요청을 보냈습니다.' });
};

// 친구 요청 수락
export const acceptFriendRequest = async (userId: number): Promise<{ message: string }> => {
  console.log(`[MOCK] 친구 요청 수락: ${userId}`);
  const requestIndex = mockReceivedRequests.findIndex((req) => req.user_id === userId);
  if (requestIndex === -1) {
    throw new Error('요청을 찾을 수 없습니다.');
  }

  // 요청 목록에서 제거
  const [acceptedRequest] = mockReceivedRequests.splice(requestIndex, 1);

  // 친구 목록에 추가
  mockFriends.push({
    friend_id: acceptedRequest.user_id,
    friend_name: acceptedRequest.name,
    profile_image: mockAllUsers.find((u) => u.user_id === userId)?.profile_image,
  });

  return simulateNetwork({ message: `${acceptedRequest.name}님과 친구가 되었습니다.` });
};

// 친구 요청 거절
export const rejectFriendRequest = async (userId: number): Promise<{ message: string }> => {
  console.log(`[MOCK] 친구 요청 거절: ${userId}`);
  const requestIndex = mockReceivedRequests.findIndex((req) => req.user_id === userId);
  if (requestIndex === -1) {
    throw new Error('요청을 찾을 수 없습니다.');
  }

  // 요청 목록에서 제거
  mockReceivedRequests.splice(requestIndex, 1);

  return simulateNetwork({ message: '친구 요청을 거절했습니다.' });
};

// 친구 삭제
export const deleteFriend = async (friendId: number): Promise<{ message: string }> => {
  console.log(`[MOCK] 친구 삭제: ${friendId}`);
  const friendIndex = mockFriends.findIndex((f) => f.friend_id === friendId);
  if (friendIndex === -1) {
    throw new Error('친구를 찾을 수 없습니다.');
  }

  // 친구 목록에서 제거
  mockFriends.splice(friendIndex, 1);

  return simulateNetwork({ message: '친구가 삭제되었습니다.' });
};
