import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ResultList from './ResultList';
import ExploreInputs from './ExploreInputs';
import useFlowerSearch from './useFlowerSearch';
import useLibraryFilter from './library/useLibraryFilter';
import LibraryDashboardView from './library/LibraryDashboardView';
import CommonNamesExplorerView from './library/CommonNamesExplorerView';
import CategoryGridView from './library/CategoryGridView';
import AttributeFilterView from './library/AttributeFilterView';
import { filterMultiAttributes } from './library/filters/attributesFilter';
import localFlowerData from '../../../assets/data/flower_data.json';
import indianCommonNames225 from '../../../assets/data/indian_common_names_225.json';

const commonIndianFlowers = (localFlowerData || []).filter(f => f.regional_names);

// Generate a random seed per device/runtime for deterministic daily flower selection
const userDeviceSeed = Math.floor(Math.random() * 1000000) + 1;

export default function LibrarySearchScreen({ database, dashboardMode = 'explore', onSelectFlower, onGoHome, onPushScreen }) {
  const {
    idQuery, setIdQuery,
    commonQuery, setCommonQuery,
    mothersQuery, setMothersQuery,
    localQuery, setLocalQuery,
    colorQuery, setColorQuery,
    showColorDropdown, setShowColorDropdown,
    isApiSearching, apiSearchError,
    results, setApiResults,
    handleIdChange, handleCommonChange, handleMothersChange, handleLocalChange, handleColorChange,
    handleSearch
  } = useFlowerSearch(database);

  // 'dashboard' | 'keyword' | 'color' | 'common' | 'indian' | 'all' | 'twelve_qualities' | 'attributes'
  const [exploreView, setExploreView] = useState('dashboard');
  const [flowerScope, setFlowerScope] = useState('all'); // 'all' | 'common'
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [selectedPsychologyCategory, setSelectedPsychologyCategory] = useState(null);
  const [selectedAttributeCategory, setSelectedAttributeCategory] = useState(null);
  const [selectedGenusCategory, setSelectedGenusCategory] = useState(null);
  const [selectedCommonName, setSelectedCommonName] = useState(null);
  const [commonNameFilter, setCommonNameFilter] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState({
    plantType: null,
    color: null,
    fragrance: null,
    season: null,
    bloomTime: null
  });
  const [isAttributeFilterApplied, setIsAttributeFilterApplied] = useState(false);

  const commonFlowerIdsSet = useMemo(() => {
    const set = new Set();
    if (Array.isArray(indianCommonNames225)) {
      indianCommonNames225.forEach(item => {
        if (item.flower_id) {
          const fid = String(item?.flower_id || '').trim();
          const fid3 = fid.padStart(3, '0');
          const fidClean = fid.replace(/^0+/, '');
          set.add(fid);
          set.add(fid3);
          set.add(fidClean);
        }
      });
    }
    return set;
  }, []);

  const matchingAttributeFlowers = useMemo(() => {
    if (exploreView !== 'attributes') return [];
    const sourceDb = (database && database.length > 0) ? database : (localFlowerData || []);
    return filterMultiAttributes(sourceDb, selectedAttributes, flowerScope, commonFlowerIdsSet);
  }, [database, exploreView, selectedAttributes, flowerScope, commonFlowerIdsSet]);

  const handleSelectFlowerOfTheDay = () => {
    const dbSource = (database && database.length > 0) ? database : (localFlowerData || []);
    if (!dbSource || dbSource.length === 0) return;

    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    let dateHash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      dateHash = (dateHash * 31 + dateStr.charCodeAt(i)) % 1000003;
    }

    const selectedIndex = Math.abs(dateHash ^ userDeviceSeed) % dbSource.length;
    const selectedFlower = dbSource[selectedIndex] || dbSource[0];

    if (onSelectFlower) {
      onSelectFlower(selectedFlower);
    }
  };

  const handleBackPress = () => {
    if (selectedCommonName) {
      setSelectedCommonName(null);
    } else if (selectedQuality) {
      if (selectedQuality === 'COMMON_FLOWERS' || (exploreView === 'view_flowers' && flowerScope === 'common')) {
        setExploreView('dashboard');
        setFlowerScope('all');
        setSelectedQuality(null);
      } else if (selectedQuality.startsWith('COMMON_LETTER_')) {
        setSelectedQuality('COMMON_FLOWERS');
      } else if (selectedQuality.startsWith('LETTER_') && exploreView === 'view_flowers') {
        setSelectedQuality('ALL_FLOWERS');
      } else if (selectedQuality.startsWith('ID_RANGE_') && exploreView === 'view_flowers') {
        setSelectedQuality('ID_RANGES');
      } else if (exploreView === 'nature' && (selectedQuality === 'Vegetables & Pods' || selectedQuality === 'Spices & Medicinal Herbs' || selectedQuality === 'Fruits & Citrus')) {
        setSelectedQuality('Edible Flora');
      } else if (exploreView === 'new_creation' || exploreView === 'new_world') {
        setSelectedQuality(null);
      } else {
        setSelectedQuality(null);
      }
      setSelectedCommonName(null);
      setCommonNameFilter('');
    } else if (selectedPsychologyCategory) {
      setSelectedPsychologyCategory(null);
    } else if (selectedAttributeCategory) {
      setSelectedAttributeCategory(null);
    } else if (selectedGenusCategory) {
      setSelectedGenusCategory(null);
      if (exploreView === 'genus') {
        setExploreView('dashboard');
        setFlowerScope('all');
      }
    } else if (exploreView === 'attributes' && isAttributeFilterApplied) {
      setIsAttributeFilterApplied(false);
    } else if (exploreView !== 'dashboard') {
      setExploreView('dashboard');
      setFlowerScope('all');
      setSelectedPsychologyCategory(null);
      setSelectedAttributeCategory(null);
      setSelectedGenusCategory(null);
      setSelectedCommonName(null);
      setCommonNameFilter('');
      setSelectedAttributes({ plantType: null, color: null, fragrance: null, season: null, bloomTime: null });
      setIsAttributeFilterApplied(false);
      // Reset search queries
      setIdQuery(''); setCommonQuery(''); setMothersQuery(''); setLocalQuery(''); setColorQuery('');
      setApiResults([]);
    } else {
      onGoHome();
    }
  };

  const activeQuery = idQuery || commonQuery || mothersQuery || colorQuery || localQuery || selectedQuality;

  const isCustomQualityView = (
    exploreView === 'view_flowers' ||
    exploreView === 'all' || 
    exploreView === 'genus' || 
    exploreView === 'twelve_qualities' || 
    exploreView === 'human_psychology' || 
    exploreView === 'positive_attributes' || 
    exploreView === 'human_difficulties' || 
    exploreView === 'divine_being' || 
    exploreView === 'higher_hemisphere' || 
    exploreView === 'lower_hemisphere' || 
    exploreView === 'manifestation' || 
    exploreView === 'parts_of_being' || 
    exploreView === 'human_being' || 
    exploreView === 'relation_to_divine' || 
    exploreView === 'union_with_divine' || 
    exploreView === 'yoga' ||
    (exploreView === 'common_languages' && selectedCommonName) ||
    exploreView === 'joy' ||
    exploreView === 'beauty' ||
    exploreView === 'love' ||
    exploreView === 'aesthetics' ||
    exploreView === 'art_and_aesthetics' ||
    exploreView === 'riches' ||
    exploreView === 'nature' ||
    exploreView === 'new_creation' ||
    exploreView === 'new_world' ||
    exploreView === 'spiritual' ||
    exploreView === 'spirituality' ||
    exploreView === 'auroville' ||
    (exploreView === 'attributes' && selectedQuality)
  );

  const {
    allFlowerLetters,
    sortedGenusGroups,
    englishCommonNamesList,
    regionalCommonNamesList,
    activeCommonNamesList,
    displayedCommonNames,
    qualityFilteredResults
  } = useLibraryFilter({
    database,
    exploreView,
    selectedQuality,
    selectedGenusCategory,
    selectedCommonName,
    commonNameFilter,
    flowerScope
  });

  const handleFeatureNotReady = () => {
    Alert.alert("Coming Soon", "This exploration feature will be implemented in a future update.");
  };

  const topSectionTitle = useMemo(() => {
    if (dashboardMode !== 'themes') {
      if (flowerScope === 'common' || selectedQuality === 'COMMON_FLOWERS') {
        return 'Common flowers';
      }
      return 'Explore';
    }
    if (!exploreView || exploreView === 'dashboard') return 'Themes';

    // MANIFESTATION
    if (
      exploreView === 'new_creation' ||
      exploreView === 'new_world' ||
      exploreView === 'nature' ||
      exploreView === 'higher_hemisphere' ||
      exploreView === 'lower_hemisphere' ||
      exploreView === 'auroville'
    ) {
      return 'MANIFESTATION';
    }

    // HUMAN BEING
    if (
      exploreView === 'relation_to_divine' ||
      exploreView === 'yoga' ||
      exploreView === 'union_with_divine' ||
      exploreView === 'parts_of_being' ||
      exploreView === 'human_being' ||
      exploreView === 'human_psychology' ||
      exploreView === 'psychology' ||
      exploreView === 'positive_attributes' ||
      exploreView === 'human_difficulties' ||
      exploreView === 'difficulties'
    ) {
      return 'HUMAN BEING';
    }

    // DIVINE BEING
    if (exploreView === 'divine_being') return 'DIVINE BEING';

    // SPIRITUAL
    if (
      exploreView === 'twelve_qualities' ||
      exploreView === 'spiritual' ||
      exploreView === 'spirituality'
    ) {
      return 'SPIRITUAL';
    }

    // THEMES
    if (
      exploreView === 'joy' ||
      exploreView === 'beauty' ||
      exploreView === 'love' ||
      exploreView === 'aesthetics' ||
      exploreView === 'art_and_aesthetics' ||
      exploreView === 'riches'
    ) {
      return 'THEMES';
    }

    return 'Themes';
  }, [exploreView, dashboardMode, flowerScope, selectedQuality]);

  const buttonTitle = useMemo(() => {
    if (!exploreView || exploreView === 'dashboard') return null;

    if (exploreView === 'new_creation' || exploreView === 'new_world') {
      if (selectedQuality) return selectedQuality;
      return 'New Creation';
    }
    if (exploreView === 'nature') {
      if (selectedQuality === 'Edible Flora') return 'Edible Flora';
      if (selectedQuality === 'Vegetables & Pods' || selectedQuality === 'Spices & Medicinal Herbs' || selectedQuality === 'Fruits & Citrus') {
        return `Edible Flora › ${selectedQuality}`;
      }
      if (selectedQuality) return selectedQuality;
      return 'Nature';
    }
    if (exploreView === 'higher_hemisphere') return 'Higher Hemisphere';
    if (exploreView === 'lower_hemisphere') return 'Lower Hemisphere';
    if (exploreView === 'auroville') return 'Flowers for Auroville';

    if (exploreView === 'relation_to_divine') return 'Relation to the Divine';
    if (exploreView === 'yoga' || exploreView === 'union_with_divine') return 'Yoga';
    if (exploreView === 'parts_of_being' || exploreView === 'human_being') return 'Parts of the Being';
    if (exploreView === 'human_psychology' || exploreView === 'psychology' || exploreView === 'positive_attributes') {
      if (selectedPsychologyCategory) return selectedPsychologyCategory;
      if (selectedQuality) return selectedQuality;
      return 'Human Psychology';
    }
    if (exploreView === 'human_difficulties' || exploreView === 'difficulties') return 'Difficulties';

    if (exploreView === 'divine_being') return 'Aspects';
    if (exploreView === 'twelve_qualities') return 'Twelve Qualities';
    if (exploreView === 'spiritual' || exploreView === 'spirituality') return 'Spiritual';

    if (exploreView === 'joy') return 'Joy';
    if (exploreView === 'beauty') return 'Beauty';
    if (exploreView === 'love') return 'Love';
    if (exploreView === 'aesthetics' || exploreView === 'art_and_aesthetics') return 'Aesthetics';
    if (exploreView === 'riches') return 'Riches';

    if (selectedQuality) {
      if (selectedQuality === 'COMMON_FLOWERS' || selectedQuality === 'Common Flowers' || selectedQuality === 'Common flowers') {
        return null;
      }
      return selectedQuality;
    }
    return null;
  }, [exploreView, selectedQuality, selectedPsychologyCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.btnBack}>
            <Text style={styles.btnBackText}>←</Text>
          </TouchableOpacity>
          <Text 
            style={[
              styles.headerTopTitle, 
              dashboardMode === 'themes' && styles.themesHeaderTitle,
              (topSectionTitle === 'Common flowers' || topSectionTitle === 'Common Flower') && styles.commonFlowersHeaderTitle
            ]} 
            numberOfLines={1}
          >
            {topSectionTitle}
          </Text>
          <TouchableOpacity onPress={onGoHome} style={styles.btnHome}>
            <Text style={styles.btnHomeText}>🏠 Home</Text>
          </TouchableOpacity>
        </View>

        {dashboardMode !== 'themes' && (
          <View style={styles.titleWrapper}>
            <Text style={styles.mainStaticTitle}>
              Mother's Flower Messages
            </Text>
          </View>
        )}



        <View style={styles.content}>
          {exploreView === 'dashboard' ? (
            <LibraryDashboardView 
              mode={dashboardMode}
              onSelectCategory={(category, scope = 'all') => {
                setExploreView(category);
                setFlowerScope(scope);
                setSelectedGenusCategory(category === 'genus' ? scope : null);
                setSelectedAttributeCategory(null);
                setSelectedPsychologyCategory(null);
                setSelectedCommonName(null);
                setCommonNameFilter('');

                if (category === 'attributes') {
                  setSelectedAttributes({ plantType: null, color: null, fragrance: null, season: null, bloomTime: null });
                  setIsAttributeFilterApplied(false);
                }

                if (category === 'common_languages') {
                  if (scope === 'all') {
                    setSelectedQuality('English');
                  } else {
                    setSelectedQuality(null);
                  }
                } else if (category === 'view_flowers' && scope === 'common') {
                  setSelectedQuality('COMMON_FLOWERS');
                } else {
                  setSelectedQuality(null);
                }
              }}
              onSelectPsychologyCategory={setSelectedPsychologyCategory}
              onSelectFlowerOfTheDay={handleSelectFlowerOfTheDay}
            />
          ) : exploreView === 'attributes' ? (
            <AttributeFilterView
              selectedAttributes={selectedAttributes}
              isFilterApplied={isAttributeFilterApplied}
              onApplyFilter={setIsAttributeFilterApplied}
              onToggleAttribute={(cat, val) => {
                setSelectedAttributes(prev => ({
                  ...prev,
                  [cat]: val
                }));
                setIsAttributeFilterApplied(false);
              }}
              onResetAll={() => {
                setSelectedAttributes({
                  plantType: null,
                  color: null,
                  fragrance: null,
                  season: null,
                  bloomTime: null
                });
                setIsAttributeFilterApplied(false);
              }}
              matchingFlowers={matchingAttributeFlowers}
              flowerScope={flowerScope}
              onSelectFlower={onSelectFlower}
            />
          ) : exploreView === 'common_languages' && !selectedCommonName ? (
            <CommonNamesExplorerView
              selectedQuality={selectedQuality}
              flowerScope={flowerScope}
              onSelectLanguage={(lang) => {
                setSelectedQuality(lang);
                setSelectedCommonName(null);
                setCommonNameFilter('');
              }}
              displayedCommonNames={displayedCommonNames}
              commonNameFilter={commonNameFilter}
              onChangeFilter={setCommonNameFilter}
              onSelectCommonName={setSelectedCommonName}
            />
          ) : (!selectedQuality && (
            exploreView === 'view_flowers' ||
            exploreView === 'twelve_qualities' ||
            exploreView === 'human_psychology' ||
            exploreView === 'positive_attributes' ||
            exploreView === 'human_difficulties' ||
            exploreView === 'higher_hemisphere' ||
            exploreView === 'lower_hemisphere' ||
            exploreView === 'parts_of_being' ||
            exploreView === 'human_being' ||
            exploreView === 'relation_to_divine' ||
            exploreView === 'union_with_divine' ||
            exploreView === 'yoga' ||
            exploreView === 'all' ||
            exploreView === 'genus' ||
            exploreView === 'plant_type' ||
            exploreView === 'attributes' ||
            exploreView === 'nature'
          )) || (exploreView === 'view_flowers' && selectedQuality === 'ALL_FLOWERS') || (exploreView === 'view_flowers' && selectedQuality === 'ID_RANGES') || (exploreView === 'attributes' && !selectedQuality) || (exploreView === 'genus' && !selectedQuality) || (exploreView === 'nature' && selectedQuality === 'Edible Flora') ? (
            <CategoryGridView
              exploreView={exploreView}
              selectedQuality={selectedQuality}
              selectedPsychologyCategory={selectedPsychologyCategory}
              selectedAttributeCategory={selectedAttributeCategory}
              selectedGenusCategory={selectedGenusCategory}
              onSelectPsychologyCategory={setSelectedPsychologyCategory}
              onSelectAttributeCategory={setSelectedAttributeCategory}
              onSelectGenusCategory={setSelectedGenusCategory}
              onSelectQuality={setSelectedQuality}
              allFlowerLetters={allFlowerLetters}
              sortedGenusGroups={sortedGenusGroups}
              database={database}
              flowerScope={flowerScope}
            />
          ) : (
            <View style={{ flex: 1 }}>
              {!isCustomQualityView && (
                <View style={styles.searchFieldsContainer}>
                  <ExploreInputs 
                    idQuery={idQuery} handleIdChange={handleIdChange}
                    commonQuery={commonQuery} handleCommonChange={handleCommonChange}
                    mothersQuery={mothersQuery} handleMothersChange={handleMothersChange}
                    localQuery={localQuery} handleLocalChange={handleLocalChange}
                    colorQuery={colorQuery} handleColorChange={handleColorChange}
                    showColorDropdown={showColorDropdown} setShowColorDropdown={setShowColorDropdown}
                    isApiSearching={isApiSearching}
                    handleSearch={handleSearch}
                    onSelectFlower={onSelectFlower}
                    database={database}
                    activeMode={'searchBy'}
                    specificView={exploreView === 'attributes' && selectedQuality === 'color' ? 'color' : exploreView}
                  />
                </View>
              )}

              {isApiSearching ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#FFD700" />
                  <Text style={styles.loadingText}>Searching database...</Text>
                </View>
              ) : (
                <ResultList 
                  results={isCustomQualityView ? qualityFilteredResults : results}
                  searchQuery={activeQuery}
                  onSelectFlower={onSelectFlower}
                  errorMessage={
                    apiSearchError 
                      ? "Error connecting to search API. Please try again." 
                      : isCustomQualityView && qualityFilteredResults.length === 0
                      ? (exploreView === 'divine_being' ? `No flowers found for "Aspects"` : `No flowers found for "${selectedQuality}"`)
                      : null
                  }
                />
              )}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#134e4a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: Platform.OS === 'web' ? 52 : 44, paddingHorizontal: 16, marginTop: Platform.OS === 'web' ? 6 : 0 },
  btnBack: { padding: 4, width: 44, justifyContent: 'center' },
  btnBackText: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
  headerTopTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center' },
  commonFlowersHeaderTitle: { fontSize: 15 },
  themesHeaderTitle: { color: '#FFD700', fontSize: 16, fontWeight: '700' },
  leftTitleContainer: { paddingHorizontal: 16, paddingTop: 0, paddingBottom: 6, marginBottom: 6, width: '100%', alignItems: 'flex-start' },
  leftTitleText: { color: '#4ADE80', fontSize: 18, fontWeight: '700', letterSpacing: 0.3 },
  btnHome: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 12 },
  btnHomeText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  titleWrapper: { alignItems: 'center', paddingHorizontal: 16, paddingBottom: 4, marginTop: 4 },
  mainStaticTitle: { color: '#FFD700', fontSize: 19, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  content: { flex: 1, padding: 16, paddingTop: 0 },
  searchFieldsContainer: { marginBottom: 8 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  loadingText: { color: '#a0aec0', fontSize: 16, marginTop: 12, fontStyle: 'italic' },
});