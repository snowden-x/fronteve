import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { UserRole } from '@/lib/types';

/**
 * Role-based route mapping
 */
const roleRoutes = {
  [UserRole.ADMIN]: ['/dashboard/admin'],
  [UserRole.PHARMACY_STAFF]: ['/dashboard'],
  [UserRole.CUSTOMER]: ['/'],
} as const;

/**
 * Public routes that don't require authentication
 */
const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'] as const;

/**
 * Hook to protect routes based on authentication and user roles
 * @returns Object containing authentication state
 */
export const useAuthGuard = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Allow access to public routes
    if (publicRoutes.includes(pathname as typeof publicRoutes[number])) {
      if (isAuthenticated) {
        // Redirect authenticated users away from auth pages
        const defaultRoute = user?.role ? roleRoutes[user.role][0] : '/';
        router.push(defaultRoute);
      }
      return;
    }

    // Check if user is authenticated for protected routes
    if (!isAuthenticated) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // Check role-based access
    if (user) {
      const allowedRoutes = roleRoutes[user.role];
      const isAllowed = allowedRoutes.some(route => pathname.startsWith(route));

      if (!isAllowed) {
        // Redirect to the default route for user's role
        router.push(allowedRoutes[0]);
      }
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  return {
    isLoading,
    isAuthenticated,
    user,
  };
};
