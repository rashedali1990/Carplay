# Technical Feasibility Report: Apple CarPlay & iPhone Screen Mirroring

## 1. هل يمكن لتطبيق iOS عادي عمل Full Screen Mirroring إلى شاشة CarPlay؟
**الإجابة القطعية: لا.**
لا تسمح Apple لأي تطبيق طرف ثالث (3rd Party App) على متجر App Store بعمل Full Screen Mirroring لشاشة نظام iPhone (بما في ذلك الشاشة الرئيسية، شاشة القفل، أو بث تطبيقات أخرى مثل YouTube و Netflix و Safari) على شاشة CarPlay.
AirPlay Screen Mirroring معطل برمجياً عمداً فوق اتصال CarPlay لحماية السائق ومنع الحوادث.

## 2. ما الذي يسمح به Apple CarPlay حالياً؟
تسمح Apple بعرض واجهات مبنية حصراً باستخدام قوالب **CarPlay Framework Templates**:
- **CPGridTemplate**: لعرض أزرار وشبكات تنقل كبيرة وآمنة أثناء القيادة.
- **CPListTemplate**: لعرض القوائم وعناصر الوسائط المتزامنة.
- **CPNowPlayingTemplate**: لواجهة مشغل الصوت والبودكاست.
- **CPActionSheetTemplate & CPAlertTemplate**: للإشعارات والتحذيرات السريعة.
- **CPWindow**: متاح فقط لتطبيقات الملاحة (Navigation Apps) المصرح لها برسم الخريطة، مع قيود صارمة على معدل التحديث.

## 3. ما هي تصنيفات تطبيقات CarPlay المسموحة (CarPlay App Categories)؟
تحدد Apple الفئات المسموحة بدقة:
1. Audio / Music / Podcast Apps (`com.apple.developer.carplay-audio`)
2. Navigation / Maps Apps (`com.apple.developer.carplay-maps`)
3. Communication / Messaging / Calling Apps (`com.apple.developer.carplay-messaging`, `com.apple.developer.carplay-calling`)
4. EV Charging Apps (`com.apple.developer.carplay-charging`)
5. Parking Apps (`com.apple.developer.carplay-parking`)
6. Quick Food Ordering Apps (`com.apple.developer.carplay-quick-ordering`)
7. Driving Task Apps

## 4. ما هي Entitlements المطلوبة؟
يتطلب أي تطبيق CarPlay الحصول على تصريح خاص من Apple (Entitlement) يتم طلبه عبر حساب المطور في:
`https://developer.apple.com/carplay/`
وفي هذا المشروع، تم إعداد الملف:
`com.apple.developer.carplay-audio`

## 5. هل ReplayKit يمكن استخدامه لهذا السيناريو؟
**نعم، ولكن ضمن قيود:**
- `RPScreenRecorder` يعمل بالتقاط محتوى التطبيق نفسه (In-App Capture) بموافقة المستخدم الصريحة.
- لا يمكن لـ ReplayKit العمل في الخلفية لتصوير شاشات التطبيقات الأخرى أو النظام دون استخدام Broadcast Extension لنقل البث إلى خادم خارجي.

## 6. هل يمكن عرض فيديو على CarPlay؟ وما هي القيود أثناء القيادة؟
- **أثناء القيادة (In Motion):** ممنوع منعاً باتاً من قِبل قوانين السلامة الفيدرالية الأمريكية (NHTSA) وإرشادات Apple (App Store Review Guideline 2.5.1). يُقفل الفيديو فوراً وتتحول التجربة إلى الصوت فقط.
- **أثناء التوقف (Vehicle in Park):** تسمح بعض الأنظمة والشركات المصنعة بعرض الوسائط والصور عندما تكون السيارة متوقفة في وضع Park (`isVehicleParked == true`).

## 7. ما الذي يحتاج إلى موافقة Apple (Apple Approval)؟
1. تفعيل الـ CarPlay Entitlement على App ID في موقع المطورين.
2. مراجعة متجر التطبيقات App Store Review للتأكد من عدم وجود تشتيت للسائق (Driver Distraction).
3. تضمين بيان الخصوصية (Privacy Manifest).

## 8. ما هو البديل الرسمي المعتمد في هذا المشروع؟
تصميم **Hybrid Compliant Architecture**:
1. واجهة CarPlay رسمية بالقالب الشبكي: `[ Videos ] [ Photos ] [ Media ] [ Favorites ] [ Settings ]`.
2. خط معالجة فيديو `VideoPipeline` مبني بـ `CVPixelBuffer` و `Metal` لنقل وسائط الهاتف إلى شاشة السيارة بأعلى جودة ممكنة (1080p @ 60 FPS).
3. عزل المعمارية تحت `ScreenMirroringManager` بحيث يرجع حالة آمنة (`.unsupported`) بدون Crash في حال عدم توفر البث العام، مع جاهزية الربط في المستقبل.
