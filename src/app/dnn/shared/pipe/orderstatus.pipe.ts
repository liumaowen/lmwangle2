import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderstatus'
})
export class OrderstatusPipe implements PipeTransform {

  transform(status: any, isonline?: any): any {
      if(status == '1'){
				if(isonline){
					return '核算费用中';
				}else{
					return '待审核';
				}			
			}else if(status == '2'){
				return '待付款';
			}else if(status == '3'){
				return '待提货';
			}else if(status == '6'){
				return '完成';
			}else if(status == '7'){
				return '取消';
			}else if(status == '0'){
				return '制单中';
			}else if(status == '8'){
				return '撤销';
			}else if(status == '9'){
				return '变更中';
			}else{
				return null;
			}
  }

}
