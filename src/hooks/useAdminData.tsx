
import { useEffect } from 'react';
import { useUserData } from './admin/useUserData';
import { useInstitutionData } from './admin/useInstitutionData';
import { useAuthStatusCheck } from './admin/useAuthStatusCheck';
import { calculateUserStats } from './admin/useUserStats';

// Re-export types with the proper 'export type' syntax
export type { User, Institution } from './admin/types';

export const useAdminData = () => {
  // Use individual hooks
  const { users, isLoadingUsers, fetchUsers } = useUserData();
  const { institutions, isLoadingInstitutions, fetchInstitutions } = useInstitutionData();
  const { currentAuthStatus, isLoggedIn, isAdmin } = useAuthStatusCheck();
  
  // Calculate user stats
  const userStats = calculateUserStats(users);

  // Fetch data when authentication status changes
  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      console.log("useAdminData: User is authenticated as admin, fetching data...");
      fetchUsers(isLoggedIn, isAdmin);
      fetchInstitutions(isLoggedIn, isAdmin);
    } else {
      console.log("useAdminData: User is not authenticated as admin, not fetching data");
    }
  }, [isLoggedIn, isAdmin]);

  // Debug log to track state changes
  useEffect(() => {
    console.log("useAdminData: Users state updated:", users.length, "users");
  }, [users]);

  useEffect(() => {
    console.log("useAdminData: Institutions state updated:", institutions.length, "institutions");
  }, [institutions]);

  return {
    users,
    institutions,
    isLoadingUsers,
    isLoadingInstitutions,
    currentAuthStatus,
    userStats,
    fetchUsers: () => fetchUsers(isLoggedIn, isAdmin),
    fetchInstitutions: () => fetchInstitutions(isLoggedIn, isAdmin)
  };
};
