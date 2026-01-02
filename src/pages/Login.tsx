import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link2, Loader2, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await login(email, password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-sidebar p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Link2 className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">
            AffiliateCRM
          </span>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-sidebar-foreground">
            Manage your affiliate
            <br />
            network with ease
          </h1>
          <p className="text-lg text-sidebar-foreground/70 max-w-md">
            Streamline your operations, track performance, and grow your business with our powerful CRM platform.
          </p>
        </div>

        <div className="text-sm text-sidebar-foreground/50">
          © 2024 AffiliateCRM. All rights reserved.
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Link2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              AffiliateCRM
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-medium text-foreground mb-2">Demo Credentials</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Admin:</span>{' '}
                admin@crm.com / admin123
              </p>
              <p>
                <span className="font-medium text-foreground">Agent:</span>{' '}
                agent@crm.com / agent123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
