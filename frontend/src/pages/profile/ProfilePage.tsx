import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';
import { useAuth } from '@/data/store';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const savedAvatar = localStorage.getItem(`avatar_${user.id}`);
      if (savedAvatar) setAvatar(savedAvatar);
    }
    
    const handleAvatarUpdate = () => {
      if (user) {
        const savedAvatar = localStorage.getItem(`avatar_${user.id}`);
        setAvatar(savedAvatar || null);
      }
    };
    
    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    return () => window.removeEventListener('avatarUpdated', handleAvatarUpdate);
  }, [user]);

  const firstLetter = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 w-full">
      <div className="flex flex-col items-center gap-6 max-w-sm w-full">
        {/* Avatar Section */}
        <div className="relative group">
          <div className="w-56 h-56 rounded-full bg-[#f67676] flex items-center justify-center overflow-hidden border text-white text-[120px] font-bold">
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              firstLetter
            )}
          </div>
          
          <button 
            className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full border shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
            title="Change your avatar"
            onClick={() => navigate('edit')}
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="text-center w-full mt-4">
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">{user?.name}</h1>
          <p className="text-lg text-gray-500 mb-6">{user?.email} · {user?.role}</p>
          
          <Button 
            variant="outline" 
            className="w-full h-10 text-sm font-medium"
            onClick={() => navigate('edit')}
          >
            Edit profile
          </Button>
        </div>
      </div>
    </div>
  );
}
