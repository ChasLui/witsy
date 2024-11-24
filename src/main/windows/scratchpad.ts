
import { anyDict } from '../../types/index';
import { app } from 'electron';
import { createWindow, titleBarOptions, getCenteredCoordinates } from './index';
import { putCachedText } from '../../main/utils';

export const openScratchPad = async (text?: string|null) => {

  // get bounds
  const width = 800;
  const height = 600;
  const { x, y } = getCenteredCoordinates(width, height);

  // query params
  const queryParams: anyDict = {};
  if (text) {
    const textId = putCachedText(text);
    queryParams['textId'] = textId;
  }

  // open a new one
  const scratchpadWindow = createWindow({
    hash: '/scratchpad',
    x, y, width, height,
    // --dialog-header-bg-color
    ...titleBarOptions({
      lightThemeColor: '#f3f3f3',
      darkBlackThemeColor: 'rgb(56, 56, 56)',
      darkBlueThemeColor: 'rgb(18, 32, 47)',
    }),
    queryParams,
  });

  // open the DevTools
  if (process.env.DEBUG) {
    scratchpadWindow.webContents.openDevTools({ mode: 'right' });
  }

  // show in dock
  if (process.platform === 'darwin') {
    app.dock.show();
  }
  
}
