import React, { useState } from "react";
import "./AnimatedSearchComponent.css";

interface SearchResult {
  id: number;
  name: string;
  description: string;
  price: string;
}

const AnimatedSearchComponent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock search function to simulate API call
  const performSearch = async (query: string) => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock results
    const mockResults: SearchResult[] = [
      {
        id: 1,
        name: `${query} - Product A`,
        description: "High quality chemical compound",
        price: "$45.99",
      },
      {
        id: 2,
        name: `${query} - Product B`,
        description: "Laboratory grade reagent",
        price: "$67.50",
      },
      {
        id: 3,
        name: `${query} - Product C`,
        description: "Research grade material",
        price: "$123.75",
      },
      {
        id: 4,
        name: `${query} - Product D`,
        description: "Industrial application compound",
        price: "$89.25",
      },
      {
        id: 5,
        name: `${query} - Product E`,
        description: "Specialty chemical for analysis",
        price: "$156.00",
      },
    ];

    setResults(mockResults);
    setIsLoading(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchMode(true);
      performSearch(searchQuery.trim());
    }
  };

  const handleBackToSearch = () => {
    setIsSearchMode(false);
    setResults([]);
    setSearchQuery("");
  };

  return (
    <div className="animated-search-container">
      {/* Search Section */}
      <div className={`search-section ${isSearchMode ? "search-mode" : "center-mode"}`}>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for chemicals, compounds, or reagents..."
              className="search-input"
              autoFocus
            />
          </div>
        </form>

        {isSearchMode && (
          <button onClick={handleBackToSearch} className="back-button">
            ← New Search
          </button>
        )}
      </div>

      {/* Results Section */}
      <div className={`results-section ${isSearchMode ? "visible" : "hidden"}`}>
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Searching for "{searchQuery}"...</p>
          </div>
        ) : (
          results.length > 0 && (
            <div className="results-container">
              <h2 className="results-title">
                Search Results for "{searchQuery}" ({results.length} found)
              </h2>

              <div className="results-table">
                <div className="table-header">
                  <div className="header-cell">Product Name</div>
                  <div className="header-cell">Description</div>
                  <div className="header-cell">Price</div>
                  <div className="header-cell">Action</div>
                </div>

                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className="table-row"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="table-cell">{result.name}</div>
                    <div className="table-cell">{result.description}</div>
                    <div className="table-cell">{result.price}</div>
                    <div className="table-cell">
                      <button className="view-button">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* Welcome Message (only shown when not in search mode) */}
      <div className={`welcome-section ${isSearchMode ? "fade-out" : "fade-in"}`}>
        {!isSearchMode && (
          <>
            <h1 className="welcome-title">Chemical Search Portal</h1>
            <p className="welcome-subtitle">
              Find chemicals, compounds, and reagents from multiple suppliers
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AnimatedSearchComponent;
