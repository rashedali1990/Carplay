# App Store & CarPlay Submission Checklist

1. [x] Request CarPlay Entitlement from Apple via `developer.apple.com/carplay/`.
2. [x] Configure Provisioning Profile with `com.apple.developer.carplay-audio`.
3. [x] Add Privacy Manifest (`PrivacyInfo.xcprivacy`) to Target.
4. [x] Add Microphone & Photo Library usage strings in `Info.plist`.
5. [x] Test on CarPlay Simulator in Xcode (Features > I/O > External Displays > CarPlay).
6. [x] Verify Driver Safety Interlock: Video must freeze or hide when simulated vehicle speed > 0.
7. [x] Upload build to App Store Connect / TestFlight.
