import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export function LanguageSwitcher() {

  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1" data-testid="language-switcher">
      <Button
        variant={pathname === '/en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => router.push('/en')}
        className="gap-1.5 text-xs font-medium px-3"
        data-testid="button-language-en"
        aria-label="Switch to English"
      >
        <Globe className="h-3.5 w-3.5" />
        EN
      </Button>
      <Button
        variant={pathname === '/es' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => router.push('/es')}
        className="gap-1.5 text-xs font-medium px-3"
        data-testid="button-language-es"
        aria-label="Cambiar a Español"
      >
        <Globe className="h-3.5 w-3.5" />
        ES
      </Button>
    </div>
  );
}
