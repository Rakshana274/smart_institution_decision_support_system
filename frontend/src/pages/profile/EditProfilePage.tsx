import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/data/store';

const tabs = [
  { id: 'general', label: 'General', hasError: true },
  { id: 'personal', label: 'Personal' },
  { id: 'professional', label: 'Professional' },
  { id: 'login', label: 'Login' },
];

export default function EditProfilePage() {
  const [activeTab, setActiveTab] = useState('general');
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r min-h-[calc(100vh-4rem)] p-6">
        <div className="mb-10 text-center">
          <hr className="w-24 mx-auto border-t-2 border-gray-300 mb-4" />
          <a href="#" className="text-blue-600 hover:underline">{user?.name || 'User'}</a>
        </div>
        
        <nav className="space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-3 py-3 text-sm text-left ${activeTab === tab.id ? 'border-r-4 border-blue-500 font-semibold text-gray-900 bg-gray-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <span>{tab.label}</span>
              {tab.hasError && <X className="w-4 h-4 text-red-500" strokeWidth={3} />}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 bg-[#f8f9fa]">
        <div className="max-w-2xl">
          {activeTab === 'general' && <GeneralInformationTab />}
          {activeTab === 'personal' && <PersonalInformationTab />}
          {activeTab === 'professional' && <ProfessionalInformationTab />}
          {activeTab === 'login' && <LoginInformationTab />}
        </div>
      </main>
    </div>
  );
}

function GeneralInformationTab() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deletePic, setDeletePic] = useState(false);
  const [name, setName] = useState(user?.name || '');

  const handleSave = async () => {
    let newAvatar = user?.avatar;
    if (deletePic && user) {
      newAvatar = ''; // Or handling deletion properly
      localStorage.removeItem(`avatar_${user.id}`);
      window.dispatchEvent(new Event('avatarUpdated'));
    } else if (fileInputRef.current?.files?.[0] && user) {
      const file = fileInputRef.current.files[0];
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newAvatar = base64;
      localStorage.setItem(`avatar_${user.id}`, base64);
      window.dispatchEvent(new Event('avatarUpdated'));
    }
    
    // Save to backend
    await updateProfile({ name, avatar: newAvatar });
    alert('Profile saved successfully!');
  };

  return (
    <div className="bg-white shadow-sm border rounded-sm">
      <div className="border-b px-8 py-5">
        <h2 className="text-xl font-normal text-gray-700">General Information</h2>
      </div>
      <div className="p-8 space-y-6">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Upload picture of yourself:</label>
          <p className="text-xs text-gray-500 mb-3">Upload files of type jpeg, jpg, png only. Max size allowed is 1MB.</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input ref={fileInputRef} type="file" accept="image/jpeg, image/png, image/jpg" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="deletePic" checked={deletePic} onChange={(e) => setDeletePic(e.target.checked)} className="rounded-sm border-gray-300" />
          <label htmlFor="deletePic" className="text-sm text-gray-700">Delete Profile Picture</label>
        </div>
        <p className="text-xs text-gray-500 -mt-2">Tick the checkbox, if you want to delete your current profile picture</p>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Your Name: <span className="text-red-500">*</span></label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 p-2 text-sm rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Your Date of birth:</label>
          <input type="date" className="w-full border border-gray-300 p-2 text-sm rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Gender:</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-sm text-gray-700">
              <input type="radio" name="gender" value="female" className="text-blue-600 focus:ring-blue-500" /> Female
            </label>
            <label className="flex items-center gap-1.5 text-sm text-gray-700">
              <input type="radio" name="gender" value="male" className="text-blue-600 focus:ring-blue-500" /> Male
            </label>
            <label className="flex items-center gap-1.5 text-sm text-gray-700">
              <input type="radio" name="gender" value="other" className="text-blue-600 focus:ring-blue-500" /> Other
            </label>
          </div>
        </div>

        <button onClick={handleSave} className="bg-[#4285f4] hover:bg-blue-600 text-white px-8 py-2 text-sm rounded-sm mt-4">Save</button>
      </div>
    </div>
  );
}

