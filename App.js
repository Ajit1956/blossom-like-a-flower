import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, BackHandler, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from './src/ui/components/WelcomeScreen';
import CameraHomeScreen from './src/ui/components/CameraHomeScreen';
import FlowerDetailCard from './src/ui/components/FlowerDetailCard.js';
import LibrarySearchScreen from './src/ui/components/LibrarySearchScreen.js';
import LinksScreen from './src/ui/components/LinksScreen.js';
import GamesScreen from './src/ui/components/GamesScreen.js';
import ViewDetailsModal from './src/ui/components/ViewDetailsModal.js';
import VarietiesModal from './src/ui/components/VarietiesModal.js';
import CommonNamesModal from './src/ui/components/CommonNamesModal.js';
import localFlowerData from './assets/data/flower_data.json';
import { API_BASE_URL, sendAppLaunchPing } from './src/config/api.js';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  // 1. Inject or update viewport meta tag for full edge-to-edge iOS viewport-fit=cover
  let metaViewport = document.querySelector('meta[name="viewport"]');
  if (!metaViewport) {
    metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    document.head.appendChild(metaViewport);
  }
  metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';

  // 2. Inject iOS Web App Full-Screen capability
  let metaCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
  if (!metaCapable) {
    metaCapable = document.createElement('meta');
    metaCapable.name = 'apple-mobile-web-app-capable';
    metaCapable.content = 'yes';
    document.head.appendChild(metaCapable);
  }

  let metaStatus = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (!metaStatus) {
    metaStatus = document.createElement('meta');
    metaStatus.name = 'apple-mobile-web-app-status-bar-style';
    metaStatus.content = 'black-translucent';
    document.head.appendChild(metaStatus);
  }

  // 3. Inject unified background & 100% viewport height CSS rules
  const styleId = 'mobile-app-frame-css';
  let styleEl = document.getElementById(styleId);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }
  styleEl.innerHTML = `
    html, body {
      background-color: #051b1a !important;
      margin: 0 !important;
      padding: 0 !important;
      height: 100% !important;
      height: 100dvh !important;
      width: 100% !important;
      overflow: hidden !important;
      -webkit-user-select: none;
      user-select: none;
    }
    #root {
      background-color: #051b1a !important;
      display: flex !important;
      height: 100% !important;
      height: 100dvh !important;
      width: 100% !important;
      justify-content: center !important;
      align-items: center !important;
    }
    .app-phone-shell {
      width: 100% !important;
      max-width: 100% !important;
      height: 100% !important;
      height: 100dvh !important;
      max-height: 100% !important;
      border-radius: 0 !important;
      border: none !important;
      box-shadow: none !important;
      background-color: #051b1a !important;
    }
    /* Large Desktop Monitors (> 950px with mouse): Centered Frame */
    @media (min-width: 951px) and (hover: hover) {
      #root {
        background-color: #031413 !important;
      }
      .app-phone-shell {
        max-width: 480px !important;
        height: 100vh !important;
        max-height: 940px !important;
        border-radius: 24px !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.7) !important;
      }
    }
  `;
}

