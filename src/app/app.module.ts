import { HttpClient } from '@angular/common/http';
import { StorageService } from './dnn/service/storage.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { RoutesModule } from './routes/routes.module';

import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { HttpInterceptorService } from './dnn/service/http-interceptor.service';
import { ServiceModule } from './dnn/service/service.module';
import { FormsModule } from '@angular/forms';

// https://github.com/ocombe/ng2-translate/issues/218
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function interceptorFactory(
    xhrBackend: XHRBackend,
    requestOptions: RequestOptions,
    router: Router,
    storage: StorageService,
    toasterService: ToasterService) {
    const service = new HttpInterceptorService(xhrBackend, requestOptions, router, storage, toasterService);
    return service;
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        HttpModule,
        BrowserAnimationsModule, // required for ng2-tag-input
        CoreModule,
        LayoutModule,
        SharedModule.forRoot(),
        RoutesModule,
        ServiceModule,
        FormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        })
    ],
    providers: [
        {
            provide: Http,
            useFactory: interceptorFactory,
            deps: [XHRBackend, RequestOptions, Router, StorageService, ToasterService]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
