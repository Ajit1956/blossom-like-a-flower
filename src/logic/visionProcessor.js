import { fetchEmbeddingFromVertexAI } from './geminiClient.js';
import * as ImageManipulator from 'expo-image-manipulator';

export async function identifyFlowerFromUri(uri, hint) {
  try {
    const vertexResult = await fetchEmbeddingFromVertexAI(uri, hint);
    if (!vertexResult) return null;

    if (vertexResult.isNoMatch || vertexResult.no_match) {
      return { isNoMatch: true, message: vertexResult.message || "Flower not in the list." };
    }

    if (vertexResult.matchedFlower) {
      const fid = String(vertexResult.matchedFlower.id || '');
      const name = String(vertexResult.matchedFlower.mothers_name || vertexResult.matchedFlower.name || '').toLowerCase();

      // Check if matched flower is an N-vector (e.g. N1, N2) or flagged as non-list
      if (
        fid.toUpperCase().startsWith('N') || 
        vertexResult.matchedFlower.is_no_match || 
        name.includes('not in the list')
      ) {
        console.log(`[Vertex AI N-Vector Match]: Matched non-list vector ID ${fid} - returning 'Flower not in the list.'`);
        return { isNoMatch: true, message: "Flower not in the list." };
      }

      console.log('[Vertex AI Matched Flower]:', vertexResult.matchedFlower.botanical_name || vertexResult.matchedFlower.mothers_name);
      return vertexResult;
    }

    if (vertexResult.error) {
      return { isNoMatch: true, message: vertexResult.error || "Flower not in the list." };
    }

    return { isNoMatch: true, message: "Flower not in the list." };
  } catch (err) {
    console.error('[Vertex AI API] Failed:', err);
    return null;
  }
}

