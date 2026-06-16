import React, { useState, useEffect } from 'react';
import { 
  Archive, Plus, Trash2, Eye, EyeOff, Lock,
  ChevronDown, Search, X, Save, Upload, FileUp, FileText, FileDown, Hash, Key,
  LayoutGrid
} from 'lucide-react';
import axios from 'axios';
import { 
  AccountIcon, CryptoIcon, DocumentIcon, SubscriptionIcon, 
  InsuranceIcon, FinancialIcon, DeviceIcon, SocialIcon, OtherIcon 
} from './AssetIcons';
import CustomDropdown from './CustomDropdown';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const assetTypes = [
  { value: 'account', label: 'Account', icon: AccountIcon, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', iconSize: 'w-10 h-10' },
  { value: 'crypto', label: 'Crypto', icon: CryptoIcon, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', iconSize: 'w-10 h-10' },
  { value: 'document', label: 'Document', icon: DocumentIcon, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', iconSize: 'w-10 h-10' },
  { value: 'subscription', label: 'Subscription', icon: SubscriptionIcon, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', iconSize: 'w-10 h-10' },
  { value: 'insurance', label: 'Insurance', icon: InsuranceIcon, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', iconSize: 'w-10 h-10' },
  { value: 'financial', label: 'Financial', icon: FinancialIcon, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', iconSize: 'w-10 h-10' },
  { value: 'device', label: 'Device', icon: DeviceIcon, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', iconSize: 'w-10 h-10' },
  { value: 'social', label: 'Social', icon: SocialIcon, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', iconSize: 'w-10 h-10' },
  { value: 'other', label: 'Other', icon: OtherIcon, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', iconSize: 'w-10 h-10' },
];

const fieldConfig = {
  account: {
    show: ['username', 'password', 'url', 'institution'],
    labels: { username: 'Username / Email', password: 'Password', url: 'Website URL', institution: 'Platform / Service' },
    placeholders: { username: 'your_username', password: 'Your password', url: 'https://...', institution: 'e.g., Google, Microsoft' }
  },
  crypto: {
    show: ['wallet_address', 'seed_phrase', 'institution', 'url'],
    labels: { wallet_address: 'Wallet Address', seed_phrase: 'Seed Phrase / Private Key', institution: 'Wallet Provider', url: 'Wallet URL' },
    placeholders: { wallet_address: '0x... or bc1...', seed_phrase: '12/24 word recovery phrase', institution: 'e.g., MetaMask, Ledger', url: 'https://...' }
  },
  document: {
    show: ['account_number', 'institution', 'url'],
    labels: { account_number: 'Document ID / Reference', institution: 'Issuing Authority', url: 'Storage URL' },
    placeholders: { account_number: 'Doc reference number', institution: 'e.g., Notary, Government', url: 'Link to cloud storage' }
  },
  subscription: {
    show: ['username', 'password', 'institution', 'url'],
    labels: { username: 'Login Email', password: 'Password', institution: 'Service Name', url: 'Billing URL' },
    placeholders: { username: 'your@email.com', password: 'Your password', institution: 'e.g., Netflix, Spotify', url: 'https://...' }
  },
  insurance: {
    show: ['account_number', 'institution', 'url', 'username'],
    labels: { account_number: 'Policy Number', institution: 'Insurance Company', url: 'Portal URL', username: 'Client ID / Email' },
    placeholders: { account_number: 'POL-123456', institution: 'e.g., Allianz, AOK', url: 'https://...', username: 'Client ID or email' }
  },
  financial: {
    show: ['account_number', 'institution', 'iban', 'bic', 'url', 'username'],
    labels: { account_number: 'Account Number', institution: 'Bank Name', iban: 'IBAN', bic: 'BIC / SWIFT', url: 'Online Banking URL', username: 'Online Banking ID' },
    placeholders: { account_number: 'e.g., 1234567890', institution: 'e.g., Deutsche Bank', iban: 'DE89 3704 0044 0532 0130 00', bic: 'e.g., COBADEFF', url: 'https://...', username: 'Banking login ID' }
  },
  device: {
    show: ['device_serial', 'institution', 'pin_code', 'url'],
    labels: { device_serial: 'Serial Number / IMEI', institution: 'Device Type / Brand', pin_code: 'PIN / Unlock Code', url: 'Device Manager URL' },
    placeholders: { device_serial: 'e.g., IMEI 35345607...', institution: 'e.g., iPhone 15, Samsung S24', pin_code: 'Device PIN or unlock code', url: 'https://...' }
  },
  social: {
    show: ['username', 'password', 'institution', 'phone_number', 'url'],
    labels: { username: 'Username / Handle', password: 'Password', institution: 'Platform', phone_number: 'Linked Phone', url: 'Profile URL' },
    placeholders: { username: '@yourhandle or email', password: 'Your password', institution: 'e.g., Instagram, LinkedIn', phone_number: '+49 123 456789', url: 'https://...' }
  },
  other: {
    show: ['username', 'password', 'account_number', 'institution', 'url'],
    labels: { username: 'Username / ID', password: 'Password / Key', account_number: 'Reference Number', institution: 'Organization', url: 'Website' },
    placeholders: { username: 'Login or ID', password: 'Password or key', account_number: 'Any reference', institution: 'Company or org', url: 'https://...' }
  }
};

const Vault = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [visibleMetadata, setVisibleMetadata] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    asset_type: 'account',
    description: '',
    url: '',
    institution: '',
    account_number: '',
    username: '',
    password: '',
    notes: '',
    wallet_address: '',
    seed_phrase: '',
    iban: '',
    bic: '',
    policy_number: '',
    device_serial: '',
    pin_code: '',
    phone_number: '',
    license_key: ''
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await axios.get(`${API_URL}/vault/assets/`);
      setAssets(response.data.results || response.data || []);
    } catch (err) {
      console.error('Failed to fetch assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type) => {
    setFormData({...formData, asset_type: type});
    setSelectedFiles([]);
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const uploadFiles = async (assetId) => {
    if (selectedFiles.length === 0) return;
    
    setUploadingFiles(true);
    try {
      for (const file of selectedFiles) {
        const formDataFile = new FormData();
        formDataFile.append('file', file);
        formDataFile.append('description', file.name);
        
        await axios.post(
          `${API_URL}/vault/assets/${assetId}/documents/`,
          formDataFile,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }
    } catch (err) {
      console.error('Failed to upload files:', err);
      alert('Asset saved but some files failed to upload');
    } finally {
      setUploadingFiles(false);
      setSelectedFiles([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/vault/assets/`, formData);
      const assetId = response.data.id;
      
      if (selectedFiles.length > 0) {
        await uploadFiles(assetId);
      }
      
      setFormData({
        name: '', asset_type: 'account', description: '', url: '',
        institution: '', account_number: '', username: '', password: '', notes: '',
        wallet_address: '', seed_phrase: '', iban: '', bic: '',
        policy_number: '', device_serial: '', pin_code: '', phone_number: '', license_key: ''
      });
      setSelectedFiles([]);
      setShowForm(false);
      fetchAssets();
    } catch (err) {
      alert('Failed to save asset');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    try {
      await axios.delete(`${API_URL}/vault/assets/${id}/`);
      fetchAssets();
    } catch (err) {
      alert('Failed to delete asset');
    }
  };

  const handleDeleteDocument = async (assetId, docId) => {
    if (!window.confirm('Delete this document file?')) return;
    try {
      await axios.delete(`${API_URL}/vault/documents/${docId}/`);
      fetchAssets();
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  const togglePassword = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMetadata = (id, key) => {
    setVisibleMetadata(prev => ({ ...prev, [`${id}-${key}`]: !prev[`${id}-${key}`] }));
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || asset.asset_type === selectedType;
    return matchesSearch && matchesType;
  });

  const getAssetTypeInfo = (type) => {
    return assetTypes.find(t => t.value === type) || assetTypes[8];
  };

  const currentConfig = fieldConfig[formData.asset_type] || fieldConfig.account;

  const renderFormField = (fieldKey) => {
    const label = currentConfig.labels[fieldKey] || fieldKey;
    const placeholder = currentConfig.placeholders[fieldKey] || '';
    const value = formData[fieldKey] || '';
    
    const isSecret = fieldKey === 'password' || fieldKey === 'seed_phrase' || fieldKey === 'pin_code' || fieldKey === 'private_key';
    
    return (
      <div key={fieldKey} className="animate-slide-in">
        <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
        {isSecret ? (
          <input
            type="password"
            value={value}
            onChange={(e) => setFormData({...formData, [fieldKey]: e.target.value})}
            className="input-field"
            placeholder={placeholder}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setFormData({...formData, [fieldKey]: e.target.value})}
            className="input-field"
            placeholder={placeholder}
          />
        )}
      </div>
    );
  };

  const renderAssetMetadata = (asset) => {
    if (!asset.metadata || Object.keys(asset.metadata).length === 0) return null;
    
    return (
      <div className="bg-gray-900/50 rounded-xl p-3 mt-3 space-y-2">
        {Object.entries(asset.metadata).map(([key, value]) => {
          if (!value) return null;
          const isSecret = key === 'seed_phrase' || key === 'pin_code' || key === 'private_key';
          const isVisible = visibleMetadata[`${asset.id}-${key}`];
          
          return (
            <div key={key} className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 w-32 capitalize">{key.replace(/_/g, ' ')}:</span>
              <span className={`font-mono ${isSecret ? 'text-gray-400' : 'text-gray-300'}`}>
                {isSecret && !isVisible ? '••••••••••••' : value}
              </span>
              {isSecret && (
                <button onClick={() => toggleMetadata(asset.id, key)} className="text-gray-500 hover:text-gray-300">
                  {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDocumentUpload = () => {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-400 mb-2">Upload Documents</label>
        <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-blue-500/40 transition-all cursor-pointer">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-upload"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.zip"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-sm text-gray-400 font-medium">Click to select files</span>
            <span className="text-xs text-gray-600">PDF, Word, Images, ZIP (max 10MB each)</span>
          </label>
        </div>
        
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-400">Selected files:</p>
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-gray-800/50 rounded-xl px-3 py-2 border border-gray-800">
                <FileUp className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300 flex-1">{file.name}</span>
                <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                <button
                  onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                  className="text-gray-500 hover:text-red-400 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAssetDocuments = (asset) => {
    if (!asset.documents || asset.documents.length === 0) return null;
    
    return (
      <div className="bg-gray-900/50 rounded-xl p-3 mt-3 space-y-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Attached Files</p>
        {asset.documents.map((doc) => (
          <div key={doc.id} className="flex items-center gap-3 bg-gray-800/50 rounded-xl px-3 py-2 border border-gray-800">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300 flex-1">{doc.description || doc.file.split('/').pop()}</span>
            <a
              href={doc.file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-400 p-1"
              title="Download"
            >
              <FileDown className="w-4 h-4" />
            </a>
            <button
              onClick={() => handleDeleteDocument(asset.id, doc.id)}
              className="text-gray-500 hover:text-red-400 p-1"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your vault..."
              className="input-field pl-12 w-72"
            />
          </div>
          <div className="relative w-48">
            <CustomDropdown
              value={selectedType}
              onChange={setSelectedType}
              placeholder="Filter by type..."
              options={[
                { value: 'all', label: 'All Types', icon: LayoutGrid, color: 'text-gray-400' },
                ...assetTypes.map(t => ({ 
                  value: t.value, 
                  label: t.label, 
                  icon: t.icon, 
                  color: t.color 
                }))
              ]}
            />
          </div>
        </div>
        <button
          onClick={() => {
            if (selectedType !== 'all') {
              setFormData({...formData, asset_type: selectedType});
            }
            setShowForm(!showForm);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {selectedType !== 'all' ? `Add ${assetTypes.find(t => t.value === selectedType)?.label}` : 'Add Asset'}
        </button>
      </div>

      {/* Add Asset Form */}
      {showForm && (
        <div className="card gradient-border animate-slide-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Archive className="w-5 h-5 text-blue-400" />
              Add New Asset
            </h3>
            <button onClick={() => setShowForm(false)} className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Asset Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-3">Select Asset Type</label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {assetTypes.map((type) => {
                const TypeIcon = type.icon;
                const isSelected = formData.asset_type === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeChange(type.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                      isSelected 
                        ? `${type.bg} ${type.border} ${type.color}` 
                        : 'bg-gray-800/50 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                    }`}
                  >
                    <TypeIcon className="w-8 h-8" />
                    <span className="text-xs font-medium text-center">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Asset Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field"
                placeholder={`e.g., My ${assetTypes.find(t => t.value === formData.asset_type)?.label}`}
                required
              />
            </div>
            
            {/* Dynamic Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentConfig.show.map(fieldKey => renderFormField(fieldKey))}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="input-field h-20 resize-none"
                placeholder="Additional details about this asset..."
              />
            </div>
            
            {/* File Upload */}
            {renderDocumentUpload()}
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Private Notes (for beneficiaries)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="input-field h-20 resize-none"
                placeholder="Instructions for accessing this asset..."
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={uploadingFiles} className="btn-primary flex items-center gap-2">
                {uploadingFiles ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Save Asset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assets List */}
      <div className="space-y-4">
        {loading ? (
          <div className="card text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading your vault...</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="card text-center py-12">
            <Archive className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No assets found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search or filters.' : 'Start by adding your first digital asset.'}
            </p>
            {!searchTerm && (
              <button onClick={() => setShowForm(true)} className="btn-primary">
                Add Your First Asset
              </button>
            )}
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const typeInfo = getAssetTypeInfo(asset.asset_type);
            return (
              <div key={asset.id} className="card-hover animate-slide-in">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${typeInfo.bg} border ${typeInfo.border} shadow-lg`} style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1)' }}>
                      <typeInfo.icon className={`w-9 h-9 ${typeInfo.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-white text-lg">{asset.name}</h4>
                        <span className={`badge ${typeInfo.bg} ${typeInfo.color} ${typeInfo.border}`}>
                          {asset.asset_type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{asset.description}</p>
                      
                      {asset.institution && (
                        <p className="text-xs text-gray-500 mb-1">{asset.institution}</p>
                      )}
                      
                      {asset.url && (
                        <a href={asset.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 inline-block mb-2">
                          {asset.url}
                        </a>
                      )}
                      
                      {/* Credentials */}
                      {(asset.username || asset.password || asset.account_number) && (
                        <div className="bg-gray-900/50 rounded-xl p-4 mt-3 space-y-2 border border-gray-800">
                          {asset.account_number && (
                            <div className="flex items-center gap-2 text-sm">
                              <Hash className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-500 w-28">Ref / Acct:</span>
                              <span className="text-gray-300 font-mono">{asset.account_number}</span>
                            </div>
                          )}
                          {asset.username && (
                            <div className="flex items-center gap-2 text-sm">
                              <Key className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-500 w-28">Username:</span>
                              <span className="text-gray-300 font-mono">{asset.username}</span>
                            </div>
                          )}
                          {asset.password && (
                            <div className="flex items-center gap-2 text-sm">
                              <Lock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-500 w-28">Password:</span>
                              <span className="text-gray-300 font-mono">
                                {visiblePasswords[asset.id] ? asset.password : '••••••••••••'}
                              </span>
                              <button
                                onClick={() => togglePassword(asset.id)}
                                className="text-gray-500 hover:text-gray-300 p-1"
                              >
                                {visiblePasswords[asset.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Type-specific metadata */}
                      {renderAssetMetadata(asset)}
                      
                      {/* Attached documents */}
                      {renderAssetDocuments(asset)}
                      
                      {asset.notes && (
                        <div className="mt-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                          <p className="text-xs text-amber-400/80 font-medium mb-1">Notes for beneficiaries:</p>
                          <p className="text-sm text-gray-400">{asset.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Vault;
