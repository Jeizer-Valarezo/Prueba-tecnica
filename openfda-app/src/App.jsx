import React, { useState, useEffect, useRef } from 'react';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import DrugDetail from './components/DrugDetail';
import axios from 'axios';
import { Container, Typography, Button, CircularProgress } from '@mui/material';

const App = () => {
  const [results, setResults] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [error, setError] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:${query}*&limit=10`);
      console.log('Response headers:', response.headers);  // Añadir este log
      setResults(response.data.results);
      setSelectedDrug(null);
      const linkHeader = response.headers.link;
      const nextUrl = linkHeader ? getNextUrlFromLinkHeader(linkHeader) : null;
      setNextPageUrl(nextUrl);
      setLoading(false);
      console.log('Initial search results:', response.data.results);
      console.log('Next page URL:', nextUrl);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data from OpenFDA", error);
      if (error.response && error.response.status === 404) {
        setError('No se encontraron resultados para la búsqueda.');
      } else {
        setError('Ocurrió un error al realizar la búsqueda. Por favor, inténtalo de nuevo.');
      }
    }
  };
  

  const getNextUrlFromLinkHeader = (linkHeader) => {
    if (!linkHeader) {
      console.log("No Link header found");
      return null;
    }
    console.log("Extracting next URL from link header:", linkHeader);
    const links = linkHeader.split(',').map(link => link.trim());
    const nextLink = links.find(link => link.includes('rel="next"'));
    const nextUrl = nextLink ? nextLink.split(';')[0].slice(1, -1) : null;
    console.log("Next URL extracted:", nextUrl);
    return nextUrl;
  };
  

  const loadMoreResults = async () => {
    if (!nextPageUrl) return;
    try {
      setLoading(true);
      console.log(`Loading more results from ${nextPageUrl}`);
      const response = await axios.get(nextPageUrl);
      setResults(prevResults => [...prevResults, ...response.data.results]);
      const linkHeader = response.headers.link;
      const nextUrl = linkHeader ? getNextUrlFromLinkHeader(linkHeader) : null;
      setNextPageUrl(nextUrl);
      setLoading(false);
      console.log('Additional search results:', response.data.results);
      console.log('Next page URL after load more:', nextUrl);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching more data from OpenFDA", error);
    }
  };

  useEffect(() => {
    if (loading) return;
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
        console.log('Reached bottom of the page, loading more results...');
        loadMoreResults();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, nextPageUrl]);

  const handleBackToResults = () => {
    setSelectedDrug(null);
  };

  return (
    <Container style={{ padding: '16px', maxWidth: '600px' }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
        Búsqueda de Medicamentos
      </Typography>
      <SearchBar onSearch={handleSearch} />
      {error && (
        <Typography variant="body1" color="error" style={{ marginTop: '16px' }}>
          {error}
        </Typography>
      )}
      {selectedDrug ? (
        <div>
          <Button variant="contained" onClick={handleBackToResults} style={{ marginBottom: '20px' }}>
            Volver a los Resultados
          </Button>
          <DrugDetail drug={selectedDrug} />
        </div>
      ) : (
        <ResultsList results={results} onSelect={setSelectedDrug} />
      )}
      {loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </div>
      )}
    </Container>
  );
};

export default App;
