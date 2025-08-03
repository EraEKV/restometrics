import { Theme } from '@/shared/types/global';

export const applyTheme = (theme: Theme) => {
  document.documentElement.className = theme;
};
