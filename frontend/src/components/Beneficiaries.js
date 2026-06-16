import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, User, Mail, Phone, MapPin, Heart, Star, X, Save, Crown, Shield, Camera, Upload } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    relationship: '',
    address: '',
    photo: null,
    is_primary: false,
    can_access_before_death: false
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const response = await axios.get(`${API_URL}/beneficiaries/`);
      setBeneficiaries(response.data.results || response.data || []);
    } catch (err) {
      console.error('Failed to fetch beneficiaries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('relationship', formData.relationship);
      data.append('address', formData.address);
      data.append('is_primary', formData.is_primary);
      data.append('can_access_before_death', formData.can_access_before_death);
      if (formData.photo) {
        data.append('photo', formData.photo);
      }

      if (editingId) {
        await axios.patch(`${API_URL}/beneficiaries/${editingId}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(`${API_URL}/beneficiaries/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setFormData({
        name: '', email: '', phone: '', relationship: '',
        address: '', photo: null, is_primary: false, can_access_before_death: false
      });
      setPhotoPreview(null);
      setEditingId(null);
      setShowForm(false);
      fetchBeneficiaries();
    } catch (err) {
      alert('Failed to save beneficiary');
    }
  };

  const handleEdit = (b) => {
    setFormData({
      name: b.name,
      email: b.email,
      phone: b.phone || '',
      relationship: b.relationship || '',
      address: b.address || '',
      photo: null,
      is_primary: b.is_primary,
      can_access_before_death: b.can_access_before_death
    });
    setPhotoPreview(b.photo_url || null);
    setEditingId(b.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this beneficiary?')) return;
    try {
      await axios.delete(`${API_URL}/beneficiaries/${id}/`);
      fetchBeneficiaries();
    } catch (err) {
      alert('Failed to remove beneficiary');
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Beneficiaries</h3>
          <p className="text-sm text-gray-500 mt-1">People who will receive your digital assets</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Beneficiary
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card gradient-border animate-slide-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              {editingId ? 'Edit Beneficiary' : 'New Beneficiary'}
            </h3>
            <button onClick={() => { setShowForm(false); setEditingId(null); setPhotoPreview(null); }} className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Photo Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Photo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl cursor-pointer transition-all border border-gray-700 w-fit">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field pl-12"
                  placeholder="e.g., Jane Doe"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input-field pl-12"
                  placeholder="beneficiary@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="input-field pl-12"
                  placeholder="+49 123 456789"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Relationship</label>
              <div className="relative">
                <Heart className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.relationship}
                  onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                  className="input-field pl-12"
                  placeholder="e.g., Spouse, Child, Sibling"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="input-field pl-12"
                  placeholder="Full address"
                />
              </div>
            </div>
            
            <div className="md:col-span-2 flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-gray-800/50 border border-gray-800 hover:border-gray-700 transition-all">
                <input
                  type="checkbox"
                  checked={formData.is_primary}
                  onChange={(e) => setFormData({...formData, is_primary: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500/50"
                />
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-gray-300">Primary Beneficiary</span>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-gray-800/50 border border-gray-800 hover:border-gray-700 transition-all">
                <input
                  type="checkbox"
                  checked={formData.can_access_before_death}
                  onChange={(e) => setFormData({...formData, can_access_before_death: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500/50"
                />
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Emergency Access</span>
                </div>
              </label>
            </div>
            
            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setPhotoPreview(null); }} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save className="w-5 h-5" />
                {editingId ? 'Update' : 'Save'} Beneficiary
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="card text-center py-12 md:col-span-2">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading beneficiaries...</p>
          </div>
        ) : beneficiaries.length === 0 ? (
          <div className="card text-center py-12 md:col-span-2">
            <Users className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No beneficiaries yet</h3>
            <p className="text-sm text-gray-500 mb-4">Add people who should receive your digital assets.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Add First Beneficiary
            </button>
          </div>
        ) : (
          beneficiaries.map((b) => (
            <div key={b.id} className="card-hover animate-slide-in">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                    {b.photo_url ? (
                      <img src={b.photo_url} alt={b.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {b.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white">{b.name}</h4>
                      {b.is_primary && (
                        <span className="badge-amber flex items-center gap-1">
                          <Star className="w-3 h-3" /> Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{b.relationship}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(b)}
                    className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{b.email}</span>
                </div>
                {b.phone && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{b.phone}</span>
                  </div>
                )}
                {b.address && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{b.address}</span>
                  </div>
                )}
              </div>
              
              {b.can_access_before_death && (
                <div className="mt-3 badge-blue flex items-center gap-1 w-fit">
                  <Shield className="w-3 h-3" /> Emergency Access
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Beneficiaries;
