import { API_BASE_URL } from '../config/api.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@regional_names_cache';
const CACHE_TIMESTAMP_KEY = '@regional_names_timestamp';

// In-memory cache for synchronous lookups and searches
let memoryCache = [];
let memoryCacheByFlowerId = {};

/**
 * Parses and filters records based on quarantine rules
 */
const processRecords = (records) => {
  const filtered = records.filter(record => {
    // Quarantine Filtering
    if (record.needs_review === true) return false;
    if (record.category === 'UNDER_VERIFICATION') return false;
    return true;
  });

  memoryCache = filtered;
  
  // Build lookup index by flower_id
  memoryCacheByFlowerId = {};
  filtered.forEach(record => {
    if (!memoryCacheByFlowerId[record.flower_id]) {
      memoryCacheByFlowerId[record.flower_id] = [];
    }
    memoryCacheByFlowerId[record.flower_id].push(record);
  });
};

export const fetchAndCacheRegionalNames = async () => {
  try {
    // 1. Try to load from persistent cache first
    if (AsyncStorage) {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedData) {
        processRecords(JSON.parse(cachedData));
      }
    }

    // 2. Fetch fresh data from API (or delta updates if supported)
    const baseUrl = API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/regional_names`);
    
    if (response.ok) {
      const freshData = await response.json();
      
      // Update persistent cache
      if (AsyncStorage) {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
        await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      }
      
      // Update in-memory cache
      processRecords(freshData);
    }
  } catch (error) {
    console.error('Error fetching regional names:', error);
  }
};

/**
 * Synchronously retrieves regional names for a given flower ID.
 * Returns an array of regional names grouped by language or just the raw array.
 */
export const getRegionalNamesForFlower = (flowerId) => {
  if (!flowerId) return [];
  return memoryCacheByFlowerId[flowerId] || [];
};

/**
 * Formats the array of records into a dictionary keyed by language name
 * to maintain compatibility with existing UI components.
 */
export const getFormattedRegionalNamesForFlower = (flowerId) => {
  const records = getRegionalNamesForFlower(flowerId);
  const formatted = {};
  records.forEach(record => {
    if (!formatted[record.language]) {
      formatted[record.language] = [];
    }
    formatted[record.language].push(record);
  });
  return formatted;
};

/**
 * Performs a synchronous fuzzy search across all valid regional names in memory.
 * Used by searchEngine.js
 */
export const searchRegionalNames = (query, similarityThreshold = 0.5) => {
  if (!query || !query.trim()) return [];
  const normalizedQuery = query.trim().toLowerCase();
  
  const matches = new Set();
  
  memoryCache.forEach(record => {
    // Match native script or transliteration
    const nativeMatch = record.regional_name && record.regional_name.toLowerCase().includes(normalizedQuery);
    const latinMatch = record.transliteration && record.transliteration.toLowerCase().includes(normalizedQuery);
    
    if (nativeMatch || latinMatch) {
      matches.add(record.flower_id);
    }
  });
  
  return Array.from(matches); // Returns array of matched flower_ids
};
