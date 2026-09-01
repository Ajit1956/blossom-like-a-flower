import { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';
import { filterFlowers, filterFlowersById } from '../../logic/searchEngine.js';
import { API_BASE_URL } from '../../config/api.js';

export default function useFlowerSearch(database) {
  const [idQuery, setIdQuery] = useState('');
  const [commonQuery, setCommonQuery] = useState('');
  const [mothersQuery, setMothersQuery] = useState('');
  const [localQuery, setLocalQuery] = useState('');
  const [colorQuery, setColorQuery] = useState('');
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  
  const [isApiSearching, setIsApiSearching] = useState(false);
  const [apiSearchError, setApiSearchError] = useState(false);
  const [apiResults, setApiResults] = useState([]);
  
  const [activeMode, setActiveMode] = useState('searchBy'); // 'searchBy' or 'viewAll'
  const [results, setResults] = useState([]);
  
  // Local instant search removed as it is now consolidated below.
  
  const [showFamiliarityDropdown, setShowFamiliarityDropdown] = useState(false);
  const [selectedFamiliarity, setSelectedFamiliarity] = useState(null);
  const [familiarityResults, setFamiliarityResults] = useState([]);

  const sortFlowersAlphabetically = (flowers) => {
    return [...flowers].sort((a, b) => {
      const nameA = (a.mothers_name || a.spiritual_name || a.common_name || '').toLowerCase();
      const nameB = (b.mothers_name || b.spiritual_name || b.common_name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  };

  const handleSearch = async () => {
    Keyboard.dismiss();
    const activeText = idQuery.trim() || commonQuery.trim() || mothersQuery.trim() || localQuery.trim();
    if (!colorQuery.trim() && !activeText) {
      setApiResults([]);
      setApiSearchError(false);
      return;
    }

    setIsApiSearching(true);
    setApiSearchError(false);
    
    try {
      if (idQuery.trim()) {
        setIsApiSearching(false);
        if (database) {
          const localMatches = filterFlowersById(idQuery, database);
          setApiResults(localMatches);
        }
        return;
      }

      const baseUrl = API_BASE_URL;
      if (colorQuery.trim()) {
        const response = await fetch(`${baseUrl}/api/vector-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: colorQuery.trim(), searchType: 'color' })
        });
        
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        const data = await response.json();
        setApiResults(Array.isArray(data) ? sortFlowersAlphabetically(data) : []);
      } else if (activeText) {
        let mode = '';
        if (commonQuery.trim()) mode = 'common';
        else if (mothersQuery.trim()) mode = 'keyword';
        else if (localQuery.trim()) mode = 'local';
        
        if (mode === 'keyword' || mode === 'mothers') {
           setIsApiSearching(false);
           if (database) {
             const localMatches = filterFlowers(mothersQuery, 'mothers', database);
             setApiResults(localMatches);
           }
           return;
        } else if (mode === 'common') {
           setIsApiSearching(false);
           if (database) {
             const localMatches = filterFlowers(commonQuery, 'common', database);
             setApiResults(localMatches);
           }
           return;
        }
        
        const response = await fetch(`${baseUrl}/api/search?query=${encodeURIComponent(activeText)}&mode=${mode}`);
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        } else {
          const data = await response.json();
          setApiResults(Array.isArray(data) ? sortFlowersAlphabetically(data) : []);
        }
      }
    } catch (err) {
      console.error('API search failed:', err);
      // If API search failed but database is available locally, perform local fallback
      if (database && activeText) {
        let fallbackMode = 'mothers';
        if (commonQuery.trim()) fallbackMode = 'common';
        const localMatches = filterFlowers(activeText, fallbackMode, database);
        setApiResults(localMatches);
        setApiSearchError(false);
      } else {
        setApiSearchError(true);
        setApiResults([]);
      }
    } finally {
      setIsApiSearching(false);
    }
  };

  useEffect(() => {
    const fetchFamiliarity = async () => {
       if (selectedFamiliarity === null) {
          setFamiliarityResults([]);
          return;
       }

       if (selectedFamiliarity === 0) {
          setFamiliarityResults(sortFlowersAlphabetically(database));
          return;
       }
       setIsApiSearching(true);
       try {
          const baseUrl = API_BASE_URL;
          const res = await fetch(`${baseUrl}/api/flowers/familiarity/${selectedFamiliarity}`);
          if (res.ok) {
             const data = await res.json();
             setFamiliarityResults(Array.isArray(data) ? sortFlowersAlphabetically(data) : []);
          } else {
             setFamiliarityResults([]);
          }
       } catch (e) {
          console.error(e);
          setFamiliarityResults([]);
       } finally {
          setIsApiSearching(false);
       }
    };
    
    if (activeMode === 'viewAll') {
       fetchFamiliarity();
    }
  }, [selectedFamiliarity, activeMode, database]);

  useEffect(() => {
    if (activeMode === 'viewAll') {
      setResults(familiarityResults);
    } else {
      if (idQuery.trim() && database) {
        const localMatches = filterFlowersById(idQuery, database);
        setResults(localMatches);
      } else if (mothersQuery.trim() && database) {
        const localMatches = filterFlowers(mothersQuery, 'mothers', database);
        setResults(localMatches);
      } else if (commonQuery.trim() && database) {
        const localMatches = filterFlowers(commonQuery, 'common', database);
        setResults(localMatches);
      } else {
        setResults(apiResults);
      }
    }
  }, [activeMode, familiarityResults, apiResults, idQuery, mothersQuery, commonQuery, database]);

  const handleIdChange = (text) => {
    setIdQuery(text);
    if (text) { setCommonQuery(''); setMothersQuery(''); setLocalQuery(''); setColorQuery(''); setShowColorDropdown(false); }
    else { setApiResults([]); }
  };

  const handleCommonChange = (text) => {
    setCommonQuery(text);
    if (text) { setIdQuery(''); setMothersQuery(''); setLocalQuery(''); setColorQuery(''); setShowColorDropdown(false); }
    else { setApiResults([]); }
  };

  const handleMothersChange = (text) => {
    setMothersQuery(text);
    if (text) { setIdQuery(''); setCommonQuery(''); setLocalQuery(''); setColorQuery(''); setShowColorDropdown(false); }
    else { setApiResults([]); }
  };

  const handleLocalChange = (text) => {
    setLocalQuery(text);
    if (text) { setIdQuery(''); setCommonQuery(''); setMothersQuery(''); setColorQuery(''); setShowColorDropdown(false); }
    else { setApiResults([]); }
  };

  const handleColorChange = (text) => {
    setColorQuery(text);
    if (text) { setIdQuery(''); setCommonQuery(''); setMothersQuery(''); setLocalQuery(''); }
    else { setApiResults([]); }
  };

  return {
    idQuery, setIdQuery,
    commonQuery, setCommonQuery,
    mothersQuery, setMothersQuery,
    localQuery, setLocalQuery,
    colorQuery, setColorQuery,
    showColorDropdown, setShowColorDropdown,
    isApiSearching, apiSearchError,
    activeMode, setActiveMode,
    results, setApiResults,
    showFamiliarityDropdown, setShowFamiliarityDropdown,
    selectedFamiliarity, setSelectedFamiliarity,
    handleIdChange,
    handleCommonChange,
    handleMothersChange,
    handleLocalChange,
    handleColorChange,
    handleSearch
  };
}
