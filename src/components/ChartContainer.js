import React, { useEffect, useRef, useState } from "react";
import { Paper } from "@mui/material";
import Plot from 'react-plotly.js';

const ChartContainer = ({ data, layout, title, fullWidth = false, customHeight, customWidth }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: customWidth || 400, height: customHeight || 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const chartWidth = Math.max(containerWidth - 32, 300); // 32px for padding
        setDimensions({
          width: customWidth || chartWidth,
          height: customHeight || 400
        });
      }
    };

    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [customHeight, customWidth]);

  const chartLayout = {
    ...layout,
    width: dimensions.width,
    height: dimensions.height,
    margin: { l: 50, r: 50, t: 50, b: 50 },
    autosize: false,
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }} ref={containerRef}>
      <Plot
        data={data}
        layout={chartLayout}
        config={{ responsive: false, displayModeBar: false }}
      />
    </Paper>
  );
};

export default ChartContainer;