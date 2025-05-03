import { NextResponse } from 'next/server';

// Helper function to get the full language name from code
function getFullLanguageName(code: string): string {
  const languageMap: Record<string, string> = {
    'en': 'English',
    'hi': 'Hindi',
    'fr': 'French',
    'es': 'Spanish',
    'ja': 'Japanese',
    'zh': 'Chinese'
  };
  
  return languageMap[code] || code;
}

export async function POST(req: Request) {
  try {
    const { topic, wordCount, category, tone, language } = await req.json();
    
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';
    
    if (!apiKey) {
      console.error('Missing OPENROUTER_API_KEY');
      return NextResponse.json({ error: 'Server misconfiguration: missing API key' }, { status: 500 });
    }
    
    // Get full language name for clearer instructions
    const fullLanguageName = getFullLanguageName(language);
    
    // Create a more explicit system message with specific Hindi instructions if needed
    let systemMessage = `You are a blog writing assistant. Write in a ${tone} tone.`;
    
    if (language === 'hi') {
      // Specific instructions for Hindi language generation
      systemMessage += ` The entire output MUST be in Hindi (हिंदी) language using Devanagari script. Do not use transliteration or Roman script.`;
    } else {
      // General instruction for other languages
      systemMessage += ` The entire output MUST be in ${fullLanguageName} language.`;
    }
    
    const openAiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: language === 'hi' 
              ? `मुझे इस विषय पर लगभग ${wordCount} शब्दों का एक ब्लॉग पोस्ट लिखकर दें: ${topic}, श्रेणी: ${category}`
              : `Write a ${wordCount}-word blog post on: ${topic} in the ${category} category.`,
          },
        ],
      }),
    });
    
    if (!openAiResponse.ok) {
      const errorData = await openAiResponse.json();
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json({ error: 'Failed to generate blog', details: errorData }, { status: 500 });
    }
    
    const responseData = await openAiResponse.json();
    const generatedBlog = responseData.choices?.[0]?.message?.content || 'No content generated';
    
    return NextResponse.json({ blog: generatedBlog });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error occurred', details: error }, { status: 500 });
  }
}