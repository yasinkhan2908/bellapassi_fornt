'use client';
import Image from "next/image";
import toast from 'react-hot-toast';
import { useEffect, useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { signIn, getSession } from 'next-auth/react';



export default function Otp() {

    const [mobile, setMobile] = useState('');
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    useEffect(() => {
        const storedMobile = sessionStorage.getItem('mobile');
        const storedOtp = localStorage.getItem('otp');
        if (storedMobile) setMobile(storedMobile);
        if (storedOtp) setOtp(storedOtp);
    }, []);

    const length = 4;
    const [otps, setOtps] = useState<string[]>(new Array(length).fill(""));
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.replace(/\D/g, "");
        if (!value) return;

        const newOtp = [...otps];
        newOtp[index] = value[0];
        setOtps(newOtp);

        if (index < length - 1 && inputsRef.current[index + 1]) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otps[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("Text").replace(/\D/g, "").slice(0, length);
        const newOtp = pasteData.split("");
        setOtps(newOtp.concat(new Array(length - newOtp.length).fill("")));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const otpValue = otps.join('');

        try {
            const result = await signIn('credentials', {
                mobile,
                otp: otpValue,
                redirect: false,
            });

            if (result?.error) {
                console.log(result?.error);
                toast.error('Invalid OTP. Please try again.');
            } else {
                toast.success('OTP verified successfully!');
                
                // Check session and redirect
                const session = await getSession();
                if (session) {
                    router.push('/user/dashboard/');
                } else {
                    toast.error('Session creation failed');
                }
            }
        } catch (error) {
            console.error('Sign in error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendLoading(true);
        try {
            // Call your API to resend OTP
            const response = await fetch('/api/auth/resend-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobile }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('OTP resent successfully!');
                if (data.otp) {
                    setOtp(data.otp);
                    localStorage.setItem('otp', data.otp);
                }
            } else {
                toast.error(data.message || 'Failed to resend OTP');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            toast.error('Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="d-flex h-screen mt-20 justify-center">
            <div>
                <div className="z-10">
                    <div className="p-4 bg-white mx-auto rounded-2xl w-100">
                        <div className="mb-4">
                            <div className="d-flex justify-center">
                                <Image 
                                    src="/img/sms_icon.png"  
                                    width={40} 
                                    height={40}   
                                    alt="SMS Icon" 
                                    className="w-40" 
                                    loading="lazy"
                                />
                            </div>
                            <div className="d-flex flex-col mt-4 text-blue text-center">
                                <span>
                                    OTP has been sent via SMS to {mobile} 
                                    {otp && <strong> Otp - ({otp})</strong>}
                                </span>
                            </div>
                            <form onSubmit={handleSubmit} className="p-4 space-y-2">
                                <div className="my-4 relative flex w-full flex-wrap items-stretch">
                                    <div className="d-flex gap-2 justify-center mt-6">
                                        {otps.map((digit, i) => (
                                            <input
                                                key={i}
                                                ref={(el) => {
                                                    inputsRef.current[i] = el;
                                                }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleChange(e, i)}
                                                onKeyDown={(e) => handleKeyDown(e, i)}
                                                onPaste={handlePaste}
                                                className="m-2 border h-10 w-custom text-center form-control rounded focus:border-gray-600 bg-red-50"
                                                disabled={loading}
                                            />
                                        ))}
                                    </div>
                                    
                                    <div className="mt-5">
                                        <div className="rounded-md bg-sss-primary-500 mx-8">
                                            <button 
                                                type="submit"
                                                disabled={loading || otps.join('').length !== length}
                                                className="transition duration-500 ease-in-out bg-sss-primary-500 text-white font-bold py-2 px-4 rounded w-full lg:w-60 inline-flex justify-center w-100 verify-btn disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? (
                                                    <span>Verifying...</span>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-bucket"></i>
                                                        <span className="mt-0.5 ml-1 text-white verify">
                                                            Verify OTP
                                                        </span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex justify-center text-center mt-5">
                                        <div className="d-flex flex-col items-center space-y-2 text-center">
                                            <div className="cursor-pointer inline-flex items-center gap-2 text-green-700 hover:underline font-bold text-xl text-green">
                                                <i className="bi bi-whatsapp"></i>
                                                <span className="text-green">Get OTP on WhatsApp</span>
                                            </div>
                                            <div className="text-gray-500">OR</div>
                                            <button 
                                                type="button"
                                                onClick={handleResendOtp}
                                                disabled={resendLoading}
                                                className="font-bold cursor-pointer text-xl text-blue disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {resendLoading ? 'Sending...' : 'Resend OTP via SMS'}
                                            </button>
                                        </div>
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

function redirect(arg0: string) {
    throw new Error("Function not implemented.");
}
