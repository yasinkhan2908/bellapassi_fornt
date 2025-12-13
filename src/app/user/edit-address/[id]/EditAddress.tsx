// app/user/add-address/AddAddressForm.tsx
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

import { AccountSidebar } from '../../dashboard/AccountSidebar';

interface FormData {
  name: string;
  email: string;
  mobile: string;
  address_line_1: string;
  address_line_2: string;
  landmark: string;
  city: string;
  city_name?: string;
  state: string;
  state_name?: string;
  postcode: string;
  country: string;
}

interface FormErrors {
  name?: string;
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
}

interface StateOption {
  value: number;
  label: string;
}

interface CityOption {
  value: number;
  label: string;
}

interface EditAddressProps {
  id: string;
}

export default function EditAddress({ id }: EditAddressProps) {
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
    mobile: '',
    address_line_1: '',
    address_line_2: '',
    landmark: '',
    city: '',
    city_name: '',
    state: '',
    state_name: '',
    postcode: '',
    country: '',
  });

  // Custom validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'mobile number is required';
    } else if (!/^\d{10,15}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }

    if (!formData.address_line_1.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.postcode.trim()) {
      newErrors.postcode = 'Postal code is required';
    } else if (!/^\d{4,10}$/.test(formData.postcode.replace(/\s/g, ''))) {
      newErrors.postcode = 'Please enter a valid postal code';
    }

    setErrors(newErrors);
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

  // ✅ Fixed useEffect hook for loading address
  useEffect(() => {
    const fetchAddressAndSync = async () => {
      try {
        const token = session?.data?.user.token;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/single-shipping-address/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        });
        
        const result = await response.json();
        if (result.data) {
          const addressData = result.data;
          console.log("addressData : ",addressData);
          // Set form data
          setFormData(addressData);
          
          // Find and set the selected state from stateOptions
          if (addressData.state && stateOptions.length > 0) {
            const stateId = parseInt(addressData.state);
            const foundState = stateOptions.find(option => option.value === stateId);
            
            if (foundState) {
              setSelectedState(foundState);
              
              // Load cities for this state
              const cities = await loadCities(addressData.state);
              
              // Find and set the selected city after cities are loaded
              if (addressData.city && cities.length > 0) {
                const cityId = parseInt(addressData.city);
                const foundCity = cities.find((city: CityOption) => city.value === cityId);
                
                if (foundCity) {
                  setSelectedCity(foundCity);
                } else {
                  // If city not found, create option from form data
                  setSelectedCity({
                    value: cityId,
                    label: addressData.city_name || `City #${cityId}`
                  });
                }
              }
            } else {
              // If state not found, create option from form data
              setSelectedState({
                value: stateId,
                label: addressData.state_name || `State #${stateId}`
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load address data',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    };

    if (id && stateOptions.length > 0) {
      fetchAddressAndSync();
    }
  }, [id, stateOptions]);

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
      
      // If we have formData.city and this is the matching state, auto-select city
      if (formData.city && stateId === formData.state) {
        const cityId = parseInt(formData.city);
        const foundCity = options.find((city: { value: number; }) => city.value === cityId);
        if (foundCity && !selectedCity) {
          setSelectedCity(foundCity);
        }
      }
      
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
      setErrors(prev => ({ ...prev, city: undefined }));
      
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
    setErrors(prev => ({ ...prev, state: undefined }));
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
      setErrors(prev => ({ ...prev, city: undefined }));
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
    
    // Special handling for address field mapping
    const fieldName = name === 'address' ? 'address_line_1' : name;
    let processedValue = value;
    if (name === 'mobile') {
      // Remove non-digit characters
      processedValue = value.replace(/\D/g, '');
      // Limit to 10 digits
      if (processedValue.length > 10) {
        processedValue = processedValue.slice(0, 10);
      }
    }
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Additional effect to sync when formData changes from external source
  useEffect(() => {
    const syncSelectsFromFormData = () => {
      // If we have formData.state but no selectedState, try to find it
      if (formData.state && !selectedState && stateOptions.length > 0) {
        const stateId = parseInt(formData.state);
        const foundState = stateOptions.find(state => state.value === stateId);
        if (foundState) {
          setSelectedState(foundState);
        }
      }
      
      // If we have formData.city but no selectedCity, try to find it
      if (formData.city && !selectedCity && selectedState && cityOptions.length > 0) {
        const cityId = parseInt(formData.city);
        const foundCity = cityOptions.find(city => city.value === cityId);
        if (foundCity) {
          setSelectedCity(foundCity);
        }
      }
    };
    
    syncSelectsFromFormData();
  }, [formData, stateOptions, cityOptions, selectedState, selectedCity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
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
      
      // Prepare data for API - ensure it's an UPDATE request since we're editing
      const apiData = {
        ...formData,
        // Ensure values are strings
        state: formData.state.toString(),
        city: formData.city.toString(),
        // Include names for better API processing
        state_name: selectedState?.label || formData.state_name || '',
        city_name: selectedCity?.label || formData.city_name || '',
        // Include address ID for update
        address_id: id
      };

      // Use UPDATE endpoint if editing, otherwise CREATE
      const endpoint = id 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/user/update-shipping-address`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/user/add-shipping-address`;
      
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
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
        text: result.message || `Address ${id ? 'updated' : 'saved'} successfully!`,
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
            <h1 className="mb-2 mb-lg-0">{id ? 'Edit Address' : 'Add Address'}</h1>
            <nav className="breadcrumbs">
              <ol>
                <li><a href="/">Home</a></li>
                <li><a href="/user/my-address/">My Addresses</a></li>
                <li className="current">{id ? 'Edit Address' : 'Add Address'}</li>
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

                      <Link aria-current="page" className="w-full justify-center inline-block text-center pt-2 pb-1 mobile-active" href="/user/my-address">
                          <i className="bi bi-geo-alt"></i>
                          <span className="tab tab-home block text-xs">My Address</span>
                      </Link>

                      <Link aria-current="page" className="w-full justify-center inline-block text-center pt-2 pb-1" href="/user/account-setting">
                          <i className="bi bi-gear"></i>
                          <span className="tab tab-home block text-xs">Account Settings</span>
                      </Link>

                      <Link aria-current="page" className="w-full justify-center inline-block text-center pt-2 pb-1" href="#">
                          <i className="bi bi-heart"></i>
                          <span className="tab tab-home block text-xs">Wishlist</span>
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
                        <h2>{id ? 'Edit Address' : 'Add Address'}</h2>
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
                                  className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                                  name="mobile" 
                                  maxLength={10}
                                  placeholder="Enter Phone Number" 
                                  value={formData.mobile} 
                                  onChange={handleInputChange} 
                                  required
                                /> 
                                {errors.mobile && <div className="invalid-feedback d-block">{errors.mobile}</div>}
                              </div>
                              
                              <div className="col-md-12">
                                <label className="form-label">Address *</label>
                                <input 
                                  type="text" 
                                  className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                  name="address" 
                                  placeholder="Enter Address" 
                                  value={formData.address_line_1} 
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
                                  className={`form-control ${errors.postcode ? 'is-invalid' : ''}`}
                                  name="postcode" 
                                  placeholder="Enter Pin Code" 
                                  value={formData.postcode} 
                                  onChange={handleInputChange} 
                                  required
                                />
                                {errors.postcode && <div className="invalid-feedback d-block">{errors.postcode}</div>}
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
                                    {id ? 'Updating...' : 'Saving...'}
                                  </>
                                ) : (id ? 'Update Address' : 'Save Address')}
                              </button>
                              <button 
                                type="button" 
                                className="btn btn-secondary ms-2"
                                onClick={() => router.push('/user/my-address/')}
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