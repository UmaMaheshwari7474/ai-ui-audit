import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { 
  UploadCloud, 
  FileImage, 
  X, 
  Sparkles, 
  Palette, 
  Type, 
  Layout, 
  ShieldCheck, 
  Activity, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Card, Button, ProgressBar, Alert } from '../components/DesignSystem';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const UploadPage = () => {
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const steps = [
    { label: 'Initializing AI Auditor Engine', icon: Sparkles },
    { label: 'Analyzing Color System & Contrast', icon: Palette },
    { label: 'Checking Typography Scales & Weights', icon: Type },
    { label: 'Evaluating Grid Layout & Spacing', icon: Layout },
    { label: 'Running WCAG Accessibility Scan', icon: ShieldCheck },
    { label: 'Synthesizing Design Improvements', icon: Activity }
  ];

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Loading animation controller
  useEffect(() => {
    let stepInterval;
    let progressInterval;

    if (loading) {
      // Rotate steps
      stepInterval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          return prev; // hold on the last step
        });
      }, 500);

      // Increment progress bar smoothly
      progressInterval = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev < 95) return prev + 1;
          return prev; // cap at 95% until response returns
        });
      }, 30);
    } else {
      setLoadingStep(0);
      setProgressPercent(0);
    }

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [loading]);

  const onDrop = (acceptedFiles, rejectedFiles) => {
    setError('');

    if (rejectedFiles && rejectedFiles.length > 0) {
      const err = rejectedFiles[0].errors[0];
      if (err.code === 'file-too-large') {
        setError('File is too large. Maximum size allowed is 10MB.');
      } else if (err.code === 'file-invalid-type') {
        setError('Invalid file type. Only PNG, JPG, and JPEG files are accepted.');
      } else {
        setError(err.message);
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview('');
    setError('');
  };

  const handleUploadSubmit = async () => {
    if (!file) {
      setError('Please select or drop an image file first.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('screenshot', file);

    try {
      const res = await axios.post(`${API_URL}/audits/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Complete progress bar
      setProgressPercent(100);
      
      // Delay slightly so user sees 100% completion
      setTimeout(() => {
        setLoading(false);
        navigate(`/analysis/${res.data.id}`);
      }, 500);
    } catch (err) {
      console.error('Audit upload failure:', err);
      setError(err.response?.data?.message || 'Failed to analyze design screenshot. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Description Panel */}
      {!loading && (
        <div className="text-center py-4 select-none">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Start a New Design Audit</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Submit a mockup, homepage, SaaS interface, or landing page. Our AI design critic checks spacing alignments, color contrast, and typographic elements.
          </p>
        </div>
      )}

      {/* Main Container */}
      <Card className="p-8 relative overflow-hidden">
        
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/98 z-20 flex flex-col items-center justify-center p-8 select-none">
            
            {/* Thinking Circle */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-8">
              {/* Spinner track */}
              <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-850 rounded-full" />
              {/* Spinning gradient border */}
              <div className="absolute inset-0 border-4 border-transparent border-t-brand-accent border-r-brand-primary rounded-full animate-spin" />
              {/* Internal Active Icon */}
              <div className="text-brand-accent p-3.5 bg-slate-50 dark:bg-slate-900 rounded-3xl">
                {React.createElement(steps[loadingStep].icon, { className: 'w-8 h-8 animate-pulse' })}
              </div>
            </div>

            {/* Title / Description */}
            <div className="text-center max-w-sm mb-6">
              <h4 className="text-sm font-black text-slate-800 dark:text-white tracking-wide uppercase">AI Design Auditor is scanning...</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">This will take about 3-5 seconds</p>
            </div>

            {/* Progress line */}
            <div className="w-full max-w-md mb-8">
              <ProgressBar value={progressPercent} variant="accent" showLabel />
            </div>

            {/* Stepper items list */}
            <div className="w-full max-w-xs space-y-2">
              {steps.map((step, idx) => {
                const isPassed = idx < loadingStep;
                const isActive = idx === loadingStep;
                
                return (
                  <div 
                    key={idx} 
                    className={`flex items-center text-xs transition-all duration-200 ${isPassed ? 'text-brand-success font-medium opacity-60' : isActive ? 'text-brand-accent font-bold scale-[1.01]' : 'text-slate-400 dark:text-slate-600'}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mr-3 shrink-0 ${isPassed ? 'bg-brand-success' : isActive ? 'bg-brand-accent animate-ping' : 'bg-slate-200 dark:bg-slate-800'}`} />
                    <span>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Form elements */}
        <div className="space-y-6">
          {error && <Alert message={error} type="error" />}

          {/* Drag & Drop Field */}
          {!file ? (
            <div 
              {...getRootProps()} 
              className={`
                border-2 border-dashed rounded-premium p-12 text-center cursor-pointer select-none transition-all duration-200
                ${isDragActive 
                  ? 'border-brand-primary bg-brand-primary/5' 
                  : 'border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/10 hover:border-slate-300 dark:hover:border-slate-750'
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="p-4 bg-white dark:bg-card-dark rounded-2xl text-slate-400 dark:text-slate-500 shadow-sm inline-flex mb-4 border border-slate-100 dark:border-slate-800">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Drag & drop your screenshot here</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                Accepts PNG, JPG, or JPEG formats. Size up to 10MB limit.
              </p>
              <Button variant="outline" size="sm" className="mt-5 border border-slate-200 dark:border-slate-800">
                Browse Files
              </Button>
            </div>
          ) : (
            /* Selected File Preview panel */
            <div className="space-y-4">
              <div className="relative rounded-premium overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex justify-center max-h-[400px]">
                <img 
                  src={preview} 
                  alt="Screenshot preview" 
                  className="max-h-[398px] max-w-full object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-3 right-3 p-2 bg-slate-900/70 hover:bg-slate-900/90 text-white rounded-full transition-colors backdrop-blur-sm"
                  title="Remove screenshot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* File details */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 rounded-xl">
                <div className="flex items-center space-x-3 min-w-0">
                  <FileImage className="w-5 h-5 text-brand-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-brand-success bg-brand-success/10 border border-brand-success/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Verified
                </span>
              </div>
            </div>
          )}

          {/* Action Trigger button */}
          <div className="flex justify-end pt-4 border-t border-slate-50 dark:border-slate-850">
            <Button
              variant="primary"
              onClick={handleUploadSubmit}
              disabled={!file}
              className="px-6"
              icon={TrendingUp}
            >
              Analyze screenshot
            </Button>
          </div>
        </div>
      </Card>
      
      {/* AI Prompts guidelines warning */}
      <div className="bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-850 p-5 rounded-premium text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 select-none">
        <h5 className="font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center">
          <Sparkles className="w-3.5 h-3.5 text-brand-accent mr-1.5" />
          Senior Designer Engine Settings
        </h5>
        Our auditor evaluates contrast ratios against WCAG 2.1 AA benchmarks, typography font-pairings, visual density, spacing grid conformity, and modern structural design elements. Results will highlight high-severity issues and immediate quick wins.
      </div>
    </div>
  );
};
