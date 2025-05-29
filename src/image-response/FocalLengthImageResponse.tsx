import type { Photo } from '../photo';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import type { NextImageSize } from '@/platforms/next-image';
import { formatFocalLength } from '@/focal';
import IconFocalLength from '@/components/icons/IconFocalLength';

export default function FocalLengthImageResponse({
  focal,
  photos,
  width,
  height,
  fontFamily
}: {
  focal: number;
  photos: Photo[];
  width: NextImageSize;
  height: number;
  fontFamily: string;
}) {
  return (
    <ImageContainer solidBackground={photos.length === 0}>
      <ImagePhotoGrid
        {...{
          photos,
          width,
          height
        }}
      />
      <ImageCaption
        {...{
          width,
          height,
          fontFamily,
          icon: (
            <span
              style={{
                display: 'flex',
                transform: `translateY(${height * 0.002}px)`,
                marginRight: height * 0.01
              }}
            >
              <IconFocalLength size={height * 0.075} />
            </span>
          ),
          title: formatFocalLength(focal)
        }}
      />
    </ImageContainer>
  );
}
