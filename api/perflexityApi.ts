export const sendToPerplexity = async (
  text: string,
  systemPrompt: string,
  conversationContext: { type: 'user' | 'bot'; content: string }[] = [],
  useSearch = false
): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationContext.map((m) => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      { role: 'user', content: text },
    ];

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: useSearch ? 'sonar-pro' : 'sonar',
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Perplexity API Error:', err);
      throw new Error(err);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No reply received.';
    return reply;
  } catch (error) {
    console.error('Error calling Perplexity API:', error);
    throw error;
  }
};
