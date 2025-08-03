'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { StoreProvider } from './StoreProvider';
import { AuthProvider } from './AuthProvider';
import { QueryProvider } from './QueryProvider';
import { Toaster } from '@/shared/ui/sonner';
import { Navbar } from '@/widgets/Navbar/ui/Navbar';

export const AppProvider = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>
    <QueryProvider>
      <StoreProvider>
        <AuthProvider>
          <>
            <Navbar />
            {children}
            <Toaster />
          </>
        </AuthProvider>
      </StoreProvider>
    </QueryProvider>
  </ThemeProvider>
);
