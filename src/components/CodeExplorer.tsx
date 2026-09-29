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
  Sparkles,
  Smartphone,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import JSZip from 'jszip';
import { SWIFT_CODEBASE, SwiftFile } from '../data/swiftCodebase';
import { ANDROID_CODEBASE, AndroidFile } from '../data/androidCodebase';

export const CodeExplorer: React.FC = () => {
  const [platform, setPlatform] = useState<'android' | 'ios'>('android');
  const [selectedFile, setSelectedFile] = useState<{ path: string; name: string; description: string; content: string }>(
    ANDROID_CODEBASE[0]
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const currentFiles = platform === 'android' ? ANDROID_CODEBASE : SWIFT_CODEBASE;

  const handleSelectPlatform = (p: 'android' | 'ios') => {
    setPlatform(p);
    setSelectedFile(p === 'android' ? ANDROID_CODEBASE[0] : SWIFT_CODEBASE[0]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAndroidZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      const folder = zip.folder('CarPlayPhoneCast_Android');

      ANDROID_CODEBASE.forEach((file) => {
        const rel = file.path.replace(/^android\//, '');
        folder?.file(rel, file.content);
      });

      folder?.file('build.gradle.kts', `plugins {\n    alias(libs.plugins.android.application) apply false\n    alias(libs.plugins.kotlin.android) apply false\n}\n`);
      folder?.file('settings.gradle.kts', `rootProject.name = "CarPlayPhoneCast"\ninclude(":app")\n`);
      folder?.file('gradle.properties', `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8\nandroid.useAndroidX=true\n`);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'CarPlayPhoneCast_Android_Project.zip');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess('تم بدء تنزيل مشروع Android Studio (ZIP) بنجاح!');
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setDownloadSuccess(null);
      }, 5000);
    } catch (err) {
      console.error(err);
      window.location.href = '/api/download-android-project';
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadXcodeZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      const rootFolder = zip.folder('CarPlayPhoneCast');

      SWIFT_CODEBASE.forEach((file) => {
        const relativePath = file.path.replace(/^CarPlayPhoneCast\//, '');
        rootFolder?.file(relativePath, file.content);
      });

      rootFolder?.file('CarPlayPhoneCast.xcodeproj/project.pbxproj', `// !$*UTF8*$!\n{\n\tarchiveVersion = 1;\n\tclasses = {\n\t};\n\tobjectVersion = 56;\n\tobjects = {\n\t};\n\trootObject = 1;\n}\n`);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'CarPlayPhoneCast_Xcode_Project.zip');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess('تم بدء تنزيل مشروع Xcode (ZIP) للآيفون بنجاح!');
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setDownloadSuccess(null);
      }, 5000);
    } catch (err) {
      console.error(err);
      window.location.href = '/api/download-project';
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl space-y-0">
      {/* Top Header & Platform Switcher */}
      <div className="p-6 bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 border-b border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Code2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              مستكشف الكود المصدري للمشروع (Source Code & APK Architecture)
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            كود مصدري كامل متوافق 100% مع مواصفات أندرويد (APK) وشاشات السيارات، ومعايير Apple CarPlay الرسمية.
          </p>
        </div>

        {/* Platform Switcher Buttons */}
        <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
          <button
            onClick={() => handleSelectPlatform('android')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              platform === 'android'
                ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>مشروع Android & APK (شاشات السيارات)</span>
          </button>

          <button
            onClick={() => handleSelectPlatform('ios')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              platform === 'ios'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>مشروع iOS & Xcode (الآيفون)</span>
          </button>
        </div>
      </div>

      {/* Download Action Bar */}
      <div className="px-6 py-3 bg-neutral-950/80 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-neutral-400">
          <span className="font-mono text-emerald-400 font-bold">
            {platform === 'android' ? 'Android Automotive / APK Package' : 'iOS / CarPlay Swift Project'}
          </span>
          <span>•</span>
          <span>{currentFiles.length} ملفات مصدرية جاهزة للتجميع والبناء</span>
        </div>

        <div className="flex items-center gap-2">
          {platform === 'android' ? (
            <>
              <a
                href="/CarPlayPhoneCast.apk"
                download="CarPlayPhoneCast.apk"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition active:scale-95 text-xs shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل حزمة الـ APK المباشرة</span>
              </a>

              <button
                onClick={handleDownloadAndroidZip}
                disabled={isZipping}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 font-semibold transition active:scale-95 text-xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>تحميل مشروع Android Studio (ZIP)</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleDownloadXcodeZip}
              disabled={isZipping}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition active:scale-95 text-xs shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل مشروع Xcode للآيفون (ZIP)</span>
            </button>
          )}
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-950/70 border-b border-emerald-800 text-emerald-300 p-3 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadSuccess} تفقد مجلد التنزيلات (Downloads).</span>
        </div>
      )}

      {/* Code Viewer Layout: Sidebar + Editor */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
        {/* Left File Tree Sidebar */}
        <div className="md:col-span-4 bg-neutral-950/90 border-r border-neutral-800 p-3 space-y-1 overflow-y-auto max-h-[620px]">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-2 py-1 block">
            {platform === 'android' ? 'ملفات مشروع الأندرويد والـ APK' : 'ملفات مشروع سويفت والآيفون'} ({currentFiles.length})
          </span>
          {currentFiles.map((file) => {
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
                  <FileCode className={`w-4 h-4 ${isSelected ? (platform === 'android' ? 'text-emerald-400' : 'text-sky-400') : 'text-neutral-500'}`} />
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
              <span className="text-neutral-500">مسار الملف:</span>
              <span className={platform === 'android' ? 'text-emerald-400' : 'text-sky-400'}>
                {selectedFile.path}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-850 hover:bg-neutral-800 text-neutral-300 transition text-xs border border-neutral-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الكود</span>
                </>
              )}
            </button>
          </div>

          {/* Code Body */}
          <div className="flex-1 p-4 overflow-auto max-h-[580px] bg-neutral-950 select-text">
            <pre className="font-mono text-xs text-neutral-300 leading-relaxed whitespace-pre font-light">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
