import React, { useState } from 'react';
import { 
  Download, 
  Apple, 
  ExternalLink, 
  QrCode, 
  ShieldCheck, 
  Smartphone, 
  Car, 
  CheckCircle2, 
  Copy, 
  Check, 
  AlertCircle,
  HelpCircle,
  Lock,
  Share2
} from 'lucide-react';

export const DistributionPage: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeInstallTab, setActiveInstallTab] = useState<'appstore' | 'testflight' | 'enterprise'>('appstore');

  const appStoreUrl = 'https://apps.apple.com/app/carplay-phonecast/id6502938120';
  const testFlightUrl = 'https://testflight.apple.com/join/V3r9YqZ2';
  const customShareUrl = 'https://example.com/app';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 text-neutral-100 shadow-2xl space-y-8 font-sans">
      {/* Top Banner & URL Bar (Simulating https://example.com/app) */}
      <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-neutral-400">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 rounded-lg font-mono text-neutral-300 border border-neutral-800">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>https://example.com/app</span>
          </div>
          <span className="hidden sm:inline text-neutral-500">• Official Distribution Portal</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(customShareUrl)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-850 hover:bg-neutral-800 text-neutral-300 text-xs transition border border-neutral-750"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Direct Link'}</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-4">
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800 text-sky-400 text-xs font-semibold">
            <Car className="w-3.5 h-3.5" />
            <span>Official Apple CarPlay Partner Application</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            PhoneCast for iPhone & Apple CarPlay
          </h2>

          <p className="text-neutral-400 text-sm leading-relaxed">
            استمتع بعرض محتوى الآيفون (الفيديوهات، الصور، والوسائط) مباشرة على شاشة سيارتك عبر Apple CarPlay بتجربة سلسة وآمنة تماماً ومتوافقة 100% مع معايير شركة Apple وقيود السلامة المرورية.
          </p>

          {/* Official Download Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            {/* App Store Official Download Button */}
            <a
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white text-neutral-950 font-bold hover:bg-neutral-200 transition shadow-lg shadow-white/10 group"
            >
              <Apple className="w-7 h-7 fill-current group-hover:scale-105 transition" />
              <div className="text-left">
                <span className="block text-[10px] font-normal tracking-wide text-neutral-600 uppercase">Download on the</span>
                <span className="block text-base tracking-tight leading-none">App Store</span>
              </div>
            </a>

            {/* TestFlight Public Beta Button */}
            <a
              href={testFlightUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-neutral-800 border border-neutral-700 text-white font-semibold hover:bg-neutral-750 transition text-sm"
            >
              <ExternalLink className="w-5 h-5 text-sky-400" />
              <div className="text-left">
                <span className="block text-[10px] font-normal text-neutral-400">Public Beta</span>
                <span className="block text-xs leading-none">TestFlight Invite</span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>توزيع رسمي معتمد عبر App Store و TestFlight بدون أي كسر حماية أو شهادات مؤسسية ملتوية.</span>
          </div>
        </div>

        {/* QR Code Card for Instant iPhone Scanning */}
        <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-3xl flex flex-col items-center text-center shadow-xl max-w-xs w-full">
          <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-inner flex items-center justify-center relative group">
            {/* SVG QR Code Illustration */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
              <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
              <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
              <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
              <rect x="40" y="10" width="8" height="8" />
              <rect x="52" y="15" width="8" height="8" />
              <rect x="40" y="25" width="8" height="8" />
              <rect x="15" y="45" width="8" height="8" />
              <rect x="25" y="55" width="8" height="8" />
              <rect x="45" y="45" width="10" height="10" />
              <rect x="65" y="45" width="8" height="8" />
              <rect x="55" y="60" width="8" height="8" />
              <rect x="75" y="65" width="8" height="8" />
              <rect x="40" y="75" width="8" height="8" />
              <rect x="60" y="80" width="15" height="15" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white border-2 border-white shadow">
                <Apple className="w-5 h-5 fill-current" />
              </div>
            </div>
          </div>

          <span className="text-xs font-semibold text-neutral-300 mt-4">امسح الكود بكاميرا الآيفون</span>
          <span className="text-[11px] text-neutral-500 mt-1">يفتح صفحة التثبيت مباشرة على جهازك</span>
        </div>
      </div>

      {/* 3-Step Installation Flow Guide */}
      <div className="pt-6 border-t border-neutral-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-sky-400" />
          خطوات التثبيت والتشغيل في السيارة (Setup & Installation Guide)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="text-sm font-semibold text-white">تنزيل التطبيق</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              اضغط على زر App Store أو امسح كود QR بكاميرا الآيفون لتثبيت التطبيق.
            </p>
          </div>

          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="text-sm font-semibold text-white">منح الصلاحيات</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              افتح التطبيق وامنح الصلاحيات المطلوبة (الصور ومكتبة الوسائط، وتسجيل الشاشة عند الطلب).
            </p>
          </div>

          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="text-sm font-semibold text-white">توصيل الآيفون بالسيارة</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              قم بتوصيل الهاتف عبر كابل USB-C أو لاسلكياً عبر Wireless CarPlay لتشغيل النظام.
            </p>
          </div>

          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm">
              4
            </div>
            <h4 className="text-sm font-semibold text-white">ظهور أيقونة التطبيق</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              تظهر أيقونة PhoneCast تلقائياً على شاشة CarPlay مع واجهة APP Connected to Car.
            </p>
          </div>
        </div>
      </div>

      {/* Official Distribution Policy Note */}
      <div className="bg-neutral-950/60 border border-neutral-800 p-4 rounded-2xl flex items-start gap-3 text-xs text-neutral-400">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-neutral-200 block">سياسة التوزيع الرسمية المعتمدة من Apple:</span>
          <p className="leading-relaxed">
            التطبيق مصمم للتوزيع القانوني عبر متجر التطبيقات الرسمي (App Store) أو برنامج النسخ التجريبية (TestFlight) أو التوزيع المخصص للشركات عبر (Apple Business Manager / Custom Apps). لا يتم استخدام شهادات المؤسسات غير المصرح بها (Enterprise Sideloading) منعاً لتعطيل التطبيق من قِبل Apple وحفاظاً على أمان بيانات المستخدم.
          </p>
        </div>
      </div>
    </div>
  );
};
