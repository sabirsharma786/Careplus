import React, { useState, useEffect } from 'react';

const CUSTOM_LOGO_STORAGE_KEY = 'careplus_original_logo_v1';
const LOGO_UPDATED_EVENT = 'careplus-logo-updated';

export const setCustomLogoFile = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string;
    if (dataUrl) {
      try {
        localStorage.setItem(CUSTOM_LOGO_STORAGE_KEY, dataUrl);
        window.dispatchEvent(new Event(LOGO_UPDATED_EVENT));
      } catch {
        // Fallback if storage quota exceeded
      }
    }
  };
  reader.readAsDataURL(file);
};

export const resetCustomLogoFile = () => {
  try {
    localStorage.removeItem(CUSTOM_LOGO_STORAGE_KEY);
    window.dispatchEvent(new Event(LOGO_UPDATED_EVENT));
  } catch {
    // Ignore storage error
  }
};

export const hasCustomLogoFile = (): boolean => {
  try {
    return Boolean(localStorage.getItem(CUSTOM_LOGO_STORAGE_KEY));
  } catch {
    return false;
  }
};

interface CarePlusLogoProps {
  className?: string;
}

export const CarePlusLogo: React.FC<CarePlusLogoProps> = ({
  className = 'h-8 sm:h-9 md:h-10 w-auto object-contain'
}) => {
  const [logoSrc, setLogoSrc] = useState<string>(() => {
    try {
      return localStorage.getItem(CUSTOM_LOGO_STORAGE_KEY) || '/careplus-logo.png';
    } catch {
      return '/careplus-logo.png';
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setLogoSrc(localStorage.getItem(CUSTOM_LOGO_STORAGE_KEY) || '/careplus-logo.png');
      } catch {
        setLogoSrc('/careplus-logo.png');
      }
    };
    window.addEventListener(LOGO_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(LOGO_UPDATED_EVENT, handleUpdate);
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLImageElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCustomLogoFile(file);
    }
  };

  return (
    <img
      src={logoSrc}
      alt="carePLUS"
      className={`${className} select-none`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      draggable={false}
    />
  );
};
