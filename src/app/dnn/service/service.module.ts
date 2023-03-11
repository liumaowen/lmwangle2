import { ResolveService } from './resolve.service';
import { NavapiService } from './../../layout/sidebar/navapi.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageService } from './storage.service';
import { UserapiService } from './userapi.service';
import { OrgApiService } from './orgapi.service';
import { ClassifyApiService } from './classifyapi.service';
import {MoneyService} from "./money.service";
import { AddressparseService } from './address_parse';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
        StorageService,
        UserapiService,
        NavapiService,
        ResolveService,
        ClassifyApiService,
        OrgApiService,
        MoneyService,
        AddressparseService
  ],
  declarations: []
})
export class ServiceModule { }
