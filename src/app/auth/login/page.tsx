'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const { currentTheme } = useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('/onboarding');
  const [mounted, setMounted] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // Handle search params safely after mounting
  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get('from');
    const registeredParam = params.get('registered');
    
    if (fromParam) {
      setCallbackUrl(fromParam);
    }
    if (registeredParam === 'true') {
      setRegistrationSuccess(true);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && mounted) {
      console.log('User already authenticated, redirecting to:', callbackUrl);
      // Use window.location.href for more reliable redirect
      setTimeout(() => {
        window.location.href = callbackUrl;
      }, 100);
    }
  }, [status, callbackUrl, mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Starting login process...', { email: formData.email, callbackUrl });

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      console.log('Login result:', result);

      if (result?.ok) {
        console.log('Login successful, redirecting to:', callbackUrl);
        // Force a hard refresh to ensure session is recognized
        window.location.href = callbackUrl;
      } else {
        console.error('Login failed:', result?.error);
        setError(result?.error || 'Login failed. Please check your credentials.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Show loading while checking authentication status
  if (status === 'loading') {
    return <Loading fullScreen text="Checking authentication..." variant="ring" size="lg" />;
  }

  // Don't show login form if already authenticated
  if (status === 'authenticated') {
    return null;
  }

  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: currentTheme.gradients.background }}
    >
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float"
          style={{ backgroundColor: `${currentTheme.colors.primary}20` }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float"
          style={{ 
            backgroundColor: `${currentTheme.colors.secondary}20`,
            animationDelay: '1s'
          }}
        ></div>
        <div className="cyber-grid absolute inset-0 opacity-30"></div>
      </div>
      
      {/* Header Section */}
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles 
              className="w-8 h-8 animate-pulse-glow"
              style={{ color: currentTheme.colors.accent }}
            />
            <h1 className="text-4xl font-bold gradient-text">DigitalWorkForce</h1>
            <Sparkles 
              className="w-8 h-8 animate-pulse-glow"
              style={{ color: currentTheme.colors.accent }}
            />
          </div>
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ color: currentTheme.colors.text }}
          >
            Welcome Back! 👋
          </h2>
          <p 
            className="text-base leading-relaxed"
            style={{ color: currentTheme.colors.textMuted }}
          >
            Sign in to access your dashboard and continue your journey
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative animate-scale-in animation-delay-200">
        <div className="glass-card-highlight p-8 shadow-2xl">
          {/* Success Message */}
          {registrationSuccess && (
            <div 
              className="mb-6 p-4 rounded-xl border animate-bounce-in"
              style={{
                backgroundColor: `${currentTheme.colors.success}20`,
                borderColor: `${currentTheme.colors.success}60`,
                color: currentTheme.colors.success
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🎉</span>
                <span className="font-semibold">Registration successful! Please sign in.</span>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div 
              className="mb-6 p-4 rounded-xl border animate-bounce-in"
              style={{
                backgroundColor: `${currentTheme.colors.error}20`,
                borderColor: `${currentTheme.colors.error}60`,
                color: currentTheme.colors.error
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="animate-slide-in-left animation-delay-400">
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold mb-2"
                style={{ color: currentTheme.colors.text }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                  style={{ color: currentTheme.colors.textMuted }}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="glass-input w-full pl-12 pr-4 py-4"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="animate-slide-in-left animation-delay-600">
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold mb-2"
                style={{ color: currentTheme.colors.text }}
              >
                Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                  style={{ color: currentTheme.colors.textMuted }}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="glass-input w-full pl-12 pr-12 py-4"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover-glow transition-all duration-200"
                  style={{ color: currentTheme.colors.textMuted }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 animate-bounce-in">
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                loading={loading}
                glow
                className="w-full"
                icon={!loading ? <LogIn className="w-5 h-5" /> : undefined}
              >
                Sign In to Dashboard
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center animate-fade-in-up animation-delay-600">
            <div className="flex items-center justify-center gap-2">
              <span 
                className="text-sm"
                style={{ color: currentTheme.colors.textMuted }}
              >
                New to DigitalWorkForce?
              </span>
              <Link
                href="/auth/register"
                className="font-semibold text-sm hover:underline transition-all duration-200 hover-glow"
                style={{ color: currentTheme.colors.accent }}
              >
                Create Account →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
