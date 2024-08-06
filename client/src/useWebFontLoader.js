import { useEffect } from 'react';
import WebFont from 'webfontloader';

const useWebFontLoader = () => {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto+Condensed:400,700&display=swap']
      }
    });
  }, []);
};

export default useWebFontLoader;
