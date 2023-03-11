import { Component, OnInit } from '@angular/core';
import { SellproService } from 'app/routes/sellpro/sellpro.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sellprodetail',
  templateUrl: './sellprodetail.component.html',
  styleUrls: ['./sellprodetail.component.scss']
})
export class SellprodetailComponent implements OnInit {

  sellpro: Object={org: {}, cuser: {}};
  /**
   * 主推钢厂
   */
  msteelmill='';
  /**
   * 产地
   */
  chandi='';
  people='';
  list:any[];
  constructor(private sellproApi: SellproService, private actroute: ActivatedRoute) {
    console.log('det');
    this.getData();
  }

  ngOnInit() {
  }
  getData() {
    this.sellproApi.getdetail(this.actroute.params['value']['id']).then(data => {
      console.log('detail',data);
      this.sellpro = data.sellpro;
      this.msteelmill = data.msteelmill;
      this.chandi = data.chandi;
      this.people = data.people;
      this.list = data.list;
    });
  }
}
