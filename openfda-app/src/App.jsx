import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import ResultsList from "./components/ResultsList";
import DrugDetail from "./components/DrugDetail";
import axios from "axios";
import { Container, Typography, Button, CircularProgress } from "@mui/material";

const App = () => {
  const [results, setResults] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bottomReached, setBottomReached] = useState(0);
  const [lastQuery, setLastQuery] = useState("");
  const [noMoreResults, setNoMoreResults] = useState(false);

  const handleSearch = async (query) => {
    const formattedQuery = query.replace(/\s/g, "*+AND+");

    const linkHeader = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:(${formattedQuery}*)&limit=10&skip=${bottomReached}`;
    try {
      setBottomReached(0);
      setError(null);
      setLoading(true);
      const response = await axios.get(linkHeader);

      const sortedResults = response.data.results.sort((a, b) => {
        const nameA = a.openfda.generic_name
          ? a.openfda.generic_name[0].toUpperCase()
          : "";
        const nameB = b.openfda.generic_name
          ? b.openfda.generic_name[0].toUpperCase()
          : "";
        return nameA.localeCompare(nameB);
      });

      setResults(sortedResults);
      setSelectedDrug(null);
      setLastQuery(formattedQuery);
      setLoading(false);
      setNoMoreResults(false); // Reset noMoreResults flag
      
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data from OpenFDA", error);
      if (error.response && error.response.status === 404) {
        setError("No results found for the search.");
      } else {
        setError(
          "An error occurred while performing the search. Please try again."
        );
      }
    }
  };

  const loadMoreResults = async () => {
    const linkHeader = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:(${lastQuery}*)&limit=10&skip=${
      bottomReached + 10
    }`;
    try {
      setLoading(true);
      const response = await axios.get(linkHeader);

      const sortedNewResults = response.data.results;

      setResults((prevResults) => [...prevResults, ...sortedNewResults]);

      setBottomReached((prev) => prev + 10);
      setLoading(false);
      
    } catch (error) {
      setLoading(false);
      console.error("Error fetching more data from OpenFDA", error);
      if (error.response && error.response.status === 404) {
        setNoMoreResults(true); // Set flag when no more results
        setError("No more results.");
      } else {
        setError(
          "An error occurred while fetching more results. Please try again."
        );
      }
    }
  };

  useEffect(() => {
    if (loading) return;
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50
      ) {
        console.log("Reached bottom of the page, loading more results...");
        loadMoreResults();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const handleBackToResults = () => {
    setSelectedDrug(null);
  };

  return (
    <Container style={{ padding: "16px", maxWidth: "600px" }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
        Drug Search
      </Typography>
      <SearchBar onSearch={handleSearch} />
      {error && (
        <Typography variant="body1" color="error" style={{ marginTop: "16px" }}>
          {error}
        </Typography>
      )}
      {selectedDrug ? (
        <div>
          <Button
            variant="contained"
            onClick={handleBackToResults}
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#115293",
              },
            }}
          >
            Back to Results
          </Button>
          <DrugDetail drug={selectedDrug} />
        </div>
      ) : (
        <ResultsList results={results} onSelect={setSelectedDrug} />
      )}
      {loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      )}
      {noMoreResults && !loading && (
        <Typography variant="body1" style={{ textAlign: "center", marginTop: "20px" }}>
          No more results available.
        </Typography>
      )}
    </Container>
  );
};

export default App;
