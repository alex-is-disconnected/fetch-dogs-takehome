import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDogs, fetchDogDetails } from "../api/fetchApi";
import { SearchFilters, Dog, SearchResponse } from "../types";
import DogCard from "../components/DogCard";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import { useAuth } from "../context/AuthContext";
import "../styles/Search.css";

function Search() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [page, setPage] = useState<number>(0);
  const [sort, setSort] = useState<string>("breed:asc");
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    async function loadDogs() {
      setLoading(true);
      try {
        const data = await fetchDogs(filters, page, pageSize, sort);
        setTotalResults(data.total);
        setSearchResponse(data);
        
        if (data.resultIds.length > 0) {
          const dogDetails = await fetchDogDetails(data.resultIds);
          setDogs(dogDetails);
        } else {
          setDogs([]);
        }
      } catch (error) {
        console.error("Error loading dogs:", error);
      }
      setLoading(false);
    }
    
    if (isAuthenticated) {
      loadDogs();
    }
  }, [filters, page, sort, pageSize, isAuthenticated]);

  function handleFilterChange(newFilters: SearchFilters) {
    setFilters(newFilters);
    setPage(0); 
  }

  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSort(event.target.value);
  }

  function handlePageSizeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setPageSize(Number(event.target.value));
    setPage(0); 
  }

  function toggleFilters() {
    setIsFilterOpen(!isFilterOpen);
  }

  const totalPages = Math.ceil(totalResults / pageSize);
  const hasNext = searchResponse?.next !== undefined;
  const hasPrev = searchResponse?.prev !== undefined || page > 0;

  return (
    <div className="search-page">
      <div className="search-container">
        <aside className={`filter-sidebar ${isFilterOpen ? 'open' : ''}`}>
          <FilterBar onFilterChange={handleFilterChange} />
        </aside>
        
        <main className="search-results">
          <div className="search-controls">
            <div className="results-info">
              <p>Showing {dogs.length} of {totalResults} dogs</p>
            </div>
            
            <div className="sort-controls">
              <label>
                Sort by:
                <select value={sort} onChange={handleSortChange}>
                  <option value="breed:asc">Breed (A-Z)</option>
                  <option value="breed:desc">Breed (Z-A)</option>
                  <option value="name:asc">Name (A-Z)</option>
                  <option value="name:desc">Name (Z-A)</option>
                  <option value="age:asc">Age (Youngest)</option>
                  <option value="age:desc">Age (Oldest)</option>
                </select>
              </label>
              
              <label>
                Show:
                <select value={pageSize} onChange={handlePageSizeChange}>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </label>
            </div>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading dogs...</p>
            </div>
          ) : dogs.length === 0 ? (
            <div className="no-results">
              <p>No dogs found matching your criteria.</p>
              <button className="btn btn-primary" onClick={() => setFilters({})}>Clear filters</button>
            </div>
          ) : (
            <>
              <div className="dog-grid">
                {dogs.map((dog) => (
                  <DogCard key={dog.id} id={dog.id} showLocation={true} />
                ))}
              </div>
              
              <Pagination 
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                hasNext={hasNext}
                hasPrev={hasPrev}
              />
            </>
          )}
        </main>
      </div>
      
      <button 
        className="filter-toggle" 
        onClick={toggleFilters}
        aria-label="Toggle filters"
      >
        {isFilterOpen ? "✕" : "⚙️"}
      </button>
    </div>
  );
}

export default Search;
