import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/primeng';
import { TabViewModule, RadioButtonModule } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular/main';
import { DataTableModule } from 'angular2-datatable/index';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { SharedModule } from './../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KaipiaoComponent } from './kaipiao/kaipiao.component';
import { SalebillComponent } from './salebill/salebill.component';
import { SalebilldetailComponent } from './salebilldetail/salebilldetail.component';
import { SalebilldetreportComponent } from './salebilldetreport/salebilldetreport.component';
import { SalebillcountComponent } from './salebillcount/salebillcount.component';
import { ExpressComponent } from './express/express.component';
import { VerifylistComponent } from './verifylist/verifylist.component';
import { AdvanceinvoicedetailComponent } from './advanceinvoicedetail/advanceinvoicedetail.component';
import { AdvanceinvoiceComponent } from './advanceinvoice/advanceinvoice.component';
import { ImportorderComponent } from './importorder/importorder.component';

const routes: Routes = [
  { path: 'kaipiao', component: KaipiaoComponent, data: { 'title': '开票列表' } },
  { path: 'salebill', component: SalebillComponent, data: { 'title': '发票列表' } },
  { path: 'salebill/:id', component: SalebilldetailComponent, data: { 'title': '发票明细' } },
  { path: 'salebilldetreport', component: SalebilldetreportComponent, data: { 'title': '发票明细表' } },
  { path: 'salebillcount', component: SalebillcountComponent, data: { 'title': '销售发未开票明细表' } },
  { path: 'express', component: ExpressComponent, data: { 'title': '快递信息' } },
  { path: 'verifylist', component: VerifylistComponent, data: { 'title': '审核列表' } },
  { path: 'advanceinvoice', component: AdvanceinvoiceComponent, data: { 'title': '销售提前开票明细表' } },
  { path: 'advanceinvoice/:id', component: AdvanceinvoicedetailComponent, data: { 'title': '提前开票单' } },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    AgGridModule,
    TabViewModule,
    DropdownModule,
    FormsModule,
    RadioButtonModule
  ],
  declarations: [KaipiaoComponent, SalebillComponent, SalebilldetailComponent, SalebilldetreportComponent,
    SalebillcountComponent, ExpressComponent, VerifylistComponent, AdvanceinvoiceComponent, AdvanceinvoicedetailComponent,
     ImportorderComponent],
  providers: [],
  entryComponents: [ImportorderComponent]
})
export class KaipiaoModule { }
