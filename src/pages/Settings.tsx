import React, { useState } from 'react';
import { Save, Bell, Lock, User, Monitor, ToggleLeft } from 'lucide-react';

const Settings: React.FC = () => {
  const [notifySessionReminders, setNotifySessionReminders] = useState(true);
  const [notifyGoalUpdates, setNotifyGoalUpdates] = useState(true);
  const [notifyContentUpdates, setNotifyContentUpdates] = useState(false);
  
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  
  const [name, setName] = useState('Player Name');
  const [email, setEmail] = useState('player@example.com');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-6">Settings</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium flex items-center mb-4">
              <User className="mr-2 text-blue-600" size={20} />
              Profile Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2 border"
                />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium flex items-center mb-4">
              <Bell className="mr-2 text-blue-600" size={20} />
              Notification Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Session Reminders</h4>
                  <p className="text-sm text-gray-500">Receive reminders for scheduled sessions</p>
                </div>
                <button 
                  onClick={() => setNotifySessionReminders(!notifySessionReminders)}
                  className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    notifySessionReminders ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className="sr-only">Toggle session reminders</span>
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                      notifySessionReminders ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Goal Updates</h4>
                  <p className="text-sm text-gray-500">Receive notifications about goal progress</p>
                </div>
                <button 
                  onClick={() => setNotifyGoalUpdates(!notifyGoalUpdates)}
                  className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    notifyGoalUpdates ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className="sr-only">Toggle goal updates</span>
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                      notifyGoalUpdates ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Content Updates</h4>
                  <p className="text-sm text-gray-500">Receive notifications about new knowledge content</p>
                </div>
                <button 
                  onClick={() => setNotifyContentUpdates(!notifyContentUpdates)}
                  className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    notifyContentUpdates ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className="sr-only">Toggle content updates</span>
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                      notifyContentUpdates ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium flex items-center mb-4">
              <Monitor className="mr-2 text-blue-600" size={20} />
              Display Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Dark Mode</h4>
                  <p className="text-sm text-gray-500">Use dark color theme</p>
                </div>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className="sr-only">Toggle dark mode</span>
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                      darkMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Compact View</h4>
                  <p className="text-sm text-gray-500">Reduce spacing and show more content</p>
                </div>
                <button 
                  onClick={() => setCompactView(!compactView)}
                  className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    compactView ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className="sr-only">Toggle compact view</span>
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                      compactView ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">High Contrast Mode</h4>
                  <p className="text-sm text-gray-500">Increase contrast for better readability</p>
                </div>
                <button 
                  onClick={() => setHighContrastMode(!highContrastMode)}
                  className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    highContrastMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className="sr-only">Toggle high contrast mode</span>
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                      highContrastMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium flex items-center mb-4">
              <Lock className="mr-2 text-blue-600" size={20} />
              Privacy & Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Data Encryption</h4>
                  <p className="text-sm text-gray-500">Encrypt all session data and notes</p>
                </div>
                <button 
                  className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-blue-600"
                >
                  <span className="sr-only">Toggle encryption</span>
                  <span
                    className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-5"
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Setup
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Data Backup</h4>
                  <p className="text-sm text-gray-500">Configure automatic backups of your data</p>
                </div>
                <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Configure
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex justify-end">
            <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
              <Save size={16} className="mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;