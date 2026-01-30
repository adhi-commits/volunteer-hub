import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { validateEmail, validatePassword, validatePhone } from '../utils/validation';

type Role = 'volunteer' | 'organizer';

interface RegisterForm {
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  skills: string[];
  orgName: string;
  category: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  idFile: File | null;
}

type RegisterErrors = Partial<Record<keyof RegisterForm, string>>;

const skillOptions = [
  { value: 'social-service', label: 'Social Service' },
  { value: 'first-aid', label: 'First Aid' },
  { value: 'healthcare-support', label: 'Healthcare Support' },
  { value: 'elderly-care', label: 'Elderly Care' },
  { value: 'child-care', label: 'Child Care' },
  { value: 'teaching', label: 'Teaching' },
  { value: 'counseling', label: 'Counseling' },
  { value: 'disaster-relief', label: 'Disaster Relief' },
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();
  const [showPassword, setShowPassword] = useState({ password: false, confirm: false });
  const [form, setForm] = useState<RegisterForm>({
    role: 'volunteer',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    skills: [],
    orgName: '',
    category: '',
    password: '',
    confirmPassword: '',
    terms: false,
    idFile: null,
  });
  const [errors, setErrors] = useState<RegisterErrors>({});

  const handleChange = (key: keyof RegisterForm, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSkill = (skill: string) => {
    setForm((prev) => {
      const exists = prev.skills.includes(skill);
      return {
        ...prev,
        skills: exists ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
      };
    });
  };

  const validateForm = () => {
    const nextErrors: RegisterErrors = {};

    if (!form.firstName.trim()) nextErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) nextErrors.lastName = 'Last name is required';
    if (!form.email.trim()) nextErrors.email = 'Email is required';
    else if (!validateEmail(form.email.trim())) nextErrors.email = 'Please enter a valid email';
    if (!form.phone.trim()) nextErrors.phone = 'Phone number is required';
    else if (!validatePhone(form.phone.trim())) nextErrors.phone = 'Please enter a valid phone number';

    if (!form.password) nextErrors.password = 'Password is required';
    else if (!validatePassword(form.password)) nextErrors.password = 'Password must be at least 8 characters';

    if (!form.confirmPassword) nextErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';

    if (form.role === 'organizer') {
      if (!form.orgName.trim()) nextErrors.orgName = 'Organization name is required';
      if (!form.category) nextErrors.category = 'Category is required';
      if (!form.idFile) nextErrors.idFile = 'Verified ID is required';
    }

    if (!form.terms) nextErrors.terms = 'You must agree to terms and conditions';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      showToast('Registration successful! Redirecting...', 'success');
      setTimeout(() => {
        if (form.role === 'organizer') {
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
      <section className="pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                  <span className="material-icons text-teal-600 text-3xl">person_add</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                <p className="text-gray-600">Join our community and start making a difference</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">I want to join as:</label>
                  <div className="grid grid-cols-2 gap-4">
                    {(['volunteer', 'organizer'] as Role[]).map((roleOption) => (
                      <label key={roleOption} className="role-card cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value={roleOption}
                          checked={form.role === roleOption}
                          onChange={(e) => handleChange('role', e.target.value as Role)}
                          className="hidden"
                        />
                        <div className="role-card-content">
                          <span className="material-icons text-4xl mb-2 text-teal-600">
                            {roleOption === 'volunteer' ? 'volunteer_activism' : 'business'}
                          </span>
                          <span className="font-semibold">
                            {roleOption === 'volunteer' ? 'Volunteer' : 'Organizer'}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Full Name */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      className="input-field"
                      placeholder="John"
                      value={form.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      className="input-field"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <span className="material-icons absolute left-3 top-3 text-gray-400 text-sm">email</span>
                    <input
                      type="email"
                      id="registerEmail"
                      className="input-field pl-10"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <span className="material-icons absolute left-3 top-3 text-gray-400 text-sm">phone</span>
                    <input
                      type="tel"
                      id="phone"
                      className="input-field pl-10"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </div>
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                {/* Volunteer Fields */}
                {form.role === 'volunteer' && (
                  <div id="volunteerFields">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department/Group</label>
                    <select
                      id="department"
                      className="input-field"
                      value={form.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                    >
                      <option value="">Select Department</option>
                      <option value="nss">NSS Volunteers</option>
                      <option value="ncc">NCC Cadets</option>
                      <option value="nature">Nature Club</option>
                      <option value="cs">Computer Science Dept</option>
                      <option value="commerce">Commerce Dept</option>
                      <option value="arts">Arts Dept</option>
                    </select>

                    <label className="block text-sm font-semibold text-gray-700 mb-2 mt-4">
                      Skills (Select multiple)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {skillOptions.map((skill) => (
                        <label key={skill.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={form.skills.includes(skill.value)}
                            onChange={() => toggleSkill(skill.value)}
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{skill.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Organizer Fields */}
                {form.role === 'organizer' && (
                  <div id="organizerFields">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Name</label>
                    <input
                      type="text"
                      id="orgName"
                      className="input-field"
                      placeholder="Your Organization Name"
                      value={form.orgName}
                      onChange={(e) => handleChange('orgName', e.target.value)}
                    />
                    {errors.orgName && <span className="error-message">{errors.orgName}</span>}

                    <label className="block text-sm font-semibold text-gray-700 mb-2 mt-4">Category</label>
                    <select
                      id="category"
                      className="input-field"
                      value={form.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                    >
                      <option value="">Select Category</option>
                      <option value="Environment">Environment</option>
                      <option value="Education">Education</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Poverty">Poverty</option>
                      <option value="Human Rights">Human Rights</option>
                    </select>
                    {errors.category && <span className="error-message">{errors.category}</span>}

                    <label className="block text-sm font-semibold text-gray-700 mb-2 mt-4">
                      Upload Verified ID (Government ID / Registration Cert)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition cursor-pointer">
                      <input
                        type="file"
                        id="idFile"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files ? e.target.files[0] : null;
                          setForm((prev) => ({ ...prev, idFile: file }));
                        }}
                      />
                      <label htmlFor="idFile" className="cursor-pointer">
                        <span className="material-icons text-4xl text-gray-400 mb-2">cloud_upload</span>
                        <p className="text-gray-600 font-medium">
                          {form.idFile ? form.idFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
                      </label>
                    </div>
                    {errors.idFile && <span className="error-message">{errors.idFile}</span>}
                  </div>
                )}

                {/* Passwords */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <span className="material-icons absolute left-3 top-3 text-gray-400 text-sm">lock</span>
                      <input
                        type={showPassword.password ? 'text' : 'password'}
                        id="registerPassword"
                        className="input-field pl-10"
                        placeholder="Create password"
                        value={form.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({ ...prev, password: !prev.password }))
                        }
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        <span className="material-icons text-sm">
                          {showPassword.password ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <span className="material-icons absolute left-3 top-3 text-gray-400 text-sm">lock</span>
                      <input
                        type={showPassword.confirm ? 'text' : 'password'}
                        id="confirmPassword"
                        className="input-field pl-10"
                        placeholder="Confirm password"
                        value={form.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
                        }
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        <span className="material-icons text-sm">
                          {showPassword.confirm ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                  </div>
                </div>

                {/* Terms */}
                <div>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded mt-1"
                      checked={form.terms}
                      onChange={(e) => handleChange('terms', e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                        Terms &amp; Conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                  {errors.terms && <span className="error-message">{errors.terms}</span>}
                </div>

                <button type="submit" className="btn-primary w-full justify-center">
                  Create Account
                  <span className="material-icons ml-2 text-sm">arrow_forward</span>
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                  Already have an account?{' '}
                  <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                    Login
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

export default Register;
