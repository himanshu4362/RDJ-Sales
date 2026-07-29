import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../../../store/hooks';
import { setCredentials } from '../../../../store/auth/authSlice';
import { useLoginMutation } from '../../api/account.api';
import { ROUTES } from '../../../../app/navigation/routes';
import { Button } from '../../../../common/components/ui/Button';
import { Input } from '../../../../common/components/ui/Input';
import { Label } from '../../../../common/components/ui/Label';

export const SignInPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) setStep('OTP');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ phone, otp }).unwrap();
      dispatch(setCredentials({ session: response.session, member: response.member }));
      
      // Navigate to intended destination or role-based home
      const from = (location.state as any)?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(response.member.role === 'admin' ? ROUTES.ADMIN_WORKSPACE : ROUTES.MEMBER_HOME, { replace: true });
      }
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">
      <div className="w-full max-w-md bg-surface-primary border border-border-default rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary font-black text-surface-primary text-xl mb-4 shadow-sm">
            RDJ
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Welcome Back</h1>
          <p className="text-sm text-text-secondary mt-1">Sign in to manage your equipment and orders.</p>
        </div>

        <form onSubmit={step === 'PHONE' ? handlePhoneSubmit : handleLogin} className="flex flex-col gap-5">
          {step === 'PHONE' ? (
            <div>
              <Label>Phone Number</Label>
              <Input type="tel" placeholder="e.g. 9999999999 (Admin Mock)" value={phone} onChange={e => setPhone(e.target.value)} autoFocus />
              <p className="text-xs text-text-muted mt-2">Use 9999999999 for Admin, anything else for Customer.</p>
            </div>
          ) : (
            <div>
              <Label>One-Time Password</Label>
              <Input type="text" placeholder="Enter any code to mock" value={otp} onChange={e => setOtp(e.target.value)} autoFocus />
            </div>
          )}
          
          <Button type="submit" disabled={isLoading} fullWidth className="mt-2 h-14 text-lg">
            {isLoading ? 'Verifying...' : step === 'PHONE' ? 'Send OTP' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};