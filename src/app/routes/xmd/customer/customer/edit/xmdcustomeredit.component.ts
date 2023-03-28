import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToasterService} from 'angular2-toaster/angular2-toaster';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {StorageService} from '../../../../../dnn/service/storage.service';
import {ClassifyApiService} from '../../../../../dnn/service/classifyapi.service';
import {XmdcustomerService} from '../../xmdcustomer.service';

@Component({
  selector: 'app-xmdcustomeredit',
  templateUrl: './xmdcustomeredit.component.html',
  styleUrls: ['./xmdcustomeredit.component.scss']
})
export class XmdCustomereditComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;

  flag = [{label: '请选择'}, {value: true, label: '是'}, {value: false, label: '否'}];
  model = {};

  cuser;

  current = this.storage.getObject('cuser');

  showbutton = {update: false};

  categorys;
  suppliertypes;
  provinces = [];
  citys = [];
  province;
  city;
  area;
  usermodel = {};
  photo;

  constructor(private route: ActivatedRoute,
              private storage: StorageService,
              private toast: ToasterService,
              private router: Router,
              private classifyApi: ClassifyApiService,
              private customerApi: XmdcustomerService) {
    console.log(this.route.parent.params['value']['id']);

    this.customerApi.getCustomer(this.route.parent.params['value']['id']).then((data) => {
      this.model = data;
      this.area = this.model['province'] + this.model['city'];
      if (data['isonline']) {
        this.customerApi.getuser(this.route.parent.params['value']['id']).then(res => {
          console.log(res);
          this.usermodel = res['user'];
          this.photo = res['photo'];
        });
      }
    });


    // if (this.current.admin) {
    //   this.showbutton.update = true;
    // } else if (this.current.finance) {
    //   this.showbutton.update = true;
    // } else if (this.current.id === this.model['salemanid']) {
    //   this.showbutton.update = true;
    // }
    this.showbutton.update = true;

    this.classifyApi.listBypid({pid: 4346}).then((data) => {
      const categorylist = [{label: '请选择行业类别', value: ''}];
      data.forEach(element => {
        categorylist.push({
          label: element.name,
          value: element.id
        });
      });
      this.categorys = categorylist;
    });
    this.getProvince();

    this.classifyApi.listBypid({pid: 14064}).then((data) => {
      const categorylist = [{label: '请选择供应商分类', value: ''}];
      data.forEach(element => {
        categorylist.push({
          label: element.name,
          value: element.id
        });
      });
      this.suppliertypes = categorylist;
    });
  }

  // 执行更新操作
  modifyCustomer() {
    console.log(this.model);
    if (!this.model['taxno']) {
      // Notify.alert('税号不能为空', { status: 'warning' }); return;
      this.toast.pop('warning', '税号不能为空');
      return;
    }
    if (!this.model['kaihubank']) {
      // Notify.alert('开户行不能为空', { status: 'warning' });
      this.toast.pop('warning', '开户行不能为空');
      return;
    }
    if (!this.model['kaihuaccount']) {
      this.toast.pop('warning', '开户行账号不能为空');
      // Notify.alert('开户行账号不能为空', { status: 'warning' });
      return;
    }
    if (!this.model['address']) {
      this.toast.pop('warning', '公司地址不能为空');
      // Notify.alert('公司地址不能为空', { status: 'warning' });
      return;
    }
    if (!this.model['contactway']) {
      this.toast.pop('warning', '公司电话不能为空');
      // Notify.alert('公司电话不能为空', { status: 'warning' });
      return;
    }
    if (!this.model['linkman']) {
      this.toast.pop('warning', '联系人不能为空');
      // Notify.alert('公司电话不能为空', { status: 'warning' });
      return;
    }
    if (!this.model['tel']) {
      this.toast.pop('warning', '联系电话不能为空');
      // Notify.alert('公司电话不能为空', { status: 'warning' });
      return;
    }
    if (this.model['iswlcompany'] == null) {
      this.toast.pop('warning', '是否为物流公司不能为空');
      // Notify.alert('是否为物流公司不能为空', { status: 'warning' });
      return;
    }
    if (this.model['isStorage'] == null) {
      this.toast.pop('warning', '是否为仓储不能为空');
      // Notify.alert('是否为仓储不能为空', { status: 'warning' });
      return;
    }
    if (this.model['iscost'] == null) {
      this.toast.pop('warning', '是否为费用单位不能为空');
      // Notify.alert('是否为费用单位不能为空', { status: 'warning' });
      return;
    }
    if (this.model['isproduce'] == null) {
      this.toast.pop('warning', '是否为加工单位不能为空');
      // Notify.alert('是否为加工单位不能为空', { status: 'warning' });
      return;
    }
    if (this.model['isonline'] == null) {
      this.toast.pop('warning', '是否为线上客户不能为空');
      // Notify.alert('是否为线上客户不能为空', { status: 'warning' });
      return;
    }
    if (this.model['issupplier'] == null) {
      this.toast.pop('warning', '是否为供应商不能为空');
      // Notify.alert('是否为线上客户不能为空', { status: 'warning' });
      return;
    }
    if (this.model['province'] == null || this.model['city'] == null) {
      this.toast.pop('warning', '公司所在区域不能为空');
      // Notify.alert('是否为线上客户不能为空', { status: 'warning' });
      return;
    }
    if (this.model['suppliertype'] == null && this.model['categoryid'] == 4358) {
      this.toast.pop('warning', '物流供应商分类不能为空');
      return;
    }
    if (confirm('确定要更新吗')) {
      this.customerApi.modifyCustomer(this.route.parent.params['value']['id'], this.model).then(() => {
        // ngDialog.close();
        this.toast.pop('success', '更新成功');
        this.router.navigateByUrl('xmdcustomer');
      });
    }
  }

  // 执行停用功能
  disable(id) {
    if (confirm('你确定该公司停用吗？')) {
      this.customerApi.disable(id).then(() => {
        this.toast.pop('success', '操作成功');
        this.model['isdel'] = true;
      });
    }
  }

  // 执行启用功能
  enable(id) {
    if (confirm('你确定该公司启用吗？')) {
      this.customerApi.enable(id).then(() => {
        this.toast.pop('success', '操作成功');
        // Notify.alert('操作成功', { status: 'success' });
        this.model['isdel'] = false;
      });
    }
  }

  closeThisDialog() {
    this.model['salemanid'] = this.cuser['code'];
    this.model['salename'] = this.cuser['name'];
    this.hideclassicModal();
  }

  // 添加业务负责人
  addsalemanDialog() {
    this.showclassicModal();
  }

  ngOnInit() {
  }

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  getProvince() {
    this.province = {};
    this.city = {};
    this.classifyApi.getChildrenTree({pid: 263}).then((data) => {
      data.forEach(element => {
        this.provinces.push({
          label: element.label,
          value: element
        });
      });
      this.citys = [];
    });
  }

  getcity() {
    this.citys = [];
    this.model['province'] = this.province['label'];
    this.classifyApi.getChildrenTree({pid: this.province['id']}).then((data) => {
      data.forEach(element => {
        this.citys.push({
          label: element.label,
          value: element
        });
      });
    });
  }

  getcounty() {
    this.model['city'] = this.city['label'];
  }

  verify(id) {
    this.customerApi.verify(id).then(data => {
      this.toast.pop('success', '审核成功');
    });
  }

  showimg(value) {
    window.open(value);
  }

  refuse(id) {
    this.customerApi.refuse(id).then(data => {
    });
  }

  createAide(id) {
    if (confirm('确定要给该客户开通自助系统吗？')) {
      this.customerApi.createAide(id).then(data => {
        this.toast.pop('success', '开户成功');
      });
    }
  }
}
