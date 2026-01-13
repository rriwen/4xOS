import { useAtom } from 'jotai';
import { useRef, useState, useEffect } from 'preact/hooks';
import { useOutsideClick } from '__/hooks';
import { useTheme } from '__/hooks/use-theme';
import {
  lightWallpaperAtom,
  darkWallpaperAtom,
  customWallpapersAtom,
  addCustomWallpaperAtom,
  removeCustomWallpaperAtom,
} from '__/stores/wallpaper.store';
import type { WallpaperState } from '__/stores/wallpaper.store';
import { builtinWallpapers } from '__/data/wallpapers';
import { uploadImage, handleDragOver, handleDragEnter, handleDragLeave, handleDrop } from '__/helpers/image-upload';
import type { ImageUploadError } from '__/helpers/image-upload';
import css from './WallpaperPicker.module.scss';

type WallpaperPickerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const WallpaperPicker = ({ isOpen, onClose }: WallpaperPickerProps) => {
  const [theme] = useTheme();
  const modalRef = useRef<HTMLDivElement>();
  const fileInputRef = useRef<HTMLInputElement>();
  const uploadAreaRef = useRef<HTMLDivElement>();

  const [lightWallpaper, setLightWallpaper] = useAtom(lightWallpaperAtom);
  const [darkWallpaper, setDarkWallpaper] = useAtom(darkWallpaperAtom);
  const [customWallpapers] = useAtom(customWallpapersAtom);
  const [, addCustomWallpaper] = useAtom(addCustomWallpaperAtom);
  const [, removeCustomWallpaper] = useAtom(removeCustomWallpaperAtom);

  const [activeTab, setActiveTab] = useState<'light' | 'dark'>(theme);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 当前主题对应的墙纸状态
  const currentWallpaper = activeTab === 'light' ? lightWallpaper : darkWallpaper;

  useOutsideClick(modalRef, () => {
    if (isOpen) onClose();
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // 同步 activeTab 与当前主题
  useEffect(() => {
    if (isOpen) {
      setActiveTab(theme);
    }
  }, [theme, isOpen]);

  const handleSelectWallpaper = (type: 'builtin' | 'custom', value: string) => {
    const newState: WallpaperState = { type, value };
    if (activeTab === 'light') {
      setLightWallpaper(newState);
    } else {
      setDarkWallpaper(newState);
    }
    onClose();
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const result = await uploadImage(file, true);
          addCustomWallpaper({
            name: result.name,
            data: result.data,
            size: result.size,
          });
        } catch (err) {
          const error = err as ImageUploadError;
          setUploadError(error.message);
          break;
        }
      }
    } catch (err) {
      const error = err as ImageUploadError;
      setUploadError(error.message || '上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: any) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      handleFileSelect(target.files);
      target.value = ''; // 重置 input
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOverEvent = (e: any) => {
    handleDragOver(e as DragEvent);
    setIsDragging(true);
  };

  const handleDragEnterEvent = (e: any) => {
    handleDragEnter(e as DragEvent);
  };

  const handleDragLeaveEvent = (e: any) => {
    handleDragLeave(e as DragEvent);
    setIsDragging(false);
  };

  const handleDropEvent = (e: any) => {
    setIsDragging(false);
    const files = handleDrop(e as DragEvent);
    if (files) {
      handleFileSelect(files as any);
    }
  };

  const handleDeleteCustomWallpaper = (id: string, e: any) => {
    e.stopPropagation();
    if (confirm('确定要删除这张墙纸吗？')) {
      removeCustomWallpaper(id);
    }
  };

  if (!isOpen) return null;

  return (
    <div class={css.overlay}>
      <div class={css.modal} ref={modalRef}>
        <div class={css.header}>
          <h2 class={css.title}>更改桌面背景</h2>
          <button class={css.closeButton} onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>

        <div class={css.tabs}>
          <button
            class={`${css.tab} ${activeTab === 'light' ? css.active : ''}`}
            onClick={() => setActiveTab('light')}
          >
            浅色主题
          </button>
          <button
            class={`${css.tab} ${activeTab === 'dark' ? css.active : ''}`}
            onClick={() => setActiveTab('dark')}
          >
            深色主题
          </button>
        </div>

        <div class={css.content}>
          <div class={css.section}>
            <h3 class={css.sectionTitle}>内置墙纸</h3>
            <div class={css.wallpaperGrid}>
              {builtinWallpapers.map((filename) => {
                const isSelected =
                  currentWallpaper.type === 'builtin' && currentWallpaper.value === filename;
                return (
                  <div
                    key={filename}
                    class={`${css.wallpaperItem} ${isSelected ? css.selected : ''}`}
                    onClick={() => handleSelectWallpaper('builtin', filename)}
                  >
                    <img
                      src={`/assets/wallpapers/${filename}`}
                      alt={filename}
                      loading="lazy"
                    />
                    {isSelected && <div class={css.checkmark}>✓</div>}
                  </div>
                );
              })}
            </div>
          </div>

          <div class={css.section}>
            <h3 class={css.sectionTitle}>自定义墙纸</h3>
            <div
              class={`${css.uploadArea} ${isDragging ? css.dragging : ''}`}
              ref={uploadAreaRef}
              onDragOver={handleDragOverEvent}
              onDragEnter={handleDragEnterEvent}
              onDragLeave={handleDragLeaveEvent}
              onDrop={handleDropEvent}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                class={css.hiddenInput}
                onChange={handleFileInputChange}
              />
              <button class={css.uploadButton} onClick={handleUploadClick} disabled={uploading}>
                {uploading ? '上传中...' : '上传图片'}
              </button>
              <p class={css.uploadHint}>支持 JPG、PNG、WEBP 格式，最大 10MB</p>
              {uploadError && <p class={css.errorMessage}>{uploadError}</p>}
            </div>

            {customWallpapers.length > 0 && (
              <div class={css.wallpaperGrid}>
                {customWallpapers.map((wallpaper) => {
                  const isSelected =
                    currentWallpaper.type === 'custom' && currentWallpaper.value === wallpaper.id;
                  return (
                    <div
                      key={wallpaper.id}
                      class={`${css.wallpaperItem} ${isSelected ? css.selected : ''}`}
                      onClick={() => handleSelectWallpaper('custom', wallpaper.id)}
                    >
                      <img src={wallpaper.data} alt={wallpaper.name} loading="lazy" />
                      {isSelected && <div class={css.checkmark}>✓</div>}
                      <button
                        class={css.deleteButton}
                        onClick={(e) => handleDeleteCustomWallpaper(wallpaper.id, e)}
                        aria-label="删除"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

