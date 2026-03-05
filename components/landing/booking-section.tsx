'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface BookingSectionProps {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaHref: string;
  features?: string[];
}

export function BookingSection({
  title,
  subtitle,
  ctaText,
  ctaHref,
  features = [
    'Choose your preferred date and time',
    'Select the service you need',
    'Get instant confirmation',
    'Receive reminders before your appointment',
  ],
}: BookingSectionProps) {
  return (
    <section className="bg-linear-to-b from-primary/5 to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mb-8 text-lg text-muted-foreground">{subtitle}</p>
            )}

            <ul className="mb-8 space-y-4">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>

            <Link href={ctaHref}>
              <Button size="lg" className="w-full sm:w-auto">
                {ctaText}
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden shadow-xl">
              <CardHeader className="bg-primary/5 pb-8 pt-8">
                <div className="flex items-center justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Calendar className="h-12 w-12 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Select Date</p>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred date
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Pick Time Slot</p>
                      <p className="text-sm text-muted-foreground">
                        Select available time
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Confirm Booking</p>
                      <p className="text-sm text-muted-foreground">
                        Get instant confirmation
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
