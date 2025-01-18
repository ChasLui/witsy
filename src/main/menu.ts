
import { ShortcutsConfig } from 'types/config'
import { App, BrowserWindow, Menu, shell } from 'electron'
import { shortcutAccelerator } from './shortcuts'
import * as window from './window'

export type MenuCallbacks = { [key: string]: () => void }

const isMac = process.platform === 'darwin'
const isMas = process.mas

const template = (app: App, callbacks: MenuCallbacks, shortcuts: ShortcutsConfig) => {

  // get all windows
  const windowsMenu = []
  for (const win of BrowserWindow.getAllWindows()) {
    if (win != window.promptAnywhereWindow) {
      windowsMenu.push({
        label: win.getTitle(),
        click: () => {
          win.restore()
          win.focus()
        }
      })
    }
  }

  // sort by title
  windowsMenu.sort((a, b) => a.label.localeCompare(b.label))

  // add separator at the beginning
  if (windowsMenu.length > 0) {
    windowsMenu.unshift({ type: 'separator' })
  }

  // done
  return [
    // { role: 'appMenu' }
    ...(isMac ? [
      {
        label: app.name,
        submenu: [
          { role: 'about' },
          ...(!isMas ? [
            {
              label: 'Check for Updates…',
              click: async () => callbacks.checkForUpdates()
            },
            { type: 'separator' },
          ] : []),
          {
            label: 'Settings…',
            accelerator: 'CmdOrCtrl+,',
            click: async () => callbacks.settings()
          },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          {
            label: 'Quit Witsy',
            accelerator: 'CmdOrCtrl+Q',
            click: () => callbacks.quit()
          }
        ]
      }
    ] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'New Prompt',
          accelerator: shortcutAccelerator(shortcuts?.prompt),
          click: () => callbacks.newPrompt()
        },
        {
          label: 'New Chat',
          accelerator: shortcutAccelerator(shortcuts?.chat),
          click: () => callbacks.newChat()
        },
        {
          label: 'New Scratchpad',
          accelerator: shortcutAccelerator(shortcuts?.scratchpad),
          click: () => callbacks.newScratchpad()
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [
            { role: 'pasteAndMatchStyle' },
            {
              label: 'Delete Chat',
              accelerator: shortcutAccelerator({ key: 'Backspace', meta: isMac }),
              click: () => window.notifyBrowserWindows('delete-chat')
            },
            { role: 'selectAll' },
          ]
          : [
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' }
          ])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        ...process.env.DEBUG ? [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
        ] : [],
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [
            { type: 'separator' },
            { role: 'front' },
            ...windowsMenu,
          ]
          : [
            { role: 'close' }
          ])
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Go to Data Folder',
          click: async () => {
            await shell.openPath(app.getPath('userData'))
          }
        },
        {
          label: 'Go to Log Folder',
          click: async () => {
            await shell.openPath(app.getPath('logs'))
          }
        },
        { type: 'separator' },
        {
          label: 'Learn More',
          click: async () => {
            await shell.openExternal('https://github.com/nbonamy/witsy')
          }
        }
      ]
    }
  ]
}

export const installMenu = (app: App, callbacks: MenuCallbacks, shortcuts: ShortcutsConfig) => {
  const menu = Menu.buildFromTemplate(template(app, callbacks, shortcuts) as Array<any>)
  Menu.setApplicationMenu(menu)
}
