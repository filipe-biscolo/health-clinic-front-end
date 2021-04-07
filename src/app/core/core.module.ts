import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';

import { LoadingComponent } from './loading/loading.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarMenuComponent } from './layout/sidebar-menu/sidebar-menu.component';
import { ToolbarModule } from 'primeng/toolbar';
import {MenubarModule} from 'primeng/menubar';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuModule } from 'primeng/menu';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    LoginComponent,
    LoadingComponent,
    HeaderComponent,
    SidebarMenuComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToolbarModule,
    MenubarModule,
    MenuModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    SidebarMenuComponent
  ]
})
export class CoreModule { }
