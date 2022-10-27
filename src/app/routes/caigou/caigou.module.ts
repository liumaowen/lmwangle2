import { CaigoudetimportComponent } from './../../dnn/shared/caigoudetimport/caigoudetimport.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaigouComponent } from './caigou/caigou.component';
import { CaigoudetComponent } from './caigoudet/caigoudet.component';
import { CaigouService } from './caigou.service';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular/main';
import { SelectModule } from 'ng2-select';
import { SharedModule } from '../../shared/shared.module';
import { WiskSharedsModule } from '../../dnn/shared/wiskshared.module';
import { CalendarModule, DropdownModule, TabViewModule } from 'primeng/primeng';
import { DataTableModule } from 'angular2-datatable';
import { FormsModule } from '@angular/forms';
import { CgfukuanComponent } from './cgfukuan/cgfukuan.component';
import { CgfukuandetComponent } from './cgfukuandet/cgfukuandet.component';
import { CgtuihuoComponent } from './cgtuihuo/cgtuihuo.component';
import { CgtuihuodetComponent } from './cgtuihuodet/cgtuihuodet.component';
import { CginvoiceingComponent } from './cginvoiceing/cginvoiceing.component';
import { CginvoicedetComponent } from './cginvoicedet/cginvoicedet.component';
import { CginvoicedetailComponent } from './cginvoicedetail/cginvoicedetail.component';
import { CgwanglaiComponent } from './cgwanglai/cgwanglai.component';
import { Cgwanglai2Component } from './cgwanglai2/cgwanglai2.component';
import { CgwanglaiyueComponent } from './cgwanglaiyue/cgwanglaiyue.component';
import { Cgwanglaiyue2Component } from './cgwanglaiyue2/cgwanglaiyue2.component';
import { CginvoiceCountComponent } from './cginvoice-count/cginvoice-count.component';
import { JsbuchaComponent } from './jsbucha/jsbucha.component';
import { JsbuchadetComponent } from './jsbuchadet/jsbuchadet.component';
import { JsbuchaimportComponent } from 'app/dnn/shared/jsbuchaimport/jsbuchaimport.component';
import { JinhuoguanzhiComponent } from './jinhuoguanzhi/jinhuoguanzhi.component';
import { CgfanliComponent } from './cgfanli/cgfanli.component';
import { RukuapplyComponent } from './rukuapply/rukuapply.component';
import { RukuapplydetComponent } from './rukuapplydet/rukuapplydet.component';
import { JsbuchadetailsComponent } from './jsbuchadetails/jsbuchadetails.component';
import { UrgentcontractComponent } from './urgentcontract/urgentcontract.component';
import { CgfanlihuizongComponent } from './cgfanlihuizong/cgfanlihuizong.component';
import { CaigoujiaofureportComponent } from './caigoujiaofureport/caigoujiaofureport.component';
import { CaigoudetimpComponent } from 'app/dnn/shared/caigoudetimp/caigoudetimp.component';
import { CginvoiceTiaohuoComponent } from './cginvoice-tiaohuo/cginvoice-tiaohuo.component';
import { WeidaofanlihuizongComponent } from './weidaofanlihuizong/weidaofanlihuizong.component';
import { LastyearwdfanlihuizongComponent } from './lastyearwdfanlihuizong/lastyearwdfanlihuizong.component';
import { CginvoiceingdetComponent } from './cginvoiceingdet/cginvoiceingdet.component';
import { CgfukuanplanComponent } from './cgfukuanplan/cgfukuanplan.component';
import { CaigoujiaofuhuizongComponent } from './caigoujiaofuhuizong/caigoujiaofuhuizong.component';
import { CaigoujiaofukaoheComponent } from './caigoujiaofukaohe/caigoujiaofukaohe.component';
import { FanliruleComponent } from './fanlirule/fanlirule.component';
import { DiscountregisterComponent } from './discountregister/discountregister.component';
import { FanliruledetailComponent } from './fanliruledetail/fanliruledetail.component';

