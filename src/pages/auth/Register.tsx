import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserRole } from '@/lib/types/user.types';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['male', 'female'] as const),
  partnerEmail: z.string().email('Invalid partner email').optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function Register() {
  const navigate = useNavigate();
  const [showPartnerField, setShowPartnerField] = useState(false);
  const { linkPartner } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      if (data.role === 'female' && data.partnerEmail) {
        await linkPartner(data.partnerEmail);
      }
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold">Create an account</h2>
        <p className="text-sm text-gray-500">Enter your details to get started</p>
      </div>
      
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                {...register('firstName')}
                className="pl-10"
                placeholder="First name"
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                {...register('lastName')}
                className="pl-10"
                placeholder="Last name"
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Gender</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                {...register('role')}
                value="female"
                onChange={(e) => {
                  register('role').onChange(e);
                  setShowPartnerField(e.target.value === 'female');
                }}
                className="text-pink-500 focus:ring-pink-500"
              />
              <span>Female</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                {...register('role')}
                value="male"
                onChange={(e) => {
                  register('role').onChange(e);
                  setShowPartnerField(false);
                }}
                className="text-pink-500 focus:ring-pink-500"
              />
              <span>Male</span>
            </label>
          </div>
          {errors.role && (
            <p className="text-sm text-red-500">{errors.role.message}</p>
          )}
        </div>

        {showPartnerField && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Partner's Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                {...register('partnerEmail')}
                className="pl-10"
                placeholder="Enter your partner's email"
                type="email"
              />
            </div>
            {errors.partnerEmail && (
              <p className="text-sm text-red-500">{errors.partnerEmail.message}</p>
            )}
          </div>
        )}

        {/* ... rest of the form fields ... */}
        
        <Button 
          className="w-full bg-pink-600 hover:bg-pink-700" 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-pink-600 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}