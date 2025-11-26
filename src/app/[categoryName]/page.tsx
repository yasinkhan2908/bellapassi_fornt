// app/[categoryName]/page.tsx
import ClientCategory from "./ClientCategory";
import ClientBootstrap from "./ClientBootstrap";
import { Metadata } from 'next'

//export const revalidate = 3600;

// Build-time generation for static export
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/categories`, {
      cache: "no-store",
    });

    const json = await res.json();

    //console.log("API JSON:", json);

    // ✅ Handle all possible structures
    let categories: any[] = [];

    if (Array.isArray(json)) {
      // If API directly returns an array
      categories = json;
    } else if (Array.isArray(json.data)) {
      // If API returns { data: [...] }
      categories = json.data;
    } else if (Array.isArray(json.data?.categories)) {
      // If API returns { data: { categories: [...] } }
      categories = json.data.categories;
    } else {
      console.warn("⚠️ No valid categories array found in API response.");
    }

    // ✅ Map only if array exists
    const params = categories.map((c: any) => ({
      categoryName: c.seo || c.slug || c.name || "unknown",
    }));

    console.log("Generated category params:", params);

    return params;
  } catch (err) {
    console.error("❌ Error generating static params:", err);
    return [];
  }
}

// FIX: Await params in generateMetadata
export async function generateMetadata({ params }: { params: Promise<{ categoryName: string }> }): Promise<Metadata> {
  const { categoryName } = await params; // 👈 Await the params
  
  //console.log(categoryName);
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/category/${categoryName}`, {
    cache: 'no-store',
  })
  const meta = await res.json()
  
  return {
    title: meta.data.categories.name,
    description: meta.data.categories.description,
    openGraph: {
      title: meta.data.categories.name,
      description: meta.data.categories.description,
    },
  }
}



// FIX: Await params in the page component
export default async function CategoryPage({ params }: { params: Promise<{ categoryName: string }> }) {
  const { categoryName } = await params; // 👈 Await the params
  //get category all attributes
  
  console.log(`${process.env.NEXT_PUBLIC_API_URL}/api/user/category-detail/${categoryName}`);
  const catDetail = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/category-detail/${categoryName}`, {
    cache: 'no-store',
  })
  const catDetailJson = await catDetail.json()
  console.log("category fields",catDetailJson);
  const CateData = Array.isArray(catDetailJson) ? catDetailJson : catDetailJson.data.category_field;
  // since you already extracted the data in the line above
  const CateDatas = CateData.data || CateData;
  //console.log("category products bg_color",json.data.bg_color);
  //
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/category-products/${categoryName}`, {
    cache: 'no-store',
  })
  const json = await res.json()
  const product = Array.isArray(json) ? json : json.data.products;
  // since you already extracted the data in the line above
  const products = product.data || product;
  //console.log("category products bg_color",json.data.bg_color);
  return (
    <>
      <ClientBootstrap />
      <ClientCategory CateDatas={CateDatas} categoryName={categoryName} products={products} initialPage={product.current_page}
      lastPage={product.last_page} bgColor={json.data.bg_color} />
    </>
  );
}