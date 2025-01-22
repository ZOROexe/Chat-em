import React, { useState } from 'react'
import { MessageSquare, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../store/authStore'
import { Link } from 'react-router-dom'
import AuthPattern from '../components/AuthPattern'
const LoginPage = () => {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const formValidation = () => {
    if (!formData.email.trim()) return toast.error("Email required");
    if (!formData.password) return toast.error("Password required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Enter a valid email");

    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = formValidation();
    if (valid === true) login(formData);
  }

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      <div className='flex flex-col items-center justify-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/* logo */}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center'>
              <div className='flex flex-col items-center justify-center gap-2 group'>
                <div className='size-12 bg-primary/10 flex items-center justify-center rounded-xl group-hover:bg-primary/20 transition-colors'>
                  <MessageSquare className='size-6 text-primary' />
                </div>
                <h1 className='text-2xl font-bold'>Welcome Back</h1>
                <p className='text-base-content/60'>Sign in to your account</p>
              </div>
            </div>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Email</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='size-5 text-base-content/40'/>
              </div>
                <input
                  type="email"
                  className='input w-full input-bordered pl-10'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='size-5 text-base-content'/>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className='input input-bordered w-full pl-10'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                    {showPassword ? (
                      <Eye className='size-5 text-base-content'/>
                    ) : (
                        <EyeOff className='size-5 text-base-content'/>
                    )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Log In"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Dont have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <AuthPattern title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}/>
    </div>
  )
}

export default LoginPage