export default function App() {
  const [screen, setScreen] = useState('WELCOME');
  const [initialTab, setInitialTab] = useState(0);
  const [dashboardMode, setDashboardMode] = useState('explore');
  const [navStack, setNavStack] = useState([]);
  const [database, setDatabase] = useState(localFlowerData || []);
  const [isFetchingDb, setIsFetchingDb] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const persistItem = async (key, val) => {
    try {
      await AsyncStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
    } catch (e) {
      console.warn(`[AsyncStorage] Failed to save ${key}:`, e.message);
    }
  };

  const fetchDatabase = async () => {
    try {
      const baseUrl = API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/flowers`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const merged = data.map(item => {
            const fid = String(item.id || '').padStart(3, '0');
            const localMatch = (localFlowerData || []).find(l => String(l.id || '').padStart(3, '0') === fid);
            return {
              ...item,
              mothers_name: (localMatch && localMatch.mothers_name) ? localMatch.mothers_name : item.mothers_name,
              mothers_significance: (localMatch && localMatch.mothers_significance !== undefined) ? localMatch.mothers_significance : item.mothers_significance,
              plant_type: item.plant_type || (localMatch ? localMatch.plant_type : ''),
              primary_color: item.primary_color || (localMatch ? localMatch.primary_color : '')
            };
          });
          setDatabase(merged);
        }
      }
    } catch (error) {
      console.warn('Network fetch fallback to local database:', error.message);
    }
  };

  useEffect(() => {
    sendAppLaunchPing();
    fetchDatabase();

    const restoreSavedState = async () => {
      try {
        const savedScreen = await AsyncStorage.getItem('app_screen');
        const savedTab = await AsyncStorage.getItem('app_initialTab');
        const savedMode = await AsyncStorage.getItem('app_dashboardMode');
        const savedNav = await AsyncStorage.getItem('app_navStack');

        if (savedScreen) setScreen(savedScreen);
        if (savedTab !== null) setInitialTab(JSON.parse(savedTab));
        if (savedMode) setDashboardMode(savedMode);
        if (savedNav) setNavStack(JSON.parse(savedNav));
      } catch (e) {
        console.warn('[AsyncStorage] Restoring UI state failed:', e.message);
      }
    };

    restoreSavedState();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (navStack.length > 0) {
        handlePopScreen();
        return true;
      }
      return false;
    };
    
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navStack]);

  const handlePushScreen = (type, params) => {
    setNavStack(prev => {
      const next = [...prev, { type, params }];
      persistItem('app_navStack', next);
      return next;
    });
  };

  const handlePopScreen = () => {
    setNavStack(prev => {
      const next = prev.slice(0, -1);
      persistItem('app_navStack', next);
      return next;
    });
  };

  const handleSnapshotProcessed = (uri, result) => {
    const matched = result ? result.matchedFlower : null;
    if (!matched) return;
    const fid = String(matched.id || '').padStart(3, '0');
    const fullFlower = (database && Array.isArray(database) && database.length > 0)
      ? (database.find(f => String(f.id || '').padStart(3, '0') === fid) || matched)
      : matched;
    handlePushScreen('FLOWER', { flower: fullFlower, photoUri: uri });
  };

  const handleSelectFlower = (flower) => {
    if (!flower) return;
    const fid = String(flower.id || '').padStart(3, '0');
    const fullFlower = (database && Array.isArray(database) && database.length > 0)
      ? (database.find(f => String(f.id || '').padStart(3, '0') === fid) || flower)
      : flower;
    handlePushScreen('FLOWER', { flower: fullFlower });
  };

  const handleReset = async () => {
    setNavStack([]);
    setScreen('WELCOME');
    setInitialTab(0);
    try {
      await AsyncStorage.multiRemove(['app_screen', 'app_initialTab', 'app_dashboardMode', 'app_navStack']);
    } catch (e) {
      console.warn('[AsyncStorage] Error resetting state:', e.message);
    }
  };

  const handleWelcomeNavigate = (tabIndex, mode) => {
    setInitialTab(tabIndex);
    persistItem('app_initialTab', tabIndex);
    if (mode) {
      setDashboardMode(mode);
      persistItem('app_dashboardMode', mode);
    }
    setScreen('APP');
    persistItem('app_screen', 'APP');
  };

  const currentBgColor = screen === 'WELCOME' ? '#051b1a' : '#134e4a';

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: currentBgColor }}>
      <View style={[styles.outerWebContainer, { backgroundColor: currentBgColor }]}>
        <View style={[styles.phoneWrapper, { backgroundColor: currentBgColor }]} dataSet={{ class: 'app-phone-shell' }}>
          <SafeAreaView style={[styles.container, { backgroundColor: currentBgColor }]}>
            {isFetchingDb ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.loadingText}>Loading flower database...</Text>
              </View>
            ) : fetchError ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Failed to load database.</Text>
                <TouchableOpacity style={styles.btnRetry} onPress={fetchDatabase}>
                  <Text style={styles.btnText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : screen === 'WELCOME' ? (
              <WelcomeScreen onNavigate={handleWelcomeNavigate} />
            ) : (
              <>
                <View style={{ flex: 1, display: navStack.length > 0 ? 'none' : 'flex' }}>
                  {initialTab === 3 ? (
                    <GamesScreen onGoHome={handleReset} />
                  ) : initialTab === 2 ? (
                    <LinksScreen onGoHome={handleReset} />
                  ) : initialTab === 1 ? (
                    <LibrarySearchScreen 
                      database={database}
                      dashboardMode={dashboardMode}
                      onSelectFlower={handleSelectFlower}
                      onGoHome={handleReset}
                      onPushScreen={handlePushScreen}
                    />
                  ) : (
                    <CameraHomeScreen 
                      database={database} 
                      initialTab={initialTab}
                      onSnapshotProcessed={handleSnapshotProcessed} 
                      onSelectFlower={handleSelectFlower}
                      onGoHome={handleReset}
                      onPushScreen={handlePushScreen}
                    />
                  )}
                </View>

                <View style={[styles.cardContainer, { display: navStack.length > 0 ? 'flex' : 'none', backgroundColor: '#134e4a' }]}>
                  {navStack.map((screenItem, index) => {
                    if (index !== navStack.length - 1) return null;
                    return (
                      <View key={index} style={StyleSheet.absoluteFill}>
                        {screenItem.type === 'FLOWER' && (
                          <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: Platform.OS === 'web' ? 14 : 8 }}>
                            <View style={styles.cardHeader}>
                              {screenItem.params && screenItem.params.hideBackBtn ? (
                                <View style={styles.btnBackArrow} />
                              ) : (
                                <TouchableOpacity onPress={handlePopScreen} style={styles.btnBackArrow}>
                                  <Text style={styles.btnBackArrowText}>←</Text>
                                </TouchableOpacity>
                              )}
                              <TouchableOpacity onPress={handleReset} style={styles.btnHome}>
                                <Text style={styles.btnHomeText}>🏠 Home</Text>
                              </TouchableOpacity>
                            </View>
                            <FlowerDetailCard 
                              flower={screenItem.params.flower} 
                              photoUri={screenItem.params.photoUri} 
                              database={database}
                              onPushScreen={handlePushScreen}
                              isFromVariety={screenItem.params.isFromVariety}
                            />
                          </View>
                        )}
                        {screenItem.type === 'DETAILS' && (
                          <ViewDetailsModal 
                            flower={screenItem.params.flower}
                            database={screenItem.params.database}
                            isFromVariety={screenItem.params.isFromVariety}
                            onPushScreen={handlePushScreen}
                            onPopScreen={handlePopScreen}
                            onGoHome={handleReset}
                          />
                        )}
                        {screenItem.type === 'COMMON_NAMES' && (
                          <CommonNamesModal 
                            visible={true}
                            onClose={handlePopScreen}
                            onGoHome={handleReset}
                            flower={screenItem.params.flower}
                            isCommonFlower={screenItem.params.isCommonFlower}
                            localMatch={screenItem.params.localMatch}
                          />
                        )}
                        {screenItem.type === 'VARIETIES' && (
                          <VarietiesModal 
                            varieties={screenItem.params.varieties}
                            onPushScreen={handlePushScreen}
                            onPopScreen={handlePopScreen}
                            onGoHome={handleReset}
                          />
                        )}
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </SafeAreaView>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerWebContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneWrapper: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  cardContainer: { flex: 1, width: '100%', paddingBottom: 0 },
  cardHeader: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, zIndex: 999 },
  btnBackArrow: { padding: 8, width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  btnBackArrowText: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
  btnHome: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  btnHomeText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#ffffff', marginTop: 16, fontSize: 16, fontWeight: '500' },
  btnRetry: { marginTop: 24, backgroundColor: '#1a202c', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 }
});
