import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  UploadCloud, 
  History, 
  Trash2, 
  Pin, 
  ChevronRight, 
  Search, 
  ArrowUpDown, 
  Star,
  Flame,
  Layout,
  Gauge
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Badge, ProgressBar, Skeleton, EmptyState } from '../components/DesignSystem';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('createdAt'); // 'createdAt' or 'score'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/audits/history`);
      setAudits(res.data);
    } catch (error) {
      console.error('Error fetching audit history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePin = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await axios.patch(`${API_URL}/audits/${id}/pin`);
      setAudits(prev => prev.map(a => a.id === id ? { ...a, isPinned: res.data.isPinned } : a));
    } catch (err) {
      console.error('Error pinning audit:', err);
    }
  };

  const handleDeleteAudit = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this audit?')) return;
    try {
      await axios.delete(`${API_URL}/audits/${id}`);
      setAudits(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting audit:', err);
    }
  };

  // Calculation helpers
  const totalAudits = audits.length;
  const pinnedAudits = audits.filter(a => a.isPinned);
  const averageScore = totalAudits > 0 
    ? Number((audits.reduce((acc, curr) => acc + curr.score, 0) / totalAudits).toFixed(1))
    : 0;

  // Sum high priority fixes across audits
  const totalHighPriorityFixes = audits.reduce((acc, curr) => {
    const highFixes = curr.priorityImprovements?.filter(item => item.severity === 'high') || [];
    return acc + highFixes.length;
  }, 0);

  // Category average scores
  const getCategoryAverages = () => {
    if (totalAudits === 0) return {};
    const sum = { typography: 0, spacing: 0, visualHierarchy: 0, accessibility: 0, colorSystem: 0, layout: 0, userExperience: 0 };
    audits.forEach(a => {
      if (a.categoryScores) {
        Object.keys(sum).forEach(cat => {
          sum[cat] += a.categoryScores[cat] || 0;
        });
      }
    });
    const averages = {};
    Object.keys(sum).forEach(cat => {
      averages[cat] = Number((sum[cat] / totalAudits).toFixed(1));
    });
    return averages;
  };

  const catAverages = getCategoryAverages();

  // Filter & Sort Audits
  const processedAudits = audits
    .filter(a => a.originalName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'score') {
        comparison = a.score - b.score;
      } else {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Score Badge Color mapping
  const getScoreBadge = (sc) => {
    if (sc >= 8.5) return <Badge variant="success">{sc} / 10</Badge>;
    if (sc >= 6.5) return <Badge variant="warning">{sc} / 10</Badge>;
    return <Badge variant="error">{sc} / 10</Badge>;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Hero section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white dark:bg-card-dark p-6 rounded-premium border border-slate-100 dark:border-slate-900/60 shadow-premium">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Welcome back, {user?.name}!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review dashboard scores and upload design screenshots for audit analysis.</p>
        </div>
        <Button 
          variant="primary" 
          size="md" 
          onClick={() => navigate('/upload')}
          className="mt-4 md:mt-0"
          icon={UploadCloud}
        >
          New Audit
        </Button>
      </div>

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <Card className="p-5 flex items-center space-x-4">
          <div className="p-3.5 bg-brand-primary/15 text-brand-primary rounded-2xl">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average UI Score</p>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white mt-1">
              {totalAudits > 0 ? `${averageScore} / 10` : '—'}
            </h4>
          </div>
        </Card>

        <Card className="p-5 flex items-center space-x-4">
          <div className="p-3.5 bg-brand-accent/15 text-brand-accent rounded-2xl">
            <History className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total UI Audits</p>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white mt-1">{totalAudits}</h4>
          </div>
        </Card>

        <Card className="p-5 flex items-center space-x-4">
          <div className="p-3.5 bg-rose-500/10 text-brand-error rounded-2xl">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">High Fixes Found</p>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white mt-1">{totalHighPriorityFixes}</h4>
          </div>
        </Card>

        <Card className="p-5 flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-500/10 text-brand-success rounded-2xl">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pinned Audits</p>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white mt-1">{pinnedAudits.length}</h4>
          </div>
        </Card>
      </div>

      {/* 3. Category Averages & Mini Upload Area Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category scores */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Average Scores by Category</h4>
            <p className="text-[10px] text-slate-400 font-semibold mb-6">Aggregated from your historical uploads.</p>
            
            {totalAudits === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
                No scores available. Upload your first audit.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Typography', val: catAverages.typography, var: 'primary' },
                  { name: 'Spacing & Layout', val: catAverages.spacing, var: 'accent' },
                  { name: 'Hierarchy & Flow', val: catAverages.visualHierarchy, var: 'primary' },
                  { name: 'Accessibility AA', val: catAverages.accessibility, var: 'error' },
                  { name: 'Color System', val: catAverages.colorSystem, var: 'success' },
                  { name: 'UX Principles', val: catAverages.userExperience, var: 'warning' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5 p-3 rounded-xl border border-slate-100/50 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/10">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <span>{item.name}</span>
                      <span className="font-bold text-slate-800 dark:text-white">{item.val} / 10</span>
                    </div>
                    <ProgressBar value={item.val} max={10} variant={item.var} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Quick Upload Box */}
        <Card 
          onClick={() => navigate('/upload')} 
          glow
          glowColor="accent"
          className="p-6 border border-brand-accent/25 hover:border-brand-accent flex flex-col items-center justify-center text-center cursor-pointer select-none group"
        >
          <div className="p-4 bg-brand-accent/5 rounded-2xl text-brand-accent mb-4 group-hover:scale-105 transition-transform duration-200">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Quick Upload</h4>
          <p className="text-xs text-slate-500 max-w-[200px] mt-1 leading-relaxed">
            Drag, drop, or select screenshots for a design critique.
          </p>
          <span className="mt-4 text-xs font-bold text-brand-accent flex items-center">
            Upload Panel
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </span>
        </Card>
      </div>

      {/* 4. Recent Audits Listing */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Recent Audits</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Search and manage your design audits.</p>
          </div>

          {/* Search & Sort inputs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-premium outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => toggleSort('createdAt')}
                className="text-[11px] py-2 px-3 border border-slate-200 dark:border-slate-800"
              >
                Date {sortField === 'createdAt' && (sortOrder === 'desc' ? '↓' : '↑')}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => toggleSort('score')}
                className="text-[11px] py-2 px-3 border border-slate-200 dark:border-slate-800"
              >
                Score {sortField === 'score' && (sortOrder === 'desc' ? '↓' : '↑')}
              </Button>
            </div>
          </div>
        </div>

        {/* Audit List Table/Container */}
        {loading ? (
          <div className="space-y-3">
            <Skeleton variant="rect" className="h-14" />
            <Skeleton variant="rect" className="h-14" />
            <Skeleton variant="rect" className="h-14" />
          </div>
        ) : processedAudits.length === 0 ? (
          <EmptyState
            title="No audits found"
            description={searchQuery ? `No audits match your filter "${searchQuery}".` : "You haven't conducted any UI reviews yet. Start by uploading a screenshot."}
            actionText={searchQuery ? "" : "Submit First Design"}
            onAction={searchQuery ? null : () => navigate('/upload')}
            icon={Layout}
          />
        ) : (
          <div className="overflow-x-auto border border-slate-100 dark:border-slate-850 rounded-premium">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-850">
                  <th className="py-3 px-4">Interface Screen</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Audit Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {processedAudits.slice(0, 5).map((audit) => (
                  <tr 
                    key={audit.id}
                    onClick={() => navigate(`/analysis/${audit.id}`)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 min-w-[200px]">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-9 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/55 dark:border-slate-750 shrink-0">
                          <img 
                            src={`http://localhost:5000${audit.screenshotUrl}`} 
                            alt={audit.originalName} 
                            className="w-full h-full object-cover object-top"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23cbd5e1" stroke-width="2"%3E%3Crect width="18" height="18" x="3" y="3" rx="2"/%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-primary">{audit.originalName}</p>
                          <p className="text-[9px] text-slate-400 truncate mt-0.5">{audit.summary?.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getScoreBadge(audit.score)}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {new Date(audit.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleTogglePin(audit.id, e)}
                          title={audit.isPinned ? "Unpin audit" : "Pin audit"}
                          className={`p-1.5 rounded-lg border transition-colors ${audit.isPinned ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-transparent text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-slate-800'}`}
                        >
                          <Pin className={`w-3.5 h-3.5 ${audit.isPinned ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteAudit(audit.id, e)}
                          title="Delete audit"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-error hover:bg-rose-500/10 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/analysis/${audit.id}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {totalAudits > 5 && (
          <div className="text-center mt-6">
            <Link to="/history" className="text-xs font-semibold text-brand-primary hover:underline flex items-center justify-center">
              View all audits in history
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};
