import { KaishiapiService } from './kaishiapi.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KaishiComponent } from './kaishi/kaishi.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/primeng';

const routes: Routes = [
  { path: '', component: KaishiComponent, data: { 'title': '开市时间段管理' } },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DropdownModule,
    FormsModule
  ],
  declarations: [KaishiComponent],
  providers: [KaishiapiService]
})
export class KaishiModule { }
