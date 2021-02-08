import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()

export class BitcoinService {

  constructor(private http: HttpClient) { }

  public getLatestTickers(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers.append('Access-Control-Allow-Origin', '*' );
    headers.append('Access-Control-Allow-Methods', '*' );
    headers.append('Access-Control-Allow-Headers', '*' );
    headers.append('Access-Control-Allow-Credentials', 'false' );
    // const headers = { "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "*",
    //   "Access-Control-Allow-Headers": "'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'", }

    return this.http.get<any>('https://api.novadax.com/v1/market/tickers', {headers: headers})
  }

  public getLatestTickerByPair(pair: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers.append('Access-Control-Allow-Origin', '*' );

    return this.http.get<any>(`http://api.novadax.com/v1/market/ticker?symbol=${pair}`, {headers: headers})
  }

  public getLivroDeOfertas(pair: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers.append('Access-Control-Allow-Origin', '*' );

    return this.http.get<any>(`https://api.novadax.com/v1/market/depth?symbol=${pair}&limit=10`, {headers: headers})
  }

  public getRecentTrades(pair: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers.append('Access-Control-Allow-Origin', '*' );

    return this.http.get<any>(`http://api.novadax.com/v1/market/trades?symbol=${pair}&limit=10`, {headers: headers})
  }

  public getTimeStamp(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers.append('Access-Control-Allow-Origin', '*' );

    return this.http.get<any>(`http://api.novadax.com/v1/common/timestamp`, {headers: headers})
  }

  public getSaldo(accessKey: string, sign: string, timeStamp: string, qryString: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Nova-Access-Key':accessKey,
        'X-Nova-Signature':sign,
        'X-Nova-Timestamp':timeStamp.toString(),
      })
    }

    return this.http.get<any>(`http://api.novadax.com/v1/wallet/query/deposit-withdraw?${qryString}`, httpOptions)
  }

  public createLimitedBuyOrder(accessKey: string, sign: string, timeStamp: any, body: any): Observable<any> {
    console.log("VALOR DE TIMESTAMP: ", timeStamp)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Nova-Access-Key':accessKey,
        'X-Nova-Signature':sign,
        'X-Nova-Timestamp':timeStamp.toString(),
      })
    }

    return this.http.post<any>(`https://api.novadax.com/v1/orders/create`, body, httpOptions)
  }

  public createMarketBuyOrder(accessKey: string, sign: string, timeStamp: any, body: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Nova-Access-Key':accessKey,
      'X-Nova-Signature':sign,
      'X-Nova-Timestamp':timeStamp.toString(),
    })
    
    return this.http.post<any>(`https://api.novadax.com/v1/orders/create`, body, {headers})
  }

  public getOrders(accessKey: string, sign: string, timeStamp: string, qryString: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Nova-Access-Key':accessKey,
        'X-Nova-Signature':sign,
        'X-Nova-Timestamp':timeStamp.toString(),
      })
    }

    return this.http.get<any>(`http://api.novadax.com/v1/orders/list?${qryString}`, httpOptions)
  }

  public cancelOrder(accessKey: string, sign: string, timeStamp: any, body: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Nova-Access-Key':accessKey,
      'X-Nova-Signature':sign,
      'X-Nova-Timestamp':timeStamp.toString(),
    })
    
    return this.http.post<any>(`https://api.novadax.com/v1/orders/cancel`, body, {headers})
  }
}