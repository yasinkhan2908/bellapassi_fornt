'use client';

import { useState, useEffect } from 'react'; // ✅ Added useEffect import
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation'; // ✅ Added useRouter
import { Header, Footer } from '../../components/common';

import { AccountSidebar } from './AccountSidebar';

const libraries: ('places')[] = ['places'];

interface FormData {
  address_id: string;
  name: string;
  email: string;
  mobile: string;
  address_line_1: string;
  address_line_2: string;
  landmark: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

interface FormErrors {
  [x: string]: string | undefined;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalcode?: string;
}

interface EditAddressProps {
  id: string;
}

export default function EditAddress({ id }: EditAddressProps) {
    const router = useRouter(); // ✅ Initialize router
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<FormData>({
    address_id: '',
    name: '',
    email: '',
    mobile: '',
    address_line_1: '',
    address_line_2: '',
    landmark: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
  });

  // Custom validation function to replace Parsley.js
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid phone number';
    }

    if (!formData.address_line_1.trim()) {
      newErrors.address_line_1 = 'Address is required';
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

  const onLoad = (autoC: google.maps.places.Autocomplete) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      
      const addressComponents = place.address_components || [];
      const getComponent = (type: string) =>
        addressComponents.find((component) => component.types.includes(type))?.long_name || '';

      setFormData(prev => ({
        ...prev,
        address_line_1: place.formatted_address || '',
        city: getComponent('locality') || getComponent('administrative_area_level_2'),
        state: getComponent('administrative_area_level_1'),
        postalcode: getComponent('postal_code'),
        country: getComponent('country')
      }));

      // Clear errors when address is selected
      setErrors(prev => ({
        ...prev,
        address_line_1: undefined,
        city: undefined,
        state: undefined,
        postalcode: undefined
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
    //   Swal.fire({
    //     title: 'Validation Error',
    //     text: 'Please fill in all required fields correctly',
    //     icon: 'error',
    //     confirmButtonText: 'OK'
    //   });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1️⃣ Get CSRF cookie first
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`);
      
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/update-shipping-address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      console.log("result",result);
      if (!result.success) {
        throw new Error(result.message || 'Something went wrong!');
      }
      
      
      // Reset form
      setFormData({
        address_id: '',
        name: '',
        email: '',
        mobile: '',
        address_line_1: '',
        address_line_2: '',
        landmark: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
      });
      
       Swal.fire({
            title: 'Success',
            text: result.message || 'Address successfully updated!',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#2ee44cff',
            cancelButtonColor: 'rgba(222, 41, 50, 1)',
            confirmButtonText: 'Ok'
        }).then(async (result) => {
            if (result.isConfirmed) {
                router.push('/user/my-address');
            }
        });
      
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Fail to update',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      
    } finally {
      setIsSubmitting(false);
      
    }
  };

  // ✅ Fixed useEffect hook
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/single-shipping-address/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        });
        
        const result = await response.json();
        if (result.data) {
            console.log("result ",result.data);
          setFormData(result.data);
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

    if (id) fetchAddress();
  }, [id]);

  return (
    <main className="main">
        <Header />
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
                            <h2>Update Address</h2>
                            </div>
                            <div className="addresses-grid">
                            <div className="address-card aos-init aos-animate active mb-3" data-aos="fade-up" data-aos-delay="200">
                                <form className="php-email-form settings-form ajaxformfileupload" onSubmit={handleSubmit} method="post">
                                <input type="hidden" name="address_id" value={formData.address_id} />
                                <div className="row g-3">
                                    <div className="col-md-12">
                                    <label className="form-label">Name *</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        name="name" 
                                        placeholder="Enter Name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
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
                                        onChange={handleChange} 
                                    />
                                    </div>
                                    <div className="col-md-6">
                                    <label className="form-label">Phone Number *</label>
                                    <input 
                                        type="tel" 
                                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                        name="phone" 
                                        placeholder="Enter Phone Number" 
                                        value={formData.mobile} 
                                        onChange={handleChange} 
                                    />
                                    {errors.mobile && <div className="invalid-feedback d-block">{errors.mobile}</div>}
                                    </div>
                                    <div className="col-md-12">
                                    <label className="form-label">Address *</label>
                                    <LoadScript
                                        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
                                        libraries={libraries}
                                    >
                                        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                                        <input 
                                            type="text" 
                                            className={`form-control pac-target-input ${errors.address_line_1 ? 'is-invalid' : ''}`}
                                            name="address_line_1" 
                                            placeholder="Enter Address" 
                                            value={formData.address_line_1} 
                                            onChange={handleChange} 
                                        />
                                        </Autocomplete>
                                    </LoadScript>
                                    {errors.address_line_1 && <div className="invalid-feedback d-block">{errors.address_line_1}</div>}
                                    </div>
                                    
                                    <div className="col-md-12">
                                    <label className="form-label">Address Line 2</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="address_line_2" 
                                        placeholder="Enter Address Line 2" 
                                        value={formData.address_line_2} 
                                        onChange={handleChange} 
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
                                        onChange={handleChange}
                                    />
                                    </div>
                                    <div className="col-md-6">
                                    <label className="form-label">State *</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                        name="state" 
                                        placeholder="Enter State" 
                                        value={formData.state} 
                                        onChange={handleChange} 
                                    />
                                    {errors.state && <div className="invalid-feedback d-block">{errors.state}</div>}
                                    </div>
                                    <div className="col-md-6">
                                    <label className="form-label">City *</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                        name="city" 
                                        placeholder="Enter City" 
                                        value={formData.city} 
                                        onChange={handleChange} 
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
                                        onChange={handleChange} 
                                    />
                                    {errors.postcode && <div className="invalid-feedback d-block">{errors.postcode}</div>}
                                    </div>
                                </div>

                                <div className="form-buttons">
                                    <input type="hidden" name="country" value={formData.country} />
                                    <button 
                                    type="submit" 
                                    className="btn btn-primary mt-3"
                                    disabled={isSubmitting}
                                    >
                                    {isSubmitting ? 'Saving...' : 'Save Address'}
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
        <Footer />
    </main>
  );
}