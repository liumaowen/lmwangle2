import { ModalDirective } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { UserapiService } from './../../../dnn/service/userapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-useredit',
  templateUrl: './useredit.component.html',
  styleUrls: ['./useredit.component.scss']
})
export class UsereditComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;

  model = {};
  groups = [];

  orgs = [];

  password = {};
  /**2018.02.28 黑名单开发 cpf ADD start */
  blacklist = [];
  /**2018.02.28 黑名单开发 end */
  constructor(private route: ActivatedRoute,
    private orgApi: OrgApiService,
    private toast: ToasterService,
    private router: Router,
    private userApi: UserapiService) {

    /**2018.02.28 黑名单开发 cpf ADD start */
    this.blacklist = [{ label: '普通', value: '0' }, { label: '特殊', value: '1' }];
    /**2018.02.28 黑名单开发 end */
    this.orgApi.listAll(0).then(data => {
      const orglist = [{ label: '请选择', value: '' }];
      data.forEach(element => {
        orglist.push({
          label: element['name'],
          value: element['id']
        });
      });
      this.orgs = orglist;
    });
    this.model = { customer: {} };
    this.userApi.get(this.route.parent.params['value']['id']).then((data) => {
      this.model = data;
      if (this.model['orgid']) {
        this.orgApi.listAll(this.model['orgid']).then(response => {
          const grouplist = [{ label: '请选择', value: '' }];
          response.forEach(element => {
            grouplist.push({
              value: element['id'],
              label: element['name']
            });
          });
          this.groups = grouplist;
        });
      }
    });
  }

  ngOnInit() {
  }

  change() {
    this.orgApi.listAll(this.model['orgid']).then(response => {
      const grouplist = [{ label: '请选择', value: '' }];
      response.forEach(element => {
        grouplist.push({
          value: element['id'],
          label: element['name']
        });
      });
      this.groups = grouplist;
    });
  }

  // 更新用户信息
  modifyModel() {
    if (!this.model['realname']) {
      this.toast.pop('warning', '请填写真实姓名');
      return;
    }
    if (!this.model['phone']) {
      this.toast.pop('warning', '请填写手机号');
      return;
    }
    if (confirm('你确定要保存？')) {
      this.userApi.update(this.model['id'], this.model).then(() => {
        this.toast.pop('success', '保存成功！');
        this.router.navigateByUrl('user');
      });
    }
  }
  enableUser() {
    if (confirm('你确定要启用该用户吗？')) {
      this.userApi.enableUser(this.model['id'], this.model).then(() => {
        this.toast.pop('success', '启用成功');
        this.router.navigateByUrl('user');
      });
    }
  }
  disableUser() {
    if (confirm('你确定要停用该用户吗？')) {
      this.userApi.disableUser(this.model['id'], this.model).then(() => {
        this.toast.pop('success', '停用成功');
        this.router.navigateByUrl('user');
      });
    }
  }
  // 修改密码弹出窗口
  modifyPasswordDialog() {
    this.showclassicModal();
  }


  // 密码修改
  modifyPassword() {
    if (!this.password['newPassword']) {
      this.toast.pop('warning', '请填写新密码');
      return;
    }
    if (!this.password['newPassword']) {
      this.toast.pop('warning', '请再次填写新密码');
      return;
    }
    if (this.password['newPassword'] === this.password['newPasswordAgain']) {
      this.userApi.modifypas(this.model['id'], this.password).then(() => {
        this.toast.pop('success', '密码修改成功');
        this.hideclassicModal();
      });
    } else {
      this.toast.pop('warning', '两次密码输入不一致');
    }
  }

  // 重置条件
  selectNull() {
    this.password = {};
  }

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

}
