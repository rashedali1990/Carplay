# CarPlay PhoneCast (Kotlin Android Automotive & Car Screen Suite)

[![Language: Kotlin](https://img.shields.io/badge/Language-Kotlin%201.9+-7F52FF?logo=kotlin&logoColor=white)](https://kotlinlang.org)
[![Platform: Android Automotive](https://img.shields.io/badge/Platform-Android%20Automotive-3DDC84?logo=android&logoColor=white)](https://developer.android.com/training/cars)
[![Build: Gradle KTS](https://img.shields.io/badge/Build-Gradle%20KTS-02303A?logo=gradle&logoColor=white)](https://gradle.org)
[![Release: APK Ready](https://img.shields.io/badge/Release-APK%20v1.0.0-10B981)](#-تحميل-حزم-الإصدار-المباشرة)

مشروع أندرويد وشاشات سيارات متكامل مبني بالكامل بلغة **Kotlin** مع بنية Gradle Kotlin DSL (`build.gradle.kts`) لتشغيل واستقبال بث هواتف الآيفون و Apple CarPlay عبر منافذ USB والشبكة اللاسلكية، مزود بمحاكي تفاعلي حي وحزم APK جاهزة للتثبيت الفوري.

---

## 🏗️ هيكلية المشروع بلغة Kotlin (Project Architecture):

```text
├── build.gradle.kts          # إعدادات مشروع أندرويد الرئيسية (Kotlin DSL)
├── settings.gradle.kts       # ربط موديول التطبيق (include :app)
├── gradle.properties         # إعدادات JVM و AndroidX
├── app/                      # موديول تطبيق أندرويد (Kotlin Module)
│   ├── build.gradle.kts      # إعدادات وتوابع Kotlin Coroutines, AndroidX, ViewBinding
│   └── src/main/
│       ├── AndroidManifest.xml # محددات شاشات السيارات وصلاحيات USB Host
│       ├── java/com/carplay/phonecast/
│       │   ├── CarPlayApplication.kt      # فئة التطبيق ونطاق الكوروتين العام
│       │   ├── ui/
│       │   │   └── MainActivity.kt        # واجهة SurfaceView للسيارات بملء الشاشة
│       │   ├── service/
│       │   │   └── CarPlayReceiverService.kt # خدمة الاستقبال الخلفية (Foreground Service)
│       │   ├── video/
│       │   │   └── MediaCodecH264Decoder.kt  # مفكك ترميز الفيديو العتادي (Low Latency 60 FPS)
│       │   ├── audio/
│       │   │   └── AudioTrackStreamPlayer.kt # مشغل الصوت المباشر 48kHz Stereo PCM
│       │   ├── usb/
│       │   │   └── UsbCarConnectionManager.kt # بروتوكول USB Host لأجهزة Apple MFi
│       │   ├── wireless/
│       │   │   └── WirelessCarPlayDiscovery.kt # إعلان خدمة Bonjour / mDNS اللاسلكية
│       │   ├── protocol/
│       │   │   └── CarPlayPacketProtocol.kt   # تفكيك حزم الفيديو والصوت واللمس
│       │   ├── touch/
│       │   │   └── CarPlayTouchController.kt  # تطبيع لمسات شاشة السيارة
│       │   └── model/
│       │       └── CarPlaySessionState.kt     # فئات الحالات المغلقة (Kotlin Sealed Classes)
│       └── res/
│           ├── layout/activity_main.xml       # واجهة SurfaceView المسرعة عتادياً
│           └── xml/
│               ├── usb_device_filter.xml      # فلتر أجهزة Apple (VID 0x05AC)
│               └── automotive_app_desc.xml    # مواصفات Android Automotive
├── releases/                                  # الحزم الجاهزة للتثبيت
│   ├── CarPlayPhoneCast.apk                   # تطبيق أندرويد الجاهز للشاشات
│   └── CarPlayPhoneCast_Kotlin_Project.zip    # المشروع البرمجي الكامل
```

---

## 📥 تحميل حزم الإصدار المباشرة (Releases):
* 🟢 **تحميل تطبيق الـ APK لشاشات السيارات والأندرويد:** [`CarPlayPhoneCast.apk`](/CarPlayPhoneCast.apk)
* 🤖 **تحميل مشروع Kotlin البرمجي كاملاً (ZIP):** [`CarPlayPhoneCast_Kotlin_Project.zip`](/api/download-kotlin-project)
* 🍏 **تحميل مشروع Xcode للآيفون (ZIP):** [`CarPlayPhoneCast_Xcode_Project.zip`](/api/download-project)

---

## 🛠️ فتح وتشغيل المشروع في Android Studio:
1. افتح برنامج **Android Studio** (نسخة Hedgehog أو أحدث).
2. اختر **Open** وحدد المجلد الرئيسي للمشروع مباشرة.
3. سيقوم Android Studio بمزامنة الـ Gradle تلقائياً (`build.gradle.kts`).
4. اضغط على **Run** لتشغيل التطبيق على شاشة السيارة أو المحاكي.

---

## 📤 ضخ وتحديث المشروع على GitHub:
```bash
git add .
git commit -m "Update repository with 100% Kotlin Android Studio project and APK"
git branch -M main
git push -u origin main
```
