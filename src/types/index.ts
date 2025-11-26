import { ReactNode } from "react";

export interface Category {
  id: number;
  name: string;
  seo: string;
  image: string;
}

export interface ManiCategory {
  id: number;
  name: string;
}

export interface PromoItem {
  name: string;
  image: string;
}

export interface ShopItem {
  video: string;
  url: string;
}
export interface LovingItem {
  image: string;
  url: string;
}
interface ProductImage {
  id: number;
  image: string;
  larage: string; // typo from API, can fix later
  medium: string;
  small: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  CateDatas:any;
  id: number;
  name: string;
  slug: string;
  image: string;
  product_name: string;
  medium: string;
  product_image: ProductImage;
  price: number;
  mrp:number;
  discount_price: number;
  rating: number;
  description: string;
  bgColor: string;
  placeholder_color: string;
}

export interface ShopGramProduct {
  image: string;
}
export interface Slide {
  image: string;
  title: string;
  subtitle: string;
  cta: string;
}

export interface SidebarProps {
  show: boolean;
  onClose: () => void;
}

export interface FilterSidebarProps {
  show: boolean;
  onClose: () => void;
}

export type HeaderProps = Record<string, never>;
export type FooterProps = Record<string, never>;
export type HeroSectionProps = Record<string, never>;
export type AccountSidebarProps = Record<string, never>;

export interface Sliders {
    id: string;
    image: string;
    image_url: string;
    sort: string;
    heading: string;
    sub_heading: string;
    url: string;
    // add other fields if needed
}
export interface SliderSectionProps {
  sliders: Sliders[];
}
export interface CategorySectionProps {
  categories: Category[];
}
export interface CategorySectionProps {
  categories: Category[];
}


export interface ComboCategoryProps {
  categories: Category[];
}

export interface SecondCategoryProps {
  categories: Category[];
}

export interface DeliveryOptionProps {
  categories: Category[];
}

export interface AboutStoreProps {
  stores: Category[];
}


export interface PromoSectionProps {
  title: string;
  items: PromoItem[];
}

export interface ShopTheLooksProps {
  title: string;
  items: ShopItem[];
}

export interface CurrentlyLovingProps {
  title: string;
  subtitle: string;
  items: LovingItem[];
}

export interface ProductSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  showViewAll?: boolean;
}

export interface NewArrivalsProps {
  title: string;
  subtitle: string;
  products: Product[];
  showViewAll?: boolean;
}


export interface ShopGramProps {
  title: string;
  subtitle: string;
  products: ShopGramProduct[];
  showViewAll?: boolean;
}

export interface CaughtYourEyeSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  showViewAll?: boolean;
}