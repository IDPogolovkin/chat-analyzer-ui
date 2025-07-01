import React, { useState } from "react";
import {
  Container,
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
import Plot from 'react-plotly.js';
import api from "./api";

function App() {
  // Consolidate analysis and visualization data into one state
  const [analysisData, setAnalysisData] = useState(null);
  const [searchParams, setSearchParams] = useState({
    q: "",
    name_of_receiver: "",
    message_status: "",
    group_name: "",
    own_phone: "",
    email: "",
    phone: "",
    app: "",
    is_deleted: false,
    start_date: "",
    end_date: "",
    latitude: "",
    longitude: "",
    radius: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch,  setLoadingSearch]  = useState(false);
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [loadingGuard,   setLoadingGuard]   = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(true);
  const [showAnalyzeResults, setShowAnalyzeResults] = useState(true);
  const [showGuardResults, setShowGuardResults] = useState(true);
  const [showVisualizations, setShowVisualizations] = useState(true);
  const [guardCategory, setGuardCategory] = useState("");
  const [guardLimit, setGuardLimit] = useState(20); // default limit
  const [guardResult, setGuardResult] = useState(null);
  const [guardText, setGuardText] = useState("");
  const [textGuardResult, setTextGuardResult] = useState(null);

  // Helper to download JSON
  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSearchChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Use the API endpoint and set the returned data for both analysis and visualization
  const handleAnalyze = async () => {
    setLoadingAnalyze(true);
    try {
      const response = await api.get("/api/analyze");
      setAnalysisData(response.data);
      downloadJSON(response.data, "analyze_result");
    } catch (error) {
      console.error("Analyze Error:", error);
      alert("An error occurred during the analysis. Please try again.");
    } finally {
      setLoadingAnalyze(false);
    }
  };

  const handleSearchSubmit = async () => {
    setLoadingSearch(true);
    try {
      // filter out empty values
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(
          ([, value]) => value !== "" && value !== undefined && value !== false
        )
      );
  
      // call the API
      const { data } = await api.get("/api/search", {
        params: filteredParams
      });
  
      // pull out the `results` array and store it
      setSearchResults(data.results);
  
      // trigger download of full payload
      downloadJSON(data, "search_result");
    } catch (error) {
      console.error("Search Error:", error);
      alert("An error occurred during the search. Please try again.");
    } finally {
      setLoadingSearch(false);
    }
  };  

  const handleGuardAnalyze = async () => {
    if (!guardCategory.trim()) {
      alert("Please enter a hazard category.");
      return;
    }
  
    setLoadingGuard(true);
    try {
      const response = await api.post("/api/guard/category", { 
        category: guardCategory,
        limit: guardLimit,
      });
      setGuardResult(response.data);
    } catch (error) {
      console.error("Guard Analyze Error:", error);
      alert("An error occurred during the hazard content analysis. Please try again.");
    } finally {
      setLoadingGuard(false);
    }
  }; 

  const handleTextGuard = async () => {
    if (!guardText.trim()) return alert("Введите текст для анализа");
    setLoadingGuard(true);
    try {
      const { data } = await api.post("/api/guard", { text: guardText });
      setTextGuardResult(data);
    } catch(e) {
      console.error(e);
      alert("Ошибка анализа текста");
    } finally {
      setLoadingGuard(false);
    }
  };

  // Helper: extract data for Plotly charts from the analysisData
  const extractPlotData = (data, key) => {
    if (data && data[key] && data[key].index && data[key].count) {
      return {
        labels: data[key].index,
        values: data[key].count,
      };
    }
    return null;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Анализатор переписок
      </Typography>

      {/* Search Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Поиск
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
              {loadingSearch ? <CircularProgress size={24} /> : "Поиск"}
            </Button>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button variant="text" onClick={() => setShowSearchResults((prev) => !prev)}>
            {showSearchResults ? "Скрыть" : "Показать"} Результаты поиска
            </Button>
            {showSearchResults && Array.isArray(searchResults) && searchResults.length > 0 && (
              <Box mt={3}>
                <Typography variant="h6">Результаты поиска</Typography>
                <pre>{JSON.stringify(searchResults, null, 2)}</pre>
              </Box>
            )}
            {showSearchResults && Array.isArray(searchResults) && searchResults.length === 0 && (
              <Box mt={3}>
                <Typography variant="h6">Никаких результатов найдено не было</Typography>
              </Box>
            )}
        </Box>
      </Paper>

      {/* Analyze Dataset Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Анализ набора данных
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAnalyze}
          fullWidth
          disabled={loadingAnalyze}
        >
          {loadingAnalyze ? <CircularProgress size={24} /> : "Анализировать"}
        </Button>
        <Box mt={2}>
          <Button variant="text" onClick={() => setShowAnalyzeResults((prev) => !prev)}>
            {showAnalyzeResults ? "Скрыть" : "Показать"} Анализ
          </Button>
          {showAnalyzeResults && analysisData && (
            <Box mt={3}>
              <Typography variant="h6">Результаты анализа</Typography>
              <pre>{JSON.stringify(analysisData, null, 2)}</pre>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Visualization Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Визуализация данных
        </Typography>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Button variant="text" onClick={() => setShowVisualizations((prev) => !prev)}>
            {showVisualizations ? "Скрыть" : "Показать"} Визуализации
          </Button>
        </Box>
        {showVisualizations && (
          <Box mt={2}>
            {!analysisData ? (
              <Alert severity="info">Нажмите «Анализировать», чтобы создать данные визуализации.</Alert>
            ) : (
              <Grid container spacing={3}>
                {/* Messages by Status */}
                {extractPlotData(analysisData, 'messages_by_status') && (
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Plot
                        data={[
                          {
                            type: 'bar',
                            x: extractPlotData(analysisData, 'messages_by_status').labels,
                            y: extractPlotData(analysisData, 'messages_by_status').values,
                          }
                        ]}
                        layout={{
                          title: 'Messages by Status',
                          xaxis: { title: 'Status' },
                          yaxis: { title: 'Count' },
                          autosize: true,
                        }}
                        style={{ width: '100%', height: 400 }}
                      />
                    </Paper>
                  </Grid>
                )}
                {/* Messages by Type */}
                {extractPlotData(analysisData, 'messages_by_type') && (
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Plot
                        data={[
                          {
                            type: 'bar',
                            x: extractPlotData(analysisData, 'messages_by_type').labels,
                            y: extractPlotData(analysisData, 'messages_by_type').values,
                          }
                        ]}
                        layout={{
                          title: 'Messages by Type',
                          xaxis: { title: 'Type' },
                          yaxis: { title: 'Count' },
                          autosize: true,
                        }}
                        style={{ width: '100%', height: 400 }}
                      />
                    </Paper>
                  </Grid>
                )}
                {/* Messages by App */}
                {extractPlotData(analysisData, 'messages_by_app') && (
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Plot
                        data={[
                          {
                            type: 'bar',
                            x: extractPlotData(analysisData, 'messages_by_app').labels,
                            y: extractPlotData(analysisData, 'messages_by_app').values,
                          }
                        ]}
                        layout={{
                          title: 'Messages by App',
                          xaxis: { title: 'App' },
                          yaxis: { title: 'Count' },
                          autosize: true,
                        }}
                        style={{ width: '100%', height: 400 }}
                      />
                    </Paper>
                  </Grid>
                )}
                {/* Top 5 Receivers */}
                {extractPlotData(analysisData, 'messages_by_receiver') && (
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Plot
                        data={[
                          {
                            type: 'pie',
                            labels: extractPlotData(analysisData, 'messages_by_receiver').labels.slice(0, 5),
                            values: extractPlotData(analysisData, 'messages_by_receiver').values.slice(0, 5),
                          }
                        ]}
                        layout={{
                          title: 'Top 5 Receivers',
                          autosize: true,
                        }}
                        style={{ width: '100%', height: 400 }}
                      />
                    </Paper>
                  </Grid>
                )}
                {/* Top 5 Locations */}
                {extractPlotData(analysisData, 'messages_by_location') && (
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Plot
                        data={[
                          {
                            type: 'pie',
                            labels: extractPlotData(analysisData, 'messages_by_location').labels.slice(0, 5),
                            values: extractPlotData(analysisData, 'messages_by_location').values.slice(0, 5),
                          }
                        ]}
                        layout={{
                          title: 'Top 5 Sender Locations',
                          autosize: true,
                        }}
                        style={{ width: '100%', height: 400 }}
                      />
                    </Paper>
                  </Grid>
                )}
                {/* Daily Message Counts */}
                {extractPlotData(analysisData, 'daily_message_counts') && (
                  <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Plot
                        data={[
                          {
                            type: 'scatter',
                            mode: 'lines+markers',
                            x: extractPlotData(analysisData, 'daily_message_counts').labels,
                            y: extractPlotData(analysisData, 'daily_message_counts').values,
                          }
                        ]}
                        layout={{
                          title: 'Daily Message Counts',
                          xaxis: { title: 'Date' },
                          yaxis: { title: 'Message Count' },
                          autosize: true,
                        }}
                        style={{ width: '100%', height: 400 }}
                      />
                    </Paper>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        )}
      </Paper>

      {/* Content Guard Analyze Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Анализ безопасности контента
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Категория опасности"
              name="guardCategory"
              fullWidth
              value={guardCategory}
              onChange={(e) => setGuardCategory(e.target.value)}
              placeholder="Введите категорию (например: spam, phishing, etc.)"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Лимит результатов"
              name="guardLimit"
              type="number"
              fullWidth
              value={guardLimit}
              onChange={(e) => setGuardLimit(Number(e.target.value))}
              placeholder="20"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGuardAnalyze}
              fullWidth
              disabled={loadingGuard}
            >
              {loadingGuard ? <CircularProgress size={24} /> : "Анализировать контент"}
            </Button>
          </Grid>
        </Grid>
        {showGuardResults && guardResult && (
          <Box mt={3}>
            <Typography variant="h6">Результаты анализа содержимого</Typography>
            <Typography>
              Найдено сообщений: <strong>{guardResult.count}</strong>
            </Typography>
            <Typography>
              Категория: <strong>{guardResult.category}</strong>
            </Typography>
            {/* Display the matching messages in a preformatted block */}
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {JSON.stringify(guardResult.matches, null, 2)}
            </pre>
          </Box>
        )}
        <Box mt={2}>
          <Button variant="text" onClick={() => setShowGuardResults((prev) => !prev)}>
            {showGuardResults ? "Скрыть" : "Показать"} Результаты
          </Button>
        </Box>
        <Box mt={4} mb={2}>
          <Typography variant="h6">Анализ одного текста</Typography>
          <TextField
            label="Текст для проверки"
            multiline
            rows={4}
            fullWidth
            value={guardText}
            onChange={e => setGuardText(e.target.value)}
          />
          <Button
            sx={{ mt: 1 }}
            variant="outlined"
            onClick={handleTextGuard}
            disabled={loadingGuard}
          >
            {loadingGuard ? <CircularProgress size={20}/> : "Проверить текст"}
          </Button>
        </Box>

        {textGuardResult && (
          <Box mt={2}>
            <Alert severity={textGuardResult.status==="unsafe" ? "error":"success"}>
              Статус: <strong>{textGuardResult.status}</strong>
              {textGuardResult.category && (
                <> (Категория: <strong>{textGuardResult.category}</strong>)</>
              )}
            </Alert>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default App;
