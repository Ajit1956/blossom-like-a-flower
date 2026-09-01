export const API_BASE_URL = 'https://flower-ai-backend-501336869089.us-central1.run.app';

/**
 * Sends an automated analytics heartbeat ping on app startup.
 */
export async function sendAppLaunchPing() {
  try {
    const deviceName = Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'iOS or Android';
    const response = await fetch(`${API_BASE_URL}/api/analytics/ping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: 'anonymous_device_id',
        device: deviceName,
        action: 'app_open'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('[Analytics Ping] Successfully sent app launch ping:', data);
      return data;
    } else {
      console.warn(`[Analytics Ping] Server returned status ${response.status}`);
    }
  } catch (error) {
    console.warn('[Analytics Ping] Error sending launch ping:', error.message);
  }
  return null;
}
