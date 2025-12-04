"use client";
import { useState } from "react";
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppDispatch } from "../../../../lib/hooks";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Define and export the Order and OrderItem interfaces
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  image?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  transactionId?: string;
  cardHolderName?: string;
  cardLastFour?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
}

interface OrderDetailProps {
  order: Order;
}

export default function OrderDetail({ order }: OrderDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const session = useSession();
  const data = session?.data?.user.token ?? null;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status step based on order status
  const getStatusStep = (status: string): number => {
    const statusMap: Record<string, number> = {
      'pending': 1,
      'processing': 1,
      'confirmed': 1,
      'packed': 2,
      'shipped': 3,
      'delivered': 4,
      'completed': 4
    };
    return statusMap[status.toLowerCase()] || 1;
  };

  const statusStep = getStatusStep(order.status);
  
  return (
    <div className="index-page">
        <main className="main">
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="card invoice">
                            <div className="card-body">
                                <div className="invoice-title">
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <h2>
                                            <span className="small">order #1082</span></h2>
                                        </div>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col-xs-6">
                                        <address>
                                            <strong>Billed To:</strong><br/>
                                            Twitter, Inc.<br/>
                                            795 Folsom Ave, Suite 600<br/>
                                            San Francisco, CA 94107<br/>
                                            <abbr title="Phone">P:</abbr> (123) 456-7890
                                        </address>
                                    </div>
                                    <div className="col-xs-6 text-right">
                                        <address>
                                            <strong>Shipped To:</strong><br/>
                                            Elaine Hernandez<br/>
                                            P. Sherman 42,<br/>
                                            Wallaby Way, Sidney<br/>
                                            <abbr title="Phone">P:</abbr> (123) 345-6789
                                        </address>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-6">
                                        <address>
                                            <strong>Payment Method:</strong><br/>
                                            Visa ending **** 1234<br/>
                                            h.elaine@gmail.com<br/>
                                        </address>
                                    </div>
                                    <div className="col-xs-6 text-right">
                                        <address>
                                            <strong>Order Date:</strong><br/>
                                            17/06/14
                                        </address>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <h3>ORDER SUMMARY</h3>
                                        <table className="table table-striped">
                                            <thead>
                                                <tr className="line">
                                                    <td><strong>#</strong></td>
                                                    <td className="text-center"><strong>PROJECT</strong></td>
                                                    <td className="text-center"><strong>HRS</strong></td>
                                                    <td className="text-right"><strong>RATE</strong></td>
                                                    <td className="text-right"><strong>SUBTOTAL</strong></td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td><strong>Template Design</strong><br/>A website template is a pre-designed webpage, or set of webpages, that anyone can modify with their own content and images to setup a website.</td>
                                                    <td className="text-center">15</td>
                                                    <td className="text-center">$75</td>
                                                    <td className="text-right">$1,125.00</td>
                                                </tr>
                                                <tr>
                                                    <td>2</td>
                                                    <td><strong>Template Development</strong><br/>Web development is a broad term for the work involved in developing a web site for the Internet (World Wide Web) or an intranet (a private network).</td>
                                                    <td className="text-center">15</td>
                                                    <td className="text-center">$75</td>
                                                    <td className="text-right">$1,125.00</td>
                                                </tr>
                                                <tr className="line">
                                                    <td>3</td>
                                                    <td><strong>Testing</strong><br/>Take measures to check the quality, performance, or reliability of (something), especially before putting it into widespread use or practice.</td>
                                                    <td className="text-center">2</td>
                                                    <td className="text-center">$75</td>
                                                    <td className="text-right">$150.00</td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td className="text-right"><strong>Taxes</strong></td>
                                                    <td className="text-right"><strong>N/A</strong></td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td className="text-right"><strong>Total</strong></td>
                                                    <td className="text-right"><strong>$2,400.00</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>									
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </main>
    </div>
  );
}