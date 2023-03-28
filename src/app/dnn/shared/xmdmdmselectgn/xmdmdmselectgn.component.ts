import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MdmService } from 'app/routes/mdm/mdm.service';

@Component({
  selector: 'app-xmdmdmselectgn',
  templateUrl: './xmdmdmselectgn.component.html',
  styleUrls: ['./xmdmdmselectgn.component.scss'],
  providers: [MdmService, BsModalRef]
})
export class XmdmdmselectgnComponent implements OnInit {
  mdmgnsearchtotal: any;
  currentPage = 1;
  gnData: any = [];
  @Output() public select = new EventEmitter<any>();
  search = {pagenum: 1, pagesize: 100, itemname: '', categoryname: ''};
  @Input()
  get mdmgnsearch() { return this.search; }
  set mdmgnsearch(dd) {
    this.search = dd;
  }
  parent;
  constructor(
    public settings: SettingsService,
    public mdmService: MdmService,
    private toast: ToasterService) {
  }

  ngOnInit() {
  }
  querymdmgn() {
    this.mdmgnsearch.pagenum = 1;
    this.getxmdMdmgn();
  }
  /**查询品名 */
  getxmdMdmgn() {
    this.mdmService.xmdgnMdmgn(this.mdmgnsearch).then(data => {
      this.mdmgnsearchtotal = data.headers.get('total');
      this.gnData = data.json();
    });
  }
  /**品名列表分页 */
  mdmgnsearchChanged(event) {
    this.mdmgnsearch['pagenum'] = event.page;
    this.mdmgnsearch['pagesize'] = event.itemsPerPage;
    this.getxmdMdmgn();
  }
  creategoogscode() {
    const itemcodes = [];
    this.gnData.forEach(item => {
      if (item.checked) {
        itemcodes.push(item);
      }
    });
    if (itemcodes.length === 1) {
      this.mdmService.getMdmAttributeDic({ itemcode: itemcodes[0].itemcode }).then(data => {
        const params = {item: itemcodes[0], attrs: data};
        this.select.emit(params);
      });
    } else {
      this.toast.pop('warning', '请选择一条记录！');
    }
  }
  selecttr(item) {
    item.checked = !item.checked;
  }
}
