import { app, BrowserWindow, Tray, Menu, nativeImage } from "electron";
import path from "path"; // distinct import
import { fileURLToPath } from "url";

// 1. Manually define __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Define icon path safely
const iconPath = path.join(__dirname, "icon.ico");

let tray = null;
let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 420,
    height: 300,
    resizable: false,
    frame: false,
    title: "NetShield",
    icon: iconPath, // using the variable defined at top
    autoHideMenuBar: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
  });

  // 3. LOGIC: Check if Packaged or Dev
  const isDev = !app.isPackaged;

  if (isDev) {
    // Dev Mode: Load localhost
    console.log("Running in DEV mode: Loading localhost");
    win.loadURL("http://localhost:3000");
  } else {
    // Production Mode: Load file from 'out' folder
    // CHECK THIS PATH: If main.js is in the root, use "out/index.html"
    // If main.js is in a subfolder, use "../out/index.html"
    const indexPath = path.join(__dirname, "../out/index.html");

    console.log("Running in PROD mode: Loading file from", indexPath);
    win.loadFile(indexPath);
  }

  // REMOVED: win.loadURL(url) <-- This was the error!

  win.once("ready-to-show", () => {
    win.show();
  });
}

function createTray() {
  // Use the iconPath we defined at the top
  const trayIcon = nativeImage.createFromPath(iconPath);

  tray = new Tray(trayIcon);
  tray.setToolTip("NetShield – Wi-Fi Guardian");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show",
      click: () => {
        if (!win) return;
        win.show();
        win.focus();
      },
    },
    {
      label: "Hide",
      click: () => {
        if (!win) return;
        win.hide();
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    if (!win) return;
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
      win.focus();
    }
  });
}

app.whenReady().then(() => {
  console.log("[electron] app ready, creating window + tray");
  createWindow();
  createTray();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
