import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { apiClient } from '../lib/api/client';
import { API_URLS, ROUTES } from '../lib/constants';
import { toast } from 'sonner';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetForm = z.infer<typeof schema>;

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ResetForm) => {
    setLoading(true);
    try {
      await apiClient.post(API_URLS.AUTH.RESET_PASSWORD, {
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success('Password reset successfully');
      navigate(ROUTES.LOGIN);
    } catch {
      toast.error('Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Invalid Reset Link</h2>
          <p className="text-sm text-slate-400">This password reset link is invalid or has expired.</p>
          <Link to={ROUTES.LOGIN}>
            <Button variant="primary" size="sm">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white">Reset Password</h2>
        <p className="mt-1 text-sm text-slate-400">Enter your new password below.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <Input
            label="New Password"
            type={showPw ? 'text' : 'password'}
            placeholder="Enter new password"
            error={errors.password?.message}
            required
            rightIcon={
              <button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-slate-200" tabIndex={-1}>
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...register('password')}
          />

          <Input
            label="Confirm Password"
            type={showPw ? 'text' : 'password'}
            placeholder="Confirm new password"
            error={errors.confirmPassword?.message}
            required
            {...register('confirmPassword')}
          />

          <Button type="submit" loading={loading} className="w-full">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};
