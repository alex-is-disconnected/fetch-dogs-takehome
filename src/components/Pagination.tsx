import "../styles/Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

function Pagination({ currentPage, totalPages, onPageChange, hasNext, hasPrev }: PaginationProps) {
  function renderPageNumbers() {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button 
          key={i} 
          onClick={() => onPageChange(i)}
          className={i === currentPage ? "active" : ""}
          aria-label={`Page ${i + 1}`}
          aria-current={i === currentPage ? "page" : undefined}
        >
          {i + 1}
        </button>
      );
    }
    
    return pages;
  }
  
  return (
    <div className="pagination-wrapper">
      <div className="pagination">
        <button 
          onClick={() => onPageChange(0)} 
          disabled={!hasPrev}
          className="pagination-nav"
          aria-label="First page"
        >
          &laquo;
        </button>
        
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={!hasPrev}
          className="pagination-nav"
          aria-label="Previous page"
        >
          &lt;
        </button>
        
        <div className="page-numbers">
          {renderPageNumbers()}
        </div>
        
        <button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={!hasNext}
          className="pagination-nav"
          aria-label="Next page"
        >
          &gt;
        </button>
        
        <button 
          onClick={() => onPageChange(totalPages - 1)} 
          disabled={!hasNext}
          className="pagination-nav"
          aria-label="Last page"
        >
          &raquo;
        </button>
      </div>
      
      <div className="pagination-info">
        Page {currentPage + 1} of {Math.max(1, totalPages)}
      </div>
    </div>
  );
}

export default Pagination;
