import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Trash2, Link2, X, Save, Send,
  CheckCircle, Clock, AlertCircle, ChevronRight, Target, ArrowRight, User, Archive
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const LegacyPlans = () => {
  const [plans, setPlans] = useState([]);
  const [assets, setAssets] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  });

  const [assignmentForm, setAssignmentForm] = useState({
    beneficiary_id: '',
    asset_id: '',
    message: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansRes, assetsRes, beneficiariesRes] = await Promise.all([
        axios.get(`${API_URL}/legacy/plans/`),
        axios.get(`${API_URL}/vault/assets/`),
        axios.get(`${API_URL}/beneficiaries/`)
      ]);
      
      setPlans(plansRes.data.results || plansRes.data || []);
      setAssets(assetsRes.data.results || assetsRes.data || []);
      setBeneficiaries(beneficiariesRes.data.results || beneficiariesRes.data || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/legacy/plans/`, formData);
      setFormData({ name: '', description: '', is_active: true });
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert('Failed to create plan');
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;
    
    try {
      await axios.post(`${API_URL}/legacy/plans/${selectedPlan.id}/assign/`, assignmentForm);
      setAssignmentForm({ beneficiary_id: '', asset_id: '', message: '' });
      setShowAssignmentForm(false);
      fetchData();
    } catch (err) {
      alert('Failed to add assignment');
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Delete this legacy plan?')) return;
    try {
      await axios.delete(`${API_URL}/legacy/plans/${id}/`);
      fetchData();
    } catch (err) {
      alert('Failed to delete plan');
    }
  };

  const handleRemoveAssignment = async (planId, assignmentId) => {
    try {
      await axios.delete(`${API_URL}/legacy/plans/${planId}/assign/${assignmentId}/`);
      fetchData();
    } catch (err) {
      alert('Failed to remove assignment');
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Legacy Plans</h3>
          <p className="text-sm text-gray-500 mt-1">Define how your assets are distributed to beneficiaries</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Plan
        </button>
      </div>

      {/* Create Plan Form */}
      {showForm && (
        <div className="card gradient-border animate-slide-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              New Legacy Plan
            </h3>
            <button onClick={() => setShowForm(false)} className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Plan Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field"
                placeholder="e.g., Family Inheritance Plan"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="input-field h-24 resize-none"
                placeholder="Describe the purpose of this plan..."
              />
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-800">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500"
              />
              <span className="text-sm text-gray-300">Activate this plan immediately</span>
            </div>
            
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save className="w-5 h-5" />
                Create Plan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Plans List */}
      <div className="space-y-4">
        {loading ? (
          <div className="card text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="card text-center py-12">
            <Target className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No legacy plans yet</h3>
            <p className="text-sm text-gray-500 mb-4">Create a plan to start assigning assets to beneficiaries.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Create First Plan
            </button>
          </div>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="card-hover animate-slide-in">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${plan.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
                  <div>
                    <h4 className="font-semibold text-white text-lg">{plan.name}</h4>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowAssignmentForm(true);
                    }}
                    className="btn-secondary text-sm py-2 px-3 flex items-center gap-1"
                  >
                    <Link2 className="w-4 h-4" />
                    Assign
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Assignments */}
              {plan.assignments && plan.assignments.length > 0 ? (
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Assignments</p>
                  {plan.assignments.map((assignment) => (
                    <div key={assignment.id} className="bg-gray-800/50 rounded-xl p-3 flex items-center justify-between border border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {assignment.beneficiary_name?.[0] || 'B'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-200">{assignment.beneficiary_name}</p>
                          <p className="text-xs text-gray-500">receives {assignment.asset_name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAssignment(plan.id, assignment.id)}
                        className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800/30 rounded-xl p-4 text-center border border-gray-800">
                  <p className="text-sm text-gray-500">No assignments yet. Click "Assign" to add beneficiaries.</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Assignment Modal */}
      {showAssignmentForm && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg bg-gray-950 border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Assign Asset to Beneficiary</h3>
              <button onClick={() => setShowAssignmentForm(false)} className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Beneficiary</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-500" />
                  <select
                    value={assignmentForm.beneficiary_id}
                    onChange={(e) => setAssignmentForm({...assignmentForm, beneficiary_id: e.target.value})}
                    className="input-field pl-12"
                    required
                  >
                    <option value="">Select beneficiary...</option>
                    {beneficiaries.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.relationship})</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Asset</label>
                <div className="relative">
                  <Archive className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-500" />
                  <select
                    value={assignmentForm.asset_id}
                    onChange={(e) => setAssignmentForm({...assignmentForm, asset_id: e.target.value})}
                    className="input-field pl-12"
                    required
                  >
                    <option value="">Select asset...</option>
                    {assets.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.asset_type})</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Personal Message</label>
                <textarea
                  value={assignmentForm.message}
                  onChange={(e) => setAssignmentForm({...assignmentForm, message: e.target.value})}
                  className="input-field h-24 resize-none"
                  placeholder="A message to include with this inheritance..."
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAssignmentForm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Link2 className="w-5 h-5" />
                  Add Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegacyPlans;
