'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  User,
  Bell,
  Shield,
  Eye,
  Globe,
  Smartphone,
  Mail,
  Lock,
  Trash2,
  Download,
  Upload,
  Save,
  ToggleLeft,
  ToggleRight,
  Moon,
  Sun,
  Palette,
  Languages,
  Camera,
  Key,
  AlertTriangle
} from 'lucide-react';

interface UserSettings {
  // Profile Settings
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  
  // Privacy Settings
  profileVisibility: 'public' | 'private' | 'connections';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  
  // Notification Settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  projectAlerts: boolean;
  messageNotifications: boolean;
  marketingEmails: boolean;
  
  // Account Settings
  twoFactorAuth: boolean;
  darkMode: boolean;
  language: string;
  timezone: string;
}

export default function Settings() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    emailNotifications: true,
    pushNotifications: true,
    projectAlerts: true,
    messageNotifications: true,
    marketingEmails: false,
    twoFactorAuth: false,
    darkMode: true,
    language: 'en',
    timezone: 'UTC'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    // Load user settings
    if (session?.user) {
      setSettings(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || ''
      }));
    }
    setLoading(false);
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      // Success notification would go here
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'account', label: 'Account', icon: AlertTriangle }
  ];

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        enabled ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold glow-text mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and privacy settings</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="neon-border rounded-xl p-6 glass-effect bg-gray-900/50">
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeSection === section.id
                          ? 'gradient-primary text-white glow-button'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="neon-border rounded-xl p-8 glass-effect bg-gray-900/50">
              {/* Profile Settings */}
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-blue-400" />
                    <h2 className="text-2xl font-bold">Profile Information</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={settings.location}
                        onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={settings.bio}
                      onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  {/* Profile Picture Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                      </div>
                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 gradient-primary rounded-lg glow-button">
                          <Upload className="w-4 h-4" />
                          Upload Photo
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800">
                          <Camera className="w-4 h-4" />
                          Take Photo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeSection === 'privacy' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-blue-400" />
                    <h2 className="text-2xl font-bold">Privacy Settings</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-gray-700">
                      <div>
                        <h3 className="font-medium">Profile Visibility</h3>
                        <p className="text-sm text-gray-400">Control who can see your profile</p>
                      </div>
                      <select
                        value={settings.profileVisibility}
                        onChange={(e) => setSettings(prev => ({ ...prev, profileVisibility: e.target.value as any }))}
                        className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="connections">Connections Only</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between py-4 border-b border-gray-700">
                      <div>
                        <h3 className="font-medium">Show Email Address</h3>
                        <p className="text-sm text-gray-400">Display email on your public profile</p>
                      </div>
                      <Toggle
                        enabled={settings.showEmail}
                        onChange={() => setSettings(prev => ({ ...prev, showEmail: !prev.showEmail }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-4 border-b border-gray-700">
                      <div>
                        <h3 className="font-medium">Show Phone Number</h3>
                        <p className="text-sm text-gray-400">Display phone on your public profile</p>
                      </div>
                      <Toggle
                        enabled={settings.showPhone}
                        onChange={() => setSettings(prev => ({ ...prev, showPhone: !prev.showPhone }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <h3 className="font-medium">Show Location</h3>
                        <p className="text-sm text-gray-400">Display location on your public profile</p>
                      </div>
                      <Toggle
                        enabled={settings.showLocation}
                        onChange={() => setSettings(prev => ({ ...prev, showLocation: !prev.showLocation }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-6 h-6 text-blue-400" />
                    <h2 className="text-2xl font-bold">Notification Preferences</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-gray-700">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-400">Receive notifications via email</p>
                      </div>
                      <Toggle
                        enabled={settings.emailNotifications}
                        onChange={() => setSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-4 border-b border-gray-700">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-gray-400">Receive push notifications on your device</p>
                      </div>
                      <Toggle
                        enabled={settings.pushNotifications}
                        onChange={() => setSettings(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-4 border-b border-gray-700">
                      <div>
                        <h3 className="font-medium">Project Alerts</h3>
                        <p className="text-sm text-gray-400">Get notified about new projects matching your skills</p>
                      </div>
                      <Toggle
                        enabled={settings.projectAlerts}
                        onChange={() => setSettings(prev => ({ ...prev, projectAlerts: !prev.projectAlerts }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-4 border-b border-gray-700">
                      <div>
                        <h3 className="font-medium">Message Notifications</h3>
                        <p className="text-sm text-gray-400">Get notified about new messages</p>
                      </div>
                      <Toggle
                        enabled={settings.messageNotifications}
                        onChange={() => setSettings(prev => ({ ...prev, messageNotifications: !prev.messageNotifications }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <h3 className="font-medium">Marketing Emails</h3>
                        <p className="text-sm text-gray-400">Receive promotional and marketing emails</p>
                      </div>
                      <Toggle
                        enabled={settings.marketingEmails}
                        onChange={() => setSettings(prev => ({ ...prev, marketingEmails: !prev.marketingEmails }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeSection === 'security' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Lock className="w-6 h-6 text-blue-400" />
                    <h2 className="text-2xl font-bold">Security Settings</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-gray-700">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <Toggle
                        enabled={settings.twoFactorAuth}
                        onChange={() => setSettings(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
                      />
                    </div>
                    
                    <div className="py-4 border-b border-gray-700">
                      <h3 className="font-medium mb-3">Change Password</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="password"
                          placeholder="Current password"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                        />
                        <input
                          type="password"
                          placeholder="New password"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                        />
                      </div>
                      <button className="mt-3 flex items-center gap-2 px-4 py-2 gradient-primary rounded-lg glow-button">
                        <Key className="w-4 h-4" />
                        Update Password
                      </button>
                    </div>
                    
                    <div className="py-4">
                      <h3 className="font-medium mb-3">Active Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-blue-400" />
                            <div>
                              <p className="font-medium">Current Device</p>
                              <p className="text-sm text-gray-400">Windows PC • Chrome</p>
                            </div>
                          </div>
                          <span className="text-green-400 text-sm">Active Now</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeSection === 'preferences' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Palette className="w-6 h-6 text-blue-400" />
                    <h2 className="text-2xl font-bold">Preferences</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-gray-700">
                      <div>
                        <h3 className="font-medium">Dark Mode</h3>
                        <p className="text-sm text-gray-400">Use dark theme across the application</p>
                      </div>
                      <Toggle
                        enabled={settings.darkMode}
                        onChange={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-4 border-b border-gray-700">
                      <div>
                        <h3 className="font-medium">Language</h3>
                        <p className="text-sm text-gray-400">Choose your preferred language</p>
                      </div>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                        className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <h3 className="font-medium">Timezone</h3>
                        <p className="text-sm text-gray-400">Set your local timezone</p>
                      </div>
                      <select
                        value={settings.timezone}
                        onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                        className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="PST">Pacific Time</option>
                        <option value="CET">Central European Time</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Management */}
              {activeSection === 'account' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                    <h2 className="text-2xl font-bold">Account Management</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-gray-800 rounded-lg border border-gray-600">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Export Data
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Download a copy of all your data including profile information, projects, and messages.
                      </p>
                      <button className="flex items-center gap-2 px-4 py-2 gradient-primary rounded-lg glow-button">
                        <Download className="w-4 h-4" />
                        Export My Data
                      </button>
                    </div>
                    
                    <div className="p-6 bg-red-900/20 rounded-lg border border-red-600">
                      <h3 className="font-medium mb-3 flex items-center gap-2 text-red-400">
                        <Trash2 className="w-5 h-5" />
                        Delete Account
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-end gap-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 gradient-primary rounded-lg glow-button font-medium disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
