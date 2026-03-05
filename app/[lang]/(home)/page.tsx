'use client';

import {
  HeroSection,
  FeaturesSection,
  SecuritySection,
  BookingSection,
  PricingSection,
  CTASection,
  FooterSection,
} from '@/components/landing';
import {
  Calculator,
  FileText,
  Users,
  Clock,
  Shield,
  Lock,
  Server,
  RefreshCw,
  Calendar,
  MessageSquare,
  BarChart,
  FileCheck,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection
        title="Ascencio Tax Inc."
        subtitle="Your Trusted Partner for Expert Tax Services. Professional accounting, tax preparation, and financial consulting for individuals and businesses."
        ctaPrimary="Get Started"
        ctaSecondary="Book a Consultation"
        ctaPrimaryHref="/signup"
        ctaSecondaryHref="#booking"
      />

      <FeaturesSection
        title="Everything You Need for Your Tax & Accounting Needs"
        subtitle="Comprehensive features designed to simplify your financial management"
        features={[
          {
            icon: Calculator,
            title: 'Tax Preparation',
            description:
              'Expert tax preparation services for individuals and businesses with maximum deductions.',
          },
          {
            icon: FileText,
            title: 'Financial Reporting',
            description:
              'Comprehensive financial reports and statements to help you understand your business.',
          },
          {
            icon: Users,
            title: 'Business Consulting',
            description:
              'Strategic business consulting to help you grow and optimize your operations.',
          },
          {
            icon: BarChart,
            title: 'Bookkeeping Services',
            description:
              'Professional bookkeeping to keep your financial records accurate and up-to-date.',
          },
          {
            icon: FileCheck,
            title: 'Audit Support',
            description:
              'Complete audit support and representation to ensure compliance and peace of mind.',
          },
          {
            icon: MessageSquare,
            title: 'Expert Advisory',
            description:
              'Personalized tax and financial advisory services from experienced professionals.',
          },
        ]}
      />

      <BookingSection
        title="Easy Online Booking"
        subtitle="Schedule your consultation in just a few clicks. Choose a time that works best for you."
        ctaText="Book an Appointment"
        ctaHref="/booking"
      />

      <SecuritySection
        title="Built for Security & Compliance"
        subtitle="Enterprise-grade security with complete regulatory compliance"
        features={[
          {
            icon: Shield,
            title: 'Fully Compliant',
            description: 'CRA and IRS compliant processes and reporting',
          },
          {
            icon: Lock,
            title: 'Bank-Level Security',
            description: 'AES-256 encryption for all sensitive data',
          },
          {
            icon: Server,
            title: 'Secure Hosting',
            description: 'All data hosted securely in certified data centers',
          },
          {
            icon: RefreshCw,
            title: 'Always Updated',
            description: 'Automatic updates with latest tax regulations',
          },
        ]}
      />

      <PricingSection
        title="Simple, Transparent Pricing"
        subtitle="Choose the plan that works best for your needs"
        plans={[
          {
            name: 'Basic',
            price: '$99',
            period: 'month',
            features: [
              'Personal tax preparation',
              'Basic bookkeeping',
              'Email support',
              'Annual tax filing',
              'Financial consultation',
            ],
            ctaText: 'Get Started',
            ctaHref: '/signup',
          },
          {
            name: 'Professional',
            price: '$299',
            period: 'month',
            features: [
              'Everything in Basic',
              'Business tax preparation',
              'Advanced bookkeeping',
              'Quarterly tax planning',
              'Priority support',
              'Financial reports',
              'Audit support',
            ],
            ctaText: 'Get Started',
            ctaHref: '/signup',
            highlighted: true,
          },
          {
            name: 'Enterprise',
            price: 'Custom',
            period: 'month',
            features: [
              'Everything in Professional',
              'Dedicated account manager',
              'Custom integrations',
              'Unlimited consultations',
              '24/7 phone support',
              'Multi-entity management',
              'Custom reporting',
            ],
            ctaText: 'Contact Us',
            ctaHref: '/contact',
          },
        ]}
      />

      <CTASection
        title="Ready to Get Started?"
        description="Join hundreds of satisfied clients who trust us with their tax and accounting needs."
        ctaText="Schedule a Free Consultation"
        ctaHref="/booking"
        variant="gradient"
      />

      <FooterSection
        companyName="Ascencio Tax Inc."
        description="Your trusted partner for expert tax services and financial consulting."
        address="1219 St Clair Ave West Suite G15, Toronto ON M6E 1B5"
        email="ascenciotaxinc@gmail.com"
        phone="(416) 658-1208"
        links={[
          { label: 'About Us', href: '/about' },
          { label: 'Services', href: '/services' },
          { label: 'Booking', href: '/booking' },
          { label: 'Blog', href: '/blog' },
          { label: 'Contact', href: '/contact' },
        ]}
      />
    </div>
  );
}
