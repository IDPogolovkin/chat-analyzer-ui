import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import MessageCard from "./MessageCard";
import api from "../api";

const HAZARD_CATEGORIES_RU = {
  "S1": "Насильственные преступления",
  "S2": "Ненасильственные преступления",
  "S3": "Преступления на сексуальной почве",
  "S4": "Сексуальная эксплуатация детей",
  "S5": "Клевета",
  "S6": "Специализированные консультации",
  "S7": "Нарушение конфиденциальности",
  "S8": "Интеллектуальная собственность",
  "S9": "Оружие неизбирательного действия",
  "S10": "Враждебные высказывания",
  "S11": "Суицид и членовредительство",
  "S12": "Контент сексуального характера",
  "S13": "Выборы"
};

const GuardSection = ({ downloadJSON }) => {
  const [loadingGuard, setLoadingGuard] = useState(false);
  const [showGuardResults, setShowGuardResults] = useState(true);
  const [guardCategory, setGuardCategory] = useState("");
  const [guardLimit, setGuardLimit] = useState(10);
  const [guardResult, setGuardResult] = useState(null);

  const handleGuardAnalyze = async () => {
    if (!guardCategory) {
      alert("Пожалуйста, выберите категорию опасности.");
      return;
    }
    setLoadingGuard(true);
    setGuardResult(null);
    try {
      const response = await api.post("/api/guard/category", {
        category: guardCategory,
        limit: guardLimit,
      });
      setGuardResult(response.data);
      downloadJSON(response.data, `guard_result_${guardCategory}`);
    } catch (error) {
      console.error("Guard Analyze Error:", error);
      alert("An error occurred during the hazard content analysis. Please try again.");
    } finally {
      setLoadingGuard(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Анализ на опасный контент 🛡️
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Категория опасности
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(HAZARD_CATEGORIES_RU).map(([code, name]) => (
              <Button 
                key={code} 
                variant={guardCategory === code ? "contained" : "outlined"} 
                onClick={() => setGuardCategory(code)}
                size="small"
              >
                {name}
              </Button>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TextField 
            label="Лимит результатов" 
            name="guardLimit" 
            type="number" 
            fullWidth 
            value={guardLimit} 
            onChange={(e) => setGuardLimit(Number(e.target.value))} 
          />
        </Grid>
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleGuardAnalyze} 
            fullWidth 
            disabled={loadingGuard}
          >
            {loadingGuard && guardCategory ? (
              <CircularProgress size={24} />
            ) : (
              "Найти опасный контент"
            )}
          </Button>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Button variant="text" onClick={() => setShowGuardResults((prev) => !prev)}>
          {showGuardResults ? "Скрыть" : "Показать"} Результаты анализа
        </Button>
      </Box>
      
      {showGuardResults && guardResult && (
        <Box mt={2}>
          <Typography>
            Найдено сообщений: <strong>{guardResult.count}</strong>
          </Typography>
          <Typography>
            Категория: <strong>{HAZARD_CATEGORIES_RU[guardCategory] || guardResult.category}</strong>
          </Typography>
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
            {guardResult.matches.length > 0 ? (
              guardResult.matches.map((msg, index) => (
                <MessageCard key={index} message={msg} isSentByUser={false} />
              ))
            ) : (
              <Alert severity="success">
                Сообщений по данной категории не найдено.
              </Alert>
            )}
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 4 }} />
    </Paper>
  );
};

export default GuardSection;