import { File } from 'expo-file-system';
import { resizeForApi } from '@/images/processImage';

// Update this constant if the model is deprecated on OpenRouter
const OPENROUTER_MODEL = 'google/gemini-2.5-pro';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Sends the image at `imagePath` to OpenRouter's vision API and returns a
 * one-or-two sentence food description. Throws on any failure — caller handles.
 */
export async function describeImage(imagePath: string, apiKey: string): Promise<string> {
  const resizedUri = await resizeForApi(imagePath);
  const base64 = await new File(resizedUri).base64();

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${base64}` },
            },
            {
              type: 'text',
              text: 'Describe the food in this image concisely in one or two sentences, suitable as a food diary note.',
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter error: ${response.status}`);
  }

  const data = await response.json();
  const content: unknown = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new Error('Unexpected response shape from OpenRouter');
  }
  return content.trim();
}
