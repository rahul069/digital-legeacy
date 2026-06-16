import React, { useState, useEffect } from 'react';
import { Mail, Smartphone, CheckCircle, Clock, AlertTriangle, Eye, MousePointer, Bell, ArrowRight, Activity } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const DeliveryTrackingPage = () => {
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTracking();
  }, []);

  const fetchTracking = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/delivery-tracking/`);
      setTracking(response.data || []);
    } catch (err) {
      console.error('Failed to fetch delivery tracking:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'opened': return <Eye className="w-4 h-4 text-blue-400" />;
      case 'clicked': return <MousePointer className="w-4 h-4 text-purple-400" />;
      case 'bounced': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'sent': return <Mail className="w-4 h-4 text-amber-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-emerald-400 bg-emerald-500/10';
      case 'opened': return 'text-blue-400 bg-blue-500/10';
      case 'clicked': return 'text-purple-400 bg-purple-500/10';
      case 'bounced': return 'text-red-400 bg-red-500/10';
      case 'failed': return 'text-red-400 bg-red-500/10';
      case 'sent': return 'text-amber-400 bg-amber-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h3 className="text-xl font-bold text-white">Delivery Tracking</h3>
        <p className="text-sm text-gray-500 mt-1">Monitor inheritance notification delivery status</p>
      </div>

      {loading ? (
        <div className="card text-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading delivery tracking...</p>
        </div>
      ) : tracking.length === 0 ? (
        <div className="card text-center py-12">
          <Mail className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No delivery tracking yet</h3>
          <p className="text-sm text-gray-500">Delivery information will appear when inheritance notifications are sent.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tracking.map((item, idx) => (
            <div key={idx} className="card-hover">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-white">{item.beneficiary_name}</h4>
                  <p className="text-sm text-gray-500">{item.beneficiary_email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {item.escalation_complete && (
                    <span className="badge-red text-xs">Escalation Complete</span>
                  )}
                  {item.claimed_at && (
                    <span className="badge-green text-xs">Claimed</span>
                  )}
                </div>
              </div>

              {/* Email Status */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400">Email:</span>
                  <span className={`badge ${getStatusColor(item.email_status)}`}>
                    {item.email_status}
                  </span>
                </div>
                {item.email_sent_at && (
                  <div className="text-xs text-gray-500 ml-6">
                    Sent: {new Date(item.email_sent_at).toLocaleString()}
                  </div>
                )}
                {item.email_opened_at && (
                  <div className="text-xs text-blue-400 ml-6">
                    Opened: {new Date(item.email_opened_at).toLocaleString()}
                  </div>
                )}
                {item.email_clicked_at && (
                  <div className="text-xs text-purple-400 ml-6">
                    Clicked: {new Date(item.email_clicked_at).toLocaleString()}
                  </div>
                )}
              </div>

              {/* SMS Status */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Smartphone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400">SMS:</span>
                  <span className={`badge ${getStatusColor(item.sms_status)}`}>
                    {item.sms_status}
                  </span>
                </div>
                {item.sms_sent_at && (
                  <div className="text-xs text-gray-500 ml-6">
                    Sent: {new Date(item.sms_sent_at).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Reminder Level */}
              {item.reminder_level > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span className="text-gray-400">Reminders:</span>
                  <span className="text-amber-400 font-medium">L{item.reminder_level}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryTrackingPage;
