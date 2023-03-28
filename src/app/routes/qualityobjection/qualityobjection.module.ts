import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular/main';
import { SharedModule } from '../../shared/shared.module';
import { WiskSharedsModule } from '../../dnn/shared/wiskshared.module';
import { CalendarModule, DropdownModule, TabViewModule } from 'primeng/primeng';
import { QualityobjectionComponent } from './qualityobjection/qualityobjection.component';
import { QualityobjectionService } from './qualityobjection.service';
import { QualityobjectiondetailComponent } from './qualityobjectiondetail/qualityobjectiondetail.component';
import { TihuodetimportComponent } from './qualityobjectiondetail/tihuodetimport/tihuodetimport.component';
import { DataTableModule } from 'angular2-datatable/lib/DataTableModule';
import { KucunqualityimportComponent } from './../../dnn/shared/kucunqualityimport/kucunqualityimport.component';
import { KucunService } from '../kucun/kucun.service';

const routes: Routes = [
  { path: '', component: QualityobjectionComponent, data: { 'title': '质量异议' } },
  { path: ':id', component: QualityobjectiondetailComponent, data: { 'title': '质量异议调查表' } },
];

@NgModule({
  imports: [
    AgGridModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    AgGridModule.withComponents([]),
    CalendarModule,
    DropdownModule,
    TabViewModule,
    DataTableModule
  ],
  declarations: [QualityobjectionComponent, QualityobjectiondetailComponent, TihuodetimportComponent,KucunqualityimportComponent],
  providers: [QualityobjectionService,KucunService],
  entryComponents: [TihuodetimportComponent,KucunqualityimportComponent]
})
export class QualityobjectionModule { }
