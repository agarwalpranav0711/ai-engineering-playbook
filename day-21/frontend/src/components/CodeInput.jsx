import React, { useState } from 'react';
import { Code2, Play, Sparkles, AlertTriangle, ShieldAlert, Cpu, RefreshCw, FileCode } from 'lucide-react';

const PRESET_BUGGY_CPP = `#include <iostream>
using namespace std;

// Calculates sum of array elements
int sum(int arr[], int n) {
    int result = 0;

    // BUG: Loop condition 'i <= n' goes out of bounds at index 'n'
    for(int i = 0; i <= n; i++) {
        result += arr[i];
    }

    return result;
}

int main() {
    int nums[] = {10, 20, 30, 40, 50};
    int total = sum(nums, 5);
    cout << "Total: " << total << endl;
    return 0;
}`;

const PRESET_INEFFICIENT_PYTHON = `# Inefficient pair sum calculation with O(n^2) time complexity

def print_all_pairs(arr):
    n = len(arr)
    # PERFORMANCE ISSUE: Nested loop causes quadratic O(n^2) time complexity
    for i in range(n):
        for j in range(n):
            print(f"Pair ({arr[i]}, {arr[j]}) -> Sum: {arr[i] + arr[j]}")

def find_duplicates(nums):
    dups = []
    # QUALITY ISSUE: Inefficient list searching inside nested loop
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j] and nums[i] not in dups:
                dups.append(nums[i])
    return dups`;

const PRESET_VULNERABLE_SECRET = `import requests

# SECURITY VULNERABILITY: Hardcoded API secret key in source code
API_KEY = "sk-or-v1-99887766554433221100aabbccddeeff"
DATABASE_PASSWORD = "SuperSecretPassword123!"

def fetch_user_data(user_id):
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
    url = f"https://api.example.com/users/{user_id}"
    response = requests.get(url, headers=headers)
    return response.json()`;

const PRESET_CLEAN_FUNCTION = `int add(int a, int b) {
    return a + b;
}`;

export default function CodeInput({ onReview, loading, reviewMode, setReviewMode }) {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(PRESET_BUGGY_CPP);

  const handlePreset = (type) => {
    if (type === 'buggy_cpp') {
      setLanguage('cpp');
      setCode(PRESET_BUGGY_CPP);
      setReviewMode('bugs');
    } else if (type === 'inefficient_py') {
      setLanguage('python');
      setCode(PRESET_INEFFICIENT_PYTHON);
      setReviewMode('dsa');
    } else if (type === 'vulnerable_py') {
      setLanguage('python');
      setCode(PRESET_VULNERABLE_SECRET);
      setReviewMode('security');
    } else if (type === 'clean') {
      setLanguage('cpp');
      setCode(PRESET_CLEAN_FUNCTION);
      setReviewMode('full');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    onReview({ language, code, review_mode: reviewMode });
  };

  // Compute line numbers for editor
  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
      
      {/* Controls & Sample Presets */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        
        {/* Language Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-cyan-400" />
            Language:
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="cpp">C++ (.cpp)</option>
            <option value="python">Python (.py)</option>
            <option value="javascript">JavaScript (.js)</option>
            <option value="typescript">TypeScript (.ts)</option>
            <option value="java">Java (.java)</option>
            <option value="go">Go (.go)</option>
            <option value="c">C (.c)</option>
            <option value="rust">Rust (.rs)</option>
          </select>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Quick Test Presets:</span>
          
          <button
            type="button"
            onClick={() => handlePreset('buggy_cpp')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3" />
            Buggy C++ Array
          </button>

          <button
            type="button"
            onClick={() => handlePreset('inefficient_py')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-all flex items-center gap-1"
          >
            <Cpu className="w-3 h-3" />
            O(n²) Python
          </button>

          <button
            type="button"
            onClick={() => handlePreset('vulnerable_py')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-1"
          >
            <ShieldAlert className="w-3 h-3" />
            Vulnerable Secret
          </button>

          <button
            type="button"
            onClick={() => handlePreset('clean')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            Clean Function
          </button>
        </div>

      </div>

      {/* Code Editor Area */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="relative flex rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden font-mono text-xs shadow-inner">
          
          {/* Line Numbers Sidebar */}
          <div className="bg-slate-900/60 border-r border-slate-800 text-slate-600 text-right select-none py-3 px-2.5 font-mono text-[11px] leading-relaxed">
            {lineNumbers.map(n => (
              <div key={n}>{n}</div>
            ))}
          </div>

          {/* Code Textarea */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste or write source code here..."
            rows={12}
            className="w-full bg-transparent p-3 text-slate-200 placeholder-slate-600 focus:outline-none resize-y leading-relaxed font-mono selection:bg-cyan-500/30"
          />

        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Selected Mode: <strong className="text-cyan-300 uppercase">{reviewMode}</strong>
          </div>

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing Multi-Dimensional Code Rules...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Run AI Code Review
              </>
            )}
          </button>

        </div>

      </form>

    </div>
  );
}
