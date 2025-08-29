
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileDown, Search, Building2 } from "lucide-react";
import InstitutionsTable from "@/components/admin/InstitutionsTable";
import { useToast } from "@/hooks/use-toast";
import { Institution } from "@/hooks/useAdminData";

interface InstitutionsTabProps {
  institutions: Institution[];
  isLoadingInstitutions: boolean;
  openCreateDialog: () => void;
  openEditDialog: (institution: Institution) => void;
  openDeleteDialog: (institution: Institution) => void;
}

const InstitutionsTab = ({ 
  institutions, 
  isLoadingInstitutions,
  openCreateDialog, 
  openEditDialog, 
  openDeleteDialog 
}: InstitutionsTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Add debug logging
  useEffect(() => {
    console.log("InstitutionsTab: Component rendered with institutions:", institutions);
  }, []);

  useEffect(() => {
    console.log("InstitutionsTab: Institutions prop updated:", institutions);
  }, [institutions]);
  
  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados de instituições estão sendo exportados em formato CSV.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Instituições ({institutions.length})</CardTitle>
            <CardDescription>
              Lista de todas as instituições cadastradas na plataforma
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar instituição..."
                className="pl-10 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              className="bg-[#4F1964] hover:bg-[#3D1052] flex items-center gap-2"
              onClick={openCreateDialog}
            >
              <Building2 className="h-4 w-4" />
              <span>Nova Instituição</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <InstitutionsTable 
          institutions={institutions} 
          isLoading={isLoadingInstitutions}
          searchQuery={searchQuery}
          onEditClick={openEditDialog}
          onDeleteClick={openDeleteDialog}
        />
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handleExportData} className="ml-auto">
          <FileDown className="mr-2 h-4 w-4" />
          Exportar Instituições (CSV)
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InstitutionsTab;
