import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import SearchSection from "./components/SearchSection";
import AnalysisSection from "./components/AnalysisSection";
import ExternalVisualizationsSection from "./components/ExternalVisualizationsSection";
import GuardSection from "./components/GuardSection";
import api from "./api";

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);

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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Анализатор переписок 💬
      </Typography>

      <SearchSection downloadJSON={downloadJSON} />
      
      <AnalysisSection 
        analysisData={analysisData}
        loadingAnalyze={loadingAnalyze}
        onAnalyze={handleAnalyze}
      />
      
      <ExternalVisualizationsSection />
      
      <GuardSection downloadJSON={downloadJSON} />
    </Container>
  );
}

export default App;