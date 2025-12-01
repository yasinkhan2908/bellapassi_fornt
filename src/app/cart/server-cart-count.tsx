// app/components/server-cart-count.tsx
import { cookies } from 'next/headers';
import Link from "next/link";
export async function ServerCartCount() {
  const cookieStore = cookies();
  const cartCount = (await cookieStore).get('cart_items');
  const count = cartCount ? parseInt(cartCount.value, 10) : 0;

  return (
    
    <Link href="/cart" className="header-action-btn" prefetch={false}>
        <i className="bi bi-cart3"></i>
        <span className="badge">{count}</span>
    </Link>
  );
}