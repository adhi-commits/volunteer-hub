import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { validateEmail } from '../utils/validation';

interface LoginErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();
  const [role, setRole] = useState<'volunteer' | 'organizer'>('volunteer');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: LoginErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!validateEmail(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email';
    }

    if (!form.password.trim()) {
      nextErrors.password = 'Password is required';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      sessionStorage.setItem('userRole', role);
      showToast('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        if (role === 'organizer') {
          navigate('/organizer-dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    }
  };

  return (
    <Layout>
      <Toast toast={toast} />
      <section className="pt-28 pb-16 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                  <span className="material-icons text-teal-600 text-3xl">lock</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Login to continue your journey</p>
              </div>

              {/* Role Selection Tabs */}
              <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
                <button
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${role === 'volunteer' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setRole('volunteer')}
                >
                  Volunteer
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${role === 'organizer' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setRole('organizer')}
                >
                  Organizer
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <span className="material-icons absolute left-3 top-3 text-gray-400 text-sm">email</span>
                    <input
                      type="email"
                      id="loginEmail"
                      name="email"
                      className="input-field pl-10"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <span className="material-icons absolute left-3 top-3 text-gray-400 text-sm">lock</span>
                    <input
                      type="password"
                      id="loginPassword"
                      name="password"
                      className="input-field pl-10"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      <span className="material-icons text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                    <span className="ml-2 text-sm text-gray-700">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                    Forgot Password?
                  </a>
                </div>

                <button type="submit" className="btn-primary w-full justify-center">
                  Login as {role === 'volunteer' ? 'Volunteer' : 'Organizer'}
                  <span className="material-icons ml-2 text-sm">arrow_forward</span>
                </button>



                <p className="text-center text-sm text-gray-600 mt-6">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-teal-600 hover:text-teal-700 font-semibold">
                    Sign Up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
