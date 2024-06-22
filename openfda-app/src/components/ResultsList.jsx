import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const ResultsList = ({ results, onSelect }) => {
  return (
    <List>
      {results.map((result, index) => (
        <ListItem button key={result.id || index} onClick={() => onSelect(result)}>
          <ListItemText 
            primary={result.openfda.generic_name ? result.openfda.generic_name[0] : "No generic name available"} 
            secondary={result.openfda.brand_name ? result.openfda.brand_name.join(", ") : "No brand name available"} 
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ResultsList;
