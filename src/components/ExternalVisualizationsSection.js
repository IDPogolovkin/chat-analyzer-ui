import React from "react";
import { Typography, Box, Button, Paper } from "@mui/material";
import { DataObject, AccountTree, Radar } from '@mui/icons-material';

const ExternalVisualizationsSection = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Внешние визуализации
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          component="a" 
          href="http://localhost:6333/dashboard#/collections/chats/visualize" 
          target="_blank" 
          rel="noopener noreferrer" 
          startIcon={<DataObject />}
        >
          Qdrant - Семантическая Визуализация
        </Button>
        <Button 
          variant="contained" 
          component="a" 
          href="http://localhost:6333/dashboard#/collections/chats/graph" 
          target="_blank" 
          rel="noopener noreferrer" 
          startIcon={<AccountTree />}
        >
          Qdrant - Семантический Граф
        </Button>
        <Button 
          variant="contained" 
          component="a" 
          href="http://localhost:7474/browser/preview/" 
          target="_blank" 
          rel="noopener noreferrer" 
          startIcon={<Radar />}
        >
          Neo4j Графы связей
        </Button>
      </Box>
    </Paper>
  );
};

export default ExternalVisualizationsSection;