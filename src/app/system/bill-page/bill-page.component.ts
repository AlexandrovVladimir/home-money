import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {BillModel} from '../shared/models/bill.model';
import {BillService} from '../shared/services/bill.service';

@Component({
  selector: 'app-bill-page',
  templateUrl: './bill-page.component.html',
  styleUrls: ['./bill-page.component.styl']
})
export class BillPageComponent implements OnInit, OnDestroy {

  private subscription1: Subscription;
  private subscription2: Subscription;

  base = 'RUB';
  bill: BillModel;
  currency: any;

  /* в данный момент, даные на странице отображаются раньше, чем передались в компонент
    http://prntscr.com/mqylxe
    Поэтому введем флаг, который будет говорить, загрузились ли сейчас даные
  */
  isLoaded = false;

  constructor(private billService: BillService) { }

  ngOnInit() {

    /* даные приходят с разных api, поэтому их надо синхронизировать
    * Это поможет сделать метод RxJs Observable.combineLatest() - принимает в себя стримы
    * */

    this.subscription1 = Observable.combineLatest(
      this.billService.getBill(),
      this.billService.getCurrency(this.base)
    ).subscribe((data: [BillModel, any]) => {
      this.bill = data[0];
      this.currency = data[1];

      this.isLoaded = true; /*флажина о статусе загрузке даных на странице и в компоненте*/
    });
  }

  onRefresh() {
    this.isLoaded = false;
    this.subscription2 = this.billService.getCurrency()
      .delay(1500)
      .subscribe((currency: any) => {
        this.currency = currency;

        this.isLoaded = true; /*флажина о статусе загрузке даных на странице и в компоненте*/
      });
  }

  ngOnDestroy() {
    if (this.subscription1 && !this.subscription1.closed) {
      this.subscription1.unsubscribe();
    }
    if (this.subscription2 && !this.subscription2.closed) {
      this.subscription2.unsubscribe();
    }
  }

}
