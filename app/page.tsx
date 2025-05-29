// CombinedPage.tsx
import Link from 'next/link';
import Player from './_components/Player';
import PlayerCSS from './_components/PlayerCss';
import {
  INFINITE_SCROLL_FEED_INITIAL,
  INFINITE_SCROLL_GRID_INITIAL,
  generateOgImageMetaForPhotos
} from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { cache } from 'react';
import { getPhotos } from '@/photo/db/query';
import { GRID_HOMEPAGE_ENABLED } from '@/app/config';
import { NULL_CATEGORY_DATA } from '@/category/data';
import PhotoFeedPage from '@/photo/PhotoFeedPage';
import PhotoGridPage from '@/photo/PhotoGridPage';
import { getDataForCategoriesCached } from '@/category/cache';
import { getPhotosMetaCached } from '@/photo/cache';

export const dynamic = 'force-static';
export const maxDuration = 60;

const getPhotosCached = cache(() =>
  getPhotos({
    limit: GRID_HOMEPAGE_ENABLED ? INFINITE_SCROLL_GRID_INITIAL : INFINITE_SCROLL_FEED_INITIAL
  })
);

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached().catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function CombinedPage() {
  const videoJsOptions = {
    techOrder: ['youtube'],
    autoplay: false,
    controls: true,
    sources: [
      {
        src: 'https://www.youtube.com/watch?v=IxQB14xVas0',
        type: 'video/youtube'
      }
    ]
  };

  const [photos, photosCount, categories] = await Promise.all([
    getPhotosCached().catch(() => []),
    getPhotosMetaCached()
      .then(({ count }) => count)
      .catch(() => 0),
    GRID_HOMEPAGE_ENABLED ? getDataForCategoriesCached() : NULL_CATEGORY_DATA
  ]);

  return (
    <div className="flex h-screen bg-black">
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <svg
          width="283"
          height="64"
          viewBox="0 0 283 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-36 h-36"
          aria-label="Vercel logo"
        >
          <path
            d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H84.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
            fill="white"
          />
        </svg>
        <div className="text-center max-w-screen-sm mb-10">
          <h1 className="text-stone-200 font-bold text-2xl">Next.js + Postgres Auth Starter</h1>
          <p className="text-stone-400 mt-5">
            This is a{' '}
            <a
              href="https://nextjs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 underline hover:text-stone-200 transition-all"
            >
              Next.js
            </a>{' '}
            starter kit that uses{' '}
            <a
              href="https://next-auth.js.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 underline hover:text-stone-200 transition-all"
            >
              NextAuth.js
            </a>{' '}
            for simple email + password login and a{' '}
            <a
              href="https://vercel.com/postgres"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 underline hover:text-stone-200 transition-all"
            >
              Postgres
            </a>{' '}
            database to persist the data.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/protected"
            className="text-stone-400 underline hover:text-stone-200 transition-all"
          >
            Protected Page
          </Link>
          <p className="text-white">·</p>
          <a
            href="https://vercel.com/templates/next.js/prisma-postgres-auth-starter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 underline hover:text-stone-200 transition-all"
          >
            Deploy to Vercel
          </a>
        </div>
        <Player {...videoJsOptions} />
        <PlayerCSS />

        {photos.length > 0 ? (
          GRID_HOMEPAGE_ENABLED ? (
            <PhotoGridPage
              {...{
                photos,
                photosCount,
                ...categories
              }}
            />
          ) : (
            <PhotoFeedPage {...{ photos, photosCount }} />
          )
        ) : (
          <PhotosEmptyState />
        )}
      </div>
    </div>
  );
}
