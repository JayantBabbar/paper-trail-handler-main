import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api, { setToken } from "@/lib/api";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_URL || 'http://localhost:8000'}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      if (!resp.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await resp.json();
  const access = data.access;
  const refresh = data.refresh;
  if (!access) throw new Error('No access token returned');

  setToken(access);
  if (refresh) localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('isAuthenticated', 'true');
      toast.success('Login successful!', { duration: 8000 });
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Login failed', { duration: 8000 });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F1F0FB] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg animate-fadeIn">
        <div className="text-center space-y-6">
          <img
            src="/FITT_Grey_logo_png (2).png"
            alt="FITT Logo"
            className="h-16 mx-auto"
          />
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-[#222222]">
              Foundation For Innovation And Technology Transfer
            </h1>
            <h2 className="text-xl font-medium text-[#ea384c]">
              Welcome to DAK-SYSTEM
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="text-left space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#222222] mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={errors.email ? "border-[#ea384c]" : ""}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-[#ea384c]">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#222222] mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={errors.password ? "border-[#ea384c]" : ""}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-[#ea384c]">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#ea384c] hover:bg-[#d42d3d] text-white transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              New User?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-[#ea384c] hover:text-[#d42d3d] font-medium underline transition-colors"
              >
                Register Now
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}