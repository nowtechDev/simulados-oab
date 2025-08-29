
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardStats from "@/components/admin/DashboardStats";

interface DashboardTabProps {
  userStats: {
    total: number;
    newLastMonth: number;
  };
  tokensUsage: {
    instituicao: string;
    tokens: number;
    percentualDoTotal: number;
  }[];
}

const DashboardTab = ({ userStats, tokensUsage }: DashboardTabProps) => {
  return (
    <div className="space-y-6">
      <DashboardStats 
        userStats={userStats}
        tokensUsage={tokensUsage}
      />
    </div>
  );
};

export default DashboardTab;
