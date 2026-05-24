import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, Save, Eye, EyeOff, Shield, Calendar } from 'lucide-react';
import { profileService } from '../services/profileService';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const profileSchema = z.object({ name: z.string().min(2, 'Name too short').max(50) });
const pwSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });

type ProfileForm = z.infer<typeof profileSchema>;
type PwForm = z.infer<typeof pwSchema>;

export const Profile: React.FC = () => {
  const [showPw, setShowPw] = useState(false);
  const { user, setUser } = useAuth();
  const qc = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
  });

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: profileErrors, isDirty: profileDirty } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: { name: profile?.name || '' },
  });

  const { register: regPw, handleSubmit: handlePw, reset: resetPw, formState: { errors: pwErrors } } = useForm<PwForm>({
    resolver: zodResolver(pwSchema),
  });

  const updateMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (updated) => {
      setUser(updated);
      qc.setQueryData(['profile'], updated);
      toast.success('Profile updated!');
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const pwMutation = useMutation({
    mutationFn: profileService.changePassword,
    onSuccess: () => { toast.success('Password changed!'); resetPw(); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to change password'),
  });

  const initials = profile?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  if (isLoading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-400 mt-0.5">Manage your account settings</p>
      </div>

      {/* Avatar + Info */}
      <Card>
        <CardBody className="pt-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile?.name}</h2>
              <p className="text-gray-400 flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5" />{profile?.email}
              </p>
              <p className="text-gray-400 flex items-center gap-1.5 mt-1 text-sm">
                <Calendar className="w-3.5 h-3.5" />
                Member since {profile?.createdAt ? format(new Date(profile.createdAt), 'MMMM yyyy') : '—'}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Edit Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Personal Information</h3>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleProfile(async (d) => updateMutation.mutateAsync(d))} className="space-y-4">
            <Input label="Full Name" {...regProfile('name')} error={profileErrors.name?.message} leftIcon={<User className="w-4 h-4" />} />
            <Input label="Email" value={profile?.email || ''} disabled leftIcon={<Mail className="w-4 h-4" />} hint="Email cannot be changed" />
            <Button type="submit" leftIcon={<Save className="w-4 h-4" />} isLoading={updateMutation.isPending} disabled={!profileDirty}>
              Save Changes
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Change Password</h3>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handlePw(async (d) => pwMutation.mutateAsync({ currentPassword: d.currentPassword, newPassword: d.newPassword }))} className="space-y-4">
            <Input label="Current Password" type={showPw ? 'text' : 'password'}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={<button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
              {...regPw('currentPassword')} error={pwErrors.currentPassword?.message} />
            <Input label="New Password" type={showPw ? 'text' : 'password'}
              leftIcon={<Lock className="w-4 h-4" />} {...regPw('newPassword')} error={pwErrors.newPassword?.message} />
            <Input label="Confirm Password" type={showPw ? 'text' : 'password'}
              leftIcon={<Lock className="w-4 h-4" />} {...regPw('confirmPassword')} error={pwErrors.confirmPassword?.message} />
            <Button type="submit" variant="outline" leftIcon={<Lock className="w-4 h-4" />} isLoading={pwMutation.isPending}>
              Update Password
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
