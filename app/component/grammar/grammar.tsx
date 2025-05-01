export const checkGrammar = async (inputText: string): Promise<string> => {
    try {
      const response = await fetch('/api/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
  
      const data = await response.json();
  
      let correctedText = inputText;
  
      if (data.matches && data.matches.length > 0) {
        let offsetShift = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.matches.forEach((match: any) => {
          if (match.replacements && match.replacements.length > 0) {
            const replacement = match.replacements[0].value;
            const start = match.offset + offsetShift;
            const end = start + match.length;
  
            correctedText =
              correctedText.slice(0, start) +
              replacement +
              correctedText.slice(end);
  
            offsetShift += replacement.length - match.length;
          }
        });
      }
  
      return correctedText;
    } catch (error) {
      console.error('Error checking grammar:', error);
      return inputText; // fallback to original if something goes wrong
    }
  };
  