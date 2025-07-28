import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import ChartContainer from "./ChartContainer";

const AnalysisSection = ({ analysisData, loadingAnalyze, onAnalyze }) => {
  const [showVisualizations, setShowVisualizations] = useState(true);

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
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Общий анализ и визуализация набора данных
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={onAnalyze} 
        fullWidth 
        disabled={loadingAnalyze}
      >
        {loadingAnalyze ? <CircularProgress size={24} /> : "Анализировать весь датасет"}
      </Button>
      
      <Box mt={2}>
        <Button variant="text" onClick={() => setShowVisualizations((prev) => !prev)}>
          {showVisualizations ? "Скрыть" : "Показать"} Визуализации
        </Button>
      </Box>
      
      {showVisualizations && (
        <Box mt={2}>
          {!analysisData ? (
            <Alert severity="info">
              Нажмите «Анализировать», чтобы создать данные для визуализации.
            </Alert>
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {extractPlotData(analysisData, 'messages_by_status') && (
                <Grid item xs={12} md={6}>
                  <ChartContainer
                    data={[{
                      type: 'bar',
                      x: extractPlotData(analysisData, 'messages_by_status').labels,
                      y: extractPlotData(analysisData, 'messages_by_status').values,
                      marker: { color: '#2e7d32' }
                    }]}
                    layout={{ title: 'Messages by Status' }}
                    title="Messages by Status"
                  />
                </Grid>
              )}
              
              {extractPlotData(analysisData, 'messages_by_type') && (
                <Grid item xs={12} md={6}>
                  <ChartContainer
                    data={[{
                      type: 'bar',
                      x: extractPlotData(analysisData, 'messages_by_type').labels,
                      y: extractPlotData(analysisData, 'messages_by_type').values,
                      marker: { color: '#d32f2f' }
                    }]}
                    layout={{ title: 'Messages by Type' }}
                    title="Messages by Type"
                  />
                </Grid>
              )}
              
              {extractPlotData(analysisData, 'messages_by_app') && (
                <Grid item xs={12} md={6}>
                  <ChartContainer
                    data={[{
                      type: 'bar',
                      x: extractPlotData(analysisData, 'messages_by_app').labels,
                      y: extractPlotData(analysisData, 'messages_by_app').values,
                      marker: { color: '#ed6c02' }
                    }]}
                    layout={{ title: 'Messages by App' }}
                    title="Messages by App"
                  />
                </Grid>
              )}
              
              {extractPlotData(analysisData, 'messages_by_receiver') && (
                <Grid item xs={12} md={6}>
                  <ChartContainer
                    data={[{
                      type: 'pie',
                      labels: extractPlotData(analysisData, 'messages_by_receiver').labels.slice(0, 5),
                      values: extractPlotData(analysisData, 'messages_by_receiver').values.slice(0, 5),
                    }]}
                    layout={{ title: 'Top 5 Receivers' }}
                    title="Top 5 Receivers"
                  />
                </Grid>
              )}
              
              {extractPlotData(analysisData, 'daily_message_counts') && (
                <Grid item xs={12}>
                  <ChartContainer
                    data={[{
                      type: 'scatter',
                      mode: 'lines+markers',
                      x: extractPlotData(analysisData, 'daily_message_counts').labels,
                      y: extractPlotData(analysisData, 'daily_message_counts').values,
                      line: { color: '#1976d2', width: 3 },
                      marker: { color: '#1976d2', size: 8 }
                    }]}
                    layout={{ title: 'Daily Message Counts' }}
                    title="Daily Message Counts"
                    customHeight={400}
                    customWidth={900}
                  />
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default AnalysisSection;