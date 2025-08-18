import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type CustomPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: CustomPaginationProps) => {
  if (totalPages <= 1) return null;

  const pagesToDisplay = (() => {
    const candidates = new Set<number>();
    candidates.add(1);
    candidates.add(totalPages);
    for (let p = currentPage - 1; p <= currentPage + 1; p++) {
      if (p >= 1 && p <= totalPages) candidates.add(p);
    }
    const sortedPages = Array.from(candidates).sort((a, b) => a - b);
    const result: (number | "ellipsis")[] = [];
    let last: number | null = null;
    for (const p of sortedPages) {
      if (last !== null && p - last > 1) result.push("ellipsis");
      result.push(p);
      last = p;
    }
    return result;
  })();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                onPageChange(currentPage - 1);
              }
            }}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {pagesToDisplay.map((item, idx) => {
          if (item === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          const page = item as number;
          const isActive = currentPage === page;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                size="default"
                isActive={isActive}
                className={
                  isActive
                    ? "bg-white/10 border-white/20 text-white"
                    : "text-white/80 hover:text-black"
                }
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1);
              }
            }}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
