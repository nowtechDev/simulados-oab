
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TokenUsage {
  instituicao: string;
  tokens: number;
  percentualDoTotal: number;
}

interface StatsProps {
  userStats: {
    total: number;
    newLastMonth: number;
  };
  tokensUsage: TokenUsage[];
}

const DashboardStats = ({ userStats, tokensUsage }: StatsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">+{userStats.newLastMonth} nos últimos 30 dias</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total de Instituições</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">+1 nos últimos 30 dias</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Tokens Consumidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">361.500</div>
            <p className="text-xs text-muted-foreground mt-1">+45.200 nos últimos 7 dias</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Faturamento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ 4.699,96</div>
            <p className="text-xs text-muted-foreground mt-1">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Consumo de Tokens por Instituição</CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribuição do uso de tokens nos últimos 30 dias
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tokensUsage.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.instituicao}</span>
                    <span className="text-sm text-muted-foreground">{item.tokens.toLocaleString()} tokens</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-[#4F1964] h-2.5 rounded-full" 
                      style={{ width: `${item.percentualDoTotal}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas de Uso</CardTitle>
            <p className="text-sm text-muted-foreground">
              Uso da plataforma nos últimos 30 dias
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Simulados realizados</h4>
                  <span className="text-sm font-bold">521</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full w-[75%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Cadernos criados</h4>
                  <span className="text-sm font-bold">187</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full w-[45%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Usuários ativos</h4>
                  <span className="text-sm font-bold">198</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full w-[65%]"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DashboardStats;
