// app/[categoryName]/page.tsx
import SearchPage from "./SearchPage";
import ClientBootstrap from "../[categoryName]/ClientBootstrap";
import { Metadata } from 'next'
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ categoryName: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchListPage({ params, searchParams }: CategoryPageProps) {
  const { categoryName } = await params;
  const searchParamsObj = await searchParams;
  
  // Get query string parameters
  const query = searchParamsObj.q as string || 'all';
  
  // console.log('query data : ',query);
  // console.log(`${process.env.API_URL}/api/user/search-products/${query}`);
  const productsResponse = await fetch(
    `${process.env.API_URL}/api/user/search-products/${query}`,
    { cache: 'no-store' }
  );
  
  if (!productsResponse.ok) {
    throw new Error('Failed to fetch products');
  }
  
  const json = await productsResponse.json();
  //console.log("search products : ",json);
  const products = json.data?.products?.data || [];
 // console.log("search products : ",products);
  const bgColor = json.data?.bg_color || ['#f9c0c847', '#e2faf9'];
  
  return (
    <>
      <ClientBootstrap />
      <SearchPage 
        categoryName={categoryName}
        initialProducts={products}
        bgColor={bgColor}
        query={query}
        initialPage={json.data?.products?.current_page || 1}
        lastPage={json.data?.products?.last_page || 1}
      />
    </>
  );
}