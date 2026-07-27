import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Pin, Trash2, Calendar, FileText, ChevronRight, Filter } from 'lucide-react';
import { Card, Button, Badge, Skeleton, EmptyState } from '../components/DesignSystem';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [scoreFilter, setScoreFilter] = useState('all'); // 'all', 'high' (>=8.5), 'medium' (6.5-8.4), 'low' (<6.5)
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'score-desc', 'score-asc'

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
    if (!window.confirm('Are you sure you want to permanently delete this audit report?')) return;
    try {
      await axios.delete(`${API_URL}/audits/${id}`);
      setAudits(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting audit:', err);
    }
  };

  // Filter logic
  const filteredAudits = audits.filter(audit => {
    // Search filter
    const matchesSearch = audit.originalName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Pin filter
    const matchesPin = showPinnedOnly ? audit.isPinned : true;
    
    // Score filter
    let matchesScore = true;
    if (scoreFilter === 'high') {
      matchesScore = audit.score >= 8.5;
    } else if (scoreFilter === 'medium') {
      matchesScore = audit.score >= 6.5 && audit.score < 8.5;
    } else if (scoreFilter === 'low') {
      matchesScore = audit.score < 6.5;
    }

    return matchesSearch && matchesPin && matchesScore;
  });

  // Sort logic
  const sortedAudits = [...filteredAudits].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === 'score-desc') {
      return b.score - a.score;
    }
    if (sortBy === 'score-asc') {
      return a.score - b.score;
    }
    return 0;
  });

  // Score Badge helper
  const getScoreBadge = (sc) => {
    if (sc >= 8.5) return <Badge variant="success">{sc} / 10</Badge>;
    if (sc >= 6.5) return <Badge variant="warning">{sc} / 10</Badge>;
    return <Badge variant="error">{sc} / 10</Badge>;
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Options Bar */}
      <Card className="p-5 select-none">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search bar */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports by filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-premium outline-none focus:border-brand-primary transition-all"
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-premium outline-none focus:border-brand-primary appearance-none cursor-pointer"
            >
              <option value="newest">Sort by: Newest first</option>
              <option value="oldest">Sort by: Oldest first</option>
              <option value="score-desc">Sort by: Score (High to Low)</option>
              <option value="score-asc">Sort by: Score (Low to High)</option>
            </select>
          </div>

          {/* Score category dropdown */}
          <div className="relative">
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-premium outline-none focus:border-brand-primary appearance-none cursor-pointer"
            >
              <option value="all">Filter: All Scores</option>
              <option value="high">Filter: Excellent (8.5+)</option>
              <option value="medium">Filter: Needs Improvement (6.5 - 8.4)</option>
              <option value="low">Filter: Critical (&lt; 6.5)</option>
            </select>
          </div>
        </div>

        {/* Pinned filter toggle check */}
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-850">
          <input
            id="pinnedOnlyCheck"
            type="checkbox"
            checked={showPinnedOnly}
            onChange={(e) => setShowPinnedOnly(e.target.checked)}
            className="w-4 h-4 rounded text-brand-accent bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-brand-accent/20 cursor-pointer"
          />
          <label htmlFor="pinnedOnlyCheck" className="text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-pointer flex items-center">
            <Pin className="w-3 h-3 mr-1 text-slate-400" />
            Show Pinned Analyses Only
          </label>
        </div>
      </Card>

      {/* Grid listing */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton variant="rect" className="h-[220px]" />
          <Skeleton variant="rect" className="h-[220px]" />
          <Skeleton variant="rect" className="h-[220px]" />
        </div>
      ) : sortedAudits.length === 0 ? (
        <EmptyState
          title="No reports match your filters"
          description="Try modifying your search text, clearing the Pinned toggle, or setting the Score filter to 'All'."
          actionText="Clear Search Filters"
          onAction={() => {
            setSearchQuery('');
            setShowPinnedOnly(false);
            setScoreFilter('all');
            setSortBy('newest');
          }}
          icon={FileText}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAudits.map((audit) => (
            <Card
              key={audit.id}
              onClick={() => navigate(`/analysis/${audit.id}`)}
              hoverable
              className="flex flex-col justify-between overflow-hidden group h-[300px]"
            >
              {/* Header and preview thumb */}
              <div>
                {/* Image overlay backdrop */}
                <div className="relative h-32 bg-slate-100 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-850 overflow-hidden flex justify-center">
                  <img 
                    src={`http://localhost:5000${audit.screenshotUrl}`} 
                    alt={audit.originalName} 
                    className="h-full object-cover object-top w-full group-hover:scale-[1.02] transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23cbd5e1" stroke-width="2"%3E%3Crect width="18" height="18" x="3" y="3" rx="2"/%3E%3C/svg%3E';
                    }}
                  />
                  {/* Pin overlay toggle */}
                  <button
                    onClick={(e) => handleTogglePin(audit.id, e)}
                    className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-md shadow-sm border transition-colors ${audit.isPinned ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-900/60 hover:bg-slate-900/80 text-white border-transparent'}`}
                  >
                    <Pin className={`w-3 h-3 ${audit.isPinned ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Content info block */}
                <div className="p-4.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(audit.createdAt).toLocaleDateString()}
                    </span>
                    {getScoreBadge(audit.score)}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-brand-primary">
                    {audit.originalName}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {audit.summary}
                  </p>
                </div>
              </div>

              {/* Action trigger footer */}
              <div className="px-4.5 py-3 bg-slate-50/50 dark:bg-slate-900/10 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => handleDeleteAudit(audit.id, e)}
                  className="text-[10px] font-bold text-slate-400 hover:text-brand-error flex items-center"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/analysis/${audit.id}`)}
                  className="text-[10px] font-bold text-brand-primary hover:text-blue-700 flex items-center"
                >
                  View Report
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
