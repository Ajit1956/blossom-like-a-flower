import React, { useState, useRef } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator, Alert, Dimensions, StyleSheet, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { identifyFlowerFromUri } from '../../logic/visionProcessor.js';
import FlowerResultCard from './FlowerResultCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CameraHomeScreen({ onGoHome, database, onPushScreen }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFlowerCard, setSelectedFlowerCard] = useState(null);
  const [confirmedFlower, setConfirmedFlower] = useState(null);
  const [noMatchState, setNoMatchState] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisError, setAnalysisError] = useState(false);
  const [topLayout, setTopLayout] = useState({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.45 });
  const [bottomLayout, setBottomLayout] = useState({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.45 });
  const cameraRef = useRef(null);

  const processImageUri = async (targetUri) => {
    if (!targetUri || isProcessing) return;
    setIsProcessing(true);
    setImage(targetUri);
    setLoading(true);
    setSelectedFlowerCard(null);
    setConfirmedFlower(null);
    setNoMatchState(false);
    setAnalysisError(false);

    try {
      console.log('[CameraHomeScreen] Identifying flower from target URI...');
      const res = await identifyFlowerFromUri(targetUri);
      if (!res) {
        setAnalysisError(true);
      } else if (res.isNoMatch || res.isUnknown) {
        setNoMatchState(true);
      } else {
        setSelectedFlowerCard(res);
      }
    } catch (e) {
      console.error('[Vision Process Error]:', e);
      setAnalysisError(true);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  const handleCapture = async () => {
    if (isProcessing) return;
    
    let capturedUri = null;
    
    // 1. Try cameraRef takePictureAsync
    if (cameraRef.current && cameraRef.current.takePictureAsync) {
      try {
        const pic = await cameraRef.current.takePictureAsync({ quality: 0.6, base64: true });
        if (pic) {
          capturedUri = pic.uri || (pic.base64 ? `data:image/jpeg;base64,${pic.base64}` : null);
        }
      } catch (e) {
        console.warn('[Camera takePictureAsync warning]:', e.message);
      }
    }

    // 2. Web fallback using HTML5 video element canvas capture
    if (!capturedUri && Platform.OS === 'web' && typeof document !== 'undefined') {
      try {
        const videoElement = document.querySelector('video');
        if (videoElement && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
          const canvas = document.createElement('canvas');
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          capturedUri = canvas.toDataURL('image/jpeg', 0.8);
          console.log('[Camera Web HTML5 Canvas capture success]');
        }
      } catch (canvasErr) {
        console.error('[Camera Web Canvas Capture Error]:', canvasErr);
      }
    }

    if (capturedUri) {
      processImageUri(capturedUri);
    } else {
      console.error('[Camera Capture]: Failed to obtain image from camera frame');
      Alert.alert('Camera Capture Failed', 'Could not capture photo from camera frame. Please try again or use the upload button.');
    }
  };

  const handleWebFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          processImageUri(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setImage(null);
    setLoading(false);
    setSelectedFlowerCard(null);
    setConfirmedFlower(null);
    setNoMatchState(false);
    setAnalysisError(false);
  };

  if (!permission) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#134e4a' }}><ActivityIndicator size="large" color="#1a202c" /></View>;
  if (!permission.granted) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#134e4a', padding: 24 }}><Text style={{ fontSize: 14, color: '#a0aec0', textAlign: 'center', marginBottom: 16 }}>Camera access is required.</Text><TouchableOpacity style={{ backgroundColor: '#1a202c', padding: 12, borderRadius: 8 }} onPress={requestPermission}><Text style={{ color: '#ffffff', fontWeight: '600' }}>Grant Permission</Text></TouchableOpacity></View>;

  return (
    <View style={{ flex: 1, backgroundColor: '#134e4a' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50, borderBottomWidth: 1, borderBottomColor: '#2d3748', backgroundColor: '#134e4a', paddingHorizontal: 16 }}>
        <TouchableOpacity onPress={onGoHome} style={{ padding: 4, width: 40 }}><Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700' }}>←</Text></TouchableOpacity>
        <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 }}>Blossom Camera</Text>
        <TouchableOpacity onPress={onGoHome} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 }}><Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '600' }}>🏠 Home</Text></TouchableOpacity>
      </View>
      {image ? (
        <View style={{ flex: 1, backgroundColor: '#111827' }}>
          <View 
            style={{ height: '50%', position: 'relative', overflow: 'hidden' }}
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              if (width > 50 && height > 50) setTopLayout({ width, height });
            }}
          >
            <Image 
              source={{ uri: image }} 
              style={{ width: topLayout.width, height: topLayout.height, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} 
              contentFit="cover" 
            />
            {!confirmedFlower && (noMatchState || selectedFlowerCard || analysisError) && (
                <TouchableOpacity 
                   style={{ position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, zIndex: 10 }}
                   onPress={handleReset}
                >
                   <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>← Retake Photo</Text>
                </TouchableOpacity>
            )}
          </View>
          
          <View style={{ height: '50%', justifyContent: 'center' }}>
            {loading && (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#4FD1C5" />
                <Text style={{ color: '#a0aec0', marginTop: 12, fontSize: 14, fontWeight: '500' }}>Analyzing with Vertex AI...</Text>
              </View>
            )}
            {!loading && analysisError && (
              <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text style={{ color: '#ef4444', fontSize: 18, fontWeight: '700', marginBottom: 6, textAlign: 'center' }}>Analysis Error</Text>
                <Text style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', marginBottom: 20, paddingHorizontal: 16 }}>Unable to connect to Cloud AI. Please tap Retake Photo to try again.</Text>
                <TouchableOpacity 
                  style={{ backgroundColor: '#4FD1C5', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 10 }}
                  onPress={handleReset}
                >
                  <Text style={{ color: '#1a202c', fontWeight: '700', fontSize: 14 }}>Retake Photo</Text>
                </TouchableOpacity>
              </View>
            )}
            {!loading && noMatchState && (
              <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(239, 68, 68, 0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                  <Text style={{ color: '#ef4444', fontSize: 24, fontWeight: 'bold' }}>✕</Text>
                </View>
                <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700', marginBottom: 6, textAlign: 'center' }}>Flower not in the list.</Text>
                <Text style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', marginBottom: 20, paddingHorizontal: 16, lineHeight: 18 }}>The AI analyzed your photo and determined this flower is not in the 898 cataloged flowers.</Text>
                <TouchableOpacity 
                  style={{ backgroundColor: '#4FD1C5', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 10 }}
                  onPress={handleReset}
                >
                  <Text style={{ color: '#1a202c', fontWeight: '700', fontSize: 14 }}>Retake Photo</Text>
                </TouchableOpacity>
              </View>
            )}
            {!loading && selectedFlowerCard && !confirmedFlower && !noMatchState && (
              <View style={{ paddingLeft: 20, paddingVertical: 20, flex: 1, justifyContent: 'center' }}>
                <FlowerResultCard 
                  flower={selectedFlowerCard} 
                  database={database} 
                  onConfirmMatch={(match) => setConfirmedFlower(match)}
                />
              </View>
            )}
            {!loading && confirmedFlower && (
              <View 
                style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
                onLayout={(e) => {
                  const { width, height } = e.nativeEvent.layout;
                  if (width > 50 && height > 50) setBottomLayout({ width, height });
                }}
              >
                {confirmedFlower.image_url ? (
                    <Image 
                      source={{ uri: confirmedFlower.image_url }} 
                      style={{ width: bottomLayout.width, height: bottomLayout.height }} 
                      contentFit="cover" 
                    />
                ) : (
                  <View style={{ flex: 1, backgroundColor: '#374151', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{color: '#9ca3af'}}>No Image</Text>
                  </View>
                )}
                <View style={{ 
                  position: 'absolute', 
                  bottom: 20, 
                  left: 0, 
                  right: 0, 
                  flexDirection: 'row', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: 12,
                  zIndex: 20 
                }}>
                  <TouchableOpacity 
                     style={{ 
                       backgroundColor: '#FDE047', 
                       paddingVertical: 12, 
                       paddingHorizontal: 22, 
                       borderRadius: 24, 
                       shadowColor: '#000', 
                       shadowOffset: { width: 0, height: 4 }, 
                       shadowOpacity: 0.3, 
                       shadowRadius: 4, 
                       elevation: 6 
                     }}
                     onPress={() => onPushScreen('FLOWER', { flower: confirmedFlower, photoUri: image, hideBackBtn: true })}
                  >
                     <Text style={{ color: '#1a202c', fontWeight: '800', fontSize: 15 }}>Confirm Match</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                     style={{ 
                       backgroundColor: '#374151', 
                       paddingVertical: 12, 
                       paddingHorizontal: 22, 
                       borderRadius: 24, 
                       borderWidth: 1,
                       borderColor: '#4b5563',
                       shadowColor: '#000', 
                       shadowOffset: { width: 0, height: 4 }, 
                       shadowOpacity: 0.3, 
                       shadowRadius: 4, 
                       elevation: 6 
                     }}
                     onPress={() => setConfirmedFlower(null)}
                  >
                     <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 15 }}>Back</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 4 }}>
            <CameraView style={{ flex: 1 }} ref={cameraRef} />
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
              <View style={{ width: 220, height: 220, borderWidth: 3, borderColor: '#1a202c', borderRadius: 24, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(26, 32, 44, 0.05)' }}><View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#1a202c', opacity: 0.8 }} /></View>
              <Text style={{ color: '#ffffff', fontSize: 13, marginTop: 16, fontWeight: '500' }}>Center the flower blossom within the box</Text>
            </View>
          </View>
          <View style={{ flex: 1, backgroundColor: '#134e4a', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
            {Platform.OS === 'web' && (
              <label style={{ backgroundColor: '#2d3748', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, cursor: 'pointer', color: '#ffffff', fontSize: 13, fontWeight: '600', display: 'flex', alignItems: 'center', gap: 6 }}>
                📁 Upload Photo
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleWebFileUpload} />
              </label>
            )}
            <TouchableOpacity style={{ width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }} onPress={handleCapture} disabled={isProcessing}>
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#e53e3e' }} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
