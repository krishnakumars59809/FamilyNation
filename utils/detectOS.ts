/**
 * Utility function to detect the operating system of the device
 * @returns The name of the operating system
 */
export const detectOS = (): string => {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;

  // Check for iOS
  if (
    /iPad|iPhone|iPod/.test(userAgent) ||
    (platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  ) {
    return 'iOS';
  }

  // Check for Android
  if (/Android/.test(userAgent)) {
    return 'Android';
  }

  // Check for Windows
  if (/Win/.test(platform)) {
    return 'Windows';
  }

  // Check for macOS
  if (/Mac/.test(platform)) {
    return 'macOS';
  }

  // Check for Linux
  if (/Linux/.test(platform)) {
    return 'Linux';
  }

  // Check for ChromeOS
  if (/CrOS/.test(userAgent)) {
    return 'ChromeOS';
  }

  // Default case if OS cannot be determined
  return 'Unknown OS';
};
