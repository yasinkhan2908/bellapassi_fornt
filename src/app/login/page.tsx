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
  const { data: session, status } = useSession();
  const router = useRouter(); // ✅ initialize router
  //toast.loading('Logging in...');
  const [mobile_number, setMobileNumber] = useState('');
  const [result, setResult] = useState<{ error?: string; data?: any } | null>(null);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      toast.loading('Logging in...');
      // 1️⃣ Get CSRF cookie first
      await api.get('/sanctum/csrf-cookie');

      // 2️⃣ Then login
      const response = await api.post('/api/user/user-register', { mobile_number });
      //console.log('Login success:', response.data);
      if (response.data.success === false) {
        toast.dismiss();
        toast.error(response.data.message || 'Login failed');
        return;
      }
      toast.dismiss();
      toast.success(response.data.message || 'Opt send to your mobile number!');
      sessionStorage.setItem('mobile', mobile_number);
      localStorage.setItem("otp", response.data.otp);
      // ✅ redirect after short delay
      setTimeout(() => {
        router.push('/otp'); // 👈 your next page path
      }, 500);
    } catch (error) {
      //console.log(error);
      toast.dismiss();
      toast.error('Login failed. Please try again.');
    }
  };
  return (
    <div className="d-flex h-screen mt-20 justify-center">
      <div>
        <div className="z-10">
          <div className="p-4 bg-white mx-auto rounded-2xl w-100">
            <div className="mb-4">
              <h3 className="font-semibold text-lg text-gray-800"> Login <span className="text-gray-500 text-sm">or</span> Signup </h3>
              <form onSubmit={handleSubmit} className="p-4 space-y-2">
                <div className="my-4 relative flex w-full flex-wrap items-stretch">
                  <span className="z-10 h-full font-normal absolute text-left text-gray-400 absolute bg-transparent rounded text-base items-center justify-center w-20 pl-3 py-3">
                    +91 |
                  </span>
                  <input type="tel" placeholder="Mobile Number" maxLength={10} className="placeholder-gray-400 text-gray-600 relative bg-white bg-white rounded text-sm border border-gray-300 outline-none focus:border-gray-600 w-full pl-14 focus:border-sss-primary-500 w-100 login-number" onChange={e => setMobileNumber(e.target.value)}/>
                  <div className="w-full flex-wrap text-gray-400 text-sm mt-2 mb-4"> 
                    By continuing, I agree to the
                    <Link href="/terms" className="text-sss-primary-500 font-semibold">Terms of Use</Link>
                    &amp;
                    <Link href="/policy" className="text-sss-primary-500 font-semibold">Privacy Policy</Link>
                  </div>
                  <div>
                    <button type="submit" className="w-100 transition btn-bg duration-500 ease-in-out bg-sss-primary-500 text-white font-bold py-2 px-4 rounded w-full md:w-3/5 lg:w-60 inline-flex justify-center">
                      Continue
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