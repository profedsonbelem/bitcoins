import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { sha256 } from 'js-sha256';
import { Md5 } from 'ts-md5/dist/md5';
import { environment } from '../../environments/environment';
import { BitcoinService } from '../../service/bitcoin.service';
import { StoreService } from 'src/shared/store.service';
import { ModalMessageComponent } from '../modal-message/modal-message.component';

@Component({
  selector: 'app-user-trades',
  templateUrl: './user-trades.component.html',
  styleUrls: ['./user-trades.component.css']
})

export class UserTradesComponent implements OnInit {
  constructor(
    private bitcoinService: BitcoinService, 
    private modalService: BsModalService, 
    private storeService: StoreService
  ) { }

  modalRef: BsModalRef;
  modalConfig: ModalOptions = { class: 'modal-sm modal-dialog-centered' };
  userTradesArray: any[] = []; 
    
  ngOnInit() {
    this.getOpenedOrders();
  }

  getOpenedOrders() {
    this.bitcoinService.getTimeStamp().subscribe(resTime => {
      let qryString = "limit=100";
      let timeStamp = resTime.data;
      
      let stringToHMAC = this.getStringToHMAC("GET", "/v1/orders/list", qryString, timeStamp);
      let hmac256 = sha256.hmac(environment.secretKey, stringToHMAC);
      
      this.bitcoinService.getOrders(environment.accesKey, hmac256, timeStamp, qryString).subscribe(res => {
        console.log("LISTA DE ORDENS ABERTAS: ", res)
        
        if (res.data && res.data.length > 0)
          res.data.forEach(trade => {
            if (trade.status === 'SUBMITTED' || trade.status === 'PROCESSING' || trade.status === 'PARTIAL_FILLED' ||  trade.status === 'CANCELING')
              this.userTradesArray.push(trade);
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
      let bodyObj = {"id": orderID}

      const md5 = new Md5();
      let md5Value = md5.appendStr(JSON.stringify(bodyObj)).end();
      let stringToHMAC = this.getStringToHMAC("POST", "/v1/orders/cancel", md5Value.toString(), timeStamp);
      let hmac256 = sha256.hmac(secretKey, stringToHMAC);
            
      this.openModalMessage(true);
      // descomentar para funcionar o módulo de forma correta
      // this.bitcoinService.cancelOrder(accesKey, hmac256, timeStamp, bodyObj).subscribe(res => {
      //   console.log("Ordem de compra de Cancelada criada: ", res)
      //   //this.openModalMessage(res.data.result);
      // })
    })
  }

  openModalMessage(result) {
    if (result) {
      this.storeService.setModalStatus(true);
      this.storeService.setModalMessage('Ordem cancelada com sucesso!');
      this.modalRef = this.modalService.show(ModalMessageComponent, this.modalConfig);
    }
    else {
      this.storeService.setModalStatus(false);
      this.storeService.setModalMessage('Erro ao cancelar ordem!');
      this.modalRef = this.modalService.show(ModalMessageComponent, this.modalConfig);
    }
  }
}