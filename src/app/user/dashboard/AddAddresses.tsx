// app/user/add-address/AddAddressForm.tsx
'use client';

import { useState } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation'; // ✅ Added useRouter

const libraries: ('places')[] = ['places'];

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  address_line_2: string;
  landmark: string;
  city: string;
  state: string;
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

export function AddAddressForm() {
  const router = useRouter(); // ✅ Initialize router
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    address_line_2: '',
    landmark: '',
    city: '',
    state: '',
    postalcode: '',
    country: '',
  });

  // Custom validation function to replace Parsley.js
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.postalcode.trim()) {
      newErrors.postalcode = 'Postal code is required';
    } else if (!/^\d{4,10}$/.test(formData.postalcode.replace(/\s/g, ''))) {
      newErrors.postalcode = 'Please enter a valid postal code';
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
        address: place.formatted_address || '',
        city: getComponent('locality') || getComponent('administrative_area_level_2'),
        state: getComponent('administrative_area_level_1'),
        postalcode: getComponent('postal_code'),
        country: getComponent('country')
      }));

      // Clear errors when address is selected
      setErrors(prev => ({
        ...prev,
        address: undefined,
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
      // Swal.fire({
      //   title: 'Validation Error',
      //   text: 'Please fill in all required fields correctly',
      //   icon: 'error',
      //   confirmButtonText: 'OK'
      // });
      return;
    }

    setIsSubmitting(true);

    // try {
      //console.log(`${process.env.NEXT_PUBLIC_API_URL}/api/user/add-shipping-address`);
      if (typeof window !== "undefined") {
      // safe to use window, document, localStorage, etc.
      const token = localStorage.getItem("token");
    }
      const token = window.localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/add-shipping-address`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // include login token
          },
          body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      //console.log("form process",result);
      if (!result.success) {
        throw new Error(result.message || 'Something went wrong!');
      }

      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        address_line_2: '',
        landmark: '',
        city: '',
        state: '',
        postalcode: '',
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
      
    // } catch (error) {
    //   Swal.fire({
    //     title: 'Error',
    //     text: error instanceof Error ? error.message : 'Failed. Please try again.',
    //     icon: 'error',
    //     confirmButtonText: 'OK'
    //   });
    // } finally {
    //   setIsSubmitting(false);
    // }
  };



  return (
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
            value={formData.phone} 
            onChange={handleChange} 
          />
          {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
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
                className={`form-control pac-target-input ${errors.address ? 'is-invalid' : ''}`}
                name="address" 
                placeholder="Enter Address" 
                value={formData.address} 
                onChange={handleChange} 
              />
            </Autocomplete>
          </LoadScript>
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
            className={`form-control ${errors.postalcode ? 'is-invalid' : ''}`}
            name="postalcode" 
            placeholder="Enter Pin Code" 
            value={formData.postalcode} 
            onChange={handleChange} 
          />
          {errors.postalcode && <div className="invalid-feedback d-block">{errors.postalcode}</div>}
        </div>
        
        <input type="hidden" name="country" value={formData.country} />
      </div>

      <div className="form-buttons">
        <button 
          type="submit" 
          className="btn btn-primary mt-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Address'}
        </button>
      </div>
    </form>
  );
}