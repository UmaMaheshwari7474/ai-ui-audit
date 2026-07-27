import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  UploadCloud, 
  CheckCircle, 
  Layers, 
  Layout, 
  ShieldCheck, 
  ChevronDown, 
  MessageSquare,
  Star,
  Zap,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Card } from '../components/DesignSystem';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: Layout,
      title: 'Layout & Spacing Audit',
      description: 'Reviews padding, margin offsets, grid columns, and alignment. Enforces strict grid systems like the 8px baseline rule.'
    },
    {
      icon: Sparkles,
      title: 'Typography & Scale',
      description: 'Checks visual weights, line-height proportions, font pairing clarity, and scans for overlapping responsive text issues.'
    },
    {
      icon: Layers,
      title: 'Contrast & Accessibility',
      description: 'Evaluates text-to-background contrast ratios using WCAG AA standards and highlights areas violating visual compliance.'
    },
    {
      icon: ShieldCheck,
      title: 'Modern UI Quality',
      description: 'Provides styling critiques on border-radii harmony, drop-shadow depth, borders, hover states, and glassmorphic overlays.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Upload Screenshot',
      description: 'Drag and drop any dashboard, landing page, mobile wireframe, or portfolio screenshot (PNG/JPG/JPEG up to 10MB).'
    },
    {
      number: '02',
      title: 'AI Audit Processing',
      description: 'Our custom design models act like a Senior Product Designer, evaluating structural nodes, readability, and modern aesthetics.'
    },
    {
      number: '03',
      title: 'Get Design Insights',
      description: 'Receive an overall score, detailed section reports, accessibility reports, and a prioritized list of quick wins and redesign advice.'
    }
  ];

  const testimonials = [
    {
      quote: "AI UI Audit cut down our design review cycles from days to seconds. The critiques are surprisingly deep and match what our Senior staff designer points out.",
      author: "Sarah Chen",
      role: "Lead Frontend Engineer at Vercel Clone",
      avatar: "SC"
    },
    {
      quote: "As a solo developer, I struggle with design consistency. This tool gave me clear, actionable CSS edits (paddings, font sizes) that immediately made my dashboard look premium.",
      author: "Marcus Vance",
      role: "Founder, SaaS-Ignite",
      avatar: "MV"
    },
    {
      quote: "The accessibility contrast scan is a life saver. It caught three critical AA violations on our primary landing page before we launched on Product Hunt.",
      author: "Elena Rostova",
      role: "Product Designer, Linear-flow",
      avatar: "ER"
    }
  ];

  const faqs = [
    {
      question: "Which file formats and sizes are supported?",
      answer: "We support standard PNG, JPG, and JPEG images. The maximum file size limit per upload is 10MB to ensure high-resolution screenshots can be audited without issues."
    },
    {
      question: "How does the AI analyze my user interface?",
      answer: "We feed your uploaded design screenshot to the Gemini 1.5 model along with a carefully tailored, high-context prompt specifying visual hierarchy, spacing, contrast rules, accessibility compliance, and modern SaaS styling aesthetics. The AI returns structured advice detailing exact components to modify."
    },
    {
      question: "Can I use it for mobile applications?",
      answer: "Absolutely! The AI is trained to audit desktop landing pages, complex dashboards, mobile apps, tablet layouts, portfolios, and wireframe mockups. It tailors the feedback to the viewport it detects."
    },
    {
      question: "Is there a limit on how many screenshots I can audit?",
      answer: "During our beta launch, you can audit as many screenshots as you like. We persist your entire audit history so you can reopen reports, delete outdated submissions, or pin your favorite audits."
    }
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300 relative overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[60vh] left-0 w-[400px] h-[400px] bg-brand-accent/5 dark:bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-background-dark/70 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 select-none">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-brand-primary/20">
            UI
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-800 dark:text-white">AI UI Audit</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">AI-POWERED</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Button size="sm" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors">
                Sign In
              </Link>
              <Button size="sm" onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="px-6 pt-20 pb-16 text-center max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-[10px] font-bold tracking-wider text-brand-primary dark:text-brand-accent uppercase mb-6"
        >
          <Sparkles className="w-3 h-3" />
          <span>V1.0 is officially live</span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6"
        >
          Review your designs like a{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
            Senior Product Designer
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Upload screenshots of websites, SaaS products, dashboards, or mobile viewports. 
          Get instant, professional design system critiques, spacing recommendations, and accessibility scores.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}>
            Start Free Audit
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <a href="#features" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors py-2.5">
            Learn how it works
          </a>
        </motion.div>
      </section>

      {/* 3. Hero Visual Mockup */}
      <section className="px-6 max-w-5xl mx-auto mb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 p-2.5 shadow-2xl backdrop-blur-sm"
        >
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-950">
            {/* Mock Dashboard preview */}
            <div className="h-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center px-4 space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <div className="flex-1" />
              <div className="text-[10px] text-slate-400 font-mono">ai-ui-audit.com/report_demo</div>
              <div className="flex-1" />
            </div>
            
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="md:col-span-2 space-y-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-1/4" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4" />
                <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                </div>
              </div>
              <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-slate-850 p-6 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-2xl font-black text-brand-success">8.4</div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-2/3" />
                <div className="h-3 bg-slate-100 dark:bg-slate-900 rounded-full w-4/5" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="px-6 py-20 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-900 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-2">Audit Core</h3>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">What our designer engine audits</h2>
            <p className="text-xs md:text-sm text-slate-500 mt-2">We analyze design elements with a comprehensive checklist to optimize conversion and spacing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Card key={idx} className="p-6 flex items-start space-x-4">
                  <div className="p-3 bg-brand-primary/5 dark:bg-brand-primary/10 text-brand-primary rounded-xl shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1.5">{feat.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="px-6 py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-2">Workflow</h3>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Simple, 3-Step Review Process</h2>
            <p className="text-xs md:text-sm text-slate-500 mt-2">Get professional feedback without the overhead of booking call sessions or paying expensive retainer fees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center px-4">
                <span className="text-6xl font-black text-slate-100 dark:text-slate-850 select-none mb-4">{step.number}</span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2">{step.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="px-6 py-20 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-900 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-2">Beta Feedback</h3>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">What creators are saying</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <Card key={idx} className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-0.5 text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    "{test.quote}"
                  </p>
                </div>
                <div className="flex items-center pt-4 border-t border-slate-50 dark:border-slate-850">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-850 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 mr-3 text-xs">
                    {test.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{test.author}</p>
                    <p className="text-[10px] text-slate-400 truncate">{test.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Pricing Section */}
      <section className="px-6 py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-2">Pricing</h3>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Simple, transparent pricing</h2>
          </div>

          <div className="max-w-md mx-auto">
            <Card glow glowColor="accent" className="p-8 border-2 border-brand-accent/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-accent text-white px-4 py-1 text-[9px] font-bold uppercase tracking-wider rounded-bl-xl">
                Free Beta
              </div>
              <div className="mb-6">
                <h4 className="text-base font-bold text-slate-800 dark:text-white">Beta Access</h4>
                <p className="text-xs text-slate-500 mt-1">Audit interfaces and explore AI-powered suggestions.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs text-slate-500 ml-2 font-medium">/ forever during beta</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 text-left">
                {[
                  'Unlimited screenshot uploads',
                  'Standard Gemini 1.5 analysis',
                  'Category-by-category scoring',
                  'Priority fixes & modernization lists',
                  'Theme switching & persistent history',
                  'Keyboard command palette (Ctrl+K)'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-xs text-slate-600 dark:text-slate-300">
                    <Check className="w-3.5 h-3.5 text-brand-success mr-2.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}>
                Create Free Account
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section className="px-6 py-20 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-900 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-2">FAQ</h3>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <Card key={idx} className="overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="flex items-center justify-between w-full px-6 py-4.5 text-left text-sm font-bold text-slate-800 dark:text-white outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 border-t border-slate-50 dark:border-slate-850 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-900 py-12 px-6 text-center select-none text-slate-500 dark:text-slate-400 relative z-10 bg-white dark:bg-background-dark">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white font-extrabold text-xs">
              UI
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">AI UI Audit</p>
              <p className="text-[9px] text-slate-400 mt-0.5">Professional AI UI/UX Reviews</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-xs font-medium">
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors">Contact</span>
          </div>

          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
            © {new Date().getFullYear()} AI UI Audit Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
