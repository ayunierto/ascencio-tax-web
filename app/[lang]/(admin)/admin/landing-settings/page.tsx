'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save, Eye, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function LandingSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Hero Section State
  const [heroTitle, setHeroTitle] = useState('Ascencio Tax Inc.');
  const [heroSubtitle, setHeroSubtitle] = useState(
    'Your Trusted Partner for Expert Tax Services. Professional accounting, tax preparation, and financial consulting for individuals and businesses.',
  );
  const [heroPrimaryCTA, setHeroPrimaryCTA] = useState('Get Started');
  const [heroSecondaryCTA, setHeroSecondaryCTA] = useState(
    'Book a Consultation',
  );

  // Company Info State
  const [companyName, setCompanyName] = useState('Ascencio Tax Inc.');
  const [companyEmail, setCompanyEmail] = useState('ascenciotaxinc@gmail.com');
  const [companyPhone, setCompanyPhone] = useState('(416) 658-1208');
  const [companyAddress, setCompanyAddress] = useState(
    '1219 St Clair Ave West Suite G15, Toronto ON M6E 1B5',
  );

  // Features Toggle
  const [showFeatures, setShowFeatures] = useState(true);
  const [showSecurity, setShowSecurity] = useState(true);
  const [showBooking, setShowBooking] = useState(true);
  const [showPricing, setShowPricing] = useState(true);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save settings to backend (implement this endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Landing Page Settings</h1>
          <p className="text-muted-foreground">
            Customize your landing page content and appearance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/" target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </a>
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="company">Company Info</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Main Title</Label>
                <Input
                  id="hero-title"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="hero-subtitle">Subtitle</Label>
                <Textarea
                  id="hero-subtitle"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="hero-primary-cta">Primary Button Text</Label>
                  <Input
                    id="hero-primary-cta"
                    value={heroPrimaryCTA}
                    onChange={(e) => setHeroPrimaryCTA(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="hero-secondary-cta">
                    Secondary Button Text
                  </Label>
                  <Input
                    id="hero-secondary-cta"
                    value={heroSecondaryCTA}
                    onChange={(e) => setHeroSecondaryCTA(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sections Visibility */}
        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Section Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-features" className="text-base">
                    Features Section
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display the features section on the landing page
                  </p>
                </div>
                <Switch
                  id="show-features"
                  checked={showFeatures}
                  onCheckedChange={setShowFeatures}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-security" className="text-base">
                    Security Section
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display the security & compliance section
                  </p>
                </div>
                <Switch
                  id="show-security"
                  checked={showSecurity}
                  onCheckedChange={setShowSecurity}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-booking" className="text-base">
                    Booking Section
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display the appointment booking section
                  </p>
                </div>
                <Switch
                  id="show-booking"
                  checked={showBooking}
                  onCheckedChange={setShowBooking}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-pricing" className="text-base">
                    Pricing Section
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display the pricing plans section
                  </p>
                </div>
                <Switch
                  id="show-pricing"
                  checked={showPricing}
                  onCheckedChange={setShowPricing}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Info */}
        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="company-email">Email</Label>
                <Input
                  id="company-email"
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="company-phone">Phone</Label>
                <Input
                  id="company-phone"
                  type="tel"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="company-address">Address</Label>
                <Textarea
                  id="company-address"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-muted bg-muted/50 p-4">
                <div className="flex items-start gap-4">
                  <Settings className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold">Advanced Customization</h3>
                    <p className="text-sm text-muted-foreground">
                      Additional customization options like custom CSS,
                      analytics integration, and more will be available in
                      future updates.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
