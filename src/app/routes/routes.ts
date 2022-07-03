import { ResolveService } from './../dnn/service/resolve.service';
import { ZhibaoComponent } from './zhibao/zhibao/zhibao.component';
import { Error500Component } from './pages/error500/error500.component';
import { Error404Component } from './pages/error404/error404.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { LockComponent } from './pages/lock/lock.component';
import { RecoverComponent } from './pages/recover/recover.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from '../layout/layout.component';

export const routes = [

    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', loadChildren: './home/home.module#HomeModule' },
            { path: 'userAgent', loadChildren: './user-agent/user-agent.module#UserAgentModule' },
            { path: 'baojia', loadChildren: './baojia/baojia.module#BaojiaModule', canActivateChild: [ResolveService] },
            { path: '', loadChildren: './report/report.module#ReportModule', canActivateChild: [ResolveService] },
            { path: 'zhibao', loadChildren: './zhibao/zhibao.module#ZhibaoModule', canActivateChild: [ResolveService] },
            { path: 'zhibaoshu', loadChildren: './zhibaoshu/zhibaoshu.module#ZhibaoshuModule', },
            { path: 'customer', loadChildren: './customer/customer.module#CustomerModule' },
            { path: 'mycustomer', loadChildren: './mycustomer/mycustomer.module#MycustomerModule' },
            { path: 'classify', loadChildren: './classify/classify.module#ClassifyModule' },
            { path: 'cangku', loadChildren: './cangku/cangku.module#CangkuModule' },
            { path: 'kaishi', loadChildren: './kaishi/kaishi.module#KaishiModule' },
            { path: 'user', loadChildren: './user/user.module#UserModule' },
            { path: 'role', loadChildren: './role/role.module#RoleModule' },
            { path: 'org', loadChildren: './org/org.module#OrgModule' },
            { path: 'banksms', loadChildren: './banksms/banksms.module#BanksmsModule' },
            { path: 'erpkaohe', loadChildren: './erpkaohe/erpkaohe.module#ErpkaoheModule' },
            { path: 'notice', loadChildren: './notice/notice.module#NoticeModule' },
            { path: 'matchcar', loadChildren: './matchcar/matchcar.module#MatchcarModule' },
            { path: 'guide', loadChildren: './guide/guide.module#GuideModule' },
            { path: 'question', loadChildren: './question/question.module#QuestionModule' },
            { path: 'echarts', loadChildren: './echarts/echarts.module#EchartsModule' },
            { path: 'qualityobjection', loadChildren: './qualityobjection/qualityobjection.module#QualityobjectionModule' },
            { path: 'mdm', loadChildren: './mdm/mdm.module#MdmModule' }
        ]
    },
    // Not lazy-loaded routes
    { path: 'login', component: LoginComponent, data: { 'title': '登录' } },
    { path: 'register', component: RegisterComponent },
    { path: 'recover', component: RecoverComponent },
    { path: 'lock', component: LockComponent },
    { path: 'maintenance', component: MaintenanceComponent },
    { path: '404', component: Error404Component },
    { path: '500', component: Error500Component },
    // Not found
    { path: '**', redirectTo: 'home' }

];
