import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@chakra-ui/react';

function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for increasing, -1 for decreasing

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress >= 100) {
        setDirection(-1);
      } else if (progress <= 0) {
        setDirection(1);
      }
      setProgress(progress + direction);
    }, 100); // update every 100ms

    // Cleanup interval
    return () => clearInterval(interval);
  }, [progress, direction]);

  return (
    <CircularProgress value={progress} color="green.400" />
  );
}

export default ProgressBar;
