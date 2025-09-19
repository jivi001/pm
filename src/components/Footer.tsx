import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border px-4 py-3 mt-8">
      <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
        <p>{t('footer.platform')} | {t('footer.optimized')}</p>
      </div>
    </footer>
  );
}