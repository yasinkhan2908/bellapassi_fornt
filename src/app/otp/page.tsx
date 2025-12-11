'use client';
import Image from "next/image";
import toast from 'react-hot-toast';
import { useEffect, useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { signIn, getSession } from 'next-auth/react';



export default function Otp() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ otp?: string; general?: string }>({});
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


    // Clear OTP function
    const clearOtp = () => {
        setOtps(new Array(length).fill(""));
        // Clear any stored OTP
        //localStorage.removeItem('otp');
        // Focus first input
        setTimeout(() => {
            inputsRef.current[0]?.focus();
        }, 0);
    };
    // Client-side validation
     const validateForm = (): boolean => {
        const newErrors: { otp?: string } = {};
        
        const otpValue = otps.join('');
        if (otpValue.length !== length) {
            newErrors.otp = 'Please enter complete OTP';
        }
        
        if (!/^\d+$/.test(otpValue)) {
            newErrors.otp = 'OTP must contain only numbers';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.replace(/\D/g, "");
        if (!value) return;

        const newOtp = [...otps];
        newOtp[index] = value[0];
        setOtps(newOtp);
        setErrors({}); // Clear errors on change

        if (index < length - 1 && inputsRef.current[index + 1]) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            const newOtp = [...otps];
            
            if (!otps[index] && index > 0) {
                // If current is empty, move to previous and clear it
                newOtp[index - 1] = "";
                setOtps(newOtp);
                inputsRef.current[index - 1]?.focus();
            } else {
                // Clear current input
                newOtp[index] = "";
                setOtps(newOtp);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("Text").replace(/\D/g, "").slice(0, length);
        const newOtp = pasteData.split("");
        setOtps(newOtp.concat(new Array(length - newOtp.length).fill("")));
        setErrors({}); // Clear errors on paste
    };

    const handleSubmit0 = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Client-side validation
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        // try {
            toast.loading('Verifying OTP...');

            // Get CSRF cookie first
            await fetch(`${process.env.API_URL}/sanctum/csrf-cookie`, {
                cache: 'no-store', // ensures fresh data each time
            });
            // console.log("otps",otps.join(""));
            // console.log("mobile",mobile);
            // OTP verification
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/otp-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    mobile: mobile, 
                    otp: otps.join("") // Send as string instead of array
                }),
            });

            const result = await response.json();

            if (!result.success) {
                setIsSubmitting(false);
                toast.dismiss();
                toast.error(result.message || 'OTP verification failed!');
                setErrors({ general: result.message || 'OTP verification failed' });
                
                // Clear OTP on failure
                clearOtp();
                return;
            }
            setIsSubmitting(false);
            toast.dismiss();
            toast.success(result.message || 'OTP successfully verified!');

            // Store authentication data
            if (result.data?.token) {
                localStorage.setItem("token", result.data.token);                
                localStorage.setItem("user_first_name", result.data.user.first_name);   
                localStorage.setItem("user_last_name", result.data.user.last_name);  
                localStorage.setItem("user_mobile", result.data.user.phone);
            }

            // Clear OTP on success
            clearOtp();

            // Redirect to dashboard
            setTimeout(() => {
                router.push('/user/dashboard');
            }, 500);
            setIsSubmitting(false);
        // } catch (error) {
        //     console.error('OTP verification error:', error);
        //     toast.dismiss();
        //     toast.error('Verification failed. Please try again.');
        //     setErrors({ general: 'Verification failed. Please try again.' });
            
        //     // Clear OTP on error
        //     clearOtp();
        // } finally {
        //     setIsSubmitting(false);
        // }
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();   // ⭐ THIS STOPS THE FORM FROM RELOADING

    // Client-side validation
    if (!validateForm()) {
        alert(123);
        return;
    }

    setIsSubmitting(true);

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
        clearOtp();
        setIsSubmitting(false);
    }
};


    const handleResendOtp = async () => {
        if (!mobile) {
            toast.error('Mobile number not found');
            return;
        }

        try {
            toast.loading('Resending OTP...');
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobile }),
            });

            const result = await response.json();

            toast.dismiss();
            
            if (result.success) {
                toast.success('OTP sent successfully!');
                // Clear previous OTP inputs
                clearOtp();
                setErrors({});
            } else {
                toast.error(result.message || 'Failed to resend OTP');
            }
        } catch (error) {
            toast.dismiss();
            toast.error('Failed to resend OTP');
        }
    };

    return (
        <main className="main">
            <div className="d-flex h-screen mt-20 justify-center opt-verify mx-auto">
                <div>
                    <div className="z-10">
                        <div className="p-4 bg-white mx-auto rounded-2xl w-100">
                            <div className="mb-4">
                                <div className="d-flex justify-center">
                                    <Image 
                                        src="/img/sms_icon.png"  
                                        width={40} 
                                        height={40}   
                                        alt="SMS icon" 
                                        className="w-40" 
                                        loading="lazy"
                                    />
                                </div>
                                <div className="d-flex flex-col mt-4 text-blue text-center">
                                    <span>
                                        OTP has been sent via SMS to {mobile} - <strong>Otp : ( {otp}  )</strong>
                                    </span>
                                </div>
                                
                                {errors.general && (
                                    <div className="text-red-500 text-center mt-2">
                                        {errors.general}
                                    </div>
                                )}

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
                                                    className={`m-2 mobile-border h-10 w-12 text-center form-control rounded focus:border-gray-600 bg-red-50 ${
                                                        errors.otp ? 'mobile-is-invalid' : ''
                                                    }`}
                                                    disabled={isSubmitting}
                                                />
                                            ))}
                                        </div>
                                        
                                        {errors.otp && (
                                            <div className="text-red-500 text-center mt-2 text-sm">
                                                {errors.otp}
                                            </div>
                                        )}

                                        <div className="mt-5">
                                            <div className="rounded-md bg-sss-primary-500 mx-8">
                                                <button 
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className={`w-100 transition duration-500 ease-in-out bg-sss-primary-500 text-white font-bold py-2 px-4 rounded w-full inline-flex justify-center verify-btn ${
                                                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                >
                                                    <i className="bi bi-bucket"></i>
                                                    <span className="mt-0.5 ml-1 text-white verify">
                                                        {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="d-flex justify-center text-center mt-5">
                                            <div className="d-flex flex-col items-center space-y-2 text-center">
                                                {/* <button
                                                    type="button"
                                                    className="cursor-pointer inline-flex items-center gap-2 text-green-700 hover:underline font-bold text-xl text-green bg-transparent border-none"
                                                >
                                                    <i className="bi bi-whatsapp"></i>
                                                    <span className="text-green">Get OTP on WhatsApp</span>
                                                </button>
                                                <div className="text-gray-500">OR</div> */}
                                                <button
                                                    type="button"
                                                    disabled={isSubmitting}
                                                    className="font-bold cursor-pointer text-xl text-blue bg-transparent border-none hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Resend OTP via SMS
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
        </main>
    );
}

function redirect(arg0: string) {
    throw new Error("Function not implemented.");
}
