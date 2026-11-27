export const MAX_UPLOAD_SIZE = 740 * 1024;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('The file is not a valid image'));
    image.src = src;
  });

const loadVideoFrame = (src: string) =>
  new Promise<HTMLVideoElement>((resolve, reject) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.onloadeddata = () => {
      video.currentTime = Math.min(0.1, video.duration / 2 || 0);
    };
    video.onseeked = () => resolve(video);
    video.onerror = () => reject(new Error('The file is not a valid video'));
    video.src = src;
  });

const drawToJpeg = (
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  maxSize: number,
  quality: number,
) => {
  const scale = Math.min(1, maxSize / Math.max(sourceWidth, sourceHeight));
  const width = Math.round(sourceWidth * scale);
  const height = Math.round(sourceHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('The file could not be processed');

  context.fillStyle = '#fff';
  context.fillRect(0, 0, width, height);
  context.drawImage(source, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', quality);
};

export const resizeImage = async (file: File, maxSize: number, quality = 0.85) => {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file');
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    return drawToJpeg(image, image.naturalWidth, image.naturalHeight, maxSize, quality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const captureVideoPoster = async (file: File, maxSize: number, quality = 0.75) => {
  if (!file.type.startsWith('video/')) {
    throw new Error('Please choose a video file');
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const video = await loadVideoFrame(objectUrl);
    return drawToJpeg(video, video.videoWidth, video.videoHeight, maxSize, quality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('The file could not be read'));
    reader.readAsDataURL(file);
  });

export const getDataUrlSize = (dataUrl: string) =>
  Math.ceil(((dataUrl.length - dataUrl.indexOf(',') - 1) * 3) / 4);

export const formatFileSize = (bytes: number) => `${Math.ceil(bytes / 1024)} KB`;
