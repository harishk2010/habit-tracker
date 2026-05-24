import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });

type FormData = z.infer<typeof schema>;

export const Register: React.FC = () => {
  const [showPw, setShowPw] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Account created! Welcome to HabitForge 🎉');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">HabitForge</h1>
          <p className="text-gray-500 mt-1">Build better habits, one day at a time</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create account</h2>
          <p className="text-gray-400 text-sm mb-8">Start building your habit streak today</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" leftIcon={<User className="w-4 h-4" />} {...register('name')} error={errors.name?.message} />
            <Input label="Email" type="email" placeholder="you@example.com" leftIcon={<Mail className="w-4 h-4" />} {...register('email')} error={errors.email?.message} />
            <Input label="Password" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={<button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
              {...register('password')} error={errors.password?.message} />
            <Input label="Confirm Password" type={showPw ? 'text' : 'password'} placeholder="Repeat password"
              leftIcon={<Lock className="w-4 h-4" />}
              {...register('confirmPassword')} error={errors.confirmPassword?.message} />
            <Button type="submit" fullWidth isLoading={isSubmitting} size="lg" className="mt-2">Create Account</Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
