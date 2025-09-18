import React, { useState } from 'react';
import { User, Lock, Bell, Database, Mail, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { admin } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'api', name: 'API Settings', icon: Database },
  ];

  const ProfileSettings = () => {
    const [profileData, setProfileData] = useState({
      name: admin?.name || '',
      email: admin?.email || '',
      bio: '',
      phone: '',
      location: ''
    });

    const handleProfileUpdate = (e) => {
      e.preventDefault();
      toast.success('Profile updated successfully!');
    };

    return (
      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              className="form-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              className="form-input"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="form-label">Location</label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData({...profileData, location: e.target.value})}
              className="form-input"
              placeholder="City, Country"
            />
          </div>
        </div>

        <div>
          <label className="form-label">Bio</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            rows={4}
            className="form-input"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            Update Profile
          </button>
        </div>
      </form>
    );
  };

  const SecuritySettings = () => {
    const [passwordData, setPasswordData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const handlePasswordChange = (e) => {
      e.preventDefault();
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
      <div className="space-y-6">
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
          
          <div>
            <label className="form-label">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              className="form-input"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary">
              Update Password
            </button>
          </div>
        </form>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Enable 2FA</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <button className="btn-secondary">
              Enable
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NotificationSettings = () => {
    const [notifications, setNotifications] = useState({
      emailNotifications: true,
      courseUpdates: true,
      newTestimonials: false,
      systemAlerts: true,
      weeklyReports: true
    });

    const handleNotificationChange = (key) => {
      setNotifications({
        ...notifications,
        [key]: !notifications[key]
      });
      toast.success('Notification preferences updated');
    };

    const notificationOptions = [
      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
      { key: 'courseUpdates', label: 'Course Updates', description: 'Get notified when courses are updated' },
      { key: 'newTestimonials', label: 'New Testimonials', description: 'Notifications for new testimonials' },
      { key: 'systemAlerts', label: 'System Alerts', description: 'Important system notifications' },
      { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly analytics reports' }
    ];

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
        
        <div className="space-y-4">
          {notificationOptions.map((option) => (
            <div key={option.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{option.label}</h4>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[option.key]}
                  onChange={() => handleNotificationChange(option.key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const APISettings = () => {
    const apiEndpoints = [
      { method: 'GET', endpoint: '/api/courses', description: 'Fetch all courses' },
      { method: 'POST', endpoint: '/api/courses', description: 'Create new course' },
      { method: 'PUT', endpoint: '/api/courses/:courseCode', description: 'Update course' },
      { method: 'DELETE', endpoint: '/api/courses/:courseCode', description: 'Delete course' },
      { method: 'GET', endpoint: '/api/testimonials', description: 'Fetch all testimonials' },
      { method: 'POST', endpoint: '/api/testimonials', description: 'Create testimonial' },
      { method: 'POST', endpoint: '/api/contact', description: 'Send contact message' },
      { method: 'POST', endpoint: '/api/admin/login', description: 'Admin login' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">API Configuration</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">API Base URL</label>
                <input
                  type="text"
                  value="https://bms-2-te1h.onrender.com"
                  className="form-input bg-white"
                  readOnly
                />
              </div>
              <div>
                <label className="form-label">API Version</label>
                <input
                  type="text"
                  value="v1"
                  className="form-input bg-white"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Available Endpoints</h3>
          <div className="space-y-3">
            {apiEndpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                    endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                    endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm text-gray-800">{endpoint.endpoint}</code>
                </div>
                <span className="text-sm text-gray-600">{endpoint.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Authentication</h4>
              <p className="text-sm text-blue-700 mt-1">
                Protected endpoints require a Bearer token in the Authorization header. 
                Obtain tokens through the login endpoint.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'api':
        return <APISettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="card">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;