// app/privacy-policy/page.tsx
'use client';
import Link from 'next/link';
import Image from "next/image";

export default function ReturnExchange() {
  return (    
    <div className="index-page">
        <main className="main flex-1">
            <div className="page-title light-background mb-3">
                <div className="container d-lg-flex justify-content-between align-items-center">
                    <h1 className="mb-2 mb-lg-0">Return Exchange</h1>
                    <nav className="breadcrumbs">
                        <ol>
                            <li><a href="/">Home</a></li>
                            <li className="current">Return Exchange</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className="container">
                <div className="row gx-sm-3 gx-0 mb-5 pb-5">
                    <p><strong>BellaPassi</strong> is a one-stop shop for everything ranging from casual flats to platform boots, formal heels to party wear pumps, holiday tops to pulled-together blouses, vacation dresses to ethnic outfit, handbags, to lifestyle products. We pay attention to every detail, which means you'll find an elevated aesthetic throughout our entire collection. Designed to make your everyday special and expressive, BellaPassi shoes & clothes are an individualist's greatest style secret. And, the best part? Find Shoes that flatter you & make you feel special.</p>
                    <p><strong>BellaPassi</strong> makes shopping for casual flats, workwear heels, weekend outfits, party dresses, and formal clothes a perfectly positive experience, and once you have your ingenious ensemble pieced together, we invite you to share your outfit ideas with our community of independent women .With an entire community cheering on your individuality and self-expression through tops, bottoms, and amazing accessories, you will undoubtedly feel like the best version of yourself.</p>
                    <p>So, are you ready to rep special occasion dresses to stop traffic, beautiful to steal the spotlight, and shoes to rule the world in? Let your unique spirit shine with BellaPassi shoes, clothing & accessories.</p>
                </div>
            </div>
        </main>
    </div>
  );
}