import type { ResponsiveImageUpload } from '@/lib/images/process-upload';
import { saveResponsiveImage } from '@/lib/images/upload-responsive';

const PORTFOLIO_FOLDER = 'uploads/portfolio';

export async function savePortfolioImage(
  file: File,
): Promise<ResponsiveImageUpload> {
  return saveResponsiveImage(file, PORTFOLIO_FOLDER);
}
