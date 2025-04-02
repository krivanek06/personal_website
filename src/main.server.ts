import { render } from '@analogjs/router/server';
import '@angular/platform-server/init';

import { enableProdMode } from '@angular/core';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

if (import.meta.env.PROD) {
  enableProdMode();
}

export default render(AppComponent, config);
