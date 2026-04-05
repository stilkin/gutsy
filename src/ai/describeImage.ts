import { File } from 'expo-file-system';
import { resizeForApi } from '@/images/processImage';
import type { Language, ModelTier } from '@/types';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const TIER_MODELS: Record<ModelTier, string> = {
  free: 'qwen/qwen3.6-plus:free',
  normal: 'google/gemini-3-flash-preview',
  premium: 'anthropic/claude-sonnet-4.6',
};

const PROMPT_LANGUAGES: Record<Language, string> = {
  en: 'English', es: 'Spanish', pt: 'Portuguese', fr: 'French',
  de: 'German', it: 'Italian', nl: 'Dutch', pl: 'Polish',
  tr: 'Turkish', id: 'Indonesian',
};

/**
 * Sends the image at `imagePath` to OpenRouter's vision API and returns a
 * one-or-two sentence food description. Throws on any failure — caller handles.
 */
export async function describeImage(
  imagePath: string,
  apiKey: string,
  modelTier: ModelTier = 'normal',
  language: Language = 'en',
): Promise<string> {
  const resizedUri = await resizeForApi(imagePath);
  const base64 = await new File(resizedUri).base64();

  let prompt =
    'List only the food and drink items visible in this image. Be concise (one or two sentences). Do not describe plates, packaging, background, or anything that is not food or drink.';
  if (language !== 'en') {
    prompt += ` Respond in ${PROMPT_LANGUAGES[language]}.`;
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: TIER_MODELS[modelTier],
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
              text: prompt,
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
