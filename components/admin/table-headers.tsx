import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

// ============================================
// Cabeçalhos da Tabela de Pedidos
// ============================================

interface TableHeaderColumn {
  label: string;
  className?: string;
}

const ORDER_TABLE_COLUMNS: TableHeaderColumn[] = [
  { label: "Pedido" },
  { label: "Cliente", className: "hidden sm:table-cell" },
  { label: "Itens", className: "hidden text-center md:table-cell" },
  { label: "Total", className: "hidden sm:table-cell" },
  { label: "Status", className: "text-center sm:text-left" },
  { label: "Data", className: "hidden md:table-cell" },
];

export function OrderTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        {ORDER_TABLE_COLUMNS.map((column) => (
          <TableHead key={column.label} className={column.className}>
            {column.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

// ============================================
// Cabeçalhos da Tabela de Produtos/Estoque
// ============================================

const PRODUCT_TABLE_COLUMNS: TableHeaderColumn[] = [
  { label: "Imagem", className: "hidden w-16 sm:table-cell" },
  { label: "Produto" },
  { label: "Preço", className: "hidden w-28 md:table-cell" },
  { label: "Estoque", className: "hidden w-28 md:table-cell" },
  { label: "Destaque", className: "hidden w-16 lg:table-cell" },
  { label: "Ações", className: "hidden w-[140px] text-right sm:table-cell" },
];

export function ProductTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        {PRODUCT_TABLE_COLUMNS.map((column) => (
          <TableHead key={column.label} className={column.className}>
            {column.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}