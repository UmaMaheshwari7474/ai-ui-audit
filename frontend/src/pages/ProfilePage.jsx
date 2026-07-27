import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Sparkles, 
  Bell, 
  Moon, 
  Sun, 
  Flame, 
  History, 
  Gauge, 
  Edit3, 
  Save, 
  ShieldCheck, 
  Lightbulb,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input, Alert, Badge } from '../components/DesignSystem';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ProfilePage = () => {
  const { user, updatePreferences, updateProfileName } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [stats, setStats] = useState({ totalAudits: 0, averageScore: 0, highFixes: 0 });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock Notification settings loaded from local context
  const [notifications, setNotifications] = useState(user?.preferences?.notifications ?? true);
  
  // Theme state synced with documentElement
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem('theme') !== 'light'
  );

  // Fetch metrics for profile dashboard
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/audits/history`);
        const audits = res.data;
        const total = audits.length;
        const avg = total > 0 
          ? Number((audits.reduce((acc, curr) => acc + curr.score, 0) / total).toFixed(1))
          : 0;
        const high = audits.reduce((acc, curr) => {
          const highFixes = curr.priorityImprovements?.filter(item => item.severity === 'high') || [];
          return acc + highFixes.length;
        }, 0);

        setStats({ totalAudits: total, averageScore: avg, highFixes: high });
      } catch (err) {
        console.error('Error fetching statistics for profile:', err);
      }
    };
    fetchStats();
  }, []);

  const handleToggleTheme = () => {
    const nextDark = !isDarkTheme;
    setIsDarkTheme(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      updatePreferences({ theme: 'dark' }).catch(() => {});
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      updatePreferences({ theme: 'light' }).catch(() => {});
    }
  };

  const handleToggleNotifications = async () => {
    const nextNotify = !notifications;
    setNotifications(nextNotify);
    try {
      await updatePreferences({ notifications: nextNotify });
      triggerSuccess('Notification preferences updated.');
    } catch (err) {
      setErrorMsg('Failed to update notification settings.');
    }
  };

  const handleSaveName = async () => {
    if (!name.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await updateProfileName(name);
      setIsEditingName(false);
      triggerSuccess('Profile name updated successfully.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update name.');
    } finally {
      setLoading(false);
    }
  };

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const designTips = [
    {
      title: 'The 8px Grid Standard',
      text: 'Align margins, paddings, and heights to multiples of 8px. It ensures uniform rhythm across layout resolutions.'
    },
    {
      title: 'Visual Hierarchy Anchor',
      text: 'Set your primary heading font weight to Bold/700 with letter-spacing of -0.02em. Keep body texts at regular weight 400 for high readability.'
    },
    {
      title: 'Functional Color Badges',
      text: 'Reserve green/red indicators solely for status evaluations (success, danger). Using primary brand colors for everything visual causes functional clutter.'
    },
    {
      title: 'Button Hover expectation',
      text: 'Ensure all primary CTAs have a hover translate state (e.g. hover:scale-[1.02] or translate-y-[-1px]) to convey clickability.'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      {/* Left side card - Profile summary */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* User Card */}
        <Card className="p-6 md:p-8">
          {successMsg && <Alert message={successMsg} type="success" className="mb-4" />}
          {errorMsg && <Alert message={errorMsg} type="error" className="mb-4" />}

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 select-none">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center font-extrabold text-white text-3xl shadow-lg ring-4 ring-slate-100 dark:ring-slate-900 shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            {/* Profile form */}
            <div className="flex-1 space-y-4 text-center md:text-left w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                {isEditingName ? (
                  <div className="flex items-center space-x-2 w-full md:max-w-md">
                    <Input
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      disabled={loading}
                      required
                    />
                    <Button 
                      onClick={handleSaveName}
                      loading={loading}
                      size="sm"
                      className="px-4 shrink-0"
                    >
                      <Save className="w-4 h-4 mr-1.5" /> Save
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center md:justify-start space-x-3">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{user?.name}</h3>
                    <button 
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-slate-400 hover:text-brand-primary rounded-lg transition-colors"
                      title="Edit name"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                
                <Badge variant="neutral">Beta User</Badge>
              </div>

              {/* Email details */}
              <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <p className="flex items-center justify-center md:justify-start">
                  <Mail className="w-4 h-4 mr-2.5 text-slate-400" />
                  {user?.email}
                </p>
                <p className="flex items-center justify-center md:justify-start">
                  <Calendar className="w-4 h-4 mr-2.5 text-slate-400" />
                  Account created on {new Date(user?.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 select-none">
          <Card className="p-5 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average UI Score</span>
            <div className="flex items-baseline mt-4">
              <span className="text-3xl font-black text-slate-800 dark:text-white">{stats.averageScore}</span>
              <span className="text-xs text-slate-400 font-semibold ml-1">/ 10</span>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Audits Conducted</span>
            <span className="text-3xl font-black text-slate-800 dark:text-white mt-4">{stats.totalAudits}</span>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">High-Severity Fixes found</span>
            <span className="text-3xl font-black text-slate-800 dark:text-white mt-4">{stats.highFixes}</span>
          </Card>
        </div>

        {/* Preferences / settings card */}
        <Card className="p-6">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-6 select-none border-b border-slate-100 dark:border-slate-850 pb-3">
            Interface Preferences
          </h4>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-850">
            {/* Theme switcher */}
            <div className="flex items-center justify-between py-4 select-none">
              <div>
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-350">Dark Mode Interface</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">Toggle default high-contrast dark dashboard styling.</p>
              </div>
              <button
                onClick={handleToggleTheme}
                className="p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-card-dark text-slate-500 hover:text-brand-primary"
              >
                {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {/* Notifications mock setting */}
            <div className="flex items-center justify-between py-4 select-none">
              <div>
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-350">Design System Tips & Alerts</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">Receive warnings when audits detect heavy contrast violations.</p>
              </div>
              <button
                onClick={handleToggleNotifications}
                className={`w-11 h-6.5 rounded-full p-1 transition-colors duration-200 outline-none border border-transparent ${notifications ? 'bg-brand-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
              >
                <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ${notifications ? 'translate-x-4.5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Right side card - Design tips list */}
      <Card className="p-6">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest select-none mb-4 flex items-center">
          <Lightbulb className="w-4 h-4 text-brand-warning mr-2" />
          Senior Design Tips
        </h4>

        <div className="space-y-4">
          {designTips.map((tip, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/5 hover:-translate-y-0.5 transition-transform duration-150"
            >
              <h5 className="text-xs font-bold text-slate-800 dark:text-white flex items-center">
                <Check className="w-3.5 h-3.5 text-brand-success mr-2" />
                {tip.title}
              </h5>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mt-2 pl-5">
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
