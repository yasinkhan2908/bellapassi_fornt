"use client";
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";

export default function CancelOrder({ id, token }: { id: number, token: string }) {
    const router = useRouter();
    
    function handleDelete() {
        Swal.fire({
            title: 'Are you sure?',
            text: "Please provide a reason for cancelling this order",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2ee44cff',
            cancelButtonColor: 'rgba(222, 41, 50, 1)',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it',
            html: `
                <div style="text-align: left;">
                    <p>You won't be able to cancel this order!</p>
                    <div class="form-group" style="margin-top: 15px;">
                        <label for="cancelReason" style="display: block; margin-bottom: 8px; font-weight: 500;">
                            Cancel Reason <span style="color: red;">*</span>
                        </label>
                        <textarea 
                            id="cancelReason" 
                            class="swal2-textarea" 
                            placeholder="Enter reason for cancellation..."
                            rows="4"
                            style="width: 100%; margin: 0; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; resize: vertical;"
                            required
                        ></textarea>
                        <small style="color: #666; display: block; margin-top: 5px;">
                            Please provide a detailed reason for cancellation
                        </small>
                    </div>
                </div>
            `,
            focusConfirm: false,
            preConfirm: () => {
                const reasonInput = document.getElementById('cancelReason') as HTMLTextAreaElement;
                const reason = reasonInput.value.trim();
                
                if (!reason) {
                    Swal.showValidationMessage('Please enter a cancellation reason');
                    return false;
                }
                
                if (reason.length < 5) {
                    Swal.showValidationMessage('Reason must be at least 5 characters long');
                    return false;
                }
                
                if (reason.length > 500) {
                    Swal.showValidationMessage('Reason must be less than 500 characters');
                    return false;
                }
                
                return reason;
            },
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading()
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                const cancelReason = result.value;
                
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/user/user-order-cancel/${id}`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                reason: cancelReason,
                                cancelledAt: new Date().toISOString()
                            }),
                            cache: 'no-store',
                        }
                    );

                    const responseData = await response.json();
                    
                    if (!response.ok || responseData.success === false) {
                        toast.dismiss();
                        toast.error(responseData.message || 'Failed to cancel order!');
                        return;
                    }
                    
                    toast.success('Order cancelled successfully!');
                    
                    // Solution 1: Multiple refresh strategies combined
                    setTimeout(() => {
                        router.refresh();
                    }, 100);
                    
                    // Solution 2: Force push to same route
                    setTimeout(() => {
                        router.push(window.location.pathname + window.location.search);
                    }, 150);
                    
                    // Solution 3: Reload page (simple but effective)
                    // window.location.reload();
                    
                } catch (error) {
                    console.error('Error cancelling order:', error);
                    toast.error('Network error. Please try again.');
                }
            }
        });
    }

    return (
        <button 
            onClick={handleDelete} 
            className="btn btn-danger order-cancelled text-white"
        >
            Cancel Order
        </button>
    );
}