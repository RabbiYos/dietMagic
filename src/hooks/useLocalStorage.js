import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storageUtils';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    return loadFromLocalStorage(key, initialValue);
  });

  useEffect(() => {
    saveToLocalStorage(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
