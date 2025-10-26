'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/lib/toast-context';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { showToast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password })
      });
      
      const result = await response.json();
      
      if (result.status) {
        showToast(result.message, 'success');
        setTimeout(() => {
          window.location.href = '/signin';
        }, 1500);
      } else {
        showToast(result.message || 'Registration failed', 'error');
      }
    } catch (error) {
      showToast('Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" 
         >
      

      {/* Form container */}
      <div className="relative z-20 w-full max-w-sm px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-stretch">
          
          {/* Heading */}
          <h1 className="text-white text-center mb-12 text-5xl sm:text-6xl font-semibold"
              style={{
                fontFamily: 'Montserrat',
                fontWeight: 600,
                fontSize: '48px',
                lineHeight: '56px',
                letterSpacing: '0%'
              }}>
            Sign up
          </h1>

          {/* Name Input */}
          <div className="mb-5">
            <input
              {...register('name')}
              type="text"
              placeholder="Name"
              className="w-full h-12 px-4 text-white placeholder-white/50 border border-white/10 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2BD17E]/30 text-base font-normal leading-6"
              style={{ backgroundColor: '#224957' }}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email Input */}
          <div className="mb-5">
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full h-12 px-4 text-white placeholder-white/50 border border-white/10 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2BD17E]/30 text-base font-normal leading-6"
              style={{ backgroundColor: '#224957' }}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div className="mb-5">
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              className="w-full h-12 px-4 text-white placeholder-white/50 border border-white/10 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2BD17E]/30 text-base font-normal leading-6"
              style={{ backgroundColor: '#224957' }}
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Input */}
          <div className="mb-8">
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="Confirm Password"
              className="w-full h-12 px-4 text-white placeholder-white/50 border border-white/10 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2BD17E]/30 text-base font-normal leading-6"
              style={{ backgroundColor: '#224957' }}
            />
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 font-semibold text-white rounded-xl transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform active:translate-y-0 text-base leading-6 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{ 
              backgroundColor: '#2BD17E',
              boxShadow: '0 4px 12px rgba(43, 209, 126, 0.3)'
            }}
          >
            {isSubmitting ? 'Signing up...' : 'Sign up'}
          </button>

          {/* Already have account link */}
          <div className="text-center mt-6">
            <span className="text-white/60 text-sm">Already have an account? </span>
            <a href="/signin" className="text-[#2BD17E] text-sm font-medium hover:underline">
              Sign in
            </a>
          </div>
        </form>
    </div>
    </div>
  );
}
