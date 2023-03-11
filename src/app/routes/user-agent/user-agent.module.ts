import { NgModule } from '@angular/core';
import { UserAgentComponent } from './user-agent/user-agent.component';

import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AutoCompleteModule } from 'primeng/primeng';

const routes: Routes = [
    { path: '', component: UserAgentComponent ,data: {'title': '用户代理'}},
];

@NgModule({
  imports: [
    SharedModule,
    AutoCompleteModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserAgentComponent],
  exports:[
    RouterModule
  ]
})
export class UserAgentModule { }
