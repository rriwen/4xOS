import { MAX_FILE_SIZE, SUPPORTED_IMAGE_FORMATS, SMALL_FILE_THRESHOLD } from '__/data/wallpapers';

export interface ImageUploadResult {
  data: string; // base64 或 blob URL
  name: string;
  size: number;
}

export interface ImageUploadError {
  message: string;
  code: 'INVALID_FORMAT' | 'FILE_TOO_LARGE' | 'READ_ERROR' | 'UNKNOWN';
}

/**
 * 验证图片文件
 */
export function validateImageFile(file: File): ImageUploadError | null {
  // 检查文件类型
  if (!SUPPORTED_IMAGE_FORMATS.includes(file.type.toLowerCase())) {
    return {
      message: '不支持的文件格式，请上传 JPG、PNG 或 WEBP 格式的图片',
      code: 'INVALID_FORMAT',
    };
  }

  // 检查文件大小
  if (file.size > MAX_FILE_SIZE) {
    return {
      message: `图片文件过大，最大支持 ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      code: 'FILE_TOO_LARGE',
    };
  }

  return null;
}

/**
 * 读取图片文件并转换为 base64
 */
export function readImageAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('读取文件失败'));
      }
    };

    reader.onerror = () => {
      reject(new Error('读取文件时发生错误'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * 压缩图片（可选）
 */
export function compressImage(
  base64: string,
  maxWidth: number = 2000,
  maxHeight: number = 2000,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // 计算新尺寸
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('无法创建画布上下文'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };

    img.onerror = () => {
      reject(new Error('图片加载失败'));
    };

    img.src = base64;
  });
}

/**
 * 上传图片文件
 */
export async function uploadImage(file: File, compress: boolean = false): Promise<ImageUploadResult> {
  // 验证文件
  const error = validateImageFile(file);
  if (error) {
    throw error;
  }

  try {
    // 读取文件
    let base64 = await readImageAsBase64(file);

    // 如果文件较大且需要压缩，进行压缩
    if (compress && file.size > SMALL_FILE_THRESHOLD) {
      base64 = await compressImage(base64);
    }

    return {
      data: base64,
      name: file.name,
      size: file.size,
    };
  } catch (err) {
    throw {
      message: err instanceof Error ? err.message : '上传图片时发生未知错误',
      code: 'READ_ERROR' as const,
    };
  }
}

/**
 * 处理拖拽上传
 */
export function handleDragOver(e: DragEvent): void {
  e.preventDefault();
  e.stopPropagation();
}

export function handleDragEnter(e: DragEvent): void {
  e.preventDefault();
  e.stopPropagation();
}

export function handleDragLeave(e: DragEvent): void {
  e.preventDefault();
  e.stopPropagation();
}

export function handleDrop(e: DragEvent): File[] | null {
  e.preventDefault();
  e.stopPropagation();

  const files: File[] = [];
  if (e.dataTransfer?.files) {
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      const file = e.dataTransfer.files[i];
      if (file.type.startsWith('image/')) {
        files.push(file);
      }
    }
  }

  return files.length > 0 ? files : null;
}

