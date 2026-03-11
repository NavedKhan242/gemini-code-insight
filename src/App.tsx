/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Code2, 
  Zap, 
  Search, 
  ShieldAlert, 
  RefreshCw, 
  Terminal,
  ChevronRight,
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are a Senior Full-Stack Developer and Technical Educator. Your goal is to demystify complex codebases for users of varying skill levels. 
When a user provides code, follow this standardized protocol strictly:

1. The "Elevator Pitch"
Start with a single, bolded sentence explaining exactly what the code accomplishes in plain English.

2. Technical Anatomy (Deep Dive)
Break the code into logical chunks. For each chunk:
- Purpose: What is this section trying to achieve?
- Mechanism: How does it work? Mention specific methods, hooks, or libraries.
- Variables: Explain the role of key data structures or parameters.

3. Efficiency & Performance
Analyze the efficiency. Use LaTeX for any mathematical notations (e.g., $O(n)$).
- Time Complexity: e.g., $O(n^2)$
- Space Complexity: e.g., $O(1)$

4. The "Senior Review" (Critique)
Provide constructive feedback. Identify:
- Edge Cases: Where will this code fail? (e.g., null inputs, empty arrays).
- Best Practices: Is there a cleaner way to write this (e.g., using map() instead of a for loop)?
- Security: Flag any vulnerabilities like hardcoded API keys or SQL injection risks.

5. Interactive Summary
End with one suggested "Refactor" version of the code that is more optimized or readable. Use a code block.

Maintain a professional, encouraging, and highly technical yet accessible tone. Use Markdown for formatting.`;

export default function App() {
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleExplain = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setExplanation('');
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: code,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      setExplanation(response.text || 'Failed to generate explanation.');
      
      // Scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error explaining code:', error);
      setExplanation('An error occurred while analyzing the code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 lg:py-20">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-6"
          >
            <Terminal size={14} />
            <span>v1.0.0 // MASTER ARCHITECT</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent"
          >
            Code Demystified.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            Paste your complex logic and let the Master Architect break it down using industry-standard protocols.
          </motion.p>
        </header>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl"
        >
          <div className="flex items-center justify-between px-6 py-4 border-bottom border-zinc-800 bg-zinc-900/80">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              </div>
              <span className="text-xs font-mono text-zinc-500 ml-2 uppercase tracking-widest">Input Buffer</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <Code2 size={14} />
              <span>TS / JS / PY / GO / RS</span>
            </div>
          </div>
          
          <div className="p-6">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste your code here..."
              className="w-full h-64 bg-transparent border-none focus:ring-0 text-zinc-300 font-mono text-sm resize-none placeholder:text-zinc-700"
            />
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleExplain}
                disabled={isLoading || !code.trim()}
                className="group relative px-8 py-3 bg-emerald-500 text-black font-semibold rounded-xl transition-all hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Explain Logic</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {explanation && (
            <motion.div 
              ref={resultRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-12 space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Zap className="text-emerald-400" />
                  Architect's Report
                </h2>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  title="Copy Report"
                >
                  {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm prose prose-invert prose-emerald max-w-none">
                  <div className="markdown-body">
                    <Markdown>{explanation}</Markdown>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-24 pt-12 border-t border-zinc-900 text-center text-zinc-600 text-sm">
          <p>© 2026 Master Architect AI. Built for Senior Engineering Excellence.</p>
        </footer>
      </main>

      <style>{`
        .markdown-body h1 { @apply text-3xl font-bold mb-6 mt-8 text-white border-b border-zinc-800 pb-2; }
        .markdown-body h2 { @apply text-xl font-semibold mb-4 mt-8 text-emerald-400 flex items-center gap-2; }
        .markdown-body h3 { @apply text-lg font-medium mb-3 mt-6 text-zinc-200; }
        .markdown-body p { @apply text-zinc-400 leading-relaxed mb-4; }
        .markdown-body ul { @apply list-disc list-inside mb-4 space-y-2 text-zinc-400; }
        .markdown-body code { @apply bg-zinc-800 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-sm; }
        .markdown-body pre { @apply bg-black/50 border border-zinc-800 p-6 rounded-xl overflow-x-auto mb-6; }
        .markdown-body pre code { @apply bg-transparent p-0 text-zinc-300; }
        .markdown-body strong { @apply text-white font-semibold; }
        .markdown-body blockquote { @apply border-l-4 border-emerald-500/50 pl-4 italic text-zinc-500 my-6; }
      `}</style>
    </div>
  );
}
