/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useRef, useEffect } from 'react';
import { Copy, MousePointer2, Loader, Save, Pencil, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { checkGrammar } from '../grammar/grammar';
import GrammarEditor from '../grammar/GrammarEditor';
import { useTheme } from 'next-themes';
import LanguageSelector from '../languages/language';
import Header from '../header/header';
import { ModeToggle } from '../ui/ModeToggle';


const Home = () => {
  const [topic, setTopic] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedBlogs, setGeneratedBlogs] = useState<{ topic: string; blog: string; suggestedTitles: string[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(300); // Default word count
  const [category, setCategory] = useState('');
  const [tone, setTone] = useState('professional');
  const [language, setLanguage] = useState('en'); // Store selected language
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
      alert('Please provide a valid topic.');
      return;
    }

    setLoading(true);
    try {
     const requestData = { topic: topic.trim(), userPrompt, wordCount, category, tone, language };


      const response = await fetch('api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (data.blog) {
        const titles = generateTitlesFromContent(data.blog);
        setGeneratedBlogs((prevBlogs) => [{ topic, blog: data.blog, suggestedTitles: titles }, ...prevBlogs]);
        setTopic('');
        setUserPrompt('');
      } else {
        alert('Error generating blog');
      }
    } catch (error) {
      console.error('Error generating blog:', error);
      alert('Error generating blog');
    }
    setLoading(false);
  };
  console.log(topic);

  const generateTitlesFromContent = (content: string) => {
    return [
      `${content.slice(0, 30)}... - A Deep Dive`,
      `Exploring ${content.slice(0, 30)} - All You Need to Know`,
      `The Ultimate Guide to ${content.slice(0, 30)}`
    ];
  };
 console.log(theme);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset previous height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set new height
    }
  }, [topic]);

  const handleCopy = (blog: string, index: number) => {
    navigator.clipboard.writeText(blog).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1000);
    });
  };

  const handleDownloadPDF = (item: { topic: string; blog: string }) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Topic: ${item.topic}`, 10, 20);
    doc.setFontSize(12);
    doc.text(item.blog, 10, 40);
    doc.save(`${item.topic}.pdf`);
  };
  // const handleEdit = (index: number) => {
  //   // When the edit button is clicked, set the editing index and pre-fill the content
  //   setEditingIndex(index);
  //   setEditedContent(generatedBlogs[index].blog); // Pre-fill the content to the textarea
  // };
  const handleSaveEdit = (index: number) => {
    // Make a copy of the current blogs to avoid direct mutation
    const updatedBlogs = [...generatedBlogs];
  
    // Update the blog at the specified index with the new edited content
    updatedBlogs[index] = {
      ...updatedBlogs[index], // Preserve other properties like topic, suggestedTitles
      blog: editedContent, // Update the blog content with the new edited content
    };
  
    // Update the state with the modified blogs array
    setGeneratedBlogs(updatedBlogs);
  
    // Reset the editing state
    setEditingIndex(null); // Reset the editing mode
    setEditedContent(''); // Clear the edited content
  };

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
    <Header />
    <div className="flex flex-col min-h-screen items-center bg-gray-50">
      <header className="py-6 text-center w-11/12 md:w-1/2">
        <h1 className="text-3xl font-bold">AI Blog Generator</h1>
      
        {/* Dark/Light mode toggle if needed */}
        <div className="absolute top-4 right-4 ">
          
          <ModeToggle /> 
        </div>
      </header>
  
      <main className="flex-1 w-11/12 md:w-1/2 flex flex-col  space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-lg font-semibold">Enter Blog Details</h2>
  
          <div className="w-full sm:w-[20%]">
            <LanguageSelector onSelect={setLanguage} />
          </div>
  
          <div className="space-y-2">
            <label htmlFor="topic" className="font-semibold">Topic</label>
            <textarea
              id="topic"
              ref={textareaRef}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter blog topic"
              className="w-full p-3 border border-gray-300 rounded-lg text-base resize-none overflow-hidden"
            />
          </div>
  
          <div className="flex flex-wrap justify-between gap-4">
            <div className="w-full sm:w-[30%]">
              <label htmlFor="category" className="block font-semibold mb-1">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="Technology">Technology</option>
                <option value="Health">Health</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Others">Others</option>
              </select>
            </div>
  
            <div className="w-full sm:w-[30%]">
              <label htmlFor="tone" className="block font-semibold mb-1">Tone</label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="humorous">Humorous</option>
              </select>
            </div>
  
            <div className="w-full sm:w-[30%]">
              <label htmlFor="wordCount" className="block font-semibold mb-1">Word Count</label>
              <input
                type="number"
                id="wordCount"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                min="100"
                max="2000"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
  
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Generate blog"
            >
              {loading ? <Loader className="animate-spin w-5 h-5" /> : <MousePointer2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
  
        {/* Render generated blogs */}
        {generatedBlogs.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#F7F7F7',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ margin: 0 }}>
                Topic: <strong>{item.topic}</strong>
              </h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleCopy(item.blog, index)} style={{ border: 'none', background: 'transparent' }}>
                  <Copy />
                </button>
                <button onClick={() => handleDownloadPDF(item)} style={{ border: 'none', background: 'transparent' }}>
                  <Download />
                </button>
                <button
                  onClick={() => {
                    setEditingIndex(index);
                    setEditedContent(item.blog);
                    setTimeout(() => {
                      if (textareaRef.current) {
                        textareaRef.current.style.height = 'auto';
                        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                      }
                    }, 0);
                  }}
                  style={{ border: 'none', background: 'transparent' }}
                >
                  <Pencil />
                </button>
              </div>
            </div>
  
            {copiedIndex === index && (
              <div
                style={{
                  position: 'absolute',
                  top: '40px',
                  right: '0',
                  backgroundColor: '#333',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                Copied!
              </div>
            )}
  
            {editingIndex === index ? (
              <>
                <textarea
                  ref={textareaRef}
                  value={editedContent}
                  onChange={(e) => {
                    setEditedContent(e.target.value);
                    if (textareaRef.current) {
                      textareaRef.current.style.height = 'auto';
                      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                    }
                  }}
                  style={{
                    width: '100%',
                    minHeight: '150px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '16px',
                    resize: 'none',
                    overflow: 'hidden',
                  }}
                />
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleSaveEdit(index)}
                    style={{
                      backgroundColor: '#28a745',
                      color: '#fff',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    Save with Grammar Check
                  </button>
                  <button
                    onClick={() => {
                      setEditingIndex(null);
                      setEditedContent('');
                    }}
                    style={{
                      backgroundColor: '#ccc',
                      color: '#333',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <p style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>{item.blog}</p>
            )}
  
            {item.suggestedTitles?.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <h4 className="font-semibold">Suggested Titles</h4>
                <ul className="list-disc list-inside">
                  {item.suggestedTitles.map((title, i) => (
                    <li key={i}>{title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  </>
  );
}
export default  Home;
  