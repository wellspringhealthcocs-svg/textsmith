import React, { useState } from 'react';
import { Button } from './Button';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-slide-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 mt-2">
              {isLogin ? 'Login to access Pro features' : 'Join TextSmith for free today'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <Button 
              className="w-full mt-2" 
              size="lg"
              onClick={() => {
                onLogin();
                onClose();
              }}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                 <span className="font-medium text-slate-700">Google</span>
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                 <span className="font-medium text-slate-700">GitHub</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};