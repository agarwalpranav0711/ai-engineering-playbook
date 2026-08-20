import React, { useState } from 'react';
import { Upload, FileText, Sparkles, CheckCircle, AlertTriangle, ArrowRight, Zap, RefreshCw } from 'lucide-react';

const SAMPLE_STRONG_RESUME = `Pranav Agarwal
Email: pranav@example.com | Phone: +1-555-0199 | GitHub: github.com/pranav | LinkedIn: linkedin.com/in/pranav

EDUCATION
B.Tech in Computer Science & Engineering | CPI: 8.8/10.0 (2022 - 2026)

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, C++, HTML5, CSS3, SQL
Frameworks & Libraries: React, Node.js, Express.js, FastAPI, Tailwind CSS, Redux Toolkit
Tools & Platforms: Git, GitHub, Docker, REST APIs, Supabase, Vercel, Postman

EXPERIENCE
Frontend Developer Intern | TechFlow Solutions (May 2024 - July 2024)
- Developed responsive web interfaces using React, TypeScript, and Tailwind CSS, improving user engagement by 25%.
- Integrated RESTful APIs with Node.js backend, reducing client-side data fetching latency by 30%.
- Utilized Git for version control and collaborated with a team of 4 engineers using Agile methodologies.

PROJECTS
Spotify Clone Web Application
- Built a full-stack music streaming web application using React, Tailwind CSS, and REST APIs.
- Implemented state management using Redux Toolkit and audio playback controls.
- Containerized application frontend using Docker and deployed on Vercel.

AI Resume & Document Reviewer
- Engineered an automated resume analysis agent using Python, FastAPI, and Pydantic for structured validation.
- Extracted PDF resume content and evaluated skill alignment against job descriptions with 95% accuracy.`;

const SAMPLE_WEAK_RESUME = `Pranav
Student

Skills:
HTML, CSS, JavaScript, Git

Projects:
- Worked on website
- Created a simple todo app using HTML and CSS
- Made a simple script

Experience:
- Helped friends with coding projects`;

const SAMPLE_JD = `Frontend Developer Intern / Junior Developer

About the Role:
We are seeking a motivated Frontend Developer Intern with strong skills in modern web development frameworks.

Requirements:
- Strong proficiency in React and JavaScript / TypeScript
- Experience building responsive web applications using CSS/Tailwind CSS
- Hands-on experience integrating REST APIs
- Familiarity with Git version control
- Good understanding of containerization (Docker) is a plus

Preferred Skills:
- Experience with FastAPI or Node.js backend integration
- TypeScript evidence in production or personal projects
- AWS or Cloud deployment knowledge

Responsibilities:
- Write clean, maintainable, and well-tested React components.
- Collaborate with backend engineers to integrate APIs.
- Optimize frontend web performance and mobile responsiveness.`;

export default function InputForm({ onAnalyze, loading, mode }) {
  const [inputTab, setInputTab] = useState('upload'); // 'upload' or 'text'
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState(SAMPLE_JD);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const loadPreset = (type) => {
    if (type === 'strong') {
      setInputTab('text');
      setFile(null);
      setResumeText(SAMPLE_STRONG_RESUME);
      setJobDescription(SAMPLE_JD);
    } else {
      setInputTab('text');
      setFile(null);
      setResumeText(SAMPLE_WEAK_RESUME);
      setJobDescription(SAMPLE_JD);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputTab === 'upload' && !file && !resumeText.strip()) {
      alert('Please upload a PDF/TXT resume file or switch to Text Paste.');
      return;
    }
    if (inputTab === 'text' && !resumeText.trim()) {
      alert('Please enter or paste your resume text.');
      return;
    }
    if (!jobDescription.trim()) {
      alert('Please enter a target Job Description.');
      return;
    }

    onAnalyze({
      file: inputTab === 'upload' ? file : null,
      resumeText: inputTab === 'text' ? resumeText : (file ? '' : resumeText),
      jobDescription,
      mode
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
      
      {/* Top Banner & Sample Presets */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Upload & Compare
          </h2>
          <p className="text-xs text-slate-400">Provide candidate resume and target role description</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
          <button
            type="button"
            onClick={() => loadPreset('strong')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-1"
          >
            <CheckCircle className="w-3 h-3" />
            Strong Resume
          </button>
          <button
            type="button"
            onClick={() => loadPreset('weak')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3" />
            Weak Resume
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT: Resume Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                1. Candidate Resume
              </label>
              
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setInputTab('upload')}
                  className={`px-2.5 py-0.5 rounded-md font-medium transition-all ${
                    inputTab === 'upload' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setInputTab('text')}
                  className={`px-2.5 py-0.5 rounded-md font-medium transition-all ${
                    inputTab === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {inputTab === 'upload' ? (
              <div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-xl p-6 text-center transition-all bg-slate-900/40 hover:bg-slate-900/60 group">
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    {file ? (
                      <p className="text-sm font-medium text-emerald-400 flex items-center justify-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </p>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-slate-200">
                          Click to upload or drag & drop resume
                        </p>
                        <p className="text-xs text-slate-500">Supports PDF or TXT files</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste full resume text here..."
                rows={10}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono resize-none"
              />
            )}
          </div>

          {/* RIGHT: Job Description Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                2. Target Job Description
              </span>
              <span className="text-xs text-slate-500 font-normal">Requirements & Responsibilities</span>
            </label>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job posting description here..."
              rows={10}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono resize-none"
            />
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Mode: <strong className="text-slate-200">{mode === 'multi_agent' ? '4-Agent Team Pipeline' : 'Single AI Reviewer'}</strong>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing Resume Evidence...
              </>
            ) : (
              <>
                Run AI Match Review
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
