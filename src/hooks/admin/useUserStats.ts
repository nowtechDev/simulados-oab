
import { User } from './types';

export const calculateUserStats = (users: User[]) => {
  const total = users.length;
  
  const newLastMonth = users.filter(user => {
    const createdAt = new Date(user.created_at);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return createdAt >= oneMonthAgo;
  }).length;
  
  return {
    total,
    newLastMonth
  };
};
