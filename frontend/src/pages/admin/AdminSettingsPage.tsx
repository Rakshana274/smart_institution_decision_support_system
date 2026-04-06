import { useState } from 'react';
import { Settings, Bell, Shield, Palette, Globe, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    institutionName: 'Demo University',
    timezone: 'America/New_York',
    language: 'English',
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    twoFactor: false,
    sessionTimeout: '30',
    passwordPolicy: 'strong',
    theme: 'light',
    compactMode: false,
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const handleSave = () => {
    // Mock save
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure system preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-muted rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="chart-card">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Institution Name</label>
              <input value={settings.institutionName} onChange={e => setSettings({ ...settings, institutionName: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Timezone</label>
              <select value={settings.timezone} onChange={e => setSettings({ ...settings, timezone: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="America/New_York">Eastern Time (US & Canada)</option>
                <option value="America/Chicago">Central Time (US & Canada)</option>
                <option value="America/Denver">Mountain Time (US & Canada)</option>
                <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                <option value="Europe/London">London (GMT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Language</label>
              <select value={settings.language} onChange={e => setSettings({ ...settings, language: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {[
              { key: 'emailNotifications' as const, label: 'Email Notifications', desc: 'Receive updates via email' },
              { key: 'pushNotifications' as const, label: 'Push Notifications', desc: 'Browser push notifications' },
              { key: 'weeklyDigest' as const, label: 'Weekly Digest', desc: 'Summary email every Monday' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${settings[item.key] ? 'bg-primary' : 'bg-muted'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-background shadow-sm absolute top-0.5 transition-transform ${settings[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div>
                <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Extra layer of security</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, twoFactor: !settings.twoFactor })}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.twoFactor ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-background shadow-sm absolute top-0.5 transition-transform ${settings.twoFactor ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Session Timeout (minutes)</label>
              <input type="number" value={settings.sessionTimeout} onChange={e => setSettings({ ...settings, sessionTimeout: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password Policy</label>
              <select value={settings.passwordPolicy} onChange={e => setSettings({ ...settings, passwordPolicy: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="basic">Basic (8+ characters)</option>
                <option value="strong">Strong (8+ chars, mixed case, numbers)</option>
                <option value="strict">Strict (12+ chars, special characters required)</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'system'].map(t => (
                  <button
                    key={t}
                    onClick={() => setSettings({ ...settings, theme: t })}
                    className={`p-4 rounded-lg border text-center transition-all ${settings.theme === t ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-input hover:border-primary/30'}`}
                  >
                    <p className="text-sm font-medium text-foreground capitalize">{t}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div>
                <p className="text-sm font-medium text-foreground">Compact Mode</p>
                <p className="text-xs text-muted-foreground">Reduce spacing and padding</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, compactMode: !settings.compactMode })}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.compactMode ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-background shadow-sm absolute top-0.5 transition-transform ${settings.compactMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button onClick={handleSave} className="flex items-center gap-2 gradient-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
