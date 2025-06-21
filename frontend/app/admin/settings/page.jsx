"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Shield, 
  Mail, 
  Globe, 
  Database, 
  Bell, 
  Palette,
  Save,
  RefreshCw
} from 'lucide-react'
import SectionHeading from '@/app/components/SectionHeading'

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Voice Cart',
    siteDescription: 'Your trusted e-commerce platform',
    siteUrl: 'https://voicecart.com',
    contactEmail: 'admin@voicecart.com',
    supportPhone: '+91 1234567890',
    
    // Security Settings
    requireEmailVerification: true,
    requirePhoneVerification: false,
    maxLoginAttempts: 5,
    sessionTimeout: 24,
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    
    // Notification Settings
    emailNotifications: true,
    orderNotifications: true,
    sellerApprovalNotifications: true,
    
    // Appearance Settings
    primaryColor: '#E11D48',
    secondaryColor: '#7C3AED',
    enableDarkMode: false,
    
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    autoBackup: true,
    backupFrequency: 'daily'
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('adminSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage
      localStorage.setItem('adminSettings', JSON.stringify(settings))
      
      setMessage('Settings saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      const defaultSettings = {
        siteName: 'Voice Cart',
        siteDescription: 'Your trusted e-commerce platform',
        siteUrl: 'https://voicecart.com',
        contactEmail: 'admin@voicecart.com',
        supportPhone: '+91 1234567890',
        requireEmailVerification: true,
        requirePhoneVerification: false,
        maxLoginAttempts: 5,
        sessionTimeout: 24,
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        emailNotifications: true,
        orderNotifications: true,
        sellerApprovalNotifications: true,
        primaryColor: '#E11D48',
        secondaryColor: '#7C3AED',
        enableDarkMode: false,
        maintenanceMode: false,
        debugMode: false,
        autoBackup: true,
        backupFrequency: 'daily'
      }
      setSettings(defaultSettings)
      localStorage.setItem('adminSettings', JSON.stringify(defaultSettings))
      setMessage('Settings reset to default!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const settingSections = [
    {
      title: 'General Settings',
      icon: Globe,
      settings: [
        { key: 'siteName', label: 'Site Name', type: 'text' },
        { key: 'siteDescription', label: 'Site Description', type: 'textarea' },
        { key: 'siteUrl', label: 'Site URL', type: 'text' },
        { key: 'contactEmail', label: 'Contact Email', type: 'email' },
        { key: 'supportPhone', label: 'Support Phone', type: 'text' }
      ]
    },
    {
      title: 'Security Settings',
      icon: Shield,
      settings: [
        { key: 'requireEmailVerification', label: 'Require Email Verification', type: 'checkbox' },
        { key: 'requirePhoneVerification', label: 'Require Phone Verification', type: 'checkbox' },
        { key: 'maxLoginAttempts', label: 'Max Login Attempts', type: 'number' },
        { key: 'sessionTimeout', label: 'Session Timeout (hours)', type: 'number' }
      ]
    },
    {
      title: 'Email Settings',
      icon: Mail,
      settings: [
        { key: 'smtpHost', label: 'SMTP Host', type: 'text' },
        { key: 'smtpPort', label: 'SMTP Port', type: 'number' },
        { key: 'smtpUser', label: 'SMTP Username', type: 'text' },
        { key: 'smtpPassword', label: 'SMTP Password', type: 'password' }
      ]
    },
    {
      title: 'Notification Settings',
      icon: Bell,
      settings: [
        { key: 'emailNotifications', label: 'Enable Email Notifications', type: 'checkbox' },
        { key: 'orderNotifications', label: 'Order Notifications', type: 'checkbox' },
        { key: 'sellerApprovalNotifications', label: 'Seller Approval Notifications', type: 'checkbox' }
      ]
    },
    {
      title: 'Appearance Settings',
      icon: Palette,
      settings: [
        { key: 'primaryColor', label: 'Primary Color', type: 'color' },
        { key: 'secondaryColor', label: 'Secondary Color', type: 'color' },
        { key: 'enableDarkMode', label: 'Enable Dark Mode', type: 'checkbox' }
      ]
    },
    {
      title: 'System Settings',
      icon: Database,
      settings: [
        { key: 'maintenanceMode', label: 'Maintenance Mode', type: 'checkbox' },
        { key: 'debugMode', label: 'Debug Mode', type: 'checkbox' },
        { key: 'autoBackup', label: 'Auto Backup', type: 'checkbox' },
        { key: 'backupFrequency', label: 'Backup Frequency', type: 'select', options: ['daily', 'weekly', 'monthly'] }
      ]
    }
  ]

  const renderSettingInput = (setting) => {
    const value = settings[setting.key]
    
    switch (setting.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <input
            type={setting.type}
            value={value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        )
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleSettingChange(setting.key, parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        )
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        )
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
            className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
          />
        )
      case 'color':
        return (
          <input
            type="color"
            value={value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="h-10 w-20 border border-gray-300 rounded-md cursor-pointer"
          />
        )
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            {setting.options.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Admin Settings"
        subtitle="Configure your platform settings"
        colors={["#E11D48", "#7C3AED", "#E11D48"]}
        animationSpeed={3}
      />

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-md ${
            message.includes('successfully') || message.includes('reset')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleReset}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <RefreshCw size={16} className="mr-2" />
          Reset to Default
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:opacity-50"
        >
          <Save size={16} className="mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingSections.map((section, sectionIndex) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center mb-6">
                <Icon size={24} className="text-rose-600 mr-3" />
                <h3 className="text-lg font-semibold">{section.title}</h3>
              </div>
              
              <div className="space-y-4">
                {section.settings.map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {setting.label}
                    </label>
                    {renderSettingInput(setting)}
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="font-medium">Clear Cache</div>
            <div className="text-sm text-gray-500">Clear all cached data</div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="font-medium">Backup Database</div>
            <div className="text-sm text-gray-500">Create manual backup</div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="font-medium">System Health</div>
            <div className="text-sm text-gray-500">Check system status</div>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default SettingsPage 