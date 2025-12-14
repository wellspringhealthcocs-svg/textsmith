import React, { useState, useEffect, useRef } from 'react';
import { ToolAction, ToolCategory, ToneType } from './types';
import { Button } from './components/Button';
import { Icon } from './components/Icon';
import { paraphraseText } from './services/geminiService';
import { Copy, Download, Trash2, Github, Menu, Info, Crown } from 'lucide-react';

// --- Tool Definitions ---
const tools: ToolAction[] = [
  { id: 'removeWhitespace', label: 'Trim Whitespace', category: ToolCategory.FORMATTING, iconName: 'minimize', description: 'Remove extra spaces and tabs.' },
  { id: 'removeEmptyLines', label: 'Remove Empty Lines', category: ToolCategory.FORMATTING, iconName: 'x-square', description: 'Delete lines with no content.' },
  { id: 'uppercase', label: 'UPPERCASE', category: ToolCategory.CASE, iconName: 'type', description: 'Convert all text to uppercase.' },
  { id: 'lowercase', label: 'lowercase', category: ToolCategory.CASE, iconName: 'type', description: 'Convert all text to lowercase.' },
  { id: 'sentenceCase', label: 'Sentence case', category: ToolCategory.CASE, iconName: 'type', description: 'Capitalize first letter of sentences.' },
  { id: 'bold', label: 'Bold Text', category: ToolCategory.STYLING, iconName: 'bold', description: 'Convert text to Unicode Bold.' },
  { id: 'italic', label: 'Italic Text', category: ToolCategory.STYLING, iconName: 'italic', description: 'Convert text to Unicode Italic.' },
  { id: 'underline', label: 'Underline', category: ToolCategory.STYLING, iconName: 'underline', description: 'Add Unicode underline.' },
  { id: 'sortAZ', label: 'Sort Lines A-Z', category: ToolCategory.SORTING, iconName: 'sort-az', description: 'Sort lines alphabetically.' },
  { id: 'sortZA', label: 'Reverse Sort Z-A', category: ToolCategory.SORTING, iconName: 'sort-za', description: 'Sort lines reverse alphabetically.' },
  { id: 'lineNumbers', label: 'Add Line Numbers', category: ToolCategory.MANIPULATION, iconName: 'hash', description: 'Add 1. 2. 3. to each line.' },
  { id: 'tabsToSpaces', label: 'Tabs to Spaces', category: ToolCategory.MANIPULATION, iconName: 'tabs', description: 'Convert tab characters to 4 spaces.' },
];

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [stats, setStats] = useState({ words: 0, chars: 0, lines: 0 });
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'about'>('editor');

  // Stats Effect
  useEffect(() => {
    const text = input || '';
    setStats({
      chars: text.length,
      words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
      lines: text.trim() === '' ? 0 : text.split('\n').length
    });
  }, [input]);

  // Logic Handlers
  const handleToolClick = (toolId: string) => {
    // Use output as source if available to allow chaining, otherwise use input
    let result = output || input;
    if (!result) return;

    switch (toolId) {
      case 'removeWhitespace':
        result = result.replace(/[ \t]+/g, ' ').split('\n').map(l => l.trim()).join('\n');
        break;
      case 'removeEmptyLines':
        result = result.split('\n').filter(line => line.trim() !== '').join('\n');
        break;
      case 'uppercase':
        result = result.toUpperCase();
        break;
      case 'lowercase':
        result = result.toLowerCase();
        break;
      case 'sentenceCase':
        result = result.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'bold':
        result = toUnicodeVariant(result, 'bold');
        break;
      case 'italic':
        result = toUnicodeVariant(result, 'italic');
        break;
      case 'underline':
        result = result.split('').map(char => char + '\u0332').join('');
        break;
      case 'sortAZ':
        result = result.split('\n').sort().join('\n');
        break;
      case 'sortZA':
        result = result.split('\n').sort().reverse().join('\n');
        break;
      case 'lineNumbers':
        result = result.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
        break;
      case 'tabsToSpaces':
        result = result.replace(/\t/g, '    ');
        break;
    }
    setOutput(result);
  };

  // Helper for Unicode Bold/Italic
  const toUnicodeVariant = (str: string, variant: 'bold' | 'italic') => {
    const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const bold = "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗";
    const italic = "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧0123456789";
    
    // Actually, spread operator [...] splits surrogate pairs correctly in modern JS
    const boldChars = [...bold]; 
    const italicChars = [...italic];
    
    return str.split('').map(char => {
      const idx = normal.indexOf(char);
      if (idx === -1) return char;
      return variant === 'bold' ? boldChars[idx] : italicChars[idx];
    }).join('');
  };

  const handleAIAction = async (tone: ToneType) => {
    // Use output as source if available
    const textToProcess = output || input;
    if (!textToProcess) return;

    setIsProcessingAI(true);
    try {
      const refined = await paraphraseText(textToProcess, tone);
      setOutput(refined);
    } catch (e) {
      alert('AI processing failed. Check API configuration.');
    } finally {
      setIsProcessingAI(false);
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      // Could add a toast here
    }
  };

  const downloadTxt = () => {
    if (!output) return;
    const element = document.createElement("a");
    const file = new Blob([output], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "textsmith_output.txt";
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'TextSmith - Free Online Text Tools',
      text: 'Check out TextSmith, a free online text manipulation and AI paraphrasing tool.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error, ignore
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('editor')}>
              <div className="bg-brand-500 text-white p-1.5 rounded-lg">
                <Icon name="wand" size={24} />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">TextSmith</span>
            </div>

            <nav className="flex items-center space-x-4 ml-auto">
              <button onClick={() => setActiveTab('editor')} className={`text-sm font-medium transition-colors ${activeTab === 'editor' ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'}`}>
                Tools
              </button>
              <button onClick={() => setActiveTab('about')} className={`text-sm font-medium transition-colors ${activeTab === 'about' ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'}`}>
                About
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50 relative">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          
          {activeTab === 'editor' ? (
            <div className="animate-fade-in">
              {/* Toolbar Section */}
              <div className="mb-8 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">Refine your text instantly.</h1>
                    <p className="text-slate-500 mt-1">Select a tool below to process your text.</p>
                  </div>
                  
                  {/* AI / Pro Section - Highlighted */}
                  <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 p-2 rounded-xl border border-indigo-100 shadow-sm">
                    <div className="px-3 py-1">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center">
                        <Icon name="sparkles" size={12} className="mr-1" /> AI Tools
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => handleAIAction('formal')}
                      isLoading={isProcessingAI}
                    >
                       Formalize
                    </Button>
                     <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => handleAIAction('concise')}
                      isLoading={isProcessingAI}
                    >
                       Summarize
                    </Button>
                  </div>
                </div>

                {/* Standard Tools Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.id)}
                      className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl hover:border-brand-400 hover:shadow-md transition-all duration-200 group text-center h-24"
                    >
                      <div className="p-2 rounded-full bg-slate-50 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors mb-2">
                        <Icon name={tool.iconName} size={20} />
                      </div>
                      <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">{tool.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Area */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px] lg:h-[calc(100vh-340px)] min-h-[500px]">
                {/* Input Column */}
                <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <span className="font-semibold text-slate-700 text-sm flex items-center">
                      <Icon name="align-left" size={16} className="mr-2 text-slate-400" />
                      Input Text
                    </span>
                    <button onClick={() => setInput('')} className="text-slate-400 hover:text-red-500 transition-colors" title="Clear">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <textarea
                    className="flex-grow w-full p-4 resize-none outline-none text-white bg-slate-900 font-mono text-sm leading-relaxed placeholder:text-slate-500"
                    placeholder="Paste or type your text here..."
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (output) setOutput(''); // Clear output if user edits source manually to avoid confusion
                    }}
                    spellCheck="false"
                  />
                  <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-mono">
                    <span>Chars: {stats.chars}</span>
                    <span>Words: {stats.words}</span>
                    <span>Lines: {stats.lines}</span>
                  </div>
                </div>

                {/* Output Column */}
                <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <span className="font-semibold text-slate-700 text-sm flex items-center">
                      <Icon name="refresh" size={16} className="mr-2 text-slate-400" />
                      Refined Output
                    </span>
                    <div className="flex space-x-2">
                       <button onClick={downloadTxt} className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors" title="Download .txt">
                        <Download size={16} />
                      </button>
                      <button onClick={copyToClipboard} className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors" title="Copy to Clipboard">
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="flex-grow w-full p-4 resize-none outline-none text-slate-800 font-mono text-sm leading-relaxed bg-slate-50/30"
                    placeholder="Your refined text will appear here..."
                    value={output}
                    readOnly
                  />
                </div>
              </div>

              {/* SEO Content Block */}
              <div className="mt-16 space-y-8 pb-12">
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Free Online Text Tools for Developers & Writers</h2>
                    <p className="text-slate-600 leading-relaxed">
                      TextSmith is the ultimate <strong>online text manipulation utility</strong> designed to streamline your workflow. 
                      Whether you are a developer cleaning code, a writer formatting content, or a data analyst organizing lists, 
                      our suite of <strong>free text tools</strong> helps you refine your output instantly.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Clean & Format Text</h3>
                        <p className="text-slate-600 leading-relaxed">
                          Effortlessly <strong>remove extra whitespace</strong>, delete empty lines, and convert tabs to spaces. 
                          Perfect for cleaning up code snippets or formatting copied text.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Case & List Converter</h3>
                        <p className="text-slate-600 leading-relaxed">
                          Use our <strong>case converter</strong> to switch to UPPERCASE, lowercase, or Sentence case. 
                          Organize data with our <strong>line sorter</strong> to alphabetize lists A-Z or Z-A.
                        </p>
                      </div>
                       <div>
                        <h3 className="font-semibold text-slate-900 mb-2">AI-Powered Rewriting</h3>
                        <p className="text-slate-600 leading-relaxed">
                          Leverage our <strong>AI paraphrasing tool</strong> to rewrite text, adjust tone to formal or concise, 
                          and summarize long paragraphs instantly.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                       <h3 className="font-bold text-slate-900 mb-2">Secure Browser-Based Processing</h3>
                       <p className="text-slate-600 leading-relaxed">
                         TextSmith performs most transformations locally in your browser. This means your data stays private and your 
                         <strong>text processing</strong> is lightning fast. No server uploads for basic formatting.
                       </p>
                    </div>
                     <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                       <h3 className="font-bold text-slate-900 mb-2">Unicode Text Styler</h3>
                       <p className="text-slate-600 leading-relaxed">
                         Stand out on social media with our <strong>bold text generator</strong> and italic fonts. 
                         Convert standard text to styled Unicode characters that work on Twitter, Instagram, and LinkedIn.
                       </p>
                    </div>
                  </div>

                  {/* Share Box */}
                  <div className="bg-brand-600 rounded-2xl p-8 text-center text-white shadow-lg shadow-brand-500/30">
                    <div className="max-w-2xl mx-auto">
                      <h3 className="text-2xl font-bold mb-3">Love using TextSmith?</h3>
                      <p className="text-brand-100 mb-6 text-lg">
                        Help your colleagues and friends work faster by sharing this free tool with them.
                      </p>
                      <button 
                        onClick={handleShare} 
                        className="bg-white text-brand-600 px-8 py-3 rounded-xl font-bold hover:bg-brand-50 transition-colors inline-flex items-center shadow-sm"
                      >
                        <Icon name="share" size={20} className="mr-2"/> 
                        Share TextSmith
                      </button>
                    </div>
                  </div>
              </div>
            </div>
          ) : (
             <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-slide-up">
                <h2 className="text-2xl font-bold mb-4">About TextSmith</h2>
                <p className="text-slate-600 mb-4">
                  TextSmith is a fast, client-side text manipulation tool designed for developers, writers, and data analysts. 
                  Unlike other tools, basic operations happen instantly in your browser without sending data to a server.
                </p>
                <p className="text-slate-600 mb-6">
                  For advanced transformations like paraphrasing and tone adjustment, we utilize the Google Gemini API to provide state-of-the-art AI assistance.
                </p>
                
                <h3 className="text-lg font-bold mb-2">Privacy & Terms</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-2 text-sm">
                  <li>We do not store your text for basic operations.</li>
                  <li>AI features send data to Google Gemini for processing only.</li>
                  <li>This service is provided "as is" without warranty.</li>
                </ul>
             </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm mb-2">
            © {new Date().getFullYear()} TextSmith. All rights reserved.
          </p>
          <p className="text-slate-400 text-xs">
            Monetized via Ad Networks and TextSmith Pro. 
            <span className="mx-2">•</span>
            Privacy Policy
            <span className="mx-2">•</span>
            Terms of Service
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;