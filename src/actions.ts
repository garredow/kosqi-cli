import { Device, useDevice } from './device';
import { logger } from './util';

export async function launchApp(appId: string) {
  await useDevice(async (device: Device) => {
    await verifyAppExists(device, appId);
    await device.launchApp(appId);
    logger.log(`Launched ${appId}`);
  });
}

export async function closeApp(appId: string) {
  await useDevice(async (device: Device) => {
    await verifyAppExists(device, appId);
    await device.closeApp(appId);
    logger.log(`Closed ${appId}`);
  });
}

export async function showAppInfo(appId: string) {
  await useDevice(async (device: Device) => {
    await verifyAppExists(device, appId);
    const app = await device.getApp(appId);
    logger.log(app);
  });
}

export async function installApp(appId: string, path: string) {
  await useDevice(async (device: Device) => {
    const app = await device.installPackagedApp(path, appId);
    logger.log(`Installed ${appId} from ${path}`);
  });
}

export async function uninstallApp(appId: string) {
  await useDevice(async (device: Device) => {
    const app = await device.uninstallApp(appId);
    logger.log(`Uninstalled ${appId}`);
  });
}

export async function listInstalledApps() {
  await useDevice(async (device: Device) => {
    const apps = await device.getInstalledApps();

    logger.log(`Found ${apps.length} installed app(s):`);
    apps.forEach((app) => logger.log(`${app.id} | ${app.name} | ${app.manifest.developer.name}`));
  });
}

export async function listRunningApps() {
  await useDevice(async (device: Device) => {
    const apps = await device.getRunningApps();
    logger.log(`Found ${apps.length} running app(s):`);
    apps.forEach((app) => logger.log(`${app.id} | ${app.name} | ${app.manifest.developer.name}`));
  });
}

export async function showDeviceInfo() {
  await useDevice(async (device: Device) => {
    const result = await device.getDeviceInfo();
    logger.log('Device Info:');
    logger.log(result);
  });
}

async function verifyAppExists(device: Device, appId: string) {
  const apps = await device.getInstalledApps();
  const app = apps.find((a) => a.id === appId);

  if (!app) {
    throw new Error(`No app found with id ${appId}`);
  }
}
