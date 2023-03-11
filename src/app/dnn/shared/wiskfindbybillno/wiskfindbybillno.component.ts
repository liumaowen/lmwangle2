import { BusinessorderapiService } from './../../../routes/businessorder/businessorderapi.service';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-wiskfindbybillno',
  templateUrl: './wiskfindbybillno.component.html',
  styleUrls: ['./wiskfindbybillno.component.scss']
})
export class WiskfindbybillnoComponent implements OnInit {
  orderBillno;
  results;

  @Output()
  billnoChange = new EventEmitter();
  @Output()
  public select = new EventEmitter<any>();

  @Input()
  get billno() {
    return this.orderBillno;
  }

  set billno(val) {
    this.orderBillno = val;
    this.billnoChange.emit(this.orderBillno);
  }

  @Input() isonline;

  constructor(private businessorderApi: BusinessorderapiService) { }

  ngOnInit() {
  }
  search($event) {
    const searchs = { search: $event['query'] };
    this.businessorderApi.getQihuoByBillno(searchs).then(data => {
      this.results = [];
      data.forEach(element => {
        this.results.push({
          name: element.billno,
          code: element.id
        });
      });
    });
  }

  checkbillno(event) {
    this.select.emit(event);
  }

}
