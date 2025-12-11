// app/user/add-address/AddAddressForm.tsx (fixed)
'use client';

import { useState, useEffect, useRef } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
const libraries: ('places')[] = ['places'];

import Link from 'next/link';
import Select, { SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';

import { AccountSidebar } from '../dashboard/AccountSidebar';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  address_line_2: string;
  landmark: string;
  city: string;
  city_name?: string;
  state: string;
  state_name?: string;
  postalcode: string;
  country: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalcode?: string;
}

interface StateOption {
  value: number;
  label: string;
}

interface CityOption {
  value: number;
  label: string;
}

export default function AddAddressForm() {
  const session = useSession();
  const router = useRouter();
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [stateOptions, setStateOptions] = useState<StateOption[]>([]);
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  
  const [selectedState, setSelectedState] = useState<StateOption | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    address_line_2: '',
    landmark: '',
    city: '',
    city_name: '',
    state: '',
    state_name: '',
    postalcode: '',
    country: 'India', // Default to India
  });

  // Custom validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Phone validation (simplified - all errors go to errors state)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number should contain only digits';
    } else if (formData.phone.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    } else if (!/^[6-9]/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Indian mobile number';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    // State validation
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    // Postal code validation
    if (!formData.postalcode.trim()) {
      newErrors.postalcode = 'Postal code is required';
    } else if (!/^\d{4,10}$/.test(formData.postalcode.replace(/\s/g, ''))) {
      newErrors.postalcode = 'Please enter a valid postal code';
    }

    // Update errors state
    setErrors(newErrors);
    
    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setIsLoadingStates(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/states`, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch states');
        }

        const result = await response.json();
        
        // Convert API response to react-select options
        const options = result.data.states.map((state: any) => ({
          value: state.id,
          label: state.name
        }));
        
        setStateOptions(options);
      } catch (error) {
        console.error('Error fetching states:', error);
        setStateOptions([]);
      } finally {
        setIsLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // Function to load cities based on selected state
  const loadCities = async (stateId: string): Promise<CityOption[]> => {
    if (!stateId) return [];
    
    try {
      setIsLoadingCities(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/state-city/${stateId}`, 
        {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }

      const result = await response.json();
      
      const options = result.data.cities.map((city: any) => ({
        value: city.id,
        label: city.name
      }));
      
      setCityOptions(options);
      return options;
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    } finally {
      setIsLoadingCities(false);
    }
  };

  // Handle state change
  const handleStateChange = async (selectedOption: SingleValue<StateOption>) => {
    setSelectedState(selectedOption);
    setSelectedCity(null);
    setCityOptions([]);
    
    if (selectedOption) {
      // Update form data
      setFormData(prev => ({
        ...prev,
        state: selectedOption.value.toString(),
        state_name: selectedOption.label,
        city: '', // Reset city when state changes
        city_name: ''
      }));
      
      // Clear city error
      if (errors.city) {
        setErrors(prev => ({ ...prev, city: undefined }));
      }
      
      // Fetch cities for selected state
      await loadCities(selectedOption.value.toString());
    } else {
      setFormData(prev => ({
        ...prev,
        state: '',
        state_name: ''
      }));
    }
    
    // Clear state error
    if (errors.state) {
      setErrors(prev => ({ ...prev, state: undefined }));
    }
  };

  // Handle city change
  const handleCityChange = (selectedOption: SingleValue<CityOption>) => {
    setSelectedCity(selectedOption);
    
    if (selectedOption) {
      setFormData(prev => ({
        ...prev,
        city: selectedOption.value.toString(),
        city_name: selectedOption.label
      }));
      
      // Clear city error
      if (errors.city) {
        setErrors(prev => ({ ...prev, city: undefined }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        city: '',
        city_name: ''
      }));
    }
  };

  // Handle other form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For phone field, allow only digits and limit to 10
    let processedValue = value;
    if (name === 'phone') {
      // Remove non-digit characters
      processedValue = value.replace(/\D/g, '');
      // Limit to 10 digits
      if (processedValue.length > 10) {
        processedValue = processedValue.slice(0, 10);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const isValid = validateForm();
    
    if (!isValid) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all required fields correctly',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = session?.data?.user.token ?? '';
      
      // Prepare data for API
      const apiData = {
        ...formData,
        // Ensure values are strings
        state: formData.state.toString(),
        city: formData.city.toString(),
        // Include names for better API processing
        state_name: selectedState?.label || '',
        city_name: selectedCity?.label || ''
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/add-shipping-address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to save address');
      }

      // Show success message
      await Swal.fire({
        title: 'Success',
        text: result.message || 'Address saved successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2ee44cff'
      });
      
      // Redirect to addresses page
      router.push('/user/my-address/');
      
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Failed to save address. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom styles for react-select
  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderColor: state.isFocused ? '#80bdff' : errors.state ? '#dc3545' : '#ced4da',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0, 123, 255, 0.25)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#80bdff' : '#adb5bd'
      },
      minHeight: 'calc(1.5em + .75rem + 2px)',
      padding: '0.375rem 0'
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 9999
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#f8f9fa' : base.backgroundColor,
      color: state.isSelected ? 'white' : '#212529'
    })
  };

  return (
    <div className="index-page">
      <main className="main">
        <div className="page-title light-background">
          <div className="container d-lg-flex justify-content-between align-items-center">
            <h1 className="mb-2 mb-lg-0">Address</h1>
            <nav className="breadcrumbs">
              <ol>
                <li><a href="/">Home</a></li>
                <li className="current">Address</li>
                <li className="current">Add Address</li>
              </ol>
            </nav>
          </div>
        </div>
        
        <section id="account" className="account section">
          <div className='container'>
            <div className="row g-4">              
              <div className="profile-menu mobile-profile-menu d-lg-block" id="profileMenu">            
                  <div id="tabs" className="d-flex justify-between border-t">

                      <Link aria-current="page" className="w-full justify-center inline-block text-center pt-2 pb-1" href="/user/dashboard">
                          <i className="bi bi-box-seam"></i>
                          <span className="tab tab-home block text-xs">My Orders</span>
                      </Link>

                      <Link aria-current="page" className="w-full justify-center inline-block text-center pt-2 pb-1" href="#">
                          <i className="bi bi-heart"></i>
                          <span className="tab tab-home block text-xs">Wishlist</span>
                      </Link>

                      <Link aria-current="page" className="w-full justify-center inline-block text-center pt-2 pb-1 mobile-active" href="/user/my-address">
                          <i className="bi bi-geo-alt"></i>
                          <span className="tab tab-home block text-xs">My Address</span>
                      </Link>

                      <Link aria-current="page" className="w-full justify-center inline-block text-center pt-2 pb-1" href="/user/account-setting">
                          <i className="bi bi-gear"></i>
                          <span className="tab tab-home block text-xs">Account Settings</span>
                      </Link>
                  </div>
              </div>
              <div className="col-lg-3">
                <AccountSidebar />
              </div>
              <div className="col-lg-9">
                <div className="content-area">
                  <div className="tab-content">
                    <div className="tab-pane fade active show" id="addresses" role="tabpanel">
                      <div className="section-header aos-init aos-animate" data-aos="fade-up">
                        <h2>Add Address</h2>
                      </div>
                      
                      <div className="addresses-grid">
                        <div className="address-card aos-init aos-animate active mb-3" data-aos="fade-up" data-aos-delay="200">
                          <form onSubmit={handleSubmit} className="php-email-form settings-form">
                            <div className="row g-3">
                              <div className="col-md-12">
                                <label className="form-label">Name *</label>
                                <input 
                                  type="text" 
                                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                  name="name" 
                                  placeholder="Enter Name" 
                                  value={formData.name} 
                                  onChange={handleInputChange} 
                                  required
                                />
                                {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                              </div>
                              
                              <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input 
                                  type="email" 
                                  className="form-control" 
                                  name="email" 
                                  placeholder="Enter Email" 
                                  value={formData.email} 
                                  onChange={handleInputChange} 
                                />
                              </div>
                               
                              <div className="col-md-6">
                                <label className="form-label">Phone Number *</label>
                                <input 
                                  type="tel" 
                                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                  name="phone" 
                                  placeholder="Enter Phone Number" 
                                  value={formData.phone} 
                                  onChange={handleInputChange} 
                                  required
                                />
                                {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
                              </div>
                              
                              <div className="col-md-12">
                                <label className="form-label">Address *</label>
                                <input 
                                  type="text" 
                                  className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                  name="address" 
                                  placeholder="Enter Address" 
                                  value={formData.address} 
                                  onChange={handleInputChange} 
                                  required
                                />
                                {errors.address && <div className="invalid-feedback d-block">{errors.address}</div>}
                              </div>
                              
                              <div className="col-md-12">
                                <label className="form-label">Address Line 2</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="address_line_2" 
                                  placeholder="Enter Address Line 2" 
                                  value={formData.address_line_2} 
                                  onChange={handleInputChange} 
                                />
                              </div>
                              
                              <div className="col-md-12">
                                <label className="form-label">Landmark</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="landmark" 
                                  placeholder="Enter Landmark" 
                                  value={formData.landmark} 
                                  onChange={handleInputChange} 
                                />
                              </div>
                              
                              <div className="col-md-6">
                                <label className="form-label">State *</label>
                                <Select
                                  className={`basic-single ${errors.state ? 'is-invalid' : ''}`}
                                  classNamePrefix="select"
                                  isLoading={isLoadingStates}
                                  isClearable={true}
                                  isSearchable={true}
                                  name="state"
                                  options={stateOptions}
                                  value={selectedState}
                                  onChange={handleStateChange}
                                  placeholder="Select State"
                                  styles={customStyles}
                                  required
                                />
                                {errors.state && <div className="invalid-feedback d-block">{errors.state}</div>}
                              </div>
                              
                              <div className="col-md-6">
                                <label className="form-label">City *</label>
                                <Select
                                  className={`basic-single ${errors.city ? 'is-invalid' : ''}`}
                                  classNamePrefix="select"
                                  isLoading={isLoadingCities}
                                  isClearable={true}
                                  isSearchable={true}
                                  isDisabled={!selectedState}
                                  name="city"
                                  options={cityOptions}
                                  value={selectedCity}
                                  onChange={handleCityChange}
                                  placeholder={selectedState ? "Select City" : "Select State First"}
                                  styles={customStyles}
                                  required
                                />
                                {errors.city && <div className="invalid-feedback d-block">{errors.city}</div>}
                              </div>
                              
                              <div className="col-md-12">
                                <label className="form-label">Pin Code *</label>
                                <input 
                                  type="text" 
                                  className={`form-control ${errors.postalcode ? 'is-invalid' : ''}`}
                                  name="postalcode" 
                                  placeholder="Enter Pin Code" 
                                  value={formData.postalcode} 
                                  onChange={handleInputChange} 
                                  required
                                />
                                {errors.postalcode && <div className="invalid-feedback d-block">{errors.postalcode}</div>}
                              </div>
                              
                              <input type="hidden" name="country" value={formData.country} />
                            </div>
                            
                            <div className="form-buttons mt-4">
                              <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving...
                                  </>
                                ) : 'Save Address'}
                              </button>
                              <button 
                                type="button" 
                                className="btn btn-secondary ms-2"
                                onClick={() => router.back()}
                              >
                                Cancel
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
        </section>
      </main>
    </div>
  );
}