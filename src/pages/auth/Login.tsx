import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Fingerprint } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold">Welcome back</h2>
        <p className="text-sm text-gray-500">Enter your credentials to access your account</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              {...register('email')}
              className="pl-10"
              placeholder="Enter your email"
              type="email"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              {...register('password')}
              className="pl-10"
              placeholder="Enter your password"
              type="password"
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              className="rounded border-gray-200 focus:ring-pink-500"
              id="remember"
              type="checkbox"
            />
            <label className="text-sm text-gray-500" htmlFor="remember">
              Remember me
            </label>
          </div>
          <Button variant="link" className="text-sm text-pink-600">
            Forgot password?
          </Button>
        </div>
        <Button 
          className="w-full bg-pink-600 hover:bg-pink-700" 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
        <Button
          variant="outline"
          className="w-full border-pink-100 text-pink-600 hover:bg-pink-50"
          type="button"
        >
          <Fingerprint className="mr-2 h-4 w-4" />
          Sign in with Biometrics
        </Button>
      </form>
      <div className="text-center text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="text-pink-600 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}