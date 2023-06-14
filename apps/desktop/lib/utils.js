function getPlatform() {
    // Printing os.platform() value
  const platform = os.platform();
   
  switch (platform) {
    case 'aix':
      return "IBM AIX";
    case 'android':
      return "Android";
    case 'darwin':
      return "MacOS";
    case 'freebsd':
      return "FreeBSD";
    case 'linux':
      return "Linux";
    case 'openbsd':
      return "OpenBSD";
    case 'sunos':
      return "SunOS";
    case 'win32':
      return "windows";
    default:
      return "Unknown";
  }
}

module.exports = {
  getPlatform
};
