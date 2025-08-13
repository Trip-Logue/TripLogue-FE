import { useState } from 'react';
import { User, Camera, Edit3, Save, X } from 'lucide-react';

interface UserProfileSectionProps {
  profileImageUrl: string | null;
  userName: string;
  currentEmail: string;
  onProfileUpdate: (newProfileImageUrl: string | null, newName: string) => void;
}

export default function UserProfileSection({
  profileImageUrl,
  userName,
  currentEmail,
  onProfileUpdate,
}: UserProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [newProfileImageUrl, setNewProfileImageUrl] = useState<string | null>(profileImageUrl);

  const handleSave = () => {
    onProfileUpdate(newProfileImageUrl, newName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewName(userName);
    setNewProfileImageUrl(profileImageUrl);
    setIsEditing(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProfileImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
      <div className='flex items-center gap-6'>
        {/* 프로필 이미지 */}
        <div className='relative'>
          <div className='w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center'>
            {newProfileImageUrl ? (
              <img
                src={newProfileImageUrl}
                alt='프로필 이미지'
                className='w-full h-full object-cover'
              />
            ) : (
              <User className='w-12 h-12 text-gray-400' />
            )}
          </div>
          {isEditing && (
            <label className='absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors'>
              <Camera className='w-4 h-4' />
              <input type='file' accept='image/*' onChange={handleImageChange} className='hidden' />
            </label>
          )}
        </div>

        {/* 사용자 정보 */}
        <div className='flex-1'>
          <div className='flex items-center gap-3 mb-4'>
            <h2 className='text-2xl font-bold text-gray-900'>프로필 정보</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'>
                <Edit3 size={20} />
              </button>
            ) : (
              <div className='flex gap-2'>
                <button
                  onClick={handleSave}
                  className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors'>
                  <Save size={20} />
                </button>
                <button
                  onClick={handleCancel}
                  className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'>
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          <div className='space-y-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>이름</label>
              {isEditing ? (
                <input
                  type='text'
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              ) : (
                <p className='text-lg text-gray-900'>{userName}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>이메일</label>
              <p className='text-lg text-gray-900'>{currentEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
