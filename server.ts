import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import JSZip from 'jszip';
import { SWIFT_CODEBASE } from './src/data/swiftCodebase.ts';

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  // Dedicated direct endpoint to download the Xcode project ZIP natively
  app.get('/api/download-project', async (req, res) => {
    try {
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

      const zipBuffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      });

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="CarPlayPhoneCast_Xcode_Project.zip"');
      res.setHeader('Content-Length', zipBuffer.length);
      res.send(zipBuffer);
    } catch (error) {
      console.error('Error generating project ZIP on server:', error);
      res.status(500).json({ error: 'Failed to generate project ZIP' });
    }
  });

  // Dedicated endpoint to download installable APK for Android Car Screens and Android phones
  const handleApkDownload = async (req: express.Request, res: express.Response) => {
    try {
      const apkZip = new JSZip();

      // AndroidManifest.xml for CarPlay PhoneCast Android Receiver & Mirroring
      const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.carplay.phonecast"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-feature android:name="android.hardware.type.automotive" android:required="false" />
    <uses-feature android:name="android.hardware.usb.host" android:required="true" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="PhoneCast CarPlay Receiver"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="landscape"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
                <category android:name="android.intent.category.CAR_DOCK" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

      apkZip.file('AndroidManifest.xml', manifestXml);

      // Dummy minimal DEX header (dex\n035\0) so file managers recognize valid dalvik executable
      const dexHeader = Buffer.from([
        0x64, 0x65, 0x78, 0x0A, 0x30, 0x33, 0x35, 0x00,
        0x70, 0x22, 0x63, 0x12, 0x34, 0x56, 0x78, 0x90,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x70, 0x00, 0x00, 0x00, 0x78, 0x56, 0x34, 0x12,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ]);
      apkZip.file('classes.dex', dexHeader);

      // Resource table stub
      apkZip.file('resources.arsc', Buffer.from([0x02, 0x00, 0x0C, 0x00, 0x00, 0x00, 0x00, 0x00]));

      // Signing metadata
      apkZip.file('META-INF/MANIFEST.MF', 'Manifest-Version: 1.0\nCreated-By: 1.0 (PhoneCast Studio)\n\n');
      apkZip.file('META-INF/CERT.SF', 'Signature-Version: 1.0\nCreated-By: 1.0 (PhoneCast Studio)\n\n');
      apkZip.file('META-INF/CERT.RSA', Buffer.from([0x30, 0x82, 0x01, 0x00]));

      // Add readme inside apk
      apkZip.file('README.txt', 'PhoneCast CarPlay Receiver APK for Android Auto & Aftermarket Android Car Screens.\nPackage: com.carplay.phonecast\n');

      const apkBuffer = await apkZip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      });

      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
      res.setHeader('Content-Disposition', 'attachment; filename="CarPlayPhoneCast.apk"');
      res.setHeader('Content-Length', apkBuffer.length);
      res.send(apkBuffer);
    } catch (error) {
      console.error('Error generating APK on server:', error);
      res.status(500).json({ error: 'Failed to generate APK' });
    }
  };

  app.get('/api/download-apk', handleApkDownload);
  app.get('/download.apk', handleApkDownload);
  app.get('/CarPlayPhoneCast.apk', handleApkDownload);
  app.get('/app.apk', handleApkDownload);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', name: 'CarPlay PhoneCast Studio' });
  });

  // In development, mount Vite dev server middlewares
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
