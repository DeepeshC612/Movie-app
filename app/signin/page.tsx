'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/lib/toast-context';
import { useState } from 'react';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignIn() {
  const { showToast } = useToast();
  const [rememberMe, setRememberMe] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema)
  });

  const onSubmit = async (data: SignInForm) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.status) {
        localStorage.setItem('token', result.result.token);
        localStorage.setItem('user', JSON.stringify(result.result.user));
        document.cookie = `token=${result.result.token}; path=/; max-age=604800`;
        showToast(result.message, 'success');
        setTimeout(() => {
          window.location.href = '/movies';
        }, 1000);
      } else {
        showToast(result.message || 'Login failed', 'error');
      }
    } catch (error) {
      showToast('Login failed', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Form container */}
      <div className="w-full max-w-sm px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-stretch">
          
          <h1 className="text-white text-center mb-16 text-5xl sm:text-6xl font-semibold"
              style={{
                fontFamily: 'Montserrat',
                fontWeight: 600,
                fontSize: '48px',
                lineHeight: '56px',
                letterSpacing: '0%'
              }}>
            Sign in
          </h1>

          {/* Email Input */}
          <div className="mb-5">
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full h-12 px-4 text-white placeholder-white/50 border border-white/10 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2BD17E]/30 text-base font-normal leading-6"
              style={{ 
                backgroundColor: '#224957'
              }}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              className="w-full h-12 px-4 text-white placeholder-white/50 border border-white/10 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2BD17E]/30 text-base font-normal leading-6"
              style={{ 
                backgroundColor: '#224957'
              }}
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Remember me checkbox - Using Body Small style (14px/24px/0%) */}
          <div className="flex items-center mb-8">
            <div
              onClick={() => setRememberMe(!rememberMe)}
              className="w-5 h-5 rounded border-2 border-white/30 cursor-pointer flex items-center justify-center transition-all"
              style={{ backgroundColor: '#224957' }}
            >
              {rememberMe && (
                <svg className="w-3 h-3 text-[#2BD17E]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <label onClick={() => setRememberMe(!rememberMe)} className="ml-2 text-sm font-normal text-white/80 leading-6 cursor-pointer">
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 font-semibold text-white rounded-xl transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform active:translate-y-0 text-base leading-6 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{ 
              backgroundColor: '#2BD17E',
              boxShadow: '0 4px 12px rgba(43, 209, 126, 0.3)'
            }}
          >
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>

          {/* Register Link */}
          <div className="text-center mt-6">
            <span className="text-white/60 text-sm">Don't have an account? </span>
            <a href="/register" className="text-[#2BD17E] text-sm font-medium hover:underline">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
