import React, { useState, useEffect } from 'react';
import { 
  Brain, DollarSign, Shield, FileSearch, Target, 
  AlertTriangle, Gift, Receipt, CheckCircle, XCircle,
  ChevronRight, Loader, Search, BookOpen, TrendingUp,
  Lock, Scale, CreditCard, Layers
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const AIAssistantPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});
  const [documentText, setDocumentText] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('');
  const [beneficiaries, setBeneficiaries] = useState([]);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const response = await axios.get(`${API_URL}/beneficiaries/`);
      setBeneficiaries(response.data.results || []);
    } catch (err) {
      console.error('Failed to fetch beneficiaries');
    }
  };

  const runAIAnalysis = async (endpoint, key, method = 'get', data = null) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      const response = method === 'get' 
        ? await axios.get(`${API_URL}/auth/${endpoint}`)
        : await axios.post(`${API_URL}/auth/${endpoint}`, data);
      setResults(prev => ({ ...prev, [key]: response.data }));
    } catch (err) {
      console.error(`AI ${key} failed:`, err);
    }
    setLoading(prev => ({ ...prev, [key]: false }));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Brain },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'valuation', label: 'Valuation', icon: DollarSign },
    { id: 'gaps', label: 'Legacy Gaps', icon: AlertTriangle },
    { id: 'beneficiary', label: 'Beneficiary Guide', icon: Gift },
    { id: 'documents', label: 'Document AI', icon: FileSearch },
    { id: 'cleanup', label: 'Cleanup Plan', icon: Layers },
    { id: 'fraud', label: 'Fraud Monitor', icon: Shield },
    { id: 'tax', label: 'Tax & Legal', icon: Scale },
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">AI Legacy Assistant</h3>
          <p className="text-sm text-gray-500 mt-1">8 AI-powered tools to save time and money</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <Brain className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-blue-400 font-medium">AI Powered</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 'subscriptions', title: 'Subscription Discovery', icon: CreditCard, desc: 'Find recurring payments and save money', color: 'blue' },
            { id: 'valuation', title: 'Estate Valuator', icon: DollarSign, desc: 'Calculate your digital estate worth', color: 'emerald' },
            { id: 'gaps', title: 'Legacy Gap Analyzer', icon: AlertTriangle, desc: 'Identify critical gaps in your plan', color: 'amber' },
            { id: 'beneficiary', title: 'Beneficiary Guide', icon: Gift, desc: 'Personalized step-by-step guides', color: 'purple' },
            { id: 'documents', title: 'Document AI', icon: FileSearch, desc: 'Extract assets from documents', color: 'cyan' },
            { id: 'cleanup', title: 'Cleanup Planner', icon: Layers, desc: 'Organize account closure priorities', color: 'orange' },
            { id: 'fraud', title: 'Fraud Monitor', icon: Shield, desc: 'Detect and prevent fraud risks', color: 'red' },
            { id: 'tax', title: 'Tax & Legal', icon: Scale, desc: 'Calculate tax and compliance', color: 'indigo' },
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              className="card-hover text-left p-5 group"
            >
              <div className={`w-10 h-10 rounded-xl bg-${tool.color}-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <tool.icon className={`w-5 h-5 text-${tool.color}-400`} />
              </div>
              <h4 className="font-bold text-white mb-1">{tool.title}</h4>
              <p className="text-sm text-gray-500">{tool.desc}</p>
              <div className="flex items-center gap-1 mt-3 text-sm text-blue-400">
                <span>Run Analysis</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4">
          <div className="card p-5">
            <h4 className="font-bold text-white mb-2">Discover Recurring Payments</h4>
            <p className="text-sm text-gray-500 mb-4">Paste bank statement text or upload a document to find all subscriptions.</p>
            <textarea
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder="Paste bank statement text here..."
              className="input-field w-full h-32 mb-3"
            />
            <button
              onClick={() => runAIAnalysis('ai/subscriptions/', 'subscriptions', 'post', { text: documentText })}
              className="btn-primary"
              disabled={loading.subscriptions}
            >
              {loading.subscriptions ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading.subscriptions ? 'Analyzing...' : 'Discover Subscriptions'}
            </button>
          </div>
          
          {results.subscriptions && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-white">Found {results.subscriptions.subscriptions.length} Subscriptions</h4>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Monthly Total</p>
                  <p className="text-2xl font-bold text-red-400">${results.subscriptions.total_monthly.toFixed(2)}</p>
                </div>
              </div>
              <div className="space-y-3">
                {results.subscriptions.subscriptions.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{sub.name}</p>
                      <p className="text-xs text-gray-500">{sub.provider} • {sub.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">${sub.monthly_cost.toFixed(2)}/mo</p>
                      <p className="text-xs text-red-400">${sub.yearly_cost.toFixed(2)}/yr</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <p className="text-sm font-medium text-emerald-400">
                  💰 You could save ${results.subscriptions.money_saved_estimate.toFixed(2)} per year by canceling unused subscriptions
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Valuation Tab */}
      {activeTab === 'valuation' && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-white">Digital Estate Valuation</h4>
              <button
                onClick={() => runAIAnalysis('ai/valuate-estate/', 'valuation')}
                className="btn-primary text-sm"
                disabled={loading.valuation}
              >
                {loading.valuation ? <Loader className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                {loading.valuation ? 'Calculating...' : 'Calculate Value'}
              </button>
            </div>
            
            {results.valuation && (
              <div className="space-y-4">
                <div className="text-center p-6 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <p className="text-sm text-gray-500 mb-1">Total Estimated Value</p>
                  <p className="text-4xl font-bold text-emerald-400">
                    ${results.valuation.total_estimated_value.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{results.valuation.valuation_method}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(results.valuation.categories).map(([key, cat]) => (
                    <div key={key} className="p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-xs text-gray-500 capitalize">{key.replace('_', ' ')}</p>
                      <p className="text-lg font-bold text-white">${cat.estimated_value.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{cat.count} assets</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legacy Gaps Tab */}
      {activeTab === 'gaps' && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-white">Legacy Plan Health Check</h4>
              <button
                onClick={() => runAIAnalysis('ai/legacy-gaps/', 'gaps')}
                className="btn-primary text-sm"
                disabled={loading.gaps}
              >
                {loading.gaps ? <Loader className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                {loading.gaps ? 'Analyzing...' : 'Check Gaps'}
              </button>
            </div>
            
            {results.gaps && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-emerald-500 rounded-full transition-all"
                        style={{ width: `${results.gaps.legacy_health_score}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-lg font-bold text-white">{results.gaps.legacy_health_score}/100</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-center">
                    <p className="text-2xl font-bold text-red-400">{results.gaps.summary.critical}</p>
                    <p className="text-xs text-gray-500">Critical</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 text-center">
                    <p className="text-2xl font-bold text-amber-400">{results.gaps.summary.high}</p>
                    <p className="text-xs text-gray-500">High</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-center">
                    <p className="text-2xl font-bold text-blue-400">{results.gaps.summary.medium}</p>
                    <p className="text-xs text-gray-500">Medium</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {results.gaps.warnings.map((warning, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border ${
                      warning.severity === 'critical' ? 'bg-red-500/10 border-red-500/20' :
                      warning.severity === 'high' ? 'bg-amber-500/10 border-amber-500/20' :
                      'bg-blue-500/10 border-blue-500/20'
                    }`}>
                      <div className="flex items-start gap-3">
                        {warning.severity === 'critical' ? <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" /> :
                         warning.severity === 'high' ? <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" /> :
                         <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />}
                        <div>
                          <p className="font-medium text-white">{warning.message}</p>
                          <p className="text-sm text-gray-500 mt-1">Action: {warning.action}</p>
                          {warning.potential_loss && (
                            <p className="text-sm text-red-400 mt-1">Potential loss: {warning.potential_loss}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Beneficiary Guide Tab */}
      {activeTab === 'beneficiary' && (
        <div className="space-y-4">
          <div className="card p-5">
            <h4 className="font-bold text-white mb-4">Generate Beneficiary Guide</h4>
            <select
              value={selectedBeneficiary}
              onChange={(e) => setSelectedBeneficiary(e.target.value)}
              className="input-field mb-4"
            >
              <option value="">Select beneficiary...</option>
              {beneficiaries.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.relationship})</option>
              ))}
            </select>
            <button
              onClick={() => runAIAnalysis(`ai/beneficiary-guide/?beneficiary_id=${selectedBeneficiary}`, 'beneficiary')}
              className="btn-primary"
              disabled={loading.beneficiary || !selectedBeneficiary}
            >
              {loading.beneficiary ? <Loader className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
              {loading.beneficiary ? 'Generating...' : 'Generate Guide'}
            </button>
          </div>
          
          {results.beneficiary && (
            <div className="card p-5">
              <h4 className="font-bold text-white mb-2">Guide for {results.beneficiary.beneficiary_name}</h4>
              <p className="text-sm text-gray-500 mb-4">Relationship: {results.beneficiary.relationship}</p>
              <p className="text-sm text-gray-400 mb-4 whitespace-pre-line">{results.beneficiary.personal_message}</p>
              
              <div className="space-y-4">
                {results.beneficiary.assets_guide.map((guide, idx) => (
                  <div key={idx} className="p-4 bg-gray-800/50 rounded-lg">
                    <h5 className="font-medium text-white mb-2">{guide.asset_name} ({guide.asset_type})</h5>
                    <div className="space-y-2">
                      {guide.steps.map((step, sidx) => (
                        <div key={sidx} className="flex items-start gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400 flex-shrink-0">
                            {sidx + 1}
                          </span>
                          <p className="text-sm text-gray-400">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <h5 className="font-medium text-emerald-400 mb-2">Priority Actions</h5>
                <div className="space-y-1">
                  {results.beneficiary.priority_actions.map((action, idx) => (
                    <p key={idx} className="text-sm text-gray-400">{action}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Document AI Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="card p-5">
            <h4 className="font-bold text-white mb-2">Extract Assets from Documents</h4>
            <p className="text-sm text-gray-500 mb-4">Paste any financial document text and AI will extract accounts, balances, and important information.</p>
            <textarea
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder="Paste document text here..."
              className="input-field w-full h-32 mb-3"
            />
            <button
              onClick={() => runAIAnalysis('ai/extract-assets/', 'documents', 'post', { text: documentText })}
              className="btn-primary"
              disabled={loading.documents}
            >
              {loading.documents ? <Loader className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
              {loading.documents ? 'Extracting...' : 'Extract Assets'}
            </button>
          </div>
          
          {results.documents && results.documents.extracted_assets && (
            <div className="card p-5">
              <h4 className="font-bold text-white mb-4">Extracted {results.documents.extracted_assets.length} Assets</h4>
              <div className="space-y-3">
                {results.documents.extracted_assets.map((asset, idx) => (
                  <div key={idx} className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">{asset.name}</p>
                      <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                        {asset.asset_type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{asset.institution} • {asset.account_number}</p>
                    {asset.balance && (
                      <p className="text-sm text-emerald-400">Balance: {asset.balance} {asset.currency}</p>
                    )}
                  </div>
                ))}
              </div>
              {results.documents.warnings && (
                <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <p className="text-sm font-medium text-amber-400 mb-1">Warnings:</p>
                  {results.documents.warnings.map((w, idx) => (
                    <p key={idx} className="text-sm text-gray-400">• {w}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Cleanup Plan Tab */}
      {activeTab === 'cleanup' && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-white">Digital Footprint Cleanup Plan</h4>
              <button
                onClick={() => runAIAnalysis('ai/cleanup-plan/', 'cleanup')}
                className="btn-primary text-sm"
                disabled={loading.cleanup}
              >
                {loading.cleanup ? <Loader className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                {loading.cleanup ? 'Generating...' : 'Generate Plan'}
              </button>
            </div>
            
            {results.cleanup && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Total Accounts</p>
                    <p className="text-2xl font-bold text-white">{results.cleanup.total_accounts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Est. Time</p>
                    <p className="text-2xl font-bold text-white">{results.cleanup.total_estimated_time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Money Saved</p>
                    <p className="text-2xl font-bold text-emerald-400">${results.cleanup.money_saved_estimate}/mo</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {results.cleanup.phases.map((phase, idx) => (
                    <div key={idx} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
                          {phase.phase}
                        </span>
                        <div>
                          <h5 className="font-medium text-white">{phase.name}</h5>
                          <p className="text-xs text-gray-500">{phase.timeframe} • {phase.estimated_time}</p>
                        </div>
                        <span className={`ml-auto px-2 py-1 rounded text-xs font-medium ${
                          phase.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                          phase.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {phase.priority}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {phase.assets.map((asset, aidx) => (
                          <div key={aidx} className="flex items-center justify-between p-2 bg-gray-900/50 rounded">
                            <p className="text-sm text-gray-400">{asset.name}</p>
                            <p className="text-xs text-gray-500">{asset.action}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fraud Monitor Tab */}
      {activeTab === 'fraud' && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-white">Fraud Risk Analysis</h4>
              <button
                onClick={() => runAIAnalysis('ai/fraud-risk/', 'fraud')}
                className="btn-primary text-sm"
                disabled={loading.fraud}
              >
                {loading.fraud ? <Loader className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                {loading.fraud ? 'Analyzing...' : 'Analyze Risk'}
              </button>
            </div>
            
            {results.fraud && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${
                  results.fraud.risk_level === 'high' ? 'bg-red-500/10 border-red-500/20' :
                  results.fraud.risk_level === 'medium' ? 'bg-amber-500/10 border-amber-500/20' :
                  'bg-emerald-500/10 border-emerald-500/20'
                }`}>
                  <div className="flex items-center gap-3">
                    <Lock className={`w-8 h-8 ${
                      results.fraud.risk_level === 'high' ? 'text-red-400' :
                      results.fraud.risk_level === 'medium' ? 'text-amber-400' :
                      'text-emerald-400'
                    }`} />
                    <div>
                      <p className="text-lg font-bold text-white">Risk Score: {results.fraud.overall_risk_score}/100</p>
                      <p className={`text-sm ${
                        results.fraud.risk_level === 'high' ? 'text-red-400' :
                        results.fraud.risk_level === 'medium' ? 'text-amber-400' :
                        'text-emerald-400'
                      }`}>
                        {results.fraud.risk_level.toUpperCase()} RISK
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {results.fraud.risks.map((risk, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${
                      risk.risk_level === 'high' ? 'bg-red-500/10 border-red-500/20' :
                      'bg-amber-500/10 border-amber-500/20'
                    }`}>
                      <p className="font-medium text-white">{risk.asset_name || risk.risk_type}</p>
                      <p className="text-sm text-gray-500">{risk.description}</p>
                      <p className="text-sm text-blue-400 mt-1">Mitigation: {risk.mitigation}</p>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h5 className="font-medium text-blue-400 mb-2">Recommendations</h5>
                  {results.fraud.recommendations.map((rec, idx) => (
                    <p key={idx} className="text-sm text-gray-400">• {rec}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tax & Legal Tab */}
      {activeTab === 'tax' && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-white">Tax & Legal Compliance Report</h4>
              <button
                onClick={() => runAIAnalysis('ai/tax-report/', 'tax')}
                className="btn-primary text-sm"
                disabled={loading.tax}
              >
                {loading.tax ? <Loader className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
                {loading.tax ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
            
            {results.tax && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Estate Value</p>
                    <p className="text-xl font-bold text-white">${results.tax.total_estate_value.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Est. Tax</p>
                    <p className="text-xl font-bold text-red-400">${results.tax.total_tax_estimate.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Compliance Score</p>
                    <p className="text-xl font-bold text-blue-400">{results.tax.compliance_score.toFixed(0)}%</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {results.tax.legal_requirements.map((req, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border ${
                      req.required ? 'bg-amber-500/10 border-amber-500/20' : 'bg-gray-800/50 border-gray-700'
                    }`}>
                      <div className="flex items-start gap-3">
                        {req.required ? 
                          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" /> :
                          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        }
                        <div>
                          <p className="font-medium text-white">{req.requirement}</p>
                          <p className="text-sm text-gray-500">{req.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <p className="text-xs text-gray-500">Cost: {req.estimated_cost}</p>
                            <p className="text-xs text-gray-500">Timeline: {req.timeline}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h5 className="font-medium text-blue-400 mb-2">Recommendations</h5>
                  {results.tax.recommendations.map((rec, idx) => (
                    <p key={idx} className="text-sm text-gray-400">• {rec}</p>
                  ))}
                </div>
                
                <p className="text-xs text-gray-500 text-center">{results.tax.disclaimer}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistantPage;
