import html2canvas from 'html2canvas';
import { useState } from 'react';
import type { RefObject } from 'react';

// Set VITE_INSTAGRAM_HANDLE in Netlify once the account name is finalized.
const INSTAGRAM_HANDLE =
  import.meta.env.VITE_INSTAGRAM_HANDLE?.replace(/^@/, '') || 'moua_studio';
const shareText = `Mi look de Studio Moua ✦ @${INSTAGRAM_HANDLE}`;
const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1350;
const EXPORT_CHARACTER_WIDTH = 648;

/**
 * html2canvas creates a separate document to render the image. Give that clone
 * a fixed 4:5 portrait layout instead of inheriting the browser's responsive
 * viewport and dynamic-viewport (`dvh`) calculations.
 */
function centerCaptureFrame(documentClone: Document, originalStage: HTMLDivElement) {
  const stage = documentClone.querySelector<HTMLDivElement>('.character-stage');
  const character = documentClone.querySelector<HTMLDivElement>('.character-asset-stack');

  if (!stage || !character) return;

  const mobileBackground = originalStage.style.getPropertyValue('--mobile-background');
  const important = 'important';

  stage.style.setProperty('position', 'relative', important);
  stage.style.setProperty('inset', 'auto', important);
  stage.style.setProperty('width', `${EXPORT_WIDTH}px`, important);
  stage.style.setProperty('height', `${EXPORT_HEIGHT}px`, important);
  stage.style.setProperty('background-image', mobileBackground, important);
  stage.style.setProperty('background-size', 'cover', important);
  stage.style.setProperty('background-position', 'center', important);

  character.style.setProperty('left', '50%', important);
  character.style.setProperty('right', 'auto', important);
  character.style.setProperty('top', 'auto', important);
  character.style.setProperty('bottom', '5%', important);
  character.style.setProperty('width', `${EXPORT_CHARACTER_WIDTH}px`, important);
  character.style.setProperty('transform', 'translateX(-50%)', important);
  character.style.setProperty('animation', 'none', important);
}

interface ShareLookButtonProps {
  stageRef: RefObject<HTMLDivElement | null>;
  isLookComplete: boolean;
}

async function canvasToFile(canvas: HTMLCanvasElement): Promise<File> {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png'),
  );

  if (!blob) {
    throw new Error('The look image could not be created.');
  }

  return new File([blob], 'mi-look-studio-moua.png', { type: 'image/png' });
}

function download(file: File) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  URL.revokeObjectURL(url);
}

export function ShareLookButton({ stageRef, isLookComplete }: ShareLookButtonProps) {
  const [status, setStatus] = useState<'idle' | 'capturing' | 'downloaded' | 'error'>('idle');

  const shareLook = async () => {
    const stage = stageRef.current;
    if (!stage || !isLookComplete || status === 'capturing') return;

    setStatus('capturing');

    try {
      const canvas = await html2canvas(stage, {
        backgroundColor: '#0e0d19',
        width: EXPORT_WIDTH,
        height: EXPORT_HEIGHT,
        windowWidth: EXPORT_WIDTH,
        windowHeight: EXPORT_HEIGHT,
        scale: Math.min(window.devicePixelRatio || 1, 2),
        useCORS: true,
        logging: false,
        onclone: (documentClone) => centerCaptureFrame(documentClone, stage),
      });
      const image = await canvasToFile(canvas);
      const shareData = { files: [image], text: shareText, title: 'Mi look de Studio Moua' };

      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        setStatus('idle');
        return;
      }

      download(image);
      setStatus('downloaded');
    } catch (error) {
      // Choosing "Cancel" in the native share sheet is not an error worth surfacing.
      if (error instanceof DOMException && error.name === 'AbortError') {
        setStatus('idle');
        return;
      }

      setStatus('error');
    }
  };

  const label = status === 'capturing' ? 'Creando tu look…' : 'Compartir mi look';

  return (
    <div className='share-look-control'>
      <button
        className='share-look-button'
        disabled={!isLookComplete || status === 'capturing'}
        onClick={shareLook}
        type='button'
      >
        <span aria-hidden='true'>↗</span>
        {label}
      </button>
      {!isLookComplete && <p role='status'>Completa tu look para compartirlo.</p>}
      {status === 'downloaded' && (
        <p role='status'>
          Imagen descargada. Súbela a Instagram y etiqueta @{INSTAGRAM_HANDLE}.
        </p>
      )}
      {status === 'error' && (
        <p role='status'>No pudimos crear la imagen. Inténtalo de nuevo.</p>
      )}
    </div>
  );
}
