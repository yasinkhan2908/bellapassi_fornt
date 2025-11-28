import ProductDetail from "../[slug]/ProductDetail";
import { notFound } from "next/navigation";
import { Metadata } from "next";



export async function generateStaticParams() {
  // Fetch all product slugs from your API
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/products`, {
    cache: 'no-store',
  });

  if (!res.ok) return [];

  const products = await res.json();

  // Adjust based on your API response structure
  const productList = products.data.products || products;

  return productList.map((product: any) => ({
    slug: product.slug,
  }));
}
// If you need generateMetadata, add it like this:
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  // You can fetch product data here for metadata if needed
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/product-detail/${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return {
      title: 'Product Not Found',
    };
    
  
  }
  if (!res.ok) {
    notFound();       // 👉 this sends user to _not-found page
  }

  const product = await res.json();
  //console.log('product detail',product);
  return {
    title: product.data?.product_name || product.product_name || 'Product Details',
    description: product.data?.product_description || product.product_description || 'Product details page',
    openGraph: {
      title: product.data?.product_name || product.product_name || 'Product Details',
      description: product.data?.product_description || product.product_description || 'Product details page',
      images: product.data?.images || product.images || [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // 👈 Await the params

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/product-detail/${slug}`, {
    cache: 'no-store',
  })

  if (!res.ok) return notFound();

  const product = await res.json();

  return <ProductDetail product={product} />;
}