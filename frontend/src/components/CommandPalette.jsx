import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Monitor, Sun, Moon, LogOut, FileText, ArrowRight, CornerDownLeft, Sparkles, UploadCloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CommandPalette = ({ isOpen, setIsOpen, isDarkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const [reports, setReports] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Fetch audits on open to allow report searching
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      axios.get(`${API_URL}/audits/history`)
        .then(res => setReports(res.data))
        .catch(err => console.error('Error fetching audits for command palette:', err));
    }
  }, [isOpen, isAuthenticated]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  // Command palette items
  const staticItems = [
    { id: 'upload', title: 'Upload Screenshot', category: 'Navigation', icon: UploadCloud, action: () => navigate('/upload') },
    { id: 'dashboard', title: 'Dashboard', category: 'Navigation', icon: Sparkles, action: () => navigate('/dashboard') },
    { id: 'history', title: 'Review History', category: 'Navigation', icon: FileText, action: () => navigate('/history') },
    { id: 'theme', title: `Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`, category: 'Actions', icon: isDarkMode ? Sun : Moon, action: toggleDarkMode },
    { id: 'logout', title: 'Logout Session', category: 'Actions', icon: LogOut, action: () => { logout(); navigate('/'); } }
  ].filter(item => {
    // Only show login actions if authenticated, hide logout if not
    if (!isAuthenticated && item.id === 'logout') return false;
    return true;
  });

  // Filter items based on query
  const filteredStatic = staticItems.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredReports = reports
    .filter(rep => rep.originalName.toLowerCase().includes(query.toLowerCase()))
    .map(rep => ({
      id: rep.id,
      title: `Audit: ${rep.originalName}`,
      category: 'UI Audit Reports',
      icon: FileText,
      action: () => navigate(`/analysis/${rep.id}`)
    }));

  const allItems = [...filteredStatic, ...filteredReports];

  // Keyboard navigation helpers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % allItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + allItems.length) % allItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          allItems[selectedIndex].action();
          setIsOpen(false);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allItems, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-lg overflow-hidden bg-white dark:bg-card-dark border border-slate-100 dark:border-slate-800 rounded-premium shadow-2xl z-10 mx-4"
          >
            {/* Search Input block */}
            <div className="relative flex items-center border-b border-slate-100 dark:border-slate-800 px-4 py-3.5">
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tools, reports, pages..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full text-sm bg-transparent outline-none border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded">
                ESC
              </kbd>
            </div>

            {/* List results */}
            <div className="max-h-[340px] overflow-y-auto p-2">
              {allItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
                  No actions or reports found matching "{query}"
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Category Headers */}
                  {Array.from(new Set(allItems.map(item => item.category))).map(category => {
                    const categoryItems = allItems.filter(item => item.category === category);
                    return (
                      <div key={category} className="space-y-0.5">
                        <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none">
                          {category}
                        </div>
                        {categoryItems.map(item => {
                          const globalIdx = allItems.indexOf(item);
                          const isSelected = globalIdx === selectedIndex;
                          const Icon = item.icon;

                          return (
                            <div
                              key={item.id}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                              onClick={() => {
                                item.action();
                                setIsOpen(false);
                              }}
                              className={`
                                flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all duration-150
                                ${isSelected 
                                  ? 'bg-slate-50 dark:bg-slate-800 text-brand-primary dark:text-brand-primary' 
                                  : 'text-slate-600 dark:text-slate-300'
                                }
                              `}
                            >
                              <div className="flex items-center min-w-0">
                                <Icon className={`w-4 h-4 mr-3 shrink-0 ${isSelected ? 'text-brand-primary' : 'text-slate-400'}`} />
                                <span className="truncate">{item.title}</span>
                              </div>
                              {isSelected && (
                                <span className="flex items-center text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                  <CornerDownLeft className="w-3 h-3 mr-1" />
                                  Enter
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Command Palette Footer instructions */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 py-2 text-[10px] font-medium text-slate-400 dark:text-slate-500 select-none">
              <span className="flex items-center gap-1.5">
                <span>↑↓ to navigate</span>
                <span className="text-slate-300 dark:text-slate-800">|</span>
                <span>Enter to select</span>
              </span>
              <span>AI UI Audit</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
