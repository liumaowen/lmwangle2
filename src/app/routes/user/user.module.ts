import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { SharedModule } from 'app/shared/shared.module';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from 'angular2-datatable';
import { TabViewModule, DropdownModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { UserdetailComponent } from './userdetail/userdetail.component';
import { BusinessorderapiService } from 'app/routes/businessorder/businessorderapi.service';
import { UsereditComponent } from './useredit/useredit.component';
import { UserprojectComponent } from './userproject/userproject.component';
import { UserroleComponent } from './userrole/userrole.component';
import { UserpermisionComponent } from './userpermision/userpermision.component';
import { UsercustomerComponent } from './usercustomer/usercustomer.component';
import { RoleapiService } from 'app/routes/role/roleapi.service';
import { UsersalemanComponent } from './usersaleman/usersaleman.component';
import { UserreceiptComponent } from './userreceipt/userreceipt.component';

const routes: Routes = [
  { path: '', component: UserComponent, data: { 'title': '用户管理' } },
  {
    path: ':id', component: UserdetailComponent,
    children: [
      { path: '', redirectTo: 'edit' },
      { path: 'edit', component: UsereditComponent, data: { 'title': '基本信息' } },
      { path: 'project', component: UserprojectComponent, data: { 'title': '员工项目' } },
      { path: 'role', component: UserroleComponent, data: { 'title': '角色列表' } },
      { path: 'permision', component: UserpermisionComponent, data: { 'title': '权限列表' } },
      { path: 'customer', component: UsercustomerComponent, data: { 'title': '用户公司信息' } },
      { path: 'saleman', component: UsersalemanComponent, data: { 'title': '关联业务员' } },
      { path: 'receipt', component: UserreceiptComponent, data: { 'title': '临时代理人' } },
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    TabViewModule,
    DropdownModule,
    FormsModule,
  ],
  declarations: [UserComponent, UserdetailComponent, UsereditComponent, UserprojectComponent, UserroleComponent,
    UserpermisionComponent, UsercustomerComponent, UsersalemanComponent, UserreceiptComponent],
  providers: [BusinessorderapiService, RoleapiService]
})
export class UserModule { }
