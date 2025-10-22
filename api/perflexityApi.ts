export const sendToGemini = async (
  text: string,
  systemPrompt: string,
  conversationContext: any[] = [],
  useSearch = false
): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${text}` }],
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API Error:', err);
      throw new Error(err);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};
