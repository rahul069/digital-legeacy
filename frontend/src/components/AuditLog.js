import React, { useState, useEffect } from 'react';
import { Shield, Activity, Clock, Eye, Lock, FileText, User, AlertTriangle, Search, ChevronRight, Filter } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/audit-logs/`);
      setLogs(response.data || []);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'view': return Eye;
      case 'create': return FileText;
      case 'update': return Activity;
      case 'delete': return AlertTriangle;
      case 'login': return User;
      case 'logout': return User;
      default: return Shield;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'view': return 'text-blue-400 bg-blue-500/10';
      case 'create': return 'text-emerald-400 bg-emerald-500/10';
      case 'update': return 'text-amber-400 bg-amber-500/10';
      case 'delete': return 'text-red-400 bg-red-500/10';
      case 'login': return 'text-cyan-400 bg-cyan-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.action === filter;
    const matchesSearch = !searchTerm || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity_id.toString().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const actionTypes = ['all', 'view', 'create', 'update', 'delete', 'login'];

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Audit Log</h3>
          <p className="text-sm text-gray-500 mt-1">Track all activity in your account</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="input-field pl-10 w-56"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {actionTypes.map(action => (
          <button
            key={action}
            onClick={() => setFilter(action)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === action
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
            }`}
          >
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </button>
        ))}
      </div>

      {/* Logs */}
      {loading ? (
        <div className="card text-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading audit logs...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="card text-center py-12">
          <Shield className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No audit logs found</h3>
          <p className="text-sm text-gray-500">Activity will appear here as you use the app.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log, idx) => {
            const Icon = getActionIcon(log.action);
            const colorClass = getActionColor(log.action);
            return (
              <div key={idx} className="card-hover flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white capitalize">{log.action}</span>
                    <span className="text-xs text-gray-500">{log.entity_type} #{log.entity_id}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                    {log.ip_address && (
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {log.ip_address}
                      </span>
                    )}
                  </div>
                  {(log.old_value || log.new_value) && (
                    <div className="mt-2 p-2 bg-gray-800/50 rounded-lg text-xs text-gray-400">
                      {log.old_value && <span className="line-through">{log.old_value}</span>}
                      {log.old_value && log.new_value && <span className="mx-2">→</span>}
                      {log.new_value && <span className="text-emerald-400">{log.new_value}</span>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AuditLogPage;
