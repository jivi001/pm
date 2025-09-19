import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { authAPI } from '../utils/api';
import { User, LoginRequest, RegisterRequest } from '../types';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface AuthFormProps {
  onLogin: (user: User) => void;
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login form state
  const [loginData, setLoginData] = useState({
    identifier: '', // Either Aadhaar or Company Registration
    password: '',
    loginType: 'candidate' as 'candidate' | 'admin'
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    aadhaar: '',
    companyRegistration: '',
    companyName: '',
    phone: '',
    location: '',
    skills: '',
    password: '',
    confirmPassword: '',
    role: 'candidate' as 'candidate' | 'admin'
  });

  // OTP state
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!otpStep) {
        // First step: verify credentials and send OTP
        const response = await authAPI.initiateLogin({
          identifier: loginData.identifier,
          password: loginData.password,
          loginType: loginData.loginType
        });
        
        if (response.success) {
          setOtpStep(true);
          setOtpSent(true);
          setError('');
        } else {
          setError(t('auth.invalidCredentials'));
        }
      } else {
        // Second step: verify OTP and complete login
        const user = await authAPI.verifyLogin({
          identifier: loginData.identifier,
          password: loginData.password,
          loginType: loginData.loginType,
          otp: otp
        });
        
        if (user) {
          onLogin(user);
        } else {
          setError('Invalid OTP. Please try again.');
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate password confirmation
    if (registerData.password !== registerData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      setIsLoading(false);
      return;
    }

    // Password strength validation
    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const skillsArray = registerData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const userData = {
        name: registerData.name,
        email: registerData.email,
        role: registerData.role,
        skills: skillsArray,
        location: registerData.location,
        phone: registerData.phone,
        password: registerData.password,
        ...(registerData.role === 'candidate' 
          ? { aadhaar: registerData.aadhaar }
          : { 
              companyRegistration: registerData.companyRegistration,
              companyName: registerData.companyName
            }
        )
      };

      const user = await authAPI.register(userData);
      onLogin(user);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>{t('welcome.title')}</CardTitle>
          <CardDescription>{t('welcome.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
              <TabsTrigger value="register">{t('auth.register')}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                {!otpStep ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="loginType">{t('auth.loginAs')}</Label>
                      <Select 
                        value={loginData.loginType} 
                        onValueChange={(value: 'candidate' | 'admin') => 
                          setLoginData({ ...loginData, loginType: value, identifier: '', password: '' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="candidate">{t('auth.candidate')}</SelectItem>
                          <SelectItem value="admin">{t('auth.admin')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="identifier">
                        {loginData.loginType === 'candidate' ? t('auth.aadhaar') : t('auth.companyReg')}
                      </Label>
                      <Input
                        id="identifier"
                        type="text"
                        placeholder={loginData.loginType === 'candidate' ? "1234-5678-9012" : "U12345AB1234PTC123456"}
                        value={loginData.identifier}
                        onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">{t('auth.password')}</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder={t('auth.password')}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('auth.sendOtp')}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center p-4 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground mb-2">
                        {t('auth.otpSent')} {loginData.identifier.slice(-4)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otp">{t('auth.otp')}</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setOtpStep(false);
                          setOtp('');
                          setOtpSent(false);
                        }}
                        className="flex-1"
                      >
                        {t('ui.back')}
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isLoading || otp.length !== 6}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('auth.verifyOtp')}
                      </Button>
                    </div>
                  </>
                )}
              </form>

              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm mb-2">{t('auth.demoCredentials')}</p>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">1234-5678-9012</Badge>
                      <span className="text-xs">{t('auth.password')}: demo123</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t('auth.candidate')} ({t('auth.aadhaar')})</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">U12345AB1234PTC123456</Badge>
                      <span className="text-xs">{t('auth.password')}: admin123</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t('auth.admin')} ({t('auth.companyReg')})</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('auth.demoOtp')}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-role">{t('auth.role')}</Label>
                  <Select 
                    value={registerData.role} 
                    onValueChange={(value: 'candidate' | 'admin') => 
                      setRegisterData({ 
                        ...registerData, 
                        role: value,
                        aadhaar: '',
                        companyRegistration: '',
                        companyName: ''
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candidate">{t('auth.candidate')}</SelectItem>
                      <SelectItem value="admin">{t('auth.admin')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-name">
                    {registerData.role === 'candidate' ? t('auth.name') : t('auth.companyName')}
                  </Label>
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder={registerData.role === 'candidate' ? "John Doe" : "TechCorp Solutions Pvt Ltd"}
                    value={registerData.role === 'candidate' ? registerData.name : registerData.companyName}
                    onChange={(e) => setRegisterData({ 
                      ...registerData, 
                      [registerData.role === 'candidate' ? 'name' : 'companyName']: e.target.value 
                    })}
                    required
                  />
                </div>

                {registerData.role === 'admin' && (
                  <div className="space-y-2">
                    <Label htmlFor="reg-contact-name">{t('auth.contactPerson')}</Label>
                    <Input
                      id="reg-contact-name"
                      type="text"
                      placeholder={t('auth.hrManager')}
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reg-email">{t('auth.email')}</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder={registerData.role === 'candidate' ? "john@example.com" : "hr@techcorp.com"}
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>

                {registerData.role === 'candidate' ? (
                  <div className="space-y-2">
                    <Label htmlFor="reg-aadhaar">{t('auth.aadhaar')}</Label>
                    <Input
                      id="reg-aadhaar"
                      type="text"
                      placeholder="1234-5678-9012"
                      value={registerData.aadhaar}
                      onChange={(e) => setRegisterData({ ...registerData, aadhaar: e.target.value })}
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="reg-company-reg">{t('auth.companyReg')}</Label>
                    <Input
                      id="reg-company-reg"
                      type="text"
                      placeholder="U12345AB1234PTC123456 (CIN Number)"
                      value={registerData.companyRegistration}
                      onChange={(e) => setRegisterData({ ...registerData, companyRegistration: e.target.value })}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reg-phone">{t('auth.phone')}</Label>
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-location">{t('auth.location')}</Label>
                  <Input
                    id="reg-location"
                    type="text"
                    placeholder={registerData.role === 'candidate' ? "Mumbai, Maharashtra" : "Bengaluru, Karnataka"}
                    value={registerData.location}
                    onChange={(e) => setRegisterData({ ...registerData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-skills">
                    {registerData.role === 'candidate' ? t('auth.skills') : 'Sectors/Technologies (comma separated)'}
                  </Label>
                  <Input
                    id="reg-skills"
                    type="text"
                    placeholder={registerData.role === 'candidate' ? "React, Python, SQL" : t('auth.sectorsPlaceholder')}
                    value={registerData.skills}
                    onChange={(e) => setRegisterData({ ...registerData, skills: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password">{t('auth.password')}</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder={t('auth.minimumChars')}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-confirm-password">{t('auth.confirmPassword')}</Label>
                  <Input
                    id="reg-confirm-password"
                    type="password"
                    placeholder={t('auth.reenterPassword')}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('auth.register')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}