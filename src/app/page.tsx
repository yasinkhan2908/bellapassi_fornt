// app/page.tsx or app/home/page.tsx

import { Navbar, Footer, HeroSection } from '../components/common';
import api from '../lib/axios';
import { 
  CategorySection, 
  AboutStore,
  ComboCategory,
  DeliveryOption,
  NewArrivals,
  ShopGram,
  SecondCategory
} from '../app/home';

export async function generateMetadata() {
  return {
    title: "Bella Passi - Online Fashion | Best Fashion Deals In India",
    description: "Affordable fashion deals for all seasons and styles",
  };
}


export default async function Home() {
  
  // 🟢 Fetch data from Laravel API (server-side)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/home-data`, {
    // cache: 'force-cache', // ensures fresh data each time
    // next: { revalidate: 3600 }, // Cache for 1 hour
    // headers: {
    //   'Cache-Control': 'public, max-age=3600'
    // }
  });
  
  const responseData = await res.json();
  const data = responseData.data;
  //console.log(data.shop_gram);

  const upcomingProducts = [
    {
      id: '1',
      name: 'Star Celeste Mini Pendan...',
      slug: 'Star Celeste Mini Pendan...',
      image: '/img/309209-sss_vertical.webp',
      price: 49,
      discount: 95,
      rating: 5,
      bgColor: 'rgba(249, 192, 200, 0.275)',
    },
    {
      id: '2',
      name: 'Curly Ribbon Bow Gold...',
      slug: 'Curly Ribbon Bow Gold...',
      image: '/img/306107-sss_vertical.webp',
      price: 49,
      discount: 95,
      rating: 5,
      bgColor: 'rgba(249, 192, 200, 0.275)',
    },
  ];

  return (
    <div className="index-page">
      
      <main className="main">
        <HeroSection sliders={data.sliders} />
        <CategorySection categories={data.categories} /> 
        <ComboCategory categories={data.is_home_top} />
        <NewArrivals 
          title="Upcoming Drops"
          subtitle="Help Us to come up with new collection."
          products={data.new_arrival}
        /> 
        <SecondCategory categories={data.is_home_bottom} />
        <ShopGram 
          title="Shop Gram"
          subtitle="Inspire and let yourself be inspired, from one unique fashion to another."
          shopgrams={data.shop_gram}
        />
        <DeliveryOption categories={data.categories}/>
        <AboutStore stores={data.categories} />
      </main>
      
    </div>
  );
}
