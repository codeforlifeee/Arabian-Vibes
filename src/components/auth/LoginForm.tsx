// Login Form Component for Drupal OAuth2
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useDrupal';

interface LoginFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function LoginForm({ onSuccess, onCancel }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoggingIn, loginError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    try {
      await login({ username: email, password });
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation
      console.error('Login failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Agent Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={isLoggingIn}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                disabled={isLoggingIn}
              />
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <Alert variant="destructive">
              <AlertDescription>
                {loginError.message || 'Login failed. Please check your credentials.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Buttons */}
          <div className="flex space-x-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoggingIn || !email || !password}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoggingIn}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>

        {/* Info Text */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Login to access agent pricing and exclusive deals.</p>
        </div>
      </CardContent>
    </Card>
  );
}
