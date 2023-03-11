import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MdmService } from '../../mdm.service';


@Component({
  selector: 'app-mdmclassifydetail',
  templateUrl: './mdmclassifydetail.component.html',
  styleUrls: ['./mdmclassifydetail.component.scss']
})
export class MdmclassifydetailComponent implements OnInit {

  model = {};

  constructor(private route: ActivatedRoute,
    private router: Router,
    private mdmService: MdmService) {

  }

  ngOnInit() {
    this.route.params.subscribe(parans => {
      this.mdmService.get(parans['id']).then(data => {
        this.model = data;
      });
    });
  }

  updateModel() {
    // if (confirm('确定要保存？')) {
    //   this.classifyApi.update(this.model['id'], this.model).then((model) => {
    //     // classifyController 给父亲传值
    //     ClassifyComponent.nextobj(this.model);
    //     // this.router.navigate(['classify']);
    //   });
    // }
  }

}
