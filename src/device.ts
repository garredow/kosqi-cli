import FirefoxClient from 'firefox-client';
import { promisify } from 'util';
import { DeviceActor, AppsActor, App, DeviceInfo } from './models';
import { logger, getManifestUrl } from './util';

export class Device {
  private _client: FirefoxClient;
  private _deviceActor: DeviceActor | undefined;
  private _appsActor: AppsActor | undefined;

  constructor() {
    this._client = new FirefoxClient();
  }

  public connect(port = 6000) {
    return new Promise((resolve, reject) => {
      this._client.connect(port, 'localhost', async (err: any) => {
        if (err) {
          logger.error('Unable to connect to device');
          return reject(err);
        }

        this._deviceActor = await this.getDeviceActor();
        this._appsActor = await this.getWebappsActor();

        resolve();
      });
      this._client.on('error', (err: any) => {
        logger.error('Unable to connect to device');
        reject(err);
      });
      this._client.on('timeout', (err: any) => {
        logger.error('Unable to connect to device');
        reject(err);
      });
    });
  }

  public disconnect() {
    this._client.disconnect();
  }

  private getDeviceActor(): Promise<DeviceActor> {
    return new Promise((resolve) => {
      this._client.getDevice((err: any, result: DeviceActor) => {
        resolve(result);
      });
    });
  }

  private getWebappsActor(): Promise<AppsActor> {
    return new Promise((resolve, reject) => {
      this._client.getWebapps((err: any, result: AppsActor) => {
        resolve(result);
      });
    });
  }

  public async getApp(appId: string): Promise<App | undefined> {
    const apps = await this.getInstalledApps();
    const app = apps.find((a) => a.id === appId);

    if (!app) throw new Error(`Unable to find app for id ${appId}`);

    return app;
  }

  public async launchApp(appId: string): Promise<void> {
    const manifestUrl = getManifestUrl(appId);
    const launchApp = promisify(this._appsActor!.launch.bind(this._appsActor));

    await launchApp(manifestUrl).catch((err) => logger.error(err));
  }

  public async closeApp(appId: string): Promise<void> {
    const manifestUrl = getManifestUrl(appId);
    const closeApp = promisify(this._appsActor!.close.bind(this._appsActor));

    await closeApp(manifestUrl);
  }

  public async getInstalledApps(): Promise<App[]> {
    const getInstalledApps = promisify<App[]>(
      this._appsActor!.getInstalledApps.bind(this._appsActor)
    );

    const apps = await getInstalledApps();

    return apps;
  }

  public async getRunningApps(): Promise<App[]> {
    const getRunningApps = promisify<string[]>(
      this._appsActor!.listRunningApps.bind(this._appsActor)
    );

    const manifestUrls = await getRunningApps();
    const allApps = await this.getInstalledApps();
    const runningApps = allApps.filter((a) => manifestUrls.includes(a.manifestURL));

    return runningApps;
  }

  public async installPackagedApp(path: string, appId: string): Promise<App> {
    const installPackagedApp = promisify<string, string, string>(
      this._appsActor!.installPackaged.bind(this._appsActor)
    );

    const installedAppId = await installPackagedApp(path, appId);
    const installedApp = (await this.getApp(installedAppId)) as App;

    return installedApp;
  }

  public async uninstallApp(appId: string): Promise<App> {
    const manifestUrl = getManifestUrl(appId);
    const uninstallApp = promisify<string, App>(this._appsActor!.uninstall.bind(this._appsActor));

    const uninstalledApp = await uninstallApp(manifestUrl);

    return uninstalledApp;
  }

  public async getDeviceInfo(): Promise<DeviceInfo> {
    const getDeviceInfo = promisify<DeviceInfo>(
      this._deviceActor!.getDescription.bind(this._deviceActor)
    );

    const device = await getDeviceInfo();

    return device;
  }
}

export async function useDevice(fn: Function) {
  const device = new Device();
  await device.connect();
  await fn(device);
  await device.disconnect();
}
