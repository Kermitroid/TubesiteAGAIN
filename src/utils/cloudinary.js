import { cloudinaryErrorsConverter, ERROR_CODE } from '../plugins/cloudinary/common';
import { find } from 'utils/find';

const GET_ERROR_DEFAULT_REQUEST = { method: 'head' };
const ERROR_WITH_GET_REQUEST = {
  method: 'get',
  credentials: 'include',
  headers: { 'Content-Range': 'bytes=0-0' }
};

const getGoodSrcs = (srcs, parsedUris) => {
  return srcs.filter(s => {
    const origUrl = new URL(s.src);
    return parsedUris.indexOf(origUrl.host + origUrl.pathname) !== -1 && s.try !== true;
  });
};

const getParsedUris = res => {
  return res.reduce((acc, r) => {
    if (r.status >= 200 && r.status < 399 && r.url !== '') {
      const parsedUri = new URL(r.url);
      acc.push(parsedUri.host + parsedUri.pathname);
    }

    return acc;
  }, []);
};

const setError = (that, res) => {
  that.videojs.error(
    cloudinaryErrorsConverter({
      errorMsg: res.headers.get('x-cld-error') || '',
      publicId: that.currentPublicId(),
      cloudName: that.cloudinaryConfig().cloud_name,
      error: res,
      statusCode: res.status
    })
  );
};

const setVideoSrc = (that, srcs) => {
  if (that.options.playerOptions.debug) {
    console.log('Trying sources: ', srcs);
  }
  srcs.forEach(s => {
    s.try = true;
  });
  that.videojs.autoplay(that.videojs.autoplay() || that.playWasCalled);
  that.videojs.src(srcs);
};

const handleCldError = (that, options) => {
  const srcs = that.videojs.cloudinary.getCurrentSources();
  const opts = options.fetchErrorUsingGet ? ERROR_WITH_GET_REQUEST : GET_ERROR_DEFAULT_REQUEST;
  opts.credentials = options.withCredentials ? 'include' : 'omit';

  if (srcs.length > 0) {
    Promise.all(srcs.map(s => fetch(s.src, opts)))
      .then(res => {
        const parsedUris = getParsedUris(res);
        const firstRes = res[0];
        if (!parsedUris.length) {
          setError(that, firstRes);
        } else {
          const goodSrcs = getGoodSrcs(srcs, parsedUris);

          if (goodSrcs && goodSrcs.length) {
            setVideoSrc(that, goodSrcs);
          } else {
            that.videojs.error({
              code: ERROR_CODE.NO_SUPPORTED_MEDIA,
              message: 'No supported media sources',
              statusCode: res.status
            });
          }
        }
      })
      .catch(error => {
        that.videojs.error({
          code: 7,
          message: error && error.message ? error.message : 'Failed to test sources'
        });
      });
  } else {
    that.videojs.error({
      code: ERROR_CODE.NO_SUPPORTED_MEDIA,
      message: 'No supported media sources'
    });
  }
};

/**
 * Check if key exist in transformation
 * @param transformation
 * @param key
 * @returns true if key exists in transformation, false otherwise
 */
const isKeyInTransformation = (transformation, key) => {
  if (!transformation || !key) {
    return false;
  }

  // transformation is an array so run this function for each item
  if (Array.isArray(transformation)) {
    return !!find(transformation, t => isKeyInTransformation(t, key));
  }

  // transformation is a Transformation object so use getValue() to check key
  if (transformation.getValue) {
    return !!transformation.getValue(key);
  }

  // transformation is an Object so just check for key existence in object
  return !!transformation[key];
};

const addTextTracks = (tracks, videojs) => {
  tracks.forEach(track => {
    if (track.src && track.src.endsWith('.vtt')) {
      fetch(track.src, GET_ERROR_DEFAULT_REQUEST).then(r => {
        if (r.status >= 200 && r.status <= 399) {
          videojs.addRemoteTextTrack(track, true);
        }
      });
    } else if (track.src && track.src.endsWith('.srt')) {
      videojs.srtTextTracks(track);
    } else if (videojs.pacedTranscript && (!track.src || track.src.endsWith('.transcript'))) {
      videojs.pacedTranscript(track);
    }
  });
};

export { handleCldError, isKeyInTransformation, addTextTracks };
