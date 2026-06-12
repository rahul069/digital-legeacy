import React, { useState, useEffect } from 'react';
import { 
  Shield, Bell, Clock, Save, AlertTriangle, CheckCircle, User, Phone, 
  Fingerprint, Lock, Globe, Moon, Sun, Monitor, Trash2, Download, 
  Key, Smartphone, Mail, Eye, EyeOff, FileText, AlertOctagon, X, ChevronRight
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', phone: '', date_of_birth: '',
    emergency_contact_name: '', emergency_contact_phone: '',
    inactivity_check_enabled: true, inactivity_check_days: 90,
    two_factor_enabled: false, login_alert_enabled: true, suspicious_activity_alert: true,
    email_notifications_enabled: true, sms_notifications_enabled: false,
    beneficiary_notification_enabled: true, inactivity_warning_enabled: true,
    death_verification_notification: true,
    data_export_enabled: true, auto_backup_enabled: true, allow_emergency_access: false,
    locale: 'en-US', timezone: 'UTC', theme_preference: 'dark',
    escalation_grace_period: 3,
    escalation_l1_days: 7,
    escalation_l2_days: 14,
    escalation_l3_days: 30,
    escalation_l4_days: 60,
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '', new_password: '', confirm_password: ''
  });
  const [showPasswordFields, setShowPasswordFields] = useState({
    current: false, new: false, confirm: false
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Data', icon: Eye },
    { id: 'preferences', label: 'Preferences', icon: Monitor },
    { id: 'danger', label: 'Danger Zone', icon: AlertOctagon },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile/`);
      const userData = response.data;
      setFormData(prev => ({
        ...prev,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone: userData.phone || '',
        date_of_birth: userData.date_of_birth || '',
        emergency_contact_name: userData.emergency_contact_name || '',
        emergency_contact_phone: userData.emergency_contact_phone || '',
        inactivity_check_enabled: userData.inactivity_check_enabled ?? true,
        inactivity_check_days: userData.inactivity_check_days || 90,
        two_factor_enabled: userData.two_factor_enabled ?? false,
        login_alert_enabled: userData.login_alert_enabled ?? true,
        suspicious_activity_alert: userData.suspicious_activity_alert ?? true,
        email_notifications_enabled: userData.email_notifications_enabled ?? true,
        sms_notifications_enabled: userData.sms_notifications_enabled ?? false,
        beneficiary_notification_enabled: userData.beneficiary_notification_enabled ?? true,
        inactivity_warning_enabled: userData.inactivity_warning_enabled ?? true,
        death_verification_notification: userData.death_verification_notification ?? true,
        data_export_enabled: userData.data_export_enabled ?? true,
        auto_backup_enabled: userData.auto_backup_enabled ?? true,
        allow_emergency_access: userData.allow_emergency_access ?? false,
        locale: userData.locale || 'en-US',
        timezone: userData.timezone || 'UTC',
        theme_preference: userData.theme_preference || 'dark',
        escalation_grace_period: userData.escalation_grace_period || 3,
        escalation_l1_days: userData.escalation_l1_days || 7,
        escalation_l2_days: userData.escalation_l2_days || 14,
        escalation_l3_days: userData.escalation_l3_days || 30,
        escalation_l4_days: userData.escalation_l4_days || 60,
      }));
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      await axios.put(`${API_URL}/auth/profile/`, formData);
      setMessage('Settings saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('New passwords do not match');
      return;
    }
    if (passwordData.new_password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    
    try {
      await axios.post(`${API_URL}/auth/password-change/`, passwordData);
      alert('Password changed successfully');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setShowPasswordForm(false);
    } catch (err) {
      alert('Failed to change password: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleExportData = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/export-data/`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'digital-legacy-export.json');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export data');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }
    try {
      await axios.post(`${API_URL}/auth/delete-account/`);
      localStorage.removeItem('token');
      window.location.reload();
    } catch (err) {
      alert('Failed to delete account');
    }
  };

  const ToggleSwitch = ({ label, description, checked, onChange, disabled }) => (
    <div className="flex items-start justify-between p-4 rounded-xl bg-gray-800/50 border border-gray-800 hover:border-gray-700 transition-all">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-gray-300">{label}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
          checked ? 'bg-blue-500' : 'bg-gray-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </button>
    </div>
  );

  const SectionTitle = ({ icon: Icon, title, subtitle }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-5 h-5 text-blue-400" />
        <h4 className="text-lg font-bold text-white">{title}</h4>
      </div>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in max-w-4xl">
      <div>
        <h3 className="text-xl font-bold text-white">Settings</h3>
        <p className="text-sm text-gray-500 mt-1">Manage your account, security, and preferences</p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
          message.includes('success') 
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.includes('success') ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-slide-in">
            <div className="card-hover">
              <SectionTitle icon={User} title="Personal Information" subtitle="Your basic profile details" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                  <input type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="input-field" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                  <input type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="input-field" placeholder="Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-500" />
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="input-field pl-12" placeholder="+49 123 456789" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Date of Birth</label>
                  <input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} className="input-field" />
                </div>
              </div>
            </div>

            <div className="card-hover">
              <SectionTitle icon={AlertTriangle} title="Emergency Contact" subtitle="Someone to contact in case of emergency" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Contact Name</label>
                  <input type="text" value={formData.emergency_contact_name} onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})} className="input-field" placeholder="Emergency contact name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Contact Phone</label>
                  <input type="tel" value={formData.emergency_contact_phone} onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})} className="input-field" placeholder="Emergency contact phone" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-slide-in">
            <div className="card-hover">
              <SectionTitle icon={Lock} title="Password" subtitle="Change your account password" />
              
              {!showPasswordForm ? (
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(true)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Change Password
                </button>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                    <input
                      type={showPasswordFields.current ? 'text' : 'password'}
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                      className="input-field pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordFields({...showPasswordFields, current: !showPasswordFields.current})}
                      className="absolute right-3 top-10 text-gray-500"
                    >
                      {showPasswordFields.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                    <input
                      type={showPasswordFields.new ? 'text' : 'password'}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                      className="input-field pr-12"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordFields({...showPasswordFields, new: !showPasswordFields.new})}
                      className="absolute right-3 top-10 text-gray-500"
                    >
                      {showPasswordFields.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                    <input
                      type={showPasswordFields.confirm ? 'text' : 'password'}
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                      className="input-field pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordFields({...showPasswordFields, confirm: !showPasswordFields.confirm})}
                      className="absolute right-3 top-10 text-gray-500"
                    >
                      {showPasswordFields.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowPasswordForm(false)} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">Update Password</button>
                  </div>
                </form>
              )}
            </div>

            <div className="card-hover">
              <SectionTitle icon={Shield} title="Two-Factor Authentication" subtitle="Add an extra layer of security" />
              <ToggleSwitch
                label="Enable 2FA"
                description="Require a verification code in addition to your password when signing in."
                checked={formData.two_factor_enabled}
                onChange={(val) => setFormData({...formData, two_factor_enabled: val})}
              />
              {formData.two_factor_enabled && (
                <div className="mt-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-sm text-amber-400">2FA is enabled. In production, you would scan a QR code here with an authenticator app.</p>
                </div>
              )}
            </div>

            <div className="card-hover">
              <SectionTitle icon={Bell} title="Login Alerts" subtitle="Get notified about account activity" />
              <div className="space-y-3">
                <ToggleSwitch
                  label="Login Alert Emails"
                  description="Receive an email every time someone logs into your account."
                  checked={formData.login_alert_enabled}
                  onChange={(val) => setFormData({...formData, login_alert_enabled: val})}
                />
                <ToggleSwitch
                  label="Suspicious Activity Alerts"
                  description="Get alerted when unusual activity is detected on your account."
                  checked={formData.suspicious_activity_alert}
                  onChange={(val) => setFormData({...formData, suspicious_activity_alert: val})}
                />
              </div>
            </div>

            <div className="card-hover">
              <SectionTitle icon={Clock} title="Inactivity Monitoring" subtitle="Dead man's switch configuration" />
              <div className="space-y-3">
                <ToggleSwitch
                  label="Enable Inactivity Monitoring"
                  description="If you don't log in for the specified period, beneficiaries will be notified."
                  checked={formData.inactivity_check_enabled}
                  onChange={(val) => setFormData({...formData, inactivity_check_enabled: val})}
                />
                <div className="flex items-center gap-4 p-4">
                  <label className="text-sm text-gray-400 whitespace-nowrap">Inactivity Period (days)</label>
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min={30}
                        max={365}
                        value={formData.inactivity_check_days}
                        onChange={(e) => setFormData({...formData, inactivity_check_days: parseInt(e.target.value) || 90})}
                        className="input-field w-24"
                      />
                      <div className="flex-1">
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all" style={{ width: `${(formData.inactivity_check_days / 365) * 100}%` }} />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Warning at {formData.inactivity_check_days - 30} days. Final notification at {formData.inactivity_check_days} days.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-hover">
              <SectionTitle icon={AlertTriangle} title="Escalation Schedule" subtitle="L1-L4 reminder configuration" />
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Grace Period (days)</label>
                    <input type="number" min={0} max={30} value={formData.escalation_grace_period} onChange={(e) => setFormData({...formData, escalation_grace_period: parseInt(e.target.value) || 3})} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">L1 Reminder (days after grace)</label>
                    <input type="number" min={1} max={365} value={formData.escalation_l1_days} onChange={(e) => setFormData({...formData, escalation_l1_days: parseInt(e.target.value) || 7})} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">L2 Reminder (days after L1)</label>
                    <input type="number" min={1} max={365} value={formData.escalation_l2_days} onChange={(e) => setFormData({...formData, escalation_l2_days: parseInt(e.target.value) || 14})} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">L3 Reminder (days after L2)</label>
                    <input type="number" min={1} max={365} value={formData.escalation_l3_days} onChange={(e) => setFormData({...formData, escalation_l3_days: parseInt(e.target.value) || 30})} className="input-field" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">L4 Final Reminder (days after L3)</label>
                    <input type="number" min={1} max={365} value={formData.escalation_l4_days} onChange={(e) => setFormData({...formData, escalation_l4_days: parseInt(e.target.value) || 60})} className="input-field" />
                  </div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-800">
                  <p className="text-sm font-medium text-gray-300 mb-2">Escalation Timeline</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400">G</span>
                      <span className="text-gray-400">Grace Period</span>
                      <span className="text-gray-500">{formData.escalation_grace_period} days</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">L1</span>
                      <span className="text-gray-400">First Reminder</span>
                      <span className="text-gray-500">{formData.escalation_grace_period + formData.escalation_l1_days} days total</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-400">L2</span>
                      <span className="text-gray-400">Second Reminder</span>
                      <span className="text-gray-500">{formData.escalation_grace_period + formData.escalation_l1_days + formData.escalation_l2_days} days total</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-xs font-bold text-red-400">L3</span>
                      <span className="text-gray-400">Urgent Reminder</span>
                      <span className="text-gray-500">{formData.escalation_grace_period + formData.escalation_l1_days + formData.escalation_l2_days + formData.escalation_l3_days} days total</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center text-xs font-bold text-red-500">L4</span>
                      <span className="text-gray-400">Final Reminder</span>
                      <span className="text-gray-500">{formData.escalation_grace_period + formData.escalation_l1_days + formData.escalation_l2_days + formData.escalation_l3_days + formData.escalation_l4_days} days total</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-slide-in">
            <div className="card-hover">
              <SectionTitle icon={Mail} title="Email Notifications" subtitle="Control what emails you receive" />
              <div className="space-y-3">
                <ToggleSwitch
                  label="General Email Notifications"
                  description="Receive general updates about your account and the service."
                  checked={formData.email_notifications_enabled}
                  onChange={(val) => setFormData({...formData, email_notifications_enabled: val})}
                />
                <ToggleSwitch
                  label="Inactivity Warnings"
                  description="Get warned before your account is flagged as inactive."
                  checked={formData.inactivity_warning_enabled}
                  onChange={(val) => setFormData({...formData, inactivity_warning_enabled: val})}
                />
                <ToggleSwitch
                  label="Death Verification Updates"
                  description="Receive updates about any death verification submissions."
                  checked={formData.death_verification_notification}
                  onChange={(val) => setFormData({...formData, death_verification_notification: val})}
                />
                <ToggleSwitch
                  label="Beneficiary Changes"
                  description="Get notified when beneficiaries are added or modified."
                  checked={formData.beneficiary_notification_enabled}
                  onChange={(val) => setFormData({...formData, beneficiary_notification_enabled: val})}
                />
              </div>
            </div>

            <div className="card-hover">
              <SectionTitle icon={Smartphone} title="SMS Notifications" subtitle="Text message alerts (requires phone number)" />
              <ToggleSwitch
                label="Enable SMS Notifications"
                description="Receive critical alerts via text message. Standard carrier rates may apply."
                checked={formData.sms_notifications_enabled}
                onChange={(val) => setFormData({...formData, sms_notifications_enabled: val})}
                disabled={!formData.phone}
              />
              {!formData.phone && (
                <p className="text-xs text-amber-400 mt-2">Add a phone number in your profile to enable SMS notifications.</p>
              )}
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-6 animate-slide-in">
            <div className="card-hover">
              <SectionTitle icon={Eye} title="Privacy Controls" subtitle="Manage who can access your data" />
              <div className="space-y-3">
                <ToggleSwitch
                  label="Allow Emergency Access"
                  description="Let your emergency contact request access to your vault before your passing."
                  checked={formData.allow_emergency_access}
                  onChange={(val) => setFormData({...formData, allow_emergency_access: val})}
                />
                <ToggleSwitch
                  label="Auto-Backup"
                  description="Automatically backup your vault data to secure cloud storage."
                  checked={formData.auto_backup_enabled}
                  onChange={(val) => setFormData({...formData, auto_backup_enabled: val})}
                />
                <ToggleSwitch
                  label="Data Export"
                  description="Allow exporting your data for backup or migration purposes."
                  checked={formData.data_export_enabled}
                  onChange={(val) => setFormData({...formData, data_export_enabled: val})}
                />
              </div>
            </div>

            <div className="card-hover">
              <SectionTitle icon={Download} title="Data Export" subtitle="Download your data" />
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Export all your vault data, beneficiaries, and legacy plans as a JSON file.</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
              </div>
            </div>

            <div className="card-hover bg-gray-900/30 border-gray-800/30">
              <SectionTitle icon={Shield} title="Security Information" subtitle="How your data is protected" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { text: 'All sensitive data is encrypted using AES-256 before storage.' },
                  { text: 'Credentials are only decrypted when you view them or when released to beneficiaries.' },
                  { text: 'Death verification requires a certificate and staff approval.' },
                  { text: 'Inheritance releases expire after 365 days for security.' },
                  { text: 'Data is never shared with third parties without your consent.' },
                  { text: 'Regular security audits are performed on our infrastructure.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 rounded-xl bg-gray-800/30">
                    <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-400">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6 animate-slide-in">
            <div className="card-hover">
              <SectionTitle icon={Monitor} title="Appearance" subtitle="Customize your experience" />
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'system', label: 'System', icon: Monitor },
                ].map((theme) => {
                  const Icon = theme.icon;
                  const isSelected = formData.theme_preference === theme.value;
                  return (
                    <button
                      key={theme.value}
                      type="button"
                      onClick={() => setFormData({...formData, theme_preference: theme.value})}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                        isSelected 
                          ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                          : 'bg-gray-800/50 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{theme.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="card-hover">
              <SectionTitle icon={Globe} title="Language & Region" subtitle="Localization preferences" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
                  <select
                    value={formData.locale}
                    onChange={(e) => setFormData({...formData, locale: e.target.value})}
                    className="input-field"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="de-DE">German</option>
                    <option value="fr-FR">French</option>
                    <option value="es-ES">Spanish</option>
                    <option value="it-IT">Italian</option>
                    <option value="nl-NL">Dutch</option>
                    <option value="pl-PL">Polish</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Timezone</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                    className="input-field"
                  >
                    <option value="UTC">UTC</option>
                    <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Europe/Paris">Europe/Paris (CET)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Danger Zone Tab */}
        {activeTab === 'danger' && (
          <div className="space-y-6 animate-slide-in">
            <div className="card border-red-500/20 bg-red-500/5">
              <SectionTitle icon={AlertOctagon} title="Danger Zone" subtitle="Irreversible actions" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50 border border-gray-800">
                  <div>
                    <p className="text-sm font-medium text-white">Delete All Vault Data</p>
                    <p className="text-xs text-gray-500 mt-1">Remove all assets, beneficiaries, and legacy plans. Your account will remain.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('This will delete ALL your vault data. This cannot be undone. Continue?')) {
                        axios.delete(`${API_URL}/vault/assets/`).then(() => {
                          alert('All vault data deleted');
                          window.location.reload();
                        }).catch(() => alert('Failed to delete data'));
                      }
                    }}
                    className="btn-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Data
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div>
                    <p className="text-sm font-medium text-red-400">Delete Account</p>
                    <p className="text-xs text-gray-500 mt-1">Permanently delete your account and all associated data. This cannot be undone.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="btn-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        {activeTab !== 'danger' && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save Changes
            </button>
          </div>
        )}
      </form>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md bg-gray-950 border-red-500/20">
            <div className="flex items-center gap-2 mb-4">
              <AlertOctagon className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-bold text-white">Delete Account</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              This action is irreversible. All your data will be permanently deleted. Type <span className="text-red-400 font-bold">DELETE</span> to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="input-field mb-4"
              placeholder="Type DELETE to confirm"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-5 rounded-xl flex-1 transition-all"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
