import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import * as api from '@/api/service/friendService';
import Layout from '@/layouts/layout';
import { UserPlus, UserCheck, UserX, Trash2, Search, Users, UserCheck2, Clock } from 'lucide-react';
import IconButton from '@/components/friend/IconButton';
import UserItem from '@/components/friend/UserItem';
import UserList from '@/components/friend/UserList';

const FriendPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: api.getMyFriends,
  });

  const { data: receivedRequests = [], isLoading: isLoadingReceived } = useQuery({
    queryKey: ['receivedRequests'],
    queryFn: api.getReceivedRequests,
  });

  const {
    data: searchResults = [],
    refetch: refetchSearch,
    isLoading: isLoadingSearch,
  } = useQuery({
    queryKey: ['userSearch', searchTerm],
    queryFn: () => api.searchUsers(searchTerm),
    enabled: false,
  });

  const mutationOptions = {
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['receivedRequests'] });
    },
    onError: (error: Error) => toast.error(error.message),
  };

  const acceptMutation = useMutation({ mutationFn: api.acceptFriendRequest, ...mutationOptions });
  const rejectMutation = useMutation({ mutationFn: api.rejectFriendRequest, ...mutationOptions });
  const deleteFriendMutation = useMutation({ mutationFn: api.deleteFriend, ...mutationOptions });
  const sendRequestMutation = useMutation({
    mutationFn: api.sendFriendRequest,
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['userSearch'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      refetchSearch();
    }
  };

  return (
    <Layout>
      <div className='w-240 mx-auto m-7 rounded-xl justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 '>
        <div className='max-w-7xl w-full p-4 sm:p-6 lg:p-8'>
          {/* Hero Section */}
          <header className='mb-12'>
            <div className='relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 lg:p-12'>
              <div className='absolute inset-0 bg-black/10'></div>
              <div className='relative z-10 text-center'>
                <div className='flex items-center justify-center gap-4 mb-4'>
                  <div className='p-3 bg-white/20 rounded-2xl backdrop-blur-sm'>
                    <Users className='text-white' size={32} />
                  </div>
                  <h1 className='text-4xl lg:text-5xl font-bold text-white tracking-tight'>
                    친구 관리
                  </h1>
                </div>
                <p className='text-xl text-blue-100 max-w-2xl mx-auto'>
                  여행 동반자를 찾고, 친구들과 함께 특별한 순간을 만들어보세요
                </p>
              </div>
              <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl'></div>
              <div className='absolute bottom-0 left-0 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl'></div>
            </div>
          </header>

          {/* Search Section */}
          <section className='mb-12'>
            <div className='bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3'>
                <Search className='text-blue-600' size={28} />
                새로운 친구 찾기
              </h2>
              <form onSubmit={handleSearchSubmit} className='relative'>
                <Search
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
                  size={20}
                />
                <input
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='이름으로 친구 검색...'
                  className='w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 hover:bg-white'
                />
                <button
                  type='submit'
                  className='absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium'>
                  검색
                </button>
              </form>

              {searchTerm && (
                <div className='mt-6'>
                  <UserList
                    users={searchResults}
                    onAction={(userId: number) => sendRequestMutation.mutate(userId)}
                    actionIcon={UserPlus}
                    actionText='요청'
                    isLoading={isLoadingSearch}
                    listType='search'
                  />
                </div>
              )}
            </div>
          </section>

          {/* Main Content Grid */}
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
            {/* Received Requests Section */}
            <section>
              <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
                <div className='bg-gradient-to-r from-orange-500 to-red-500 p-6'>
                  <h2 className='text-xl font-bold text-white flex items-center gap-3'>
                    <Clock className='text-orange-200' size={24} />
                    받은 친구 요청
                    <span className='ml-auto bg-white/20 text-white text-sm font-medium rounded-full px-3 py-1'>
                      {receivedRequests.length}
                    </span>
                  </h2>
                </div>
                <div className='p-6'>
                  {isLoadingReceived ? (
                    <div className='flex justify-center items-center py-12'>
                      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500'></div>
                    </div>
                  ) : receivedRequests.length > 0 ? (
                    <div className='space-y-4'>
                      {receivedRequests.map((req) => (
                        <div
                          key={req.friendship_id}
                          className='bg-gray-50 rounded-xl p-4 border border-gray-100'>
                          <UserItem name={req.name} profileImage={req.profile_image}>
                            <div className='flex gap-2'>
                              <IconButton
                                onClick={() => acceptMutation.mutate(req.user_id)}
                                icon={UserCheck}
                                variant='accept'
                              />
                              <IconButton
                                onClick={() => rejectMutation.mutate(req.user_id)}
                                icon={UserX}
                                variant='reject'
                              />
                            </div>
                          </UserItem>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-12'>
                      <Clock className='mx-auto text-gray-300 mb-4' size={48} />
                      <p className='text-gray-500 text-lg'>받은 친구 요청이 없습니다</p>
                      <p className='text-gray-400 text-sm mt-2'>새로운 친구 요청을 기다려보세요</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Friends Section */}
            <section>
              <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
                <div className='bg-gradient-to-r from-green-500 to-emerald-500 p-6'>
                  <h2 className='text-xl font-bold text-white flex items-center gap-3'>
                    <UserCheck2 className='text-green-200' size={24} />내 친구 목록
                    <span className='ml-auto bg-white/20 text-white text-sm font-medium rounded-full px-3 py-1'>
                      {friends.length}
                    </span>
                  </h2>
                </div>
                <div className='p-6'>
                  {isLoadingFriends ? (
                    <div className='flex justify-center items-center py-12'>
                      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-500'></div>
                    </div>
                  ) : friends.length > 0 ? (
                    <div className='space-y-4'>
                      {friends.map((friend) => (
                        <div
                          key={friend.friend_id}
                          className='bg-gray-50 rounded-xl p-4 border border-gray-100 hover:bg-gray-100 transition-colors duration-200'>
                          <UserItem name={friend.friend_name} profileImage={friend.profile_image}>
                            <IconButton
                              onClick={() => deleteFriendMutation.mutate(friend.friend_id)}
                              icon={Trash2}
                              variant='delete'
                            />
                          </UserItem>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-12'>
                      <Users className='mx-auto text-gray-300 mb-4' size={48} />
                      <p className='text-gray-500 text-lg'>아직 친구가 없습니다</p>
                      <p className='text-gray-400 text-sm mt-2'>새로운 친구를 찾아보세요</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FriendPage;
