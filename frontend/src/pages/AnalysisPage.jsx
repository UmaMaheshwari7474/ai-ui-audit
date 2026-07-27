import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Copy, 
  Download, 
  Pin, 
  ChevronDown, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Palette, 
  Type, 
  Grid, 
  Sparkles, 
  Accessibility, 
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronUp,
  Layout
} from 'lucide-react';
import { Card, Button, Badge, ProgressBar, Skeleton, CircularProgress, Alert } from '../components/DesignSystem';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AnalysisPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('quickWins'); // 'quickWins' or 'longTerm'
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    color: true,
    typography: true,
    spacing: true,
    modern: true,
    access: true
  });

  useEffect(() => {
    fetchAuditReport();
  }, [id]);

  const fetchAuditReport = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_URL}/audits/${id}`);
      setAudit(res.data);
    } catch (err) {
      console.error('Error fetching audit report:', err);
      setError(err.response?.data?.message || 'Report not found or unauthorized.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePin = async () => {
    try {
      const res = await axios.patch(`${API_URL}/audits/${id}/pin`);
      setAudit(prev => ({ ...prev, isPinned: res.data.isPinned }));
    } catch (err) {
      console.error('Error pinning audit:', err);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Compile report markdown and copy to clipboard
  const handleCopyReport = () => {
    if (!audit) return;
    
    const mdReport = `
# AI UI/UX Design Audit: ${audit.originalName}
Overall Score: ${audit.score}/10
Date Conducted: ${new Date(audit.createdAt).toLocaleDateString()}

## Summary
${audit.summary}

## Strengths
${audit.strengths.map(s => `- ${s}`).join('\n')}

## Weaknesses
${audit.weaknesses.map(w => `- ${w}`).join('\n')}

## Priority Recommendations
${audit.priorityImprovements.map(item => `- [${item.severity.toUpperCase()}] ${item.text} (${item.type === 'quickWin' ? 'Quick Win' : 'Long-Term'})`).join('\n')}

## Spacing & Layout
${audit.spacingRecommendations.map(s => `- ${s}`).join('\n')}

## Typography & Weights
${audit.typographyRecommendations.map(t => `- ${t}`).join('\n')}

## Color & Contrast
${audit.colorRecommendations.map(c => `- ${c}`).join('\n')}

