### Interactive Mobile Dashboard using D3 and Cordova ###

To run in your browser:

1. Open www/index.html in your browser


To run as a Cordova app:

1. Open Terminal and type:

    ```
    cordova create olympic-dashboard-d3
    cd olympic-dashboard-d3
    cordova platforms add ios
    cordova plugin add org.apache.cordova.device
    cordova plugin add org.apache.cordova.console
    cordova plugin add org.apache.cordova.statusbar
    ```

2. Delete the www folder that was created and replace it with the www folder from this repo

3. In terminal type:

    ```
    cordova build ios
    ```

4. Open the .xcodeproj file in the platforms/ios folder and run the app in the emulator or on your iOS device. To run the app on your iOS device, you need an Apple developer certificate and an app provisioning profile.