const routes: Routes = [
  { path: 'caigou', component: CaigouComponent, data: { 'title': '采购管理' } },
  { path: 'caigou/:id', component: CaigoudetComponent, data: { 'title': '采购详情' } },
  { path: 'cgfukuan', component: CgfukuanComponent, data: { 'title': '采购付款单' } },
  { path: 'cgfukuan/:id', component: CgfukuandetComponent, data: { 'title': '采购付款单详情' } },
  { path: 'cgtuihuo', component: CgtuihuoComponent, data: { 'title': '采购退货时序表' } },
  { path: 'cgtuihuo/:id', component: CgtuihuodetComponent, data: { 'title': '采购退货详情' } },
  { path: 'cginvoiceing', component: CginvoiceingComponent, data: { 'title': '待开票列表' } },
  { path: 'cginvoice/det', component: CginvoicedetComponent, data: { 'title': '采购发票明细表' } },
  { path: 'cginvoice/:id', component: CginvoicedetailComponent, data: { 'title': '采购发票详情' } },
  { path: 'cgwanglai/:id', component: CgwanglaiComponent, data: { 'title': '采购往来明细表' } },
  { path: 'cgwanglai2/:id', component: Cgwanglai2Component, data: { 'title': '财务往来明细表' } },
  { path: 'cgwanglaiyue', component: CgwanglaiyueComponent, data: { 'title': '采购往来余额表' } },
  { path: 'cgwanglaiyue2', component: Cgwanglaiyue2Component, data: { 'title': '财务往来余额表' } },
  { path: 'cginvoicecount', component: CginvoiceCountComponent, data: { 'title': '未开票列表' } },
  { path: 'jsbucha', component: JsbuchaComponent, data: { 'title': '结算补差时序表' } },
  { path: 'jhgz', component: JinhuoguanzhiComponent, data: { 'title': '进货管制表' } },
  { path: 'jsbucha/:id', component: JsbuchadetComponent, data: { 'title': '结算补差详情' } },
  { path: 'cgfanli', component: CgfanliComponent, data: { 'title': '返利明细表' } },
  { path: 'rukuapply', component: RukuapplyComponent, data: { 'title': '入库申请明细表' } },
  { path: 'rukuapply/:id', component: RukuapplydetComponent, data: { 'title': '入库申请单详情' } },
  { path: 'jsbuchadetails', component: JsbuchadetailsComponent, data: { 'title': '结算补差明细表' } },
  { path: 'urgentcontract', component: UrgentcontractComponent, data: { 'title': '急单管理表' } },
  { path: 'cgfanlihuizong', component: CgfanlihuizongComponent, data: { 'title': '钢厂返利汇总表' } },
  { path: 'caigoujiaofu', component: CaigoujiaofureportComponent, data: { 'title': '采购交付情况表' } },
  { path: 'cginvoicetiaohuo', component: CginvoiceTiaohuoComponent, data: { 'title': '调货未到票明细表' } },
  { path: 'weidaofanlihuizong', component: WeidaofanlihuizongComponent, data: { 'title': '未到返利汇总表' } },
  { path: 'lastwdfanlihuizong', component: LastyearwdfanlihuizongComponent, data: { 'title': '去年未到返利汇总表' } },
  { path: 'cginvoiceingdet', component: CginvoiceingdetComponent, data: { 'title': '采购发票未登记明细表' } },
  { path: 'cgfukuanplan', component: CgfukuanplanComponent, data: { 'title': '采购付款计划' } },
  { path: 'caigoujiaofuhuizong', component: CaigoujiaofuhuizongComponent, data: { 'title': '采购交付汇总表' } },
  { path: 'caigoujiaofukaohe', component: CaigoujiaofukaoheComponent, data: { 'title': '采购交付考核表' } },
  { path: 'fanlirule', component: FanliruleComponent, data: { 'title': '钢厂优惠规则表' } },
  { path: 'fanlirule/:id', component: FanliruledetailComponent, data: { 'title': '钢厂优惠规则详情' } },
  { path: 'discountregister', component: DiscountregisterComponent, data: { 'title': '优惠登记表' } },

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
    TabViewModule
  ],
  declarations: [CaigouComponent, CaigoudetComponent, CaigoudetimportComponent, CaigoudetimpComponent,
    CgfukuanComponent, CgfukuandetComponent,
    CgtuihuoComponent, CgtuihuodetComponent, CginvoiceingComponent, CginvoicedetComponent, CginvoicedetailComponent,
    CgwanglaiComponent, Cgwanglai2Component, CgwanglaiyueComponent, Cgwanglaiyue2Component, CginvoiceCountComponent, JsbuchaComponent,
    JsbuchadetComponent, JsbuchaimportComponent, JinhuoguanzhiComponent, CgfanliComponent, RukuapplyComponent, RukuapplydetComponent,
    JsbuchadetailsComponent, UrgentcontractComponent, CgfanlihuizongComponent, CaigoujiaofureportComponent,
    CginvoiceTiaohuoComponent, WeidaofanlihuizongComponent, LastyearwdfanlihuizongComponent, CginvoiceingdetComponent,
    CgfukuanplanComponent, CaigoujiaofuhuizongComponent, CaigoujiaofukaoheComponent, FanliruleComponent, DiscountregisterComponent, FanliruledetailComponent],
  exports: [RouterModule],
  providers: [CaigouService],
  entryComponents: [CaigoudetimportComponent, CaigoudetimpComponent, JsbuchaimportComponent]
})
export class CaigouModule { }
