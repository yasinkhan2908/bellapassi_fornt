// app/privacy-policy/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Stores - BellaPassi | Your Data Protection and Privacy',
  description: 'Read BellaPassi\'s Our Stores to understand how we protect your personal information, data security measures, and your privacy rights when shopping with us.',
  keywords: [
    'Our Stores', 'BellaPassi privacy', 'data protection', 'user privacy', 
    'information security', 'personal data', 'confidentiality', 'shoes privacy',
    'clothing privacy', 'online shopping privacy', 'fashion privacy', 'e-commerce privacy',
    'customer data protection', 'GDPR compliance', 'privacy statement', 'terms of privacy'
  ].join(', '),
  authors: [{ name: 'BellaPassi' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Our Stores - BellaPassi',
    description: 'Learn how BellaPassi protects your privacy and personal data when you shop for shoes, clothing, and accessories.',
    type: 'website',
    url: 'https://bellapassi.com/privacy-policy',
  },
  twitter: {
    card: 'summary',
    title: 'Our Stores - BellaPassi',
    description: 'Your privacy matters. Read how we protect your data at BellaPassi.',
  },
  alternates: {
    canonical: 'https://bellapassi.com/privacy-policy',
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}