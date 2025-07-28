import React, { useState } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import MessageCard from "./MessageCard";
import api from "../api";

const SearchSection = ({ downloadJSON }) => {
  const [searchParams, setSearchParams] = useState({
    q: "", name_of_receiver: "", message_status: "", group_name: "",
    own_phone: "", email: "", phone: "", app: "", is_deleted: false,
    start_date: "", end_date: "", latitude: "", longitude: "", radius: "",
  });
  const [searchResults, setSearchResults] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(true);

  const handleSearchChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSearchSubmit = async () => {
    setLoadingSearch(true);
    setSearchResults(null);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(
          ([, value]) => value !== "" && value !== undefined && value !== false
        )
      );
      const { data } = await api.get("/api/search", { params: filteredParams });
      setSearchResults(data.results);
      downloadJSON(data, "search_result");
    } catch (error) {
      console.error("Search Error:", error);
      alert("An error occurred during the search. Please try again.");
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Поиск по сообщениям
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField 
            label="Запрос" 
            name="q" 
            fullWidth 
            value={searchParams.q} 
            onChange={handleSearchChange} 
          />
        </Grid>
        <Grid item xs={6}>
          <TextField 
            label="Имя получателя" 
            name="name_of_receiver" 
            fullWidth 
            value={searchParams.name_of_receiver} 
            onChange={handleSearchChange} 
          />
        </Grid>
        <Grid item xs={6}>
          <TextField 
            label="Статус сообщения" 
            name="message_status" 
            fullWidth 
            value={searchParams.message_status} 
            onChange={handleSearchChange} 
          />
        </Grid>
        <Grid item xs={6}>
          <TextField 
            label="Название группы" 
            name="group_name" 
            fullWidth 
            value={searchParams.group_name} 
            onChange={handleSearchChange} 
          />
        </Grid>
        <Grid item xs={6}>
          <TextField 
            label="Email" 
            name="email" 
            type="email" 
            fullWidth 
            value={searchParams.email} 
            onChange={handleSearchChange} 
          />
        </Grid>
        <Grid item xs={6}>
          <TextField 
            label="Телефон" 
            name="phone" 
            type="phone" 
            fullWidth 
            value={searchParams.phone} 
            onChange={handleSearchChange} 
          />
        </Grid>
        <Grid item xs={6}>
          <TextField 
            label="Источник" 
            name="app" 
            fullWidth 
            value={searchParams.app} 
            onChange={handleSearchChange} 
          />
        </Grid>
        <Grid item xs={6}>
          <TextField 
            label="Дата начала" 
            type="datetime-local" 
            name="start_date" 
            fullWidth 
            InputLabelProps={{ shrink: true }} 
            value={searchParams.start_date} 
            onChange={handleSearchChange} 
          />
        </Grid>
        <Grid item xs={6}>
          <TextField 
            label="Дата окончания" 
            type="datetime-local" 
            name="end_date" 
            fullWidth 
            InputLabelProps={{ shrink: true }} 
            value={searchParams.end_date} 
            onChange={handleSearchChange} 
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel 
            control={
              <Checkbox 
                name="is_deleted" 
                checked={searchParams.is_deleted} 
                onChange={handleSearchChange} 
              />
            } 
            label="Удаленные" 
          />
        </Grid>
        <Grid item xs={12}>
          <Button 
            sx={{ mt: 1 }} 
            variant="contained" 
            color="primary" 
            onClick={handleSearchSubmit} 
            fullWidth 
            disabled={loadingSearch}
          >
            {loadingSearch ? <CircularProgress size={26} /> : "Поиск"}
          </Button>
        </Grid>
      </Grid>
      
      <Box mt={2}>
        <Button variant="text" onClick={() => setShowSearchResults((prev) => !prev)}>
          {showSearchResults ? "Скрыть" : "Показать"} Результаты поиска
        </Button>
        {showSearchResults && searchResults && (
          <Box 
            mt={2} 
            p={2} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              backgroundColor: '#f0f2f5', 
              borderRadius: 2 
            }}
          >
            {searchResults.length > 0 ? (
              searchResults.map((msg, index) => (
                <MessageCard 
                  key={index} 
                  message={msg} 
                  isSentByUser={searchParams.phone && msg.phone === searchParams.phone} 
                />
              ))
            ) : (
              <Alert severity="info">По вашему запросу ничего не найдено.</Alert>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default SearchSection;