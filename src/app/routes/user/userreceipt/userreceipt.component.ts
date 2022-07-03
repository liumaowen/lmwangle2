import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { UserapiService } from 'app/dnn/service/userapi.service';

@Component({
  selector: 'app-userreceipt',
  templateUrl: './userreceipt.component.html',
  styleUrls: ['./userreceipt.component.scss']
})
export class UserreceiptComponent implements OnInit {

  @ViewChild('createModal') private createModal: ModalDirective;
  @ViewChild('editModal') private editModal: ModalDirective;
  suser;
  usersaleman: any = { userid: '', salemanid: '', salemanname: '' };
  tableData;
  totalItems;
  editparams: any = {};
  userid = this.route.parent.params['value']['id'];
  constructor(private route: ActivatedRoute,
    private toast: ToasterService,
    private router: Router,
    private userApi: UserapiService) { }

  ngOnInit() {
    this.select();
  }
  createDialog() {
    this.createModal.show();
  }
  closeDialog() {
    this.createModal.hide();
  }
  create() {
    this.usersaleman['userid'] = this.route.parent.params['value']['id'];
    this.usersaleman['salemanid'] = this.suser['code'];
    this.usersaleman['salemanname'] = this.suser['name'];
    this.userApi.createUserreceipt(this.usersaleman).then(data => {
      this.toast.pop('success', '创建成功');
      this.select();
      this.closeDialog();
    });
  }
  select() {
    this.userApi.queryUserreceipt(this.userid).then(data => {
      // 获取到当前数据
      this.tableData = data;
    });
  }
  /**修改停用或启用 */
  showeditmodal(user) {
    this.editparams = JSON.parse(JSON.stringify(user));
    this.editModal.show();
  }
  closeeditDialog() {
    this.editModal.hide();
  }
  editsave() {
    this.userApi.editsave(this.editparams).then(data => {
      this.select();
      this.toast.pop('success', '修改成功');
      this.closeeditDialog();
    });
  }
}
