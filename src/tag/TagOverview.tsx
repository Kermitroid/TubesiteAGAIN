import { Photo, PhotoDateRange } from '@/photo';
import TagHeader from './TagHeader';
import PhotoGridContainer from '@/photo/PhotoGridContainer';

export default function TagOverview({
  tag,
  photos,
  count,
  dateRange,
  animateOnFirstLoadOnly
}: {
  tag: string;
  photos: Photo[];
  count: number;
  dateRange?: PhotoDateRange;
  animateOnFirstLoadOnly?: boolean;
}) {
  return (
    <PhotoGridContainer
      {...{
        cacheKey: `tag-${tag}`,
        photos,
        count,
        tag,
        header: (
          <TagHeader
            {...{
              tag,
              photos,
              count,
              dateRange
            }}
          />
        ),
        animateOnFirstLoadOnly
      }}
    />
  );
}
