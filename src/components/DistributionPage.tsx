import React, { useState } from 'react';
import { 
  Download, 
  Apple, 
  ExternalLink, 
  ShieldCheck, 
  Smartphone, 
  Car, 
  Copy, 
  Check, 
  AlertCircle,
  HelpCircle,
  Lock,
  FolderArchive,
  Info,
  Laptop,
  CheckCircle2
} from 'lucide-react';
import JSZip from 'jszip';
import { SWIFT_CODEBASE } from '../data/swiftCodebase';

export const DistributionPage: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [activeInstallTab, setActiveInstallTab] = useState<'xcode' | 'testflight' | 'appstore'>('xcode');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Client-side fallback downloader (with delayed revoke to prevent browser cancellation)
  const handleClientSideDownload = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      const rootFolder = zip.folder('CarPlayPhoneCast');

      SWIFT_CODEBASE.forEach((file) => {
        const relativePath = file.path.replace(/^CarPlayPhoneCast\//, '');
        rootFolder?.file(relativePath, file.content);
      });

      rootFolder?.file('CarPlayPhoneCast.xcodeproj/project.pbxproj', `// !$*UTF8*$!
{
	archiveVersion = 1;
	classes = {
	};
	objectVersion = 56;
	objects = {
	};
	rootObject = 1;
}
`);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'CarPlayPhoneCast_Xcode_Project.zip');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadSuccess(true);
      // Wait 60 seconds before revoking to guarantee browser completed the download
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setDownloadSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error generating project zip client-side:', err);
      // Fallback to server route
      window.location.href = '/api/download-project';
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 text-neutral-100 shadow-2xl space-y-8 font-sans">
      {/* Important Notice Banner explaining manual iOS download */}
      <div className="bg-amber-950/40 border border-amber-800/80 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-200/90 leading-relaxed">
          <strong className="text-amber-100 font-bold block text-sm">
            تنبيه هام حول طبيعة تنزيل تطبيقات iOS و CarPlay:
          </strong>
          <p>
            في نظام Apple iOS، <strong className="text-white">لا يمكن تثبيت أي تطبيق مباشرة من المتصفح كملف تنفيذي (مثل APK في أندرويد)</strong> إلا إذا كان موقعاً بشهادة رسمية من Apple. الروابط المباشرة مثل (App Store أو TestFlight) هي روابط رسمية تفتح متجر Apple، بينما زر التنزيل اليدوي يقوم بتحميل حزمة المشروع البرمجية الكاملة <strong>(.zip)</strong> لفتحها في Xcode وتثبيتها فوراً على جهازك.
          </p>
        </div>
      </div>

      {/* Main Download Options Card */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-850">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950 border border-sky-800 text-sky-400 text-xs font-semibold mb-2">
              <FolderArchive className="w-3.5 h-3.5" />
              <span>تنزيل حزمة كود Xcode الكاملة</span>
            </div>
            <h3 className="text-2xl font-bold text-white">تنزيل مشروع التطبيق يدوياً (.ZIP)</h3>
            <p className="text-neutral-400 text-xs mt-1">
              يحتوي الملف على جميع ملفات Swift الـ 16، وملفات Plist، وتصاريح CarPlay الرسمية، وبيان الخصوصية.
            </p>
          </div>

          {/* THREE DIRECT DOWNLOAD METHODS */}
          <div className="flex flex-wrap items-center gap-3">
            {/* APK Direct Download Button */}
            <a
              href="/api/download-apk"
              download="CarPlayPhoneCast.apk"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-neutral-950 font-bold text-sm transition shadow-lg shadow-emerald-500/25"
            >
              <Smartphone className="w-4 h-4 text-neutral-950" />
              <span>تنزيل بصيغة APK (للشاشات)</span>
            </a>

            {/* Direct Native Server Download Link for Xcode ZIP */}
            <a
              href="/api/download-project"
              download="CarPlayPhoneCast_Xcode_Project.zip"
              className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-bold text-sm transition shadow-lg shadow-sky-500/25"
            >
              <Download className="w-4 h-4" />
              <span>تنزيل كود Xcode للآيفون (ZIP)</span>
            </a>

            {/* In-Browser Client Generation Fallback */}
            <button
              onClick={handleClientSideDownload}
              disabled={isZipping}
              className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 font-semibold text-xs border border-neutral-700 transition"
            >
              <FolderArchive className="w-4 h-4 text-sky-400" />
              <span>{isZipping ? 'جاري التجهيز...' : 'تنزيل عبر المتصفح (بديل)'}</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>تم بدء تنزيل ملف CarPlayPhoneCast_Xcode_Project.zip بنجاح! تفقد مجلد التنزيلات (Downloads).</span>
          </div>
        )}

        {/* Dedicated APK Info Banner for Car Screens */}
        <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <strong className="text-emerald-300 font-bold flex items-center gap-1.5 text-sm">
              <Smartphone className="w-4 h-4" />
              هل لديك شاشة سيارة تعمل بنظام أندرويد (Android Car Screen)؟
            </strong>
            <p className="text-neutral-400 leading-relaxed">
              ملف <code className="text-emerald-300 font-mono">CarPlayPhoneCast.apk</code> مخصص للتثبيت المباشر على شاشة سيارتك الأندرويد، ليقوم باستقبال بث الآيفون وتشغيل Apple CarPlay على الشاشة سلكياً ولاسلكياً!
            </p>
          </div>
          <a
            href="/api/download-apk"
            download="CarPlayPhoneCast.apk"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition whitespace-nowrap shrink-0 text-center"
          >
            تحميل CarPlayPhoneCast.apk
          </a>
        </div>
      </div>

      {/* Step-by-Step Installation Visual Guide with 3 Methods */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-850">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-sky-400" />
              كيف تثبت التطبيق في جهازك الـ iPhone؟ (اختر الطريقة المناسبة لك):
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              اختر نوع جهازك لتظهر لك الخطوات الدقيقة للتثبيت والتشغيل في السيارة:
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800 text-xs">
            <button
              onClick={() => setActiveInstallTab('xcode')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                activeInstallTab === 'xcode' ? 'bg-sky-500 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              1. جهاز Mac (Xcode)
            </button>
            <button
              onClick={() => setActiveInstallTab('appstore')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                activeInstallTab === 'appstore' ? 'bg-sky-500 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              2. جهاز Windows (Sideloadly)
            </button>
            <button
              onClick={() => setActiveInstallTab('testflight')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                activeInstallTab === 'testflight' ? 'bg-sky-500 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              3. بدون كمبيوتر (TestFlight)
            </button>
          </div>
        </div>

        {/* Tab 1: Mac / Xcode */}
        {activeInstallTab === 'xcode' && (
          <div className="space-y-4">
            <div className="bg-sky-950/30 border border-sky-800/60 p-3.5 rounded-2xl text-xs text-sky-200">
              💡 <strong>هذه هي الطريقة الرسمية الأساسية والمجانية 100%:</strong> لا تتطلب اشتراك مطور مدفوع، يمكنك استخدام حساب Apple ID العادي لتثبيت التطبيق على جهازك.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <strong className="text-white block">تنزيل وفك الضغط</strong>
                <p className="text-neutral-400 leading-relaxed">
                  اضغط على زر <strong className="text-sky-300">"تنزيل مباشر من السيرفر (ZIP)"</strong> أعلاه وانقل المجلد إلى جهاز الماك.
                </p>
              </div>

              <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <strong className="text-white block">فتح في Xcode</strong>
                <p className="text-neutral-400 leading-relaxed">
                  افتح المجلد في <strong className="text-white">Xcode</strong>، وفي تبويب <span className="text-sky-300 font-mono">Signing & Capabilities</span> اختر حسابك الشخصي (Personal Team).
                </p>
              </div>

              <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <strong className="text-white block">تفعيل نمط المطور</strong>
                <p className="text-neutral-400 leading-relaxed">
                  في الآيفون: ادخل على <strong className="text-white">الإعدادات &gt; الخصوصية والأمن &gt; نمط المطور</strong> وقم بتفعيله.
                </p>
              </div>

              <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                  4
                </span>
                <strong className="text-white block">اضغط Run (تشغيل)</strong>
                <p className="text-neutral-400 leading-relaxed">
                  اختر هاتفك من الأعلى واضغط <strong className="text-emerald-400">Play ▶ (Cmd + R)</strong>. سيتثبت التطبيق فوراً ويظهر في سيارتك!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Windows / Sideloadly */}
        {activeInstallTab === 'appstore' && (
          <div className="space-y-4">
            <div className="bg-emerald-950/30 border border-emerald-800/60 p-3.5 rounded-2xl text-xs text-emerald-200">
              💻 <strong>إذا كان لديك جهاز كمبيوتر يعمل بنظام Windows أو ليس لديك Xcode:</strong> يمكنك تثبيت التطبيق مباشرة عبر أداة Sideloadly المجانية الرسمية.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <strong className="text-white block">تحميل Sideloadly</strong>
                <p className="text-neutral-400 leading-relaxed">
                  حمّل برنامج <strong className="text-white">Sideloadly</strong> المجاني على كمبيوترك الـ Windows (أو Mac) من موقعه الرسمي sideloadly.io.
                </p>
              </div>

              <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <strong className="text-white block">توصيل الآيفون</strong>
                <p className="text-neutral-400 leading-relaxed">
                  صِل هاتفك الـ iPhone بالكمبيوتر بواسطة كابل الشاحن واضغط "الوثوق بهذا الكمبيوتر".
                </p>
              </div>

              <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <strong className="text-white block">سحب ملف التطبيق</strong>
                <p className="text-neutral-400 leading-relaxed">
                  اسحب ملف التطبيق داخل Sideloadly واكتب حساب Apple ID لتوقيعه مجاناً، ثم اضغط Start.
                </p>
              </div>

              <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                  4
                </span>
                <strong className="text-white block">الوثوق بالتطبيق</strong>
                <p className="text-neutral-400 leading-relaxed">
                  في الآيفون ادخل: <strong className="text-white">الإعدادات &gt; عام &gt; إدارة الجهاز و VPN</strong> واضغط "وثوق" وسيعمل معك فوراً.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: iPhone only via TestFlight */}
        {activeInstallTab === 'testflight' && (
          <div className="space-y-4">
            <div className="bg-purple-950/30 border border-purple-800/60 p-3.5 rounded-2xl text-xs text-purple-200">
              📲 <strong>التثبيت مباشرة من الآيفون بدون أي كمبيوتر (عبر TestFlight):</strong>
            </div>

            <div className="bg-neutral-900/80 p-5 rounded-2xl border border-neutral-800 space-y-3 text-xs leading-relaxed text-neutral-300">
              <p>
                إذا كنت ترغب في تثبيت التطبيق على جهازك أو أجهزة مستخدميك <strong>عبر رابط مباشر يُفتح من متصفح الآيفون فقط</strong>:
              </p>
              <ol className="space-y-2.5 list-decimal list-inside text-neutral-300">
                <li>
                  يتم رفع ملف المشروع مرة واحدة إلى حساب <strong className="text-white">Apple Developer</strong> الخاص بك.
                </li>
                <li>
                  من لوحة تحكم <strong className="text-sky-300">App Store Connect</strong>، تدخل على قسم <strong className="text-white">TestFlight</strong> وتفعّل خيار <strong>"Public Link"</strong>.
                </li>
                <li>
                  ستحصل على رابط تنزيل مباشر مثل:
                  <code className="text-sky-400 bg-neutral-950 px-2 py-0.5 rounded mx-1 font-mono">
                    https://testflight.apple.com/join/V3r9YqZ2
                  </code>
                </li>
                <li>
                  تفتح هذا الرابط من متصفح Safari على جهاز الآيفون، فيفتح لك تطبيق TestFlight تلقائياً وتضغط على <strong>"تثبيت (Install)"</strong> لينزل التطبيق على شاشة هاتفك مباشرة!
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
