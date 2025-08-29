
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle } from "lucide-react";

type ScoringTableProps = {
  items: {
    item: string;
    valor: number;
    obtido?: number;
  }[];
  showObtained?: boolean;
  maxTotal?: number; // Optional prop to override the displayed total
};

const ScoringTable = ({ items, showObtained = false, maxTotal }: ScoringTableProps) => {
  // Calculate total points possible
  const totalPoints = items && items.length > 0 ? items.reduce((sum, item) => sum + item.valor, 0) : 0;
  
  // Calculate total points obtained (if showing obtained points)
  const totalObtained = showObtained && items && items.length > 0
    ? items.reduce((sum, item) => sum + (item.obtido || 0), 0)
    : 0;

  // Use provided maxTotal if available, otherwise use calculated totalPoints
  const displayedTotal = maxTotal !== undefined ? maxTotal : totalPoints;

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-50">
            <TableHead className="w-[60%] font-medium">Item</TableHead>
            <TableHead className="w-[20%] text-center font-medium">Valor</TableHead>
            {showObtained && (
              <TableHead className="w-[20%] text-center font-medium">Obtido</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items && items.map((item, index) => (
            <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <TableCell className="align-top py-3 text-justify">{item.item}</TableCell>
              <TableCell className="text-center py-3">{item.valor.toFixed(2)}</TableCell>
              {showObtained && (
                <TableCell className="text-center py-3">
                  <div className="flex items-center justify-center">
                    {(item.obtido || 0) > 0 ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        {item.obtido?.toFixed(2)}
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500">
                        <XCircle className="w-4 h-4 mr-1" />
                        0.00
                      </span>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
          <TableRow className="bg-gray-100 font-medium">
            <TableCell>Total</TableCell>
            <TableCell className="text-center">{displayedTotal.toFixed(2)}</TableCell>
            {showObtained && (
              <TableCell className="text-center">{totalObtained.toFixed(2)}</TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ScoringTable;
