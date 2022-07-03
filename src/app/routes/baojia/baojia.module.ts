import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DataTableModule } from 'angular2-datatable';
import { BaojiaService } from './baojia.service';
import { FileUploadModule } from 'ng2-file-upload';
import { DialogModule } from 'primeng/primeng';
import { BaojiaComponent } from './baojia/baojia.component';

import { Routes, RouterModule } from '@angular/router';
import { BaojiadetailComponent } from './baojiadetail/baojiadetail.component';

const routes: Routes = [
        { path: '', component: BaojiaComponent ,data:{'title':'报价管理'}},
        { path: 'baojiadet/:id', component: BaojiadetailComponent, outlet: 'primary' ,data: {'title': '价格政策'}}];


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    WiskSharedsModule,
    FileUploadModule,
    DialogModule,
    DataTableModule,

  ],
  declarations: [BaojiaComponent, BaojiadetailComponent],
  exports: [
    RouterModule
  ],
  providers:[
    BaojiaService
  ]
})
export class BaojiaModule { }
