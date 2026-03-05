'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description:
        'We strive for excellence in every service we provide, ensuring the highest quality standards.',
    },
    {
      icon: Users,
      title: 'Client-Focused',
      description:
        'Our clients are at the heart of everything we do. Your success is our success.',
    },
    {
      icon: Target,
      title: 'Integrity',
      description:
        'We maintain the highest ethical standards and transparency in all our dealings.',
    },
    {
      icon: Heart,
      title: 'Dedication',
      description:
        'We are dedicated to building long-term relationships with our clients based on trust.',
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 to-background py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">About Us</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Your trusted partner for expert tax services and financial
            consulting
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <Card>
            <CardContent className="p-8 md:p-12">
              <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                At Ascencio Tax Inc., we are committed to providing exceptional
                tax and accounting services that help individuals and businesses
                achieve their financial goals. With years of experience and a
                team of dedicated professionals, we offer comprehensive
                solutions tailored to your unique needs.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="mb-8 text-center text-3xl font-bold">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full transition-all hover:shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-xl font-semibold">
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Why Choose Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-8 md:p-12">
              <h2 className="mb-6 text-3xl font-bold">Why Choose Us</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Expert Team</h3>
                  <p className="text-muted-foreground">
                    Our team consists of certified accountants and tax
                    professionals with extensive experience in Canadian and
                    international tax law.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Personalized Service
                  </h3>
                  <p className="text-muted-foreground">
                    We understand that every client is unique, and we tailor our
                    services to meet your specific needs and goals.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Technology-Driven
                  </h3>
                  <p className="text-muted-foreground">
                    We leverage the latest technology to provide efficient,
                    accurate, and secure financial services.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Year-Round Support
                  </h3>
                  <p className="text-muted-foreground">
                    Tax planning and financial management don't end at tax
                    season. We're here to support you throughout the year.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
