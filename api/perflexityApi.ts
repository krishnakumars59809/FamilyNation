export const sendToGemini = async (
  text: string,
  systemPrompt: string,
  conversationContext: { type: 'user' | 'bot'; content: string }[] = [],
  useSearch = false
): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const contents = [
      ...conversationContext.map((m) => ({
        role: m.type === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text }] },
    ];

    const payload = {
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      tools: useSearch ? [{ google_search: {} }] : []
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API Error:', err);
      throw new Error(err);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply received.';
    return reply;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};
