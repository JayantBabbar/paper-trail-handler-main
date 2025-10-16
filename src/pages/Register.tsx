import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api, { setToken } from '@/lib/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await api.register({ email, password });
      if (data.access) {
        setToken(data.access);
        localStorage.setItem('isAuthenticated', 'true');
        toast.success('Registration successful', { duration: 8000 });
        navigate('/');
      } else {
        toast.error('Registration succeeded but no token returned', { duration: 8000 });
      }
    } catch (e: any) {
      toast.error(e.message || 'Registration failed', { duration: 8000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F0FB] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg animate-fadeIn">
        <h1 className="text-2xl font-semibold text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Registering...' : 'Register'}</Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[#ea384c] hover:text-[#d42d3d] font-medium underline transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
