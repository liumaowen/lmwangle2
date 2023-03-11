import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-usersaleman',
  templateUrl: './usersaleman.component.html',
  styleUrls: ['./usersaleman.component.scss']
})
export class UsersalemanComponent implements OnInit {
  @ViewChild('createModal') private createModal: ModalDirective;
  suser;
  usersaleman: any = { userid: '', salemanid: '', salemanname: '' };
  tableData;
  totalItems;
  userid = this.route.parent.params['value']['id'];
  constructor(private route: ActivatedRoute,
    private toast: ToasterService,
    private router: Router,
    private userApi: UserapiService) { }

  ngOnInit() {
    console.log(123456);
    this.select();
  }
  createDialog() {
    this.createModal.show();
  }
  closeDialog() {
    this.createModal.hide();
  }
  create() {
    console.log(this.suser);
    this.usersaleman['userid'] = this.route.parent.params['value']['id'];
    this.usersaleman['salemanid'] = this.suser['code'];
    this.usersaleman['salemanname'] = this.suser['name'];
    console.log(this.usersaleman);
    this.userApi.createUsersaleman(this.usersaleman).then(data => {
      this.toast.pop('success', '创建成功');
      this.select();
      this.closeDialog();
    });
  }
  select() {
    this.userApi.queryUsersaleman(this.userid).then(data => {
      // 获取到当前数据
      this.tableData = data;
    });
  }
  remove(id) {
    if (confirm('你确定删除吗？')) {
      this.userApi.delUsersaleman(id).then(data => {
        this.select();
      });
    }
  }
}
