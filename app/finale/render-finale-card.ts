import { BITNOB_CARD_LOGO_DATA_URL } from './bitnob-card-logo';

type RenderFinaleCardOptions = {
  firstName: string;
  registrationNumber: string;
  photoUrl: string | null;
  photoPosition: number;
};

const CARD_SIZE = 540;
const OUTPUT_SCALE = 2;

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load card image: ${source.slice(0, 80)}`));
    image.src = source;
  });
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  verticalPosition: number,
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const availableY = image.naturalHeight - sourceHeight;
  const sourceY = Math.max(0, availableY * (verticalPosition / 100));
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
}

function drawPattern(context: CanvasRenderingContext2D) {
  context.fillStyle = '#8142df';
  context.fillRect(0, 0, CARD_SIZE, CARD_SIZE);
  context.fillStyle = '#12081c';

  const tileWidth = 76;
  const tileHeight = 66;
  for (let row = -1; row < 10; row += 1) {
    const offset = row % 2 === 0 ? 0 : tileWidth / 2;
    for (let column = -1; column < 9; column += 1) {
      const centerX = column * tileWidth + offset;
      const centerY = row * tileHeight;
      context.beginPath();
      context.moveTo(centerX, centerY - 23);
      context.lineTo(centerX + 38, centerY);
      context.lineTo(centerX, centerY + 23);
      context.lineTo(centerX - 38, centerY);
      context.closePath();
      context.fill();
    }
  }
}

function drawText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  color: string,
) {
  context.font = font;
  context.fillStyle = color;
  context.fillText(text, x, y);
}

export async function renderFinaleCard({
  firstName,
  registrationNumber,
  photoUrl,
  photoPosition,
}: RenderFinaleCardOptions): Promise<Blob> {
  await document.fonts.ready;
  const pidecLogoUrl = new URL(
    '/logos/Coloured Logo Black text Trans.png',
    window.location.origin,
  ).toString();
  const [pidecLogo, bitnobLogo, photo] = await Promise.all([
    loadImage(pidecLogoUrl),
    loadImage(BITNOB_CARD_LOGO_DATA_URL),
    photoUrl ? loadImage(photoUrl) : Promise.resolve(null),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = CARD_SIZE * OUTPUT_SCALE;
  canvas.height = CARD_SIZE * OUTPUT_SCALE;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas rendering is unavailable');
  context.scale(OUTPUT_SCALE, OUTPUT_SCALE);
  context.textBaseline = 'alphabetic';

  drawPattern(context);
  context.fillStyle = 'rgba(255,255,255,0.5)';
  context.fillRect(19, 19, 502, 502);
  context.fillStyle = '#ffffff';
  context.fillRect(24, 24, 492, 492);

  context.drawImage(pidecLogo, 64, 48, 150, 58);
  drawText(context, 'HEADLINE SPONSOR', 392, 65, '700 8px Arial, sans-serif', '#765784');
  context.drawImage(bitnobLogo, 390, 72, 110, 24);

  context.strokeStyle = '#ede3f5';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(64, 120);
  context.lineTo(476, 120);
  context.stroke();

  context.fillStyle = '#ff5500';
  context.fillRect(95, 175, 180, 210);
  context.fillStyle = '#8e4dff';
  context.fillRect(85, 165, 180, 210);
  context.fillStyle = '#eadff8';
  context.fillRect(92, 172, 166, 196);

  if (photo) {
    drawCoverImage(context, photo, 92, 172, 166, 196, photoPosition);
  } else {
    context.fillStyle = '#2a003b';
    context.fillRect(92, 172, 166, 196);
    context.textAlign = 'center';
    drawText(
      context,
      firstName.slice(0, 1).toUpperCase(),
      175,
      296,
      '700 72px Arial, sans-serif',
      '#ffffff',
    );
    context.textAlign = 'left';
  }

  const safeFirstName = firstName.trim() || 'Guest';
  const firstNameFontSize = safeFirstName.length > 14 ? 15 : safeFirstName.length > 10 ? 17 : 19;
  drawText(
    context,
    safeFirstName,
    294,
    211,
    `600 ${firstNameFontSize}px Arial, sans-serif`,
    '#8e4dff',
  );
  drawText(context, 'IS GOING', 294, 255, '600 39px Arial, sans-serif', '#2a003b');
  drawText(context, 'TO', 294, 292, '600 39px Arial, sans-serif', '#2a003b');
  drawText(context, 'PIDEC 1.0', 294, 329, '700 25px Arial, sans-serif', '#ff5500');
  drawText(context, 'GRAND FINALE', 294, 356, '700 25px Arial, sans-serif', '#ff5500');

  context.strokeStyle = '#ede3f5';
  context.beginPath();
  context.moveTo(64, 425);
  context.lineTo(476, 425);
  context.stroke();

  drawText(
    context,
    'Friday, 28 August 2026',
    64,
    461,
    '700 14px Arial, sans-serif',
    '#2a003b',
  );
  drawText(
    context,
    'J.F. Ajayi Auditorium, University of Lagos',
    64,
    484,
    '400 12px Arial, sans-serif',
    '#684577',
  );

  context.font = '600 11px ui-monospace, monospace';
  const registrationWidth = Math.ceil(context.measureText(registrationNumber).width) + 24;
  const registrationX = 476 - registrationWidth;
  context.fillStyle = '#2a003b';
  context.fillRect(registrationX, 451, registrationWidth, 32);
  drawText(
    context,
    registrationNumber,
    registrationX + 12,
    472,
    '600 11px ui-monospace, monospace',
    '#ffffff',
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not generate the share card'))),
      'image/png',
    );
  });
}