function PersonalInformationTab() {
  const { user } = useAuth();
  
  return (
    <div className="bg-white shadow-sm border rounded-sm">
      <div className="border-b px-8 py-5">
        <h2 className="text-xl font-normal text-gray-700">Personal Information</h2>
      </div>
      <div className="p-8 space-y-6">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Email address: <span className="text-red-500">*</span></label>
          <input type="email" defaultValue={user?.email || "rakshana.cs23@bitsathy.ac.in"} className="w-full border border-gray-300 p-2 text-sm rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Country Name: <span className="text-red-500">*</span></label>
          <select className="w-full border border-gray-300 p-2 text-sm rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
            <option>India</option>
            <option>USA</option>
            <option>UK</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Select your timezone:</label>
          <select className="w-full border border-gray-300 p-2 text-sm rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
            <option>Asia/Kolkata (+05:30)</option>
            <option>UTC</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Area Pincode:</label>
          <input type="text" className="w-full border border-gray-300 p-2 text-sm rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>

        <div>
          <button className="text-[#4285f4] text-sm hover:underline">+ Add your number</button>
        </div>

        <button className="bg-[#4285f4] hover:bg-blue-600 text-white px-8 py-2 text-sm rounded-sm mt-4">Save</button>
      </div>
    </div>
  );
}

function ProfessionalInformationTab() {
  return (
    <div className="bg-white shadow-sm border rounded-sm">
      <div className="border-b px-8 py-5">
        <h2 className="text-xl font-normal text-gray-700">Professional Information</h2>
      </div>
      <div className="p-8 space-y-6">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Programming Language Preference: <span className="text-red-500">*</span></label>
          <select className="w-full border border-gray-300 p-2 text-sm rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
            <option>Java(HotSpot 17.0.1)</option>
            <option>Python 3</option>
            <option>JavaScript</option>
            <option>C++</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Programming Since:</label>
          <select className="w-full border border-gray-300 p-2 text-sm rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-500">
            <option>Programming since</option>
            <option>Less than 1 year</option>
            <option>1-3 years</option>
            <option>3+ years</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Highest Degree Earned:</label>
          <input type="text" className="w-full border border-gray-300 p-2 text-sm rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Are you a Student or a Professional: <span className="text-red-500">*</span></label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-sm text-gray-700">
              <input type="radio" name="profession" value="student" className="text-blue-600 focus:ring-blue-500" /> Student
            </label>
            <label className="flex items-center gap-1.5 text-sm text-gray-700">
              <input type="radio" name="profession" value="professional" className="text-blue-600 focus:ring-blue-500" /> Professional
            </label>
            <label className="flex items-center gap-1.5 text-sm text-gray-700">
              <input type="radio" name="profession" value="other" defaultChecked className="text-blue-600 focus:ring-blue-500" /> Other
            </label>
          </div>
        </div>

        <button className="bg-[#4285f4] hover:bg-blue-600 text-white px-8 py-2 text-sm rounded-sm mt-4">Save</button>
      </div>
    </div>
  );
}

function LoginInformationTab() {
  return (
    <div className="bg-white shadow-sm border rounded-sm">
      <div className="border-b px-8 py-5">
        <h2 className="text-xl font-normal text-gray-700">Login Information</h2>
      </div>
      <div className="p-8 space-y-8">
        <div className="space-y-4">
          <p className="text-sm text-gray-700">Use 8 characters with a mix of uppercase, lowercase, numbers, and special characters (e.g.@$X&amp;)</p>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">New Password:</label>
            <input type="password" className="w-full border border-gray-300 p-2 text-sm rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Confirm password:</label>
            <input type="password" className="w-full border border-gray-300 p-2 text-sm rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>

          <p className="text-xs text-gray-500">Set up your password</p>
          
          <button className="bg-[#4285f4] hover:bg-blue-600 text-white px-6 py-2 text-sm rounded-sm mt-2">Update Password</button>
        </div>

        <div className="pt-6 border-t">
          <h3 className="text-sm font-semibold tracking-wider text-gray-700 uppercase mb-4">Logout From All Devices</h3>
          <button className="bg-[#d34827] hover:bg-red-700 text-white px-6 py-2 text-sm rounded-sm shadow-sm transition-colors">Logout from all devices</button>
        </div>
      </div>
    </div>
  );
}
