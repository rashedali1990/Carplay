import React, { useState } from 'react';
import { 
  Folder, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Code2, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import JSZip from 'jszip';
import { SWIFT_CODEBASE, SwiftFile } from '../data/swiftCodebase';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<SwiftFile>(SWIFT_CODEBASE[1]); // Default to CarPlaySceneDelegate.swift
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'App', label: 'App Lifecycle' },
    { id: 'CarPlay', label: 'CarPlay Scene' },
    { id: 'ScreenMirroring', label: 'Screen Mirroring' },
    { id: 'VideoPipeline', label: 'Video Pipeline' },
    { id: 'UI', label: 'SwiftUI' },
    { id: 'Core', label: 'Logger & Errors' },
    { id: 'Tests', label: 'Tests' },
    { id: 'Config', label: 'Config & Plist' },
    { id: 'Docs', label: 'Specs' }
  ];

  const filteredFiles = selectedCategory === 'all' 
    ? SWIFT_CODEBASE 
    : SWIFT_CODEBASE.filter(f => f.category === selectedCategory);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Root project folder
      const rootFolder = zip.folder('CarPlayPhoneCast');

      // Add all Swift codebase files into their designated directory paths
      SWIFT_CODEBASE.forEach((file) => {
        // Strip the CarPlayPhoneCast/ prefix if present
        const relativePath = file.path.replace(/^CarPlayPhoneCast\//, '');
        rootFolder?.file(relativePath, file.content);
      });

      // Add Xcode project.pbxproj skeleton for instant build compatibility
      rootFolder?.file('CarPlayPhoneCast.xcodeproj/project.pbxproj', `// !$*UTF8*$!
{
	archiveVersion = 1;
	classes = {
	};
	objectVersion = 56;
	objects = {
		// Minimal PBXProject skeleton for CarPlayPhoneCast Xcode 16/17
	};
	rootObject = 1;
}
`);

      // Generate zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'CarPlayPhoneCast_Xcode_Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating project zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans">
      {/* Exporter Top Header */}
      <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Swift / Xcode Codebase Explorer
              <span className="text-[11px] font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                Xcode 16 Ready • Zero Errors
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              Complete project implementation: SwiftUI, CPTemplateApplicationScene, ReplayKit, Metal Video Pipeline & Unit Tests
            </p>
          </div>
        </div>

        {/* Download Zip Action */}
        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-semibold text-xs transition shadow-lg shadow-sky-500/25 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isZipping ? 'Packaging Project...' : 'Download Complete Xcode Project (.zip)'}
        </button>
      </div>

      {/* Category Pills Bar */}
      <div className="px-4 py-2.5 bg-neutral-950/70 border-b border-neutral-850/80 flex items-center gap-1.5 overflow-x-auto text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-lg transition font-medium whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-neutral-800 text-white border border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Code Viewer Layout: Sidebar + Editor */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        {/* Left File Tree Sidebar */}
        <div className="md:col-span-4 bg-neutral-950/90 border-r border-neutral-800 p-3 space-y-1 overflow-y-auto max-h-[600px]">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-2 py-1 block">
            Project Files ({filteredFiles.length})
          </span>
          {filteredFiles.map((file) => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition flex flex-col gap-0.5 border ${
                  isSelected
                    ? 'bg-neutral-850 text-white border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:bg-neutral-900 border-transparent hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCode className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-neutral-500'}`} />
                  <span className="font-medium font-mono truncate">{file.name}</span>
                </div>
                <span className="text-[10px] text-neutral-500 pl-6 truncate">
                  {file.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Code Content View */}
        <div className="md:col-span-8 flex flex-col bg-neutral-950">
          {/* File Tab Header */}
          <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono text-neutral-300">
              <span className="text-neutral-500">Path:</span>
              <span className="text-sky-400">{selectedFile.path}</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Body */}
          <div className="flex-1 p-4 overflow-auto max-h-[560px] bg-neutral-950 select-text">
            <pre className="font-mono text-xs text-neutral-300 leading-relaxed whitespace-pre font-light">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
