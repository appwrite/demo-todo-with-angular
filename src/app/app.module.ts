import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoComponent } from './components/todo/todo.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { LandingComponent } from './components/landing/landing.component';
import { AlertComponent } from './components/alert/alert.component';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AppState } from './store';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { environment } from 'src/environments/environment';
import {
  AppWriteConfig,
  AppwriteService,
  AppWriteConfigToken,
} from './service/appwrite.service';

export const Server = {
  endpoint: environment.APP_ENDPOINT,
  project: environment.APP_PROJECT,
  collectionID: environment.APP_COLLECTION_ID,
};

const appwriteConfig: AppWriteConfig = {
  endpoint: environment.APP_ENDPOINT,
  projectId: environment.APP_PROJECT,
  collectionID: environment.APP_COLLECTION_ID,
};

function appWriteConfig(service: AppwriteService) {
  return () => service.init();
}

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent,
    TodoItemComponent,
    LoginComponent,
    SignupComponent,
    LandingComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxsModule.forRoot(AppState, {
      developmentMode: !environment.production,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
  ],
  providers: [
    {
      provide: AppWriteConfigToken,
      useValue: appwriteConfig,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appWriteConfig,
      deps: [AppwriteService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
