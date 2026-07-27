import React, { useState } from 'react';
import { Loader2, AlertCircle, CheckCircle2, Info, ChevronDown } from 'lucide-react';

// ==========================================
// 1. BUTTON COMPONENT
// ==========================================
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  icon: Icon
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-premium transition-all duration-200 active:scale-[0.98] disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed select-none';
  
  const variants = {
    primary: 'bg-brand-primary text-slate-950 hover:bg-[#b08c4a] shadow-sm focus:ring-2 focus:ring-brand-primary/20 focus:ring-offset-2',
    secondary: 'bg-brand-accent text-slate-950 hover:bg-[#c39446] shadow-sm focus:ring-2 focus:ring-brand-accent/20 focus:ring-offset-2',
    outline: 'border border-slate-200 dark:border-slate-800 bg-card-light dark:bg-card-dark text-slate-700 dark:text-slate-200 hover:bg-slate-50/60 dark:hover:bg-slate-800 focus:ring-2 focus:ring-brand-primary/20',
    danger: 'bg-brand-error text-white hover:bg-red-750 shadow-sm focus:ring-2 focus:ring-red-500/20',
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

// ==========================================
// 2. CARD COMPONENT
// ==========================================
export const Card = ({
  children,
  onClick,
  hoverable = false,
  className = '',
  glow = false,
  glowColor = 'primary'
}) => {
  const glowStyles = glow 
    ? (glowColor === 'accent' ? 'glow-accent' : 'glow-primary') 
    : '';

  return (
    <div
      onClick={onClick}
      className={`
        bg-card-light dark:bg-card-dark 
        border border-slate-200/50 dark:border-slate-900/60
        rounded-premium shadow-premium
        transition-all duration-300
        ${hoverable ? 'hover:shadow-premium-hover hover:-translate-y-0.5 cursor-pointer' : ''}
        ${glowStyles}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// ==========================================
// 3. INPUT COMPONENT
// ==========================================
export const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  disabled = false,
  icon: Icon
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 select-none">
          {label} {required && <span className="text-brand-error">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-premium text-sm
            bg-slate-50 dark:bg-slate-900/50 
            text-slate-800 dark:text-slate-100
            border border-slate-200 dark:border-slate-800
            focus:border-brand-primary dark:focus:border-brand-primary
            focus:ring-2 focus:ring-brand-primary/10
            outline-none transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : 'pl-4'}
            ${error ? 'border-brand-error focus:ring-brand-error/10 focus:border-brand-error' : ''}
            py-2.5
          `}
        />
      </div>
      {error && (
        <p className="text-xs text-brand-error font-medium">{error}</p>
      )}
    </div>
  );
};

// ==========================================
// 4. DROPDOWN COMPONENT
// ==========================================
export const Dropdown = ({
  options,
  selected,
  onChange,
  label,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === selected);

  return (
    <div className={`relative flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-premium text-sm focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all"
        >
          <span>{selectedOption ? selectedOption.label : 'Select option'}</span>
          <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 w-full mt-2 z-20 bg-white dark:bg-card-dark border border-slate-100 dark:border-slate-800 rounded-premium shadow-lg overflow-hidden py-1 animate-fadeIn">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selected === opt.value ? 'bg-slate-100 dark:bg-slate-800 font-medium text-brand-primary' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. BADGE COMPONENT
// ==========================================
export const Badge = ({
  children,
  variant = 'info',
  className = ''
}) => {
  const styles = {
    success: 'bg-emerald-50 dark:bg-emerald-500/10 text-brand-success border-emerald-100 dark:border-emerald-500/20',
    warning: 'bg-amber-50 dark:bg-amber-500/10 text-brand-warning border-amber-100 dark:border-amber-500/20',
    error: 'bg-rose-50 dark:bg-rose-500/10 text-brand-error border-rose-100 dark:border-rose-500/20',
    info: 'bg-amber-50/40 dark:bg-brand-primary/10 text-brand-primary border-amber-150/40 dark:border-brand-primary/20',
    purple: 'bg-orange-50/40 dark:bg-brand-accent/10 text-brand-accent border-orange-150/40 dark:border-brand-accent/20',
    neutral: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ==========================================
// 6. ALERT COMPONENT
// ==========================================
export const Alert = ({
  message,
  type = 'info',
  onClose,
  className = ''
}) => {
  const config = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
      text: 'text-emerald-800 dark:text-emerald-300',
      icon: CheckCircle2,
      color: 'text-brand-success'
    },
    error: {
      bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20',
      text: 'text-rose-800 dark:text-rose-300',
      icon: AlertCircle,
      color: 'text-brand-error'
    },
    info: {
      bg: 'bg-amber-50/55 dark:bg-brand-primary/10 border-amber-200/50 dark:border-brand-primary/20',
      text: 'text-amber-900 dark:text-amber-200',
      icon: Info,
      color: 'text-brand-primary'
    }
  };

  const current = config[type] || config.info;
  const Icon = current.icon;

  return (
    <div className={`flex items-start p-4 rounded-premium border ${current.bg} ${current.text} ${className}`}>
      <Icon className={`w-5 h-5 mr-3 shrink-0 ${current.color}`} />
      <div className="flex-1 text-sm font-medium">{message}</div>
      {onClose && (
        <button onClick={onClose} className="ml-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          &times;
        </button>
      )}
    </div>
  );
};

// ==========================================
// 7. PROGRESS BAR COMPONENT
// ==========================================
export const ProgressBar = ({
  value,
  max = 100,
  variant = 'primary',
  className = '',
  showLabel = false
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    primary: 'bg-brand-primary',
    accent: 'bg-brand-accent',
    success: 'bg-brand-success',
    warning: 'bg-brand-warning',
    error: 'bg-brand-error'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colors[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ==========================================
// 8. SKELETON COMPONENT
// ==========================================
export const Skeleton = ({
  variant = 'text',
  className = ''
}) => {
  const styles = {
    text: 'h-4 w-3/4 rounded-full',
    title: 'h-6 w-1/2 rounded-full',
    circle: 'h-12 w-12 rounded-full',
    rect: 'h-32 w-full rounded-premium'
  };

  return (
    <div className={`bg-slate-200 dark:bg-slate-800 animate-pulse ${styles[variant]} ${className}`} />
  );
};

// ==========================================
// 9. CIRCULAR PROGRESS COMPONENT
// ==========================================
export const CircularProgress = ({
  score = 0,
  max = 10,
  size = 120,
  strokeWidth = 10,
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = score / max;
  const strokeDashoffset = circumference * (1 - progress);

  // Score coloring logic
  const getScoreColors = (val) => {
    if (val >= 8.5) return { stroke: 'stroke-brand-success', text: 'text-brand-success', bg: 'bg-emerald-500/10' };
    if (val >= 6.5) return { stroke: 'stroke-brand-warning', text: 'text-brand-warning', bg: 'bg-amber-500/10' };
    return { stroke: 'stroke-brand-error', text: 'text-brand-error', bg: 'bg-rose-500/10' };
  };

  const colors = getScoreColors(score);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Track circle */}
        <circle
          className="stroke-slate-100 dark:stroke-slate-800"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className={`${colors.stroke} transition-all duration-1000 ease-out`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Inner score label */}
      <div className={`absolute flex flex-col items-center justify-center w-[82%] h-[82%] rounded-full ${colors.bg}`}>
        <span className={`text-3xl font-extrabold ${colors.text}`}>{score}</span>
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
};

// ==========================================
// 10. EMPTY STATE COMPONENT
// ==========================================
export const EmptyState = ({
  title,
  description,
  actionText,
  onAction,
  icon: Icon,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-slate-850 rounded-premium bg-card-light/50 dark:bg-card-dark/50 ${className}`}>
      {Icon && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-400 dark:text-slate-500 mb-4 ring-8 ring-slate-100/50 dark:ring-slate-950/20">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
