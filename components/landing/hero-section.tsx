'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary?: string;
  ctaPrimaryHref: string;
  ctaSecondaryHref?: string;
  imageSrc?: string;
}

export function HeroSection({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  ctaPrimaryHref,
  ctaSecondaryHref,
  imageSrc,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-primary/5 to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              {subtitle}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href={ctaPrimaryHref}>
                <Button size="lg" className="w-full sm:w-auto">
                  {ctaPrimary}
                </Button>
              </Link>
              {ctaSecondary && ctaSecondaryHref && (
                <Link href={ctaSecondaryHref}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    {ctaSecondary}
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>

          {imageSrc && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <img
                src={imageSrc}
                alt="Hero"
                className="h-auto w-full rounded-lg shadow-2xl"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
