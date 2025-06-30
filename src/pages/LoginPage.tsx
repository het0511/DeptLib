import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { sendWelcomeEmail } from '../utils/sendWelcomeEmail';
import { verifyEmail } from '../utils/verifyEmail'; 

type FormData = {
  email: string;
  password: string;
  name?: string;
};

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();
  const { login, register: registerUser, error, isLoading } = useAuthStore();

  const onSubmit = async (data: FormData) => {
    if (isLogin) {
      await login(data.email, data.password);
    } else {
      if (data.name) {
        // Verify email before registering
        const isEmailValid = await verifyEmail(data.email);
        if (!isEmailValid) {
          alert("Invalid or risky email. Please use a valid email address.");
          return; // Stop signup if email is invalid
        }

        await registerUser(data.name, data.email, data.password);
        
        // Send welcome email after successful signup
        sendWelcomeEmail(data.email, data.name);
      }
    }

    // If no error, redirect to books page
    if (!error) {
      navigate('/books');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="sm:w-full sm:max-w-md bg-white/10 backdrop-blur-lg shadow-xl rounded-xl p-8">
        <h2 className="text-center text-3xl font-bold text-white drop-shadow-md">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>

        {error && (
          <div className="mt-4 bg-red-500 text-white text-sm p-3 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300">Name</label>
              <input
                id="name"
                type="text"
                {...register('name', { required: !isLogin })}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">Name is required</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email', { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">Valid email is required</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password', { required: true, minLength: 6 })}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">Password must be at least 6 characters</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 transition duration-300 transform hover:scale-105 shadow-md"
          >
            {isLoading ? 'Loading...' : (
              <>
                {isLogin ? <LogIn className="h-5 w-5 mr-2" /> : <UserPlus className="h-5 w-5 mr-2" />}
                {isLogin ? 'Sign in' : 'Sign up'}
              </>
            )}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 w-full text-center text-sm text-indigo-400 hover:underline"
        >
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