## Accessibility Findings
${audit.accessibilityFindings.map(a => `- ${a}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(mdReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Score styling color
  const getSeverityBadge = (sev) => {
    if (sev === 'high') return <Badge variant="error">High</Badge>;
    if (sev === 'medium') return <Badge variant="warning">Medium</Badge>;
    return <Badge variant="info">Low</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="title" className="w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton variant="rect" className="lg:col-span-1 h-[400px]" />
          <div className="lg:col-span-2 space-y-6">
            <Skeleton variant="rect" className="h-40" />
            <Skeleton variant="rect" className="h-[300px]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="max-w-md mx-auto py-16">
        <Card className="p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-brand-warning mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">Audit Load Error</h3>
          <p className="text-xs text-slate-500 mb-6">{error || 'Could not load this report.'}</p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  // Filter priorities
  const quickWinsList = audit.priorityImprovements?.filter(item => item.type === 'quickWin') || [];
  const longTermList = audit.priorityImprovements?.filter(item => item.type === 'longTerm') || [];

  return (
    <div className="space-y-6">
      
      {/* 1. Audit Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white dark:bg-card-dark p-6 rounded-premium border border-slate-100 dark:border-slate-900/60 shadow-premium gap-4 select-none">
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <Badge variant="purple" className="text-[10px]">AI AUDIT REPORT</Badge>
            <span className="text-[10px] text-slate-400 font-semibold">{new Date(audit.createdAt).toLocaleDateString()}</span>
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white truncate mt-1">{audit.originalName}</h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2 shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleTogglePin}
            className={`border border-slate-200 dark:border-slate-800 text-[11px] ${audit.isPinned ? 'bg-amber-500/10 text-amber-500' : ''}`}
          >
            <Pin className={`w-3.5 h-3.5 mr-1.5 ${audit.isPinned ? 'fill-current' : ''}`} />
            {audit.isPinned ? 'Pinned' : 'Pin'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyReport}
            className="border border-slate-200 dark:border-slate-800 text-[11px]"
          >
            <Copy className="w-3.5 h-3.5 mr-1.5" />
            {copied ? 'Copied Markdown' : 'Copy Report'}
          </Button>
          
          {/* Coming soon disabled PDF exporter */}
          <div className="relative group">
            <Button 
              variant="outline" 
              size="sm" 
              disabled
              className="border border-slate-100 dark:border-slate-900 opacity-60 text-[11px]"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export PDF
            </Button>
            <span className="absolute bottom-full right-1/2 translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900 text-white text-[9px] font-bold py-1 px-2 rounded tracking-wide shadow-md whitespace-nowrap">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* 2. Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side Pane - Sticky Screenshot Image */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <Card className="overflow-hidden p-3.5">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 select-none mb-3">Audited screenshot</h4>
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex justify-center max-h-[500px]">
              <img 
                src={`http://localhost:5000${audit.screenshotUrl}`} 
                alt="Audit target interface" 
                className="max-h-[498px] max-w-full object-contain object-top"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23cbd5e1" stroke-width="2"%3E%3Crect width="18" height="18" x="3" y="3" rx="2"/%3E%3C/svg%3E';
                }}
              />
            </div>
            
            {/* View Full Resolution Anchor */}
            <div className="text-center mt-3">
              <a 
                href={`http://localhost:5000${audit.screenshotUrl}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] font-semibold text-brand-primary hover:underline inline-flex items-center"
              >
                Open original image
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </Card>
        </div>

        {/* Right Side Pane - Recommendations & Detailed Scores */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Overall score circle and summary */}
          <Card className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            <CircularProgress score={audit.score} size={120} strokeWidth={9} className="shrink-0" />
            <div className="text-center md:text-left space-y-3">
              <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide select-none">AI Designer Summary</h4>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {audit.summary}
              </p>
            </div>
          </Card>

          {/* Category Scores Breakdown */}
          <Card className="p-6">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide select-none mb-4">Category Scores</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Typography', val: audit.categoryScores?.typography, icon: Type },
                { name: 'Spacing', val: audit.categoryScores?.spacing, icon: Grid },
                { name: 'Hierarchy', val: audit.categoryScores?.visualHierarchy, icon: Sparkles },
                { name: 'Accessibility', val: audit.categoryScores?.accessibility, icon: Accessibility },
                { name: 'Colors', val: audit.categoryScores?.colorSystem, icon: Palette },
                { name: 'Layout', val: audit.categoryScores?.layout, icon: Layout }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/10 flex items-center justify-between">
                  <div className="flex items-center min-w-0">
                    <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-500 dark:text-slate-400 mr-3 shrink-0">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-white shrink-0 ml-2">{item.val || '—'} / 10</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Strengths and Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide select-none mb-4 flex items-center">
                <CheckCircle2 className="w-4 h-4 text-brand-success mr-2" />
                Key Strengths
              </h4>
              <ul className="space-y-3">
                {audit.strengths?.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6 relative">
                    <span className="absolute left-0 top-1 w-1.5 h-1.5 rounded-full bg-brand-success" />
                    {str}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide select-none mb-4 flex items-center">
                <XCircle className="w-4 h-4 text-brand-error mr-2" />
                Areas to Improve
              </h4>
              <ul className="space-y-3">
                {audit.weaknesses?.map((weak, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6 relative">
                    <span className="absolute left-0 top-1 w-1.5 h-1.5 rounded-full bg-brand-error" />
                    {weak}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Priority Matrix List */}
          <Card className="p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-4 select-none">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Priority Matrix</h4>
              
              {/* Tab Selector */}
              <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-0.5">
                <button
                  onClick={() => setActiveTab('quickWins')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${activeTab === 'quickWins' ? 'bg-white dark:bg-card-dark shadow-sm text-brand-accent' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Quick Wins ({quickWinsList.length})
                </button>
                <button
                  onClick={() => setActiveTab('longTerm')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${activeTab === 'longTerm' ? 'bg-white dark:bg-card-dark shadow-sm text-brand-accent' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Long-Term ({longTermList.length})
                </button>
              </div>
            </div>

            {/* List Tab items */}
            <div className="space-y-3">
              {(activeTab === 'quickWins' ? quickWinsList : longTermList).map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-900/5 hover:-translate-x-0.5 transition-transform duration-150"
                >
                  <div className="flex items-start min-w-0 pr-4">
                    <Clock className="w-4 h-4 text-slate-400 mr-3 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-normal">{item.text}</p>
                  </div>
                  <div className="shrink-0">{getSeverityBadge(item.severity)}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Collapsible Design Recommendations Accordion System */}
          <div className="space-y-3">
            
            {/* Color System */}
            <Card className="overflow-hidden">
              <button 
                onClick={() => toggleSection('color')}
                className="w-full flex items-center justify-between px-6 py-4 outline-none font-bold text-sm text-slate-800 dark:text-white bg-slate-50/40 dark:bg-slate-900/5"
              >
                <span className="flex items-center"><Palette className="w-4 h-4 text-brand-primary mr-2.5" /> Color System Recommendations</span>
                {expandedSections.color ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedSections.color && (
                <div className="px-6 pb-5 pt-3 border-t border-slate-50 dark:border-slate-850 space-y-2.5">
                  {audit.colorRecommendations?.map((rec, idx) => (
                    <p key={idx} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mr-2.5 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </p>
                  ))}
                </div>
              )}
            </Card>

            {/* Typography */}
            <Card className="overflow-hidden">
              <button 
                onClick={() => toggleSection('typography')}
                className="w-full flex items-center justify-between px-6 py-4 outline-none font-bold text-sm text-slate-800 dark:text-white bg-slate-50/40 dark:bg-slate-900/5"
              >
                <span className="flex items-center"><Type className="w-4 h-4 text-brand-accent mr-2.5" /> Typography & Scale</span>
                {expandedSections.typography ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedSections.typography && (
                <div className="px-6 pb-5 pt-3 border-t border-slate-50 dark:border-slate-850 space-y-2.5">
                  {audit.typographyRecommendations?.map((rec, idx) => (
                    <p key={idx} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mr-2.5 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </p>
                  ))}
                </div>
              )}
            </Card>

            {/* Spacing */}
            <Card className="overflow-hidden">
              <button 
                onClick={() => toggleSection('spacing')}
                className="w-full flex items-center justify-between px-6 py-4 outline-none font-bold text-sm text-slate-800 dark:text-white bg-slate-50/40 dark:bg-slate-900/5"
              >
                <span className="flex items-center"><Grid className="w-4 h-4 text-brand-success mr-2.5" /> Spacing & Padding alignment</span>
                {expandedSections.spacing ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedSections.spacing && (
                <div className="px-6 pb-5 pt-3 border-t border-slate-50 dark:border-slate-850 space-y-2.5">
                  {audit.spacingRecommendations?.map((rec, idx) => (
                    <p key={idx} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-success mr-2.5 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </p>
                  ))}
                </div>
              )}
            </Card>

            {/* Modernization */}
            <Card className="overflow-hidden">
              <button 
                onClick={() => toggleSection('modern')}
                className="w-full flex items-center justify-between px-6 py-4 outline-none font-bold text-sm text-slate-800 dark:text-white bg-slate-50/40 dark:bg-slate-900/5"
              >
                <span className="flex items-center"><Sparkles className="w-4 h-4 text-brand-warning mr-2.5" /> Modernization suggestions</span>
                {expandedSections.modern ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedSections.modern && (
                <div className="px-6 pb-5 pt-3 border-t border-slate-50 dark:border-slate-850 space-y-2.5">
                  {audit.modernizationSuggestions?.map((rec, idx) => (
                    <p key={idx} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-warning mr-2.5 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </p>
                  ))}
                </div>
              )}
            </Card>

            {/* Accessibility findings */}
            <Card className="overflow-hidden">
              <button 
                onClick={() => toggleSection('access')}
                className="w-full flex items-center justify-between px-6 py-4 outline-none font-bold text-sm text-slate-800 dark:text-white bg-slate-50/40 dark:bg-slate-900/5"
              >
                <span className="flex items-center"><Accessibility className="w-4 h-4 text-brand-error mr-2.5" /> WCAG AA Accessibility Findings</span>
                {expandedSections.access ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedSections.access && (
                <div className="px-6 pb-5 pt-3 border-t border-slate-50 dark:border-slate-850 space-y-2.5">
                  {audit.accessibilityFindings?.map((rec, idx) => (
                    <p key={idx} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-error mr-2.5 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </p>
                  ))}
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};
