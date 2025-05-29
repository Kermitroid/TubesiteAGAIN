// CombinedApp.tsx
import 'video.js/dist/video-js.css';
import '../style/index.css';
import '../style/common.css';
import { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ThemeProvider } from 'next-themes';
import AppStateProvider from '@/state/AppStateProvider';
import AppTextProvider from '@/i18n/state/AppTextProvider';
import ToasterWithThemes from '@/toast/ToasterWithThemes';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AppStateProvider>
        <AppTextProvider>
          <ToasterWithThemes />
          <Component {...pageProps} />
          <Analytics debug={false} />
          <SpeedInsights debug={false} />
        </AppTextProvider>
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default MyApp;
