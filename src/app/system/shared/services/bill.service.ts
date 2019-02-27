import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BillModel} from '../models/bill.model';
import {BaseApi} from '../../../shared/core/base-api';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  /* так как добавили базовый класс base-api , то перепишем метод getBill и класс BillService */
  public test = 'test';
  constructor(private http: HttpClient) {}

  public getBill(): Observable<BillModel> {
    return this.http.get<BillModel>(environment.apiUrl + '/bill');
  }

  public getCurrency(base: string = 'RUB'): Observable<any> {
    /* запрос к удаленному серверу */
    return this.http.get<BillModel>(`https://api.exchangeratesapi.io/latest?base=${base}`);
  }
}
