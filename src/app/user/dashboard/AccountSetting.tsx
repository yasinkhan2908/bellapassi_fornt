'use client';
import Link from 'next/link';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { AccountSidebar } from './AccountSidebar';
import Swal from 'sweetalert2';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
}

interface FormErrors {
  [x: string]: string | undefined;
  first_name?: string;
  last_name?: string;
}

export default function AccountSetting() {
  const router = useRouter();
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<{ error?: string; data?: any } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [mobileNumber, setMobileNumber] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // ✅ Track client-side rendering
  
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: ''
  });

  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  // Custom validation function to replace Parsley.js
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Set client-side flag and initialize localStorage values
  useEffect(() => {
    setIsClient(true);
    console.log("user mobile",localStorage.getItem("user_mobile"));
    setMobileNumber(localStorage.getItem("user_mobile"));
    setToken(localStorage.getItem('token'));
  }, []);

  // ✅ Fetch current profile on page load (client-side only)
  useEffect(() => {
    const fetchProfile = async () => {
      // Wait for token to be available and ensure we're on client
      if (!token || !isClient) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const responseData = await response.json();
        console.log('data', responseData.data);
        setUser(responseData.data);
        setFormData(responseData.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    
    fetchProfile();
  }, [token, isClient]);

  // ✅ Handle input changes dynamically
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // ✅ Use token from state instead of localStorage directly
    if (!token) {
      Swal.fire({
        title: 'Error',
        text: 'No authentication token found',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Something went wrong!');
      }

      // ✅ Update localStorage on client side only
    //   if (isClient) {
        localStorage.setItem("user_first_name", formData.first_name);
        localStorage.setItem("user_last_name", formData.last_name);
    //   }

      Swal.fire({
        title: 'Success',
        text: result.message || 'Account successfully updated!',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#2ee44cff',
        cancelButtonColor: 'rgba(222, 41, 50, 1)',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          setIsSubmitting(false);
        }
      });
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Failed to update profile',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      setIsSubmitting(false);
    }
  };

  // ✅ Show loading state during SSR/hydration
  if (!isClient) {
    return (
      <main className="main">
        <section id="account" className="account section">
          <div className='container'>
            <div className="row g-4">
              <div className="col-lg-3">
                <AccountSidebar />
              </div>
              <div className="col-lg-9">
                <div className="content-area">
                  <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <section id="account" className="account section">
        <div className='container'>
          <div className="row g-4">
            <div className="col-lg-3">
              <AccountSidebar />
            </div>
            <div className="col-lg-9">
              <div className="content-area">
                <div className="tab-content">
                  <div className="tab-pane fade active show" id="addresses" role="tabpanel">
                    <div className="section-header aos-init aos-animate" data-aos="fade-up">
                      <h2>Account Setting</h2>
                    </div>

                    <div className="addresses-grid">                                        
                      <div className="settings-content">
                        <div className="settings-section aos-init aos-animate mb-5" data-aos="fade-up">
                          <h3>Personal Information</h3>
                          <form className="php-email-form settings-form ajaxformfileupload" onSubmit={handleSubmit} method="post">
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label className="form-label">First Name</label>
                                <input 
                                  type="text" 
                                  className={`form-control ${errors.first_name ? 'is-invalid' : ''}`} 
                                  id="first_name" 
                                  name="first_name" 
                                  placeholder='Enter first name' 
                                  value={formData.first_name} 
                                  onChange={handleChange}
                                />
                                {errors.first_name && <div className="invalid-feedback d-block">{errors.first_name}</div>}
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Last Name</label>
                                <input 
                                  type="text" 
                                  className={`form-control ${errors.last_name ? 'is-invalid' : ''}`} 
                                  id="last_name" 
                                  name="last_name" 
                                  placeholder='Enter Last name' 
                                  value={formData.last_name} 
                                  onChange={handleChange}
                                />
                                {errors.last_name && <div className="invalid-feedback d-block">{errors.last_name}</div>}
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input 
                                  type="email" 
                                  className="form-control" 
                                  id="email" 
                                  name="email"  
                                  placeholder='Enter email' 
                                  value={formData.email} 
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Phone</label>
                                <input 
                                  type="tel" 
                                  className="form-control" 
                                  id="mobile" 
                                  name="mobile"  
                                  maxLength={10}  
                                  placeholder='Enter phone number' 
                                  value={mobileNumber || ''} 
                                  readOnly 
                                />
                              </div>
                            </div>

                            <div className="form-buttons">
                              <button 
                                type="submit" 
                                className="btn btn-primary mt-3"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? 'Update...' : 'Update Account'}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>    
                    </div>
                  </div>    
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}