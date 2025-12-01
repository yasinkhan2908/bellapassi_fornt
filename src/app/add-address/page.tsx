// app/user/add-address/AddAddressForm.tsx
'use client';

import { useState,useEffect,useRef } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation'; // ✅ Added useRouter
import { useSession } from "next-auth/react";
const libraries: ('places')[] = ['places'];
import "select2/dist/css/select2.min.css";


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
interface StateType {
  id: number;
  name: string;
}
interface CityType {
  id: number;
  name: string;
}

export default function AddAddressForm() {
  const session = useSession();
  const data = session?.data?.user.token ?? null;
  console.log("address token ; ",data);
  const router = useRouter(); // ✅ Initialize router
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  
  
  const [States, setStates] = useState<StateType[]>([]);
  const [Cities, setCities] = useState<CityType[]>([]);
  
  const selectRef = useRef<HTMLSelectElement>(null);


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
  const fetchCities = async (stateValue: string) => {
    if (!stateValue) return;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/state-city/${stateValue}`, {
                      cache: 'no-store',
                    });

    if (!response.ok) {
      throw new Error('Failed to fetch city');
    }

    const result = await response.json();
    console.log("All city:", result);
    // Save cities to state
    setCities(result.data.cities);
  };
  const handleChange = async ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "state") {
      await fetchCities(value);
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
      const token = session?.data?.user.token??'';
    }
      const token = session?.data?.user.token??'';
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
              router.push('/address');
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

   useEffect(() => {
      (async () => {
        const $ = (await import("jquery")).default;
        await import("select2");

        if (selectRef.current) {
          $(selectRef.current).select2();
        }
      })();
      const fetchStates = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/states`, {
            cache: 'no-store',
          });

          if (!response.ok) {
            throw new Error('Failed to fetch state');
          }

          const result = await response.json();
          console.log("All State:", result);
          setStates(result.data.states);
        } catch (error) {
          console.error('Error fetching state:', error);
          setStates([]);
        } finally {
          setLoading(false);
        }
      };

      fetchStates();
    }, []); // <-- run once only!


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
                        <div className="col-lg-12">
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
                                            {/* <LoadScript
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
                                            </LoadScript> */}
                                            <input 
                                                  type="text" 
                                                  className={`form-control pac-target-input ${errors.address ? 'is-invalid' : ''}`}
                                                  name="address" 
                                                  placeholder="Enter Address" 
                                                  value={formData.address} 
                                                  onChange={handleChange} 
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
                                            {/* <input 
                                              type="text" 
                                              className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                              name="state" 
                                              placeholder="Enter State" 
                                              value={formData.state} 
                                              onChange={handleChange} 
                                            /> */}

                                            {/* <select className={`form-control pac-target-input ${errors.address ? 'is-invalid' : ''}`} name="address" value={formData.address} onChange={handleChange}>
                                              <option value="">Select Address</option>
                                              {States.map((state) => (
                                                <option value={state.id}>{state.name}</option>
                                              ))}
                                            </select> */}
                                            <select className={`form-control ${errors.state ? 'is-invalid' : ''}`} name="state" value={formData.state} onChange={handleChange}
                                            >
                                              <option value="">Select State</option>
                                              {States.map((state) => (
                                                <option value={state.id}>{state.name}</option>
                                              ))}
                                            </select>
                                            {errors.state && <div className="invalid-feedback d-block">{errors.state}</div>}
                                          </div>
                                          
                                          <div className="col-md-6">
                                            <label className="form-label">City *</label>
                                            {/* <input 
                                              type="text" 
                                              className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                              name="city" 
                                              placeholder="Enter City" 
                                              value={formData.city} 
                                              onChange={handleChange} 
                                            /> */}
                                            <select className={`form-control ${errors.city ? 'is-invalid' : ''}`} name="city" value={formData.city} onChange={handleChange}
                                            >
                                              <option value="">Select city</option>
                                              {Cities.map((city) => (
                                                <option value={city.id}>{city.name}</option>
                                              ))}
                                            </select>
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

