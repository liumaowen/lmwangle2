import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular/main';
import { DataTableModule } from 'angular2-datatable';
import { SelectModule } from 'ng2-select';
import { CalendarModule, CheckboxModule, DropdownModule, RadioButtonModule } from 'primeng/primeng';
import { WiskSharedsModule } from '../../dnn/shared/wiskshared.module';
import { SharedModule } from '../../shared/shared.module';
import { CouponService } from './coupon.service';
import { CouponComponent } from './coupon/coupon.component';
import { CouponlistComponent } from './couponlist/couponlist.component';
import { JingliaohesuanComponent } from './jingliaohesuan/jingliaohesuan.component';
import { KucunclassifyComponent } from './kucunclassify/kucunclassify.component';
import { SendcouponComponent } from './sendcoupon/sendcoupon.component';
import { Kucunclassify1Component } from './kucunclassify1/kucunclassify1.component';

const routes: Routes = [
  { path: 'coupon', component: CouponComponent, data: { 'title': '优惠券' } },
  { path: 'couponlist', component: CouponlistComponent, data: { 'title': '发放记录' } },
  { path: 'sendcoupon', component: SendcouponComponent, data: { 'title': '优惠券' } },
  { path: 'kucunclassify', component: KucunclassifyComponent, data: { 'title': '库存销售管理' } },
  { path: 'kucunclassify1', component: Kucunclassify1Component, data: { 'title': '代销合同限额管理' } },
  { path: 'jingliaohesuan', component: JingliaohesuanComponent, data: { 'title': '净料价格核算' } }
];

@NgModule({
  imports: [
    CommonModule,
    AgGridModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    AgGridModule.withComponents([]),
    SelectModule,
    CalendarModule,
    DropdownModule,
    DataTableModule,
    FormsModule,
    RadioButtonModule,
    CheckboxModule
  ],
  exports: [RouterModule],
  declarations: [CouponComponent, SendcouponComponent, CouponlistComponent, KucunclassifyComponent, JingliaohesuanComponent, Kucunclassify1Component],
  providers: [CouponService]
})
export class CouponModule { }
