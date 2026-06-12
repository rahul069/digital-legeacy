import React, { useState, useEffect } from 'react';
import { Activity, Shield, User, Lock, FileText, Clock, Eye, Globe, AlertTriangle, ChevronRight, Download, Search, ShieldCheck, Key, Hash, Smartphone, Bell, Mail, AlertOctagon, X, Fingerprint, ChevronDown, Upload, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    assets: 0,
    beneficiaries: 0,
    legacyPlans: 0,
    protected: true,
    auditLogs: 0,
    deliveryTracking: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentAssets, setRecentAssets] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanText, setScanText] = useState('');
  const [showScanModal, setShowScanModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [assetsRes, beneficiariesRes, legacyRes, auditRes] = await Promise.all([
        axios.get(`${API_URL}/vault/assets/`),
        axios.get(`${API_URL}/beneficiaries/`),
        axios.get(`${API_URL}/legacy/plans/`),
        axios.get(`${API_URL}/auth/audit-logs/`),
      ]);

      const assets = assetsRes.data.results || assetsRes.data || [];
      const logs = auditRes.data || [];
      setStats({
        assets: assets.length || 0,
        beneficiaries: beneficiariesRes.data.length || 0,
        legacyPlans: legacyRes.data.results?.length || legacyRes.data.length || 0,
        protected: true,
        auditLogs: logs.length || 0,
        deliveryTracking: 0,
      });
      setRecentAssets(assets.slice(0, 3));
      setAuditLogs(logs.slice(0, 5));
    } catch (err) {
      console.error('Dashboard data fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePdf = async () => {
    setGeneratingPdf(true);
    try {
      const response = await axios.get(`${API_URL}/auth/legacy-report/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'digital-legacy-report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to generate PDF');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleScanDocument = async () => {
    if (!scanText.trim()) return;
    setScanning(true);
    try {
      const response = await axios.post(`${API_URL}/auth/scan-document/`, {
        text: scanText,
        document_type: 'auto',
      });
      setScanResult(response.data);
    } catch (err) {
      alert('AI scanning failed or unavailable');
    } finally {
      setScanning(false);
    }
  };

  const statCards = [
    { title: 'Vault Assets', value: stats.assets, icon: FileText, color: 'from-blue-500 to-blue-600', textColor: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20', desc: 'Encrypted items' },
    { title: 'Beneficiaries', value: stats.beneficiaries, icon: User, color: 'from-purple-500 to-purple-600', textColor: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20', desc: 'Designated heirs' },
    { title: 'Legacy Plans', value: stats.legacyPlans, icon: Activity, color: 'from-amber-500 to-amber-600', textColor: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20', desc: 'Active plans' },
    { title: 'Security', value: 'Active', icon: Shield, color: 'from-emerald-500 to-emerald-600', textColor: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20', desc: 'Encryption on' },
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 border border-gray-800/60 p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">Your Digital Estate is Protected</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
              All your digital assets are encrypted with AES-256 and ready to be transferred to your beneficiaries when needed. Keep your vault updated regularly.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-emerald-400">Protected</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button onClick={handleGeneratePdf} disabled={generatingPdf} className="btn-primary flex items-center gap-2">
          {generatingPdf ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
          Generate Legacy Report PDF
        </button>
        <button onClick={() => setShowScanModal(true)} className="btn-secondary flex items-center gap-2">
          <Upload className="w-4 h-4" /> AI Document Scanner
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className={`card-hover ${stat.borderColor} border`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
              <Activity className="w-4 h-4 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-gray-400 mb-1">{stat.title}</div>
            <div className="text-xs text-gray-500">{stat.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Assets */}
        <div className="lg:col-span-2 card-hover">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Recent Assets
            </h3>
            <span className="badge-blue">{recentAssets.length} items</span>
          </div>
          {recentAssets.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No assets added yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAssets.map((asset) => (
                <div key={asset.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/30 border border-gray-800/50 hover:border-gray-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">{asset.name}</p>
                    <p className="text-xs text-gray-500">{asset.asset_type}</p>
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(asset.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Log */}
        <div className="card-hover">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Audit Log
            </h3>
            <span className="badge-green">{stats.auditLogs} events</span>
          </div>
          {auditLogs.length === 0 ? (
            <div className="text-center py-8">
              <ShieldCheck className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No audit events yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-800/50">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">{log.action} {log.entity_type}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Scan Modal */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg bg-gray-950 border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                AI Document Scanner
              </h3>
              <button onClick={() => { setShowScanModal(false); setScanResult(null); setScanText(''); }} className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-4">Paste document text or OCR output here. The AI will extract asset information.</p>
            <textarea
              value={scanText}
              onChange={(e) => setScanText(e.target.value)}
              className="input-field h-40 resize-none mb-4"
              placeholder="Paste document text here..."
            />
            <button onClick={handleScanDocument} disabled={scanning || !scanText.trim()} className="btn-primary w-full flex items-center justify-center gap-2">
              {scanning ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-5 h-5" />}
              {scanning ? 'Scanning...' : 'Scan Document'}
            </button>
            {scanResult && (
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium text-white">Detected Assets:</h4>
                {scanResult.assets.map((asset, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-gray-800/50 border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-blue text-xs">{asset.asset_type}</span>
                      <span className="text-xs text-gray-500">Confidence: {Math.round(asset.confidence * 100)}%</span>
                    </div>
                    <p className="text-sm font-medium text-white">{asset.name}</p>
                    {asset.institution && <p className="text-xs text-gray-400">{asset.institution}</p>}
                    {asset.account_number && <p className="text-xs text-gray-400">Ref: {asset.account_number}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
