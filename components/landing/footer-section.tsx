'use client';

import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSectionProps {
  companyName: string;
  description?: string;
  address?: string;
  email?: string;
  phone?: string;
  links?: FooterLink[];
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export function FooterSection({
  companyName,
  description,
  address,
  email,
  phone,
  links,
  socialLinks,
}: FooterSectionProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xl font-bold">{companyName}</h3>
            {description && (
              <p className="mb-4 text-sm text-muted-foreground">
                {description}
              </p>
            )}
            <div className="space-y-2 text-sm">
              {address && (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">{address}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${email}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {email}
                  </a>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${phone}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Links */}
          {links && links.length > 0 && (
            <div>
              <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Links (placeholder for future implementation) */}
          {socialLinks && (
            <div>
              <h4 className="mb-4 text-sm font-semibold">Follow Us</h4>
              <div className="flex gap-4">
                {/* Social media icons would go here */}
              </div>
            </div>
          )}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>
            © {currentYear} {companyName}. All Rights Reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
