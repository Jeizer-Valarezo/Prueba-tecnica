import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const ResultsList = ({ results, onSelect }) => {
  return (
    <List>
      {results.map((result, index) => (
        <ListItem button key={result.id || index} onClick={() => onSelect(result)}>
          <ListItemText primary={result.openfda.brand_name || "Sin nombre de marca"} secondary={result.openfda.generic_name?.join(", ") || "Sin nombre genérico"} />
        </ListItem>
      ))}
    </List>
  );
};

export default ResultsList;
