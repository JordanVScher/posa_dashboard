// Modules to control application life and create native browser window
const {
	app, BrowserWindow, Menu, dialog,
} = require('electron');

require('electron-reload')(__dirname);
const { shell } = require('electron');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({ width: 1280, height: 720 });

	// and load the index.html of the app.
	mainWindow.loadFile('src/index.html');

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

const menu = Menu.buildFromTemplate([

	{
		label: 'Menu',
		submenu: [
			{
				label: 'Adicionar Aluno',
				click() {
					mainWindow.loadFile('src/addStudent.html');
				},
			},
			{
				label: 'Adicionar Lembrete',
				click() {
					mainWindow.loadFile('src/addReminder.html');
				},
			},
			{
				type: 'separator',
			},
			{
				label: 'Sair',
				click() {
					app.quit();
				},
			},
		],
	},
	{
		label: 'Editar',
		submenu: [{
			label: 'Desfazer',
			accelerator: 'CmdOrCtrl+Z',
			role: 'undo',
		}, {
			label: 'Refazer',
			accelerator: 'Shift+CmdOrCtrl+Z',
			role: 'redo',
		}, {
			type: 'separator',
		}, {
			label: 'Cortar',
			accelerator: 'CmdOrCtrl+X',
			role: 'cut',
		}, {
			label: 'Copiar',
			accelerator: 'CmdOrCtrl+C',
			role: 'copy',
		}, {
			label: 'Colar',
			accelerator: 'CmdOrCtrl+V',
			role: 'paste',
		}, {
			label: 'Selecionar Tudo',
			accelerator: 'CmdOrCtrl+A',
			role: 'selectall',
		}],
	}, {
		label: 'Visualizar',
		submenu: [{
			label: 'Recarregar',
			accelerator: 'CmdOrCtrl+R',
			click: (item, focusedWindow) => {
				if (focusedWindow) {
					// on reload, start fresh and close any old
					// open secondary windows
					if (focusedWindow.id === 1) {
						BrowserWindow.getAllWindows().forEach((win) => {
							if (win.id > 1) win.close();
						});
					}
					focusedWindow.reload();
				}
			},
		}, {
			label: 'Tela Cheia',
			accelerator: (() => {
				if (process.platform === 'darwin') {
					return 'Ctrl+Command+F';
				}
				return 'F11';
			})(),
			click: (item, focusedWindow) => {
				if (focusedWindow) {
					focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
				}
			},
		}, {
			label: 'Toggle Developer Tools',
			accelerator: (() => {
				if (process.platform === 'darwin') {
					return 'Alt+Command+I';
				}
				return 'Ctrl+Shift+I';
			})(),
			click: (item, focusedWindow) => {
				if (focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			},
		}],
	}, {
		label: 'Janela',
		role: 'window',
		submenu: [{
			label: 'Minimize',
			accelerator: 'CmdOrCtrl+M',
			role: 'minimize',
		}, {
			label: 'Close',
			accelerator: 'CmdOrCtrl+W',
			role: 'close',
		}, {
			type: 'separator',
		}, {
			label: 'Reopen Window',
			accelerator: 'CmdOrCtrl+Shift+T',
			enabled: false,
			key: 'reopenMenuItem',
			click: () => {
				app.emit('activate');
			},
		}],
	},
	{
		label: 'Diálogos',
		submenu: [
			{
				label: 'Menu Inicial',
				click() {
					mainWindow.loadFile('src/mainMenu.html');
				},
			},
			{
				label: 'Portal',
				click() {
					mainWindow.loadFile('src/portalMenu.html');
				},
			},
			{
				label: 'Outro',
				click() {
					mainWindow.loadFile('src/miscMenu.html');
				},
			},

		],
	},
	{
		label: 'Ajuda',
		submenu: [
			{
				label: 'Github',
				click() {
					shell.openExternal('https://github.com/JordanVScher/posa_dashboard');
				},
			},
			{
				type: 'separator',
			},
			{
				label: 'Sobre',
				click() {
					shell.openExternal('https://github.com/JordanVScher/posa_dashboard');
				},
			},
		],
	},
]);

Menu.setApplicationMenu(menu);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a windows in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}

	mainWindow.on('unresponsive', () => {
		const options = {
			type: 'info',
			title: 'O processo está demorando demais para responer.',
			message: 'O processo está demorando demais para responer. O que deseja fazer?',
			buttons: ['Recarregar', 'Fechar'],
		};

		dialog.showMessageBox(options, (index) => {
			if (index === 0) mainWindow.reload();
			else mainWindow.close();
		});
	});

	mainWindow.webContents.on('crashed', () => {
		const options = {
			type: 'info',
			title: 'O processo não está respondendo.',
			message: 'O processo não está respondendo. O que deseja fazer?',
			buttons: ['Recarregar', 'Fechar'],
		};

		dialog.showMessageBox(options, (index) => {
			if (index === 0) mainWindow.reload();
			else mainWindow.close();
		});
	});

	mainWindow.on('close', () => { mainWindow = null; });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
