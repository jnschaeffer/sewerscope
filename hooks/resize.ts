import { useState, useEffect } from 'react';

type WindowDimensions = {
  width: number,
  height: number,
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({width: 0, height: 0});

  useEffect(() => {
    function handleResize() {
      let dimensions = getWindowDimensions()
      setWindowDimensions(dimensions)
    }

    handleResize()

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('load', handleResize);
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowDimensions;
}
