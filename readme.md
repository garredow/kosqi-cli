# kosqi-cli

## What is it?

KOSQI is a tool to manage your KaiOS device. With it, you can perform the following actions:

- Get app detail
- Install an app
- Uninstall an app
- Launch an app
- Close an app
- List installed apps on device

Right now, it only supports basic app management but more functionality is planned.

## Why did you make it?

I wanted a simple CLI tool I could use during app development to automate some processes.

## Prerequisites

- A KaiOS device in Debug mode
- ADB. If you can run `adb devices` and see your KaiOS device, you're good to go.

## Installation

KOSQI is not available via NPM, but you can easily install it locally.

```
git clone https://github.com/garredow/kosqi-cli.git
cd kosqi-cli
npm run build
npm link
```

The `kosqi` package is now available to use from the command line!

## How do I use it?

At any time, you can run `kosqi --help` to view available commands.

### **Show Device Info**

```
kosqi device
```

### **Get App Info**

This returns metadata and the manifest for the provided app ID.

```
kosqi info <appId>
```

Example Request

```
kosqi info com.garredow.foxcasts
```

<details><summary>Example Response</summary>

```json
{
  "origin": "app://com.garredow.foxcasts",
  "installOrigin": "app://com.garredow.foxcasts",
  "manifestURL": "app://com.garredow.foxcasts/manifest.webapp",
  "appStatus": 2,
  "receipts": [],
  "kind": "packaged",
  "installTime": 1554065377926,
  "installState": "installed",
  "removable": true,
  "id": "com.garredow.foxcasts",
  "basePath": "/data/local/webapps",
  "localId": 1060,
  "sideloaded": true,
  "enabled": true,
  "blockedStatus": 0,
  "name": "FoxCasts",
  "csp": "",
  "role": "",
  "redirects": null,
  "widgetPages": [],
  "installerAppId": 0,
  "installerIsBrowser": false,
  "storeId": "",
  "storeVersion": 0,
  "downloading": false,
  "readyToApplyDownload": false,
  "additionalLanguages": {},
  "manifest": {
    "name": "FoxCasts",
    "description": "A fully-featured podcast app for your FirefoxOS device.",
    "version": "1.4.1",
    "launch_path": "/index.html",
    "icons": {
      "24": "/assets/icon-24.png",
      "32": "/assets/icon-32.png",
      "48": "/assets/icon-48.png",
      "64": "/assets/icon-64.png",
      "128": "/assets/icon-128.png",
      "256": "/assets/icon-256.png"
    },
    "developer": {
      "name": "Garrett Downs",
      "url": "http://www.foxcasts.com"
    },
    "installs_allowed_from": ["https://marketplace.firefox.com"],
    "type": "privileged",
    "permissions": {
      "audio-channel-content": {
        "description": "Required to play audio in the background."
      },
      "systemXHR": {
        "description": "Required to download podcasts and perform other vital functions."
      },
      "desktop-notification": {
        "description": "Required to display episode information and playback controls in the notification panel."
      },
      "device-storage:music": {
        "access": "readwrite",
        "description": "Required to read and write podcasts episodes."
      },
      "device-storage:videos": {
        "access": "readwrite",
        "description": "Required to read and write podcasts episodes."
      },
      "device-storage:sdcard": {
        "access": "readwrite",
        "description": "Required to read and write podcasts episodes to external storage."
      }
    },
    "default_locale": "en"
  }
}
```

</details>

### **Install App**

Install a packaged app to the device. Note: The ID you pass in should match the ID in the webapp manifest. This will be handled automatically in the future.

```
kosqi install --id <appId> --path <path_to_app_zip>
```

Example Request

```
kosqi install --id com.garredow.foxcasts --path /Users/garrett/dev/foxcasts/application.zip
```

### **Uninstall App**

Uninstall an app from the device.

```
kosqi uninstall <appId>
```

Example Request

```
kosqi uninstall com.garredow.foxcasts
```

### **Launch App**

```
kosqi launch <appId>
```

Example Request

```
kosqi launch com.garredow.foxcasts
```

### **Close App**

```
kosqi close <appId>
```

Example Request

```
kosqi close com.garredow.foxcasts
```

### **List Installed Apps**

Prints a simple list of apps installed on the device.

```
kosqi list
```

Example Response

```
com.garredow.foxcasts | FoxCasts | Garrett Downs
com.garredow.foxcasts3 | FoxCasts | Garrett Downs
```

## FAQ

**Why won't KOSQI connect to my device?**

You may have to set the forwarding in ADB. Try running `adb forward tcp:6000 localfilesystem:/data/local/debugger-socket`.
