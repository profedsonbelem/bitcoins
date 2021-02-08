import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { environment } from '../../environments/environment';
import { BitcoinService } from '../../service/bitcoin.service';
import { sha256 } from 'js-sha256';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-finished-trades',
  templateUrl: './finished-trades.component.html',
  styleUrls: ['./finished-trades.component.css']
})

export class FinishedTradesComponent implements OnInit {
  constructor(private bitcoinService: BitcoinService,) { }
  finishedTradesArray: any[] = []; 
    
  ngOnInit() {
    this.getUnfinishedOrders();
  }

  getUnfinishedOrders() {
    this.bitcoinService.getTimeStamp().subscribe(resTime => {
      console.log("VALOR DE TIMESTAMP: ", resTime)
      // let accesKey = "10a592fc-7de0-4cb3-8187-2820ae7ea8c8";
      // let secretKey = "o3BJxTkDUDts1MJkpDbUzRUS9hBOn6xw";
      let qryString = "limit=100";
      let timeStamp = resTime.data;
      
      let stringToHMAC = this.getStringToHMAC("GET", "/v1/orders/list", qryString, timeStamp);
      let hmac256 = sha256.hmac(environment.secretKey, stringToHMAC);
      
      this.bitcoinService.getOrders(environment.accesKey, hmac256, timeStamp, qryString).subscribe(res => {
        console.log("LISTA DE ORDENS ABERTAS: ", res)
        
        if (res.data && res.data.length > 0)
          res.data.forEach(trade => {
            if (trade.status === 'PARTIAL_CANCELED' || trade.status === 'PARTIAL_REJECTED' || trade.status === 'FILLED' ||  trade.status === 'CANCELED' || trade.status === 'REJECTED')
              this.finishedTradesArray.push(trade);
          })
      })
    })
  }

  handleTempo(tempo) {
    return moment(new Date(tempo)).format('DD/mm/yyyy HH:mm:ss')
  }

  handleTipo(texto) {
    if (texto === "BUY")
      return 'Comprar';
    else
      return 'Vender';
  }

  handlePreco(value) {
    return parseFloat(value).toLocaleString('pt-br', {minimumFractionDigits: 2})
  }

  getStringToHMAC(metodo: string, url: string, qryString: string, timeStamp: string) {
    return `${metodo}\n${url}\n${qryString}\n${timeStamp}`
  }

  handleCancelOrder(orderID) {
    console.log("Entrou no onClick")
    console.log("VALOR DE ORDER ID: ", orderID)

    this.bitcoinService.getTimeStamp().subscribe(resTime => {
      let accesKey = "10a592fc-7de0-4cb3-8187-2820ae7ea8c8";
      let secretKey = "o3BJxTkDUDts1MJkpDbUzRUS9hBOn6xw";
      let timeStamp = resTime.data;
      
      let bodyObj = {
        "id": orderID,
      }

      const md5 = new Md5();
      let md5Value = md5.appendStr(JSON.stringify(bodyObj)).end();
      console.log("VALOR DE MD5: ", md5Value);      
      let stringToHMAC = this.getStringToHMAC("POST", "/v1/orders/cancel", md5Value.toString(), timeStamp);
      console.log("STRING TO HMAC: ", stringToHMAC);
      let hmac256 = sha256.hmac(secretKey, stringToHMAC);
      console.log("VALOR DE HMAC-SHA256: ", hmac256);
      
      this.bitcoinService.cancelOrder(accesKey, hmac256, timeStamp, bodyObj).subscribe(res => {
        console.log("Ordem de compra de Cancelada criada: ", res)
        
      })
    })
  }
}