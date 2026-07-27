import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, Input, Button, Alert } from '../components/DesignSystem';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google Login popup simulation
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    setTimeout(async () => {
      try {
        await loginWithGoogle('Alex Mercer', 'alex.mercer@gmail.com');
        setGoogleLoading(false);
        navigate('/dashboard');
      } catch (err) {
        setError(err.message || 'Google authentication failed.');
        setGoogleLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 transition-colors">
      
      {/* Background design elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-accent/5 dark:bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Logo Container */}
      <div className="flex items-center space-x-3 mb-8 relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-brand-primary/20">
          UI
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-800 dark:text-white">AI UI Audit</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">SaaS Platform</p>
        </div>
      </div>

      {/* Sign Up Sheet */}
      <Card className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Create Your Account</h2>
          <p className="text-xs text-slate-500 mt-1">Join top product teams auditing UI/UX designs.</p>
        </div>

        {error && (
          <Alert message={error} type="error" className="mb-4" />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            icon={User}
            required
            disabled={loading || googleLoading}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={handleChange}
            icon={Mail}
            required
            disabled={loading || googleLoading}
          />

          <Input
            label="Password (min. 6 chars)"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            icon={Lock}
            required
            disabled={loading || googleLoading}
          />

          <Button 
            type="submit" 
            className="w-full mt-2" 
            loading={loading}
            disabled={googleLoading}
          >
            Create Account
          </Button>
        </form>

        {/* Separator */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">or</span>
          <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
        </div>

        {/* Google SSO trigger button */}
        <Button 
          variant="outline" 
          className="w-full relative" 
          onClick={handleGoogleLogin}
          loading={googleLoading}
          disabled={loading}
        >
          {!googleLoading && (
            <svg className="w-4 h-4 mr-2 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
          )}
          Continue with Google
        </Button>

        <p className="text-center text-xs text-slate-500 mt-6 select-none">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-primary font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
};
