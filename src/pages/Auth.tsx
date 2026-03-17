import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Mail, Lock, User } from 'lucide-react';
import { z } from 'zod';

export default function Auth() {
  const navigate = useNavigate();
  const { user, signIn, signUp, isLoading } = useAuth();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState({ email: '', password: '' });

  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupErrors, setSignupErrors] = useState({ email: '', password: '', name: '' });

  const emailSchema = z.string().email(t('auth.invalidEmail'));
  const passwordSchema = z.string().min(6, t('auth.passwordMin'));
  const nameSchema = z.string().min(2, t('auth.nameMin'));

  useEffect(() => {
    if (user && !isLoading) navigate('/');
  }, [user, isLoading, navigate]);

  const validateLoginForm = () => {
    const errors = { email: '', password: '' };
    let isValid = true;
    try { emailSchema.parse(loginEmail); } catch (e: any) { errors.email = e.errors[0].message; isValid = false; }
    try { passwordSchema.parse(loginPassword); } catch (e: any) { errors.password = e.errors[0].message; isValid = false; }
    setLoginErrors(errors);
    return isValid;
  };

  const validateSignupForm = () => {
    const errors = { email: '', password: '', name: '' };
    let isValid = true;
    try { emailSchema.parse(signupEmail); } catch (e: any) { errors.email = e.errors[0].message; isValid = false; }
    try { passwordSchema.parse(signupPassword); } catch (e: any) { errors.password = e.errors[0].message; isValid = false; }
    try { nameSchema.parse(signupName); } catch (e: any) { errors.name = e.errors[0].message; isValid = false; }
    setSignupErrors(errors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    setIsProcessing(true);
    const { error } = await signIn(loginEmail, loginPassword);
    if (!error) navigate('/');
    setIsProcessing(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignupForm()) return;
    setIsProcessing(true);
    const { error } = await signUp(signupEmail, signupPassword, signupName);
    if (!error) { setSignupEmail(''); setSignupPassword(''); setSignupName(''); }
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Shield className="w-12 h-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t('auth.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{t('auth.title')}</CardTitle>
          <CardDescription>{t('auth.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t('auth.loginTab')}</TabsTrigger>
              <TabsTrigger value="signup">{t('auth.signupTab')}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="pr-10" placeholder="email@example.com" />
                  </div>
                  {loginErrors.email && <p className="text-sm text-destructive">{loginErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="login-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="pr-10" placeholder="••••••••" />
                  </div>
                  {loginErrors.password && <p className="text-sm text-destructive">{loginErrors.password}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {isProcessing ? t('auth.loggingIn') : t('auth.loginButton')}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">{t('auth.fullName')}</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="signup-name" value={signupName} onChange={(e) => setSignupName(e.target.value)} className="pr-10" placeholder={t('auth.namePlaceholder')} />
                  </div>
                  {signupErrors.name && <p className="text-sm text-destructive">{signupErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="signup-email" type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className="pr-10" placeholder="email@example.com" />
                  </div>
                  {signupErrors.email && <p className="text-sm text-destructive">{signupErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="signup-password" type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} className="pr-10" placeholder={t('auth.passwordPlaceholder')} />
                  </div>
                  {signupErrors.password && <p className="text-sm text-destructive">{signupErrors.password}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {isProcessing ? t('auth.signingUp') : t('auth.signupButton')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
