const { app, BrowserWindow } = require("electron"); // electron
const isDev = require("electron-is-dev"); // To check if electron is in development mode
const path = require("path");
const sqlite3 = require("sqlite3");

let mainWindow;

// Initializing the Electron Window
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 600, // width of window
    height: 600, // height of window
    webPreferences: {
      // The preload file where we will perform our app communication
      preload: isDev
        ? path.join(app.getAppPath(), "./public/preload.js") // Loading it from the public folder for dev
        : path.join(app.getAppPath(), "./build/preload.js"), // Loading it from the build folder for production
      worldSafeExecuteJavaScript: true, // If you're using Electron 12+, this should be enabled by default and does not need to be added here.
      contextIsolation: true, // Isolating context so our app is not exposed to random javascript executions making it safer.
    },
  });

  // Loading a webpage inside the electron window we just created
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000" // Loading localhost if dev mode
      : `file://${path.join(__dirname, "../build/index.html")}` // Loading build file if in production
  );

  // Setting Window Icon - Asset file needs to be in the public/images folder.
  mainWindow.setIcon(path.join(__dirname, "images/appicon.ico"));

  // In development mode, if the window has loaded, then load the dev tools.
  if (isDev) {
    mainWindow.webContents.on("did-frame-finish-load", () => {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    });
  }
};

// ((OPTIONAL)) Setting the location for the userdata folder created by an Electron app. It default to the AppData folder if you don't set it.
app.setPath(
  "userData",
  isDev
    ? path.join(app.getAppPath(), "userdata/") // In development it creates the userdata folder where package.json is
    : path.join(process.resourcesPath, "userdata/") // In production it creates userdata folder in the resources folder
);

// When the app is ready to load
app.whenReady().then(async () => {
  await createWindow(); // Create the mainWindow

  // If you want to add React Dev Tools
  if (isDev) {
    await session.defaultSession
      .loadExtension(
        path.join(__dirname, `../userdata/extensions/react-dev-tools`) // This folder should have the chrome extension for React Dev Tools. Get it online or from your Chrome extensions folder.
      )
      .then((name) => console.log("Dev Tools Loaded"))
      .catch((err) => console.log(err));
  }
});

// Exiting the app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Activating the app
app.on("activate", () => {
  if (mainWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Logging any exceptions
process.on("uncaughtException", (error) => {
  console.log(`Exception: ${error}`);
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Initializing a new database
const db = new sqlite3.Database(
  isDev
    ? path.join(__dirname, "../db/prefs.db") // my root folder if in dev mode
    : path.join(process.resourcesPath, "db/prefs.db"), // the resources path if in production build
  (err) => {
    if (err) {
      console.log(`Database Error: ${err}`);
    } else {
      console.log("Database Loaded");
    }
  }
);

// db.serialize(function () {
//   db.run("CREATE TABLE IF NOT EXISTS Developers (make, name, ratio, notes)");
// });
// ipcMain.handle("get-profile-details", (event, args) => {
//   // return "hello";
//   // db.get(
//   //   `SELECT Password password, ProfileInfo profileinfo FROM users WHERE Username = ?`,
//   //   [args.username],
//   //   (err, data) => (data.password === args.password ? data.profileinfo : null)
//   // );
// });
