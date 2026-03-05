'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  title: string;
  description?: string;
  ctaText: string;
  ctaHref: string;
  variant?: 'default' | 'gradient';
}

export function CTASection({
  title,
  description,
  ctaText,
  ctaHref,
  variant = 'default',
}: CTASectionProps) {
  return (
    <section
      className={`py-20 md:py-32 ${
        variant === 'gradient'
          ? 'bg-linear-to-r from-primary to-primary/80 text-primary-foreground'
          : 'bg-muted/50'
      }`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {description && (
            <p
              className={`mb-8 text-lg ${
                variant === 'gradient'
                  ? 'text-primary-foreground/90'
                  : 'text-muted-foreground'
              }`}
            >
              {description}
            </p>
          )}
          <Link href={ctaHref}>
            <Button
              size="lg"
              variant={variant === 'gradient' ? 'secondary' : 'default'}
              className="text-lg"
            >
              {ctaText}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
