import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { OrgComponent } from './../org/org.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrgApiService } from 'app/dnn/service/orgapi.service';

@Component({
  selector: 'app-orgdetail',
  templateUrl: './orgdetail.component.html',
  styleUrls: ['./orgdetail.component.scss']
})
export class OrgdetailComponent implements OnInit {

  @ViewChild('createProModal') private createProModal: ModalDirective;

  model = {};
  flag = 1;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toast: ToasterService,
    private orgApi: OrgApiService) { }

  ngOnInit() {
    this.route.params.subscribe(parans => {
      this.orgApi.get(parans['id']).then(data => {
        this.model = data.json();
      });
    });
  }

  user;

  // 添加负责人
  adduserDialog(flag) {
    this.flag = flag;
    this.user = undefined;
    this.showcreateProModal();
  }

  adduser() {
    if (typeof (this.user) === 'object') {
      if (this.flag === 1) {
        this.model['userid'] = this.user['code'];
        this.model['realname'] = this.user['name'];
      } else {
        this.model['userid2'] = this.user['code'];
        this.model['realname2'] = this.user['name'];
      }
      this.hidecreateProModal();
    } else {
      this.toast.pop('warning', '请选择人员！');
    }
  }

  updateModel() {
    if (confirm('确定要保存？')) {
      this.orgApi.modifyOrg(this.model['id'], this.model).then((model) => {
        // classifyController 给父亲传值
        OrgComponent.nextobj(this.model);
        // this.router.navigate(['org']);
      });
    }
  }

  showcreateProModal() {
    this.createProModal.show();
  }

  hidecreateProModal() {
    this.user = undefined;
    this.createProModal.hide();
  }

}
