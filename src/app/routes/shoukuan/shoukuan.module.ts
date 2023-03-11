import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShoukuanService } from './shoukuan.service';
import { WiskSharedsModule } from '../../dnn/shared/wiskshared.module';
import { SharedModule } from '../../shared/shared.module';
import { DataTableModule } from 'angular2-datatable/index';
import { AgGridModule } from 'ag-grid-angular/main';
import { DropdownModule } from 'primeng/primeng';
import { ShoukuanstatusPipe } from '../../dnn/shared/pipe/shoukuanstatus.pipe';
import { AgentuserPipe } from '../../dnn/shared/pipe/agentuser.pipe';
import { CalendarModule, RadioButtonModule, AutoCompleteModule } from 'primeng/primeng';
import { ShoukuanreportComponent } from './shoukuanreport/shoukuanreport.component';
import { XiaoshouwanglaireportComponent } from './xiaoshouwanglaireport/xiaoshouwanglaireport.component';
import { XiaoshouwanglaiyuereportComponent } from './xiaoshouwanglaiyuereport/xiaoshouwanglaiyuereport.component';
import { InnertransferreportComponent } from './innertransferreport/innertransferreport.component';
import { InnertransferdetailComponent } from './innertransferdetail/innertransferdetail.component';
import { ShoukuanhuizongComponent } from './shoukuanhuizong/shoukuanhuizong.component';
import { ZhiyajinComponent } from './zhiyajin/zhiyajin.component';
import { ZhiyajindetailComponent } from './zhiyajindetail/zhiyajindetail.component';
import { SelectModule } from 'ng2-select';
import {ReceiptreportComponent} from './receiptreport/receiptreport.component';
import {ShoukuandetComponent} from './receiptreport/shoukuandet/shoukuandet.component';
import {ReceiptService} from './receiptreport/service/receipt.service';

const routes: Routes = [
  { path: 'zhiyajin', component: ZhiyajinComponent, data: { 'title': '质押金收款' } },
  { path: 'zhiyajin/:id', component: ZhiyajindetailComponent, data: { 'title': '质押金收款明细' } },
  { path: 'shoukuanreport', component: ShoukuanreportComponent, data: { 'title': '收款明细表' } },
  { path: 'xiaoshouwanglaireport', component: XiaoshouwanglaireportComponent, data: { 'title': '销售往来明细表' } },
  { path: 'xiaoshouwanglaireport/:id', component: XiaoshouwanglaireportComponent, data: { 'title': '销售往来明细表' } },
  { path: 'xiaoshouwanglaiyue', component: XiaoshouwanglaiyuereportComponent, data: { 'title': '销售往来余额表' } },
  { path: 'innertransfer', component: InnertransferreportComponent, data: { 'title': '内部转账明细表' } },
  { path: 'innertransfer/:id', component: InnertransferdetailComponent, data: { 'title': '内部转账详情' } },
  { path: 'shoukuanhuizong', component: ShoukuanhuizongComponent, data: { 'title': '资金总体情况表' } },
  { path: 'receiptreport', component: ReceiptreportComponent, data: { 'title': '收据明细表' } },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SelectModule,
    RouterModule.forChild(routes),
    DataTableModule,
    CalendarModule,
    AgGridModule.withComponents([]),
    WiskSharedsModule,
    DropdownModule,
    RadioButtonModule,
    AutoCompleteModule
  ],
  declarations: [ShoukuanreportComponent,
    XiaoshouwanglaireportComponent,
    XiaoshouwanglaiyuereportComponent,
    InnertransferreportComponent,
    InnertransferdetailComponent,
    ShoukuanhuizongComponent,
    ZhiyajinComponent,
    ZhiyajindetailComponent,
    ReceiptreportComponent,
    ShoukuandetComponent
  ],
  exports: [
    RouterModule
  ],
  providers: [
    ShoukuanstatusPipe,
    AgentuserPipe,
    ShoukuanService,
    ReceiptService
  ],
  entryComponents: [
    ShoukuandetComponent
  ]
})
export class ShoukuanModule { }
