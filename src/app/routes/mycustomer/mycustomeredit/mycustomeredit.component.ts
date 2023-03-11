import { MycustomerapiService } from './../mycustomerapi.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CustomerapiService } from './../../customer/customerapi.service';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { StorageService } from './../../../dnn/service/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-mycustomeredit',
  templateUrl: './mycustomeredit.component.html',
  styleUrls: ['./mycustomeredit.component.scss']
})
export class MycustomereditComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;

  flag = [{ label: '请选择' }, { value: true, label: '是' }, { value: false, label: '否' }];

  model = {};

  cuser;

  current = this.storage.getObject('cuser');

  constructor(private route: ActivatedRoute,
    private storage: StorageService,
    private toast: ToasterService,
    private router: Router,
    private classifyApi: ClassifyApiService,
    private mycustomerApi: MycustomerapiService) {

    this.mycustomerApi.getCustomer(this.route.parent.params['value']['id']).then((data) => {
      const model = data.json();
      this.model = model;
      console.log(this.model['iscost']);
    });
  }

  // 执行更新操作
  modifyCustomer() {
    console.log(this.model);
    if (1 === this.model['isonline']) {
      this.model['isonline'] = true;
    } else {
      this.model['isonline'] = false;
    }

    if (confirm('确定要更新吗')) {
      this.mycustomerApi.modifyCustomer(this.route.parent.params['value']['id'], this.model).then(() => {
        this.toast.pop('success', '更新成功');
        this.router.navigateByUrl('mycustomer');
        // Notify.alert('更新成功', { status: 'success' });
        // $state.go("app.mycustomer");
      });
    }
  }

  selel(event) {
    console.log(event);
    console.log(this.model['iscost']);
  }

  // 添加业务负责人
  addsalemanDialog() {
    this.showclassicModal();
  }

  closeThisDialog() {
    this.model['salemanid'] = this.cuser['code'];
    this.model['salename'] = this.cuser['name'];
    this.hideclassicModal();
  }

  ngOnInit() {
  }

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

}
