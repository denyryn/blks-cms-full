import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pageCount <= 1) return null;

  const { pageIndex, pageCount } = pagination;

  const goToPage = (newPageIndex, event) => {
    event.preventDefault();
    if (newPageIndex < 0) return;
    if (newPageIndex >= pageCount) return;
    if (newPageIndex === pageIndex) return;
    onPageChange({ pageIndex: newPageIndex, pageSize: pagination.pageSize });
  };

  // Helper to create a range of numbers
  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  // Simplified pagination logic
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const rangeStart = Math.max(0, pageIndex - delta);
    const rangeEnd = Math.min(pageCount - 1, pageIndex + delta);

    return range(rangeStart, rangeEnd);
  };

  const pages = getVisiblePages();

  return (
    <UIPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => goToPage(pageIndex - 1, e)}
            aria-disabled={pageIndex === 0}
            className={cn({
              "pointer-events-none opacity-50": pageIndex === 0,
            })}
          />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => goToPage(page, e)}
              isActive={page === pageIndex}
            >
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => goToPage(pageIndex + 1, e)}
            aria-disabled={pageIndex === pageCount - 1}
            className={cn({
              "pointer-events-none opacity-50": pageIndex === pageCount - 1,
            })}
          />
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  );
}
