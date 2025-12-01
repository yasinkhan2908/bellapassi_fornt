'use client';
import Link from 'next/link';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { useSession } from "next-auth/react";

//
export default function Login() {
  const session = useSession();
  const data = session?.data ?? null;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const router = useRouter();

  // Client-side validation
  const validateForm = (mobile_number: string): boolean => {
    setValidationError('');

    // Check if mobile number is empty
    if (!mobile_number.trim()) {
      setValidationError('Mobile number is required');
      return false;
    }

    // Check if mobile number contains only digits
    if (!/^\d+$/.test(mobile_number)) {
      setValidationError('Mobile number should contain only digits');
      return false;
    }

    // Check if mobile number is exactly 10 digits
    if (mobile_number.length !== 10) {
      setValidationError('Mobile number must be exactly 10 digits');
      return false;
    }

    // Check if mobile number starts with valid Indian prefix (6-9)
    if (!/^[6-9]/.test(mobile_number)) {
      setValidationError('Please enter a valid Indian mobile number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setValidationError('');

    const formData = new FormData(e.currentTarget);
    const mobile_number = formData.get('mobile_number') as string;

    // Client-side validation
    if (!validateForm(mobile_number)) {
      return;
    }

    setIsLoading(true);

    // try {
      // 1️⃣ Get CSRF cookie first
      await fetch(`${process.env.API_URL}/sanctum/csrf-cookie`, {
        cache: 'no-store', // ensures fresh data each time
      });

      // 2️⃣ Then login
      // console.log("login url",`${process.env.API_URL}/api/user/user-register`);
      // console.log("login url",`${process.env.NEXT_PUBLIC_API_URL}/api/user/user-register`);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/user-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // ensures fresh data each time
        body: JSON.stringify({ mobile_number }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Login failed');
        return;
      }

      // Store data
      sessionStorage.setItem('mobile', mobile_number);
      localStorage.setItem('otp', result.otp);
      //console.log("result.otp",result.otp);
      // Redirect
      router.push('/otp');
    // } catch (err) {
    //   setError('Login failed. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // Real-time validation on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow digits
    if (value && !/^\d*$/.test(value)) {
      return;
    }

    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
    
    // Clear server error when user starts typing
    if (error) {
      setError('');
    }
  };

  // Validate on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      validateForm(value);
    }
  };
  return (
    <div className="d-flex h-screen mt-20 justify-center">
      <div>
        <div className="z-10">
          <div className="p-4 bg-white mx-auto rounded-2xl w-100">
            <div className="mb-4">
              <h3 className="font-semibold text-lg text-gray-800"> Login <span className="text-gray-500 text-sm">or</span> Signup </h3>
              <form onSubmit={handleSubmit} className="p-0 space-y-2">
      
        
                <div className="my-4 relative flex w-full flex-wrap items-stretch">
                  <span className="z-10 h-full font-normal absolute text-left text-gray-400 absolute bg-transparent rounded text-base items-center justify-center w-20 pl-3 py-3">
                    +91 |
                  </span>
                  <input 
                    type="number" 
                    name="mobile_number"
                    placeholder="Mobile Number" 
                    maxLength={10} 
                    className={`placeholder-gray-400 text-gray-600 relative bg-white bg-white rounded text-sm mobile-border border-gray-300 outline-none focus:border-gray-600 w-full pl-14 focus:border-sss-primary-500 w-100 login-number ${validationError ? 'mobile-is-invalid' : ''} ${error && !validationError ? 'mobile-is-invalid' : ''}  ` }
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    pattern="[6-9]{1}[0-9]{9}"
                    title="Please enter a valid 10-digit Indian mobile number"
                  />
                  
                  {/* Validation Error */}
                  {validationError && (
                    <div className="text-red-500 text-sm mt-2">{validationError}</div>
                  )}
                  
                  {/* Server Error */}
                  {error && !validationError && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                  )}
                  <div className="w-full flex-wrap text-gray-400 text-sm mt-2 mb-4"> 
                    By continuing, I agree to the
                    <Link href="/terms" className="text-sss-primary-500 font-semibold mx-1" prefetch={false}>Terms of Use</Link>
                    &amp;
                    <Link href="/policy" className="text-sss-primary-500 font-semibold mx-1" prefetch={false}>Privacy Policy</Link>
                  </div>
                  <div>
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-100 btn btn-primary inline-flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          Processing...
                        </>
                      ) : 'Continue'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}