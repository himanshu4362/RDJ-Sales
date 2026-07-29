import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAppDispatch } from '../../../../store/hooks';
import { setCredentials } from '../../../../store/auth/authSlice';
import { useSignInMutation, useRegisterMutation } from '../../api/account.api';
import { signInSchema, registerSchema, type SignInFormData, type RegisterFormData } from '../../validation/account.schema';
import { ROUTES } from '../../../../app/navigation/routes';
import { Button } from '../../../../common/components/ui/Button';
import { Input } from '../../../../common/components/ui/Input';
import { Label } from '../../../../common/components/ui/Label';
import { FieldError } from '../../../../common/components/ui/FieldError';

// --- SUB-COMPONENT: SIGN IN FORM ---
const SignInForm = ({ onSuccess, onError }: { onSuccess: (res: any) => void, onError: (err: string) => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [signIn, { isLoading }] = useSignInMutation();
  const form = useForm<SignInFormData>({ resolver: zodResolver(signInSchema) });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const res = await signIn(data).unwrap();
      onSuccess(res);
    } catch (err: any) {
      onError(err?.data?.message || 'Invalid phone number or password.');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div>
        <Label>Phone Number</Label>
        <Input type="tel" autoComplete="tel" inputMode="numeric" placeholder="10-digit mobile number" error={!!form.formState.errors.phone} {...form.register('phone')} />
        <FieldError error={form.formState.errors.phone?.message} />
      </div>
      <div>
        <Label>Password</Label>
        <div className="relative">
          <Input type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" error={!!form.formState.errors.password} {...form.register('password')} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-text-muted hover:text-text-primary">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <FieldError error={form.formState.errors.password?.message} />
      </div>
      <Button type="submit" disabled={isLoading} fullWidth className="mt-2 h-12 font-bold">{isLoading ? 'Signing In...' : 'Sign In'}</Button>
    </form>
  );
};

// --- SUB-COMPONENT: REGISTER FORM ---
const RegisterForm = ({ onSuccess, onError, onSwitchToLogin }: { onSuccess: (res: any) => void, onError: (err: string, code?: string) => void, onSwitchToLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();
  const form = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await register(data).unwrap();
      onSuccess(res);
    } catch (err: any) {
      onError(err?.data?.message || 'Registration failed.', err?.data?.code);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Label>Full Name</Label>
        <Input placeholder="e.g. Rahul Kumar" error={!!form.formState.errors.displayName} {...form.register('displayName')} />
        <FieldError error={form.formState.errors.displayName?.message} />
      </div>
      <div>
        <Label>Phone Number</Label>
        <Input type="tel" autoComplete="tel" inputMode="numeric" placeholder="10-digit mobile number" error={!!form.formState.errors.phone} {...form.register('phone')} />
        <FieldError error={form.formState.errors.phone?.message} />
      </div>
      <div>
        <Label>Password</Label>
        <div className="relative">
          <Input type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create password (min 8 chars)" error={!!form.formState.errors.password} {...form.register('password')} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-text-muted hover:text-text-primary">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <FieldError error={form.formState.errors.password?.message} />
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="terms"
          {...form.register('acceptTerms')}
          className="h-4 w-4 rounded border-border-default text-brand-primary focus:ring-brand-primary"
        />
        <Label htmlFor="terms" className="mb-0 text-xs font-medium text-text-secondary cursor-pointer">
          I agree to the Commercial Terms of Service
        </Label>
      </div>
      <FieldError error={form.formState.errors.acceptTerms?.message} />

      <Button type="submit" disabled={isLoading} fullWidth className="mt-2 h-12 font-bold">{isLoading ? 'Creating Account...' : 'Register & Continue'}</Button>
    </form>
  );
};

// --- WORKSPACE SHELL ---
export const SignInRegisterWorkspace: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [serverError, setServerError] = useState<{ message: string, code?: string } | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthSuccess = (res: any) => {
    setServerError(null);
    dispatch(setCredentials({ session: res.session, member: res.member }));

    // Rule #13 & #14: Business Context & Intent Preservation
    const state = location.state as any;
    if (state?.from) {
      navigate(state.from, { replace: true, state: { intent: state.intent } });
    } else {
      navigate(res.member.identity.role === 'admin' ? ROUTES.ADMIN_WORKSPACE : ROUTES.MEMBER_HOME, { replace: true });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-md bg-surface-primary border border-border-default rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-surface-secondary/50 border-b border-border-default p-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary font-black text-surface-primary text-xl mb-3 shadow-sm">RDJ</div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Account Workspace</h1>
        </div>

        <div className="grid grid-cols-2 border-b border-border-default bg-surface-secondary">
          <button onClick={() => { setMode('signin'); setServerError(null); }} className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-colors ${mode === 'signin' ? 'bg-surface-primary text-brand-primary border-b-2 border-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}>Sign In</button>
          <button onClick={() => { setMode('register'); setServerError(null); }} className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-colors ${mode === 'register' ? 'bg-surface-primary text-brand-primary border-b-2 border-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}>Create Account</button>
        </div>

        <div className="p-8">
          {/* Trust UX: reassures the customer before they hand over phone/password */}
          <div className="mb-6 flex items-center justify-center gap-2 text-[10px] font-bold text-success uppercase tracking-widest bg-success/10 py-2 px-3 rounded-md border border-success/20 text-center">
            <ShieldCheck size={14} className="shrink-0" />
            <span>Secure Commercial Workspace. Your data is strictly used for order fulfillment.</span>
          </div>

          {serverError && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg flex flex-col gap-2">
              <span className="text-danger text-xs font-bold">{serverError.message}</span>
              {/* Failure UX Recovery Path */}
              {serverError.code === 'ACCOUNT_EXISTS' && (
                <Button variant="secondary" onClick={() => { setMode('signin'); setServerError(null); }} className="h-8 text-xs w-max mt-1">Switch to Sign In</Button>
              )}
            </div>
          )}
          {mode === 'signin' ? <SignInForm onSuccess={handleAuthSuccess} onError={(msg) => setServerError({ message: msg })} /> : <RegisterForm onSuccess={handleAuthSuccess} onError={(msg, code) => setServerError({ message: msg, code })} onSwitchToLogin={() => setMode('signin')} />}
        </div>
      </div>
    </div>
  );
};