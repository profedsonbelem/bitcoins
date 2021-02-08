import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/shared/store.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { BitcoinService } from 'src/service/bitcoin.service';
import { sha256 } from 'js-sha256';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-buy-sell',
  templateUrl: './buy-sell.component.html',
  styleUrls: ['./buy-sell.component.css']
})

export class BuySellComponent implements OnInit {
  buySellForm: FormGroup; 
  autoTicks = false;
  disabled = false;
  invert = false;
  max = 500;
  min = 0;
  showTicks = true;
  step = 50;
  thumbLabel = true;
  value = 0;
  vertical = false;
  tickInterval = 0;
  mercadoCompraRangeValue = 0;
  mercadoVendaRangeValue = 0;

  constructor(private bitcoinService: BitcoinService, private storeService: StoreService, private formBuilder: FormBuilder) { 
    this.buySellForm = new FormGroup({
      precoCompra: new FormControl(''),
      qtdCompra: new FormControl(''),
      precoVenda: new FormControl(''),
      qtdVenda: new FormControl(''),
      mercadoCompraRangeValue: new FormControl(''),
    });
  }

  ngOnInit() {
    this.storeService.getValorCorrenteBTC().subscribe(valor => {
      this.buySellForm.patchValue({
        precoCompra: valor,
        precoVenda: valor,
      })
    });
  }

  getStringToHMAC(metodo: string, url: string, qryString: string, timeStamp: string) {
      return `${metodo}\n${url}\n${qryString}\n${timeStamp}`
  }

  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }

  onSubmitGET(form) {
    console.log("Entrou no submit")
    console.log("VALOR DE FORM: ", form)

    this.bitcoinService.getTimeStamp().subscribe(resTime => {
      console.log("VALOR DE TIMESTAMP: ", resTime)
      let accesKey = "10a592fc-7de0-4cb3-8187-2820ae7ea8c8";
      let secretKey = "o3BJxTkDUDts1MJkpDbUzRUS9hBOn6xw";
      let qryString = "currency=BTC&direct=desc&size=10&start=DR562339304588709888&type=coin_in";
      let timeStamp = resTime.data;
      
      let stringToHMAC = this.getStringToHMAC("GET", "/v1/wallet/query/deposit-withdraw", qryString, timeStamp);
      console.log("STRING TO HMAC: ", stringToHMAC);
      let hmac256 = sha256.hmac(secretKey, stringToHMAC);
      console.log("VALOR DE HMAC-SHA256: ", hmac256);

      //exemplo que funciona a credencial
      this.bitcoinService.getSaldo(accesKey, hmac256, timeStamp, qryString).subscribe(res => {
        console.log("VALOR DE SALDO: ", res)
        
      })
    })
  }

  // onSubmit(form) {
  //   console.log("Entrou no submit")
  //   console.log("VALOR DE FORM: ", form)

  //   this.bitcoinService.getTimeStamp().subscribe(resTime => {
  //     console.log("VALOR DE TIMESTAMP: ", resTime)
  //     let accesKey = "10a592fc-7de0-4cb3-8187-2820ae7ea8c8";
  //     let secretKey = "o3BJxTkDUDts1MJkpDbUzRUS9hBOn6xw";
  //     let qryString = "limit=100";
  //     let timeStamp = resTime.data;
      
  //     let stringToHMAC = this.getStringToHMAC("GET", "/v1/orders/list", qryString, timeStamp);
  //     console.log("STRING TO HMAC: ", stringToHMAC);
  //     let hmac256 = sha256.hmac(secretKey, stringToHMAC);
  //     console.log("VALOR DE HMAC-SHA256: ", hmac256);

  //     //exemplo que funciona a credencial
  //     this.bitcoinService.getOrders(accesKey, hmac256, timeStamp, qryString).subscribe(res => {
  //       console.log("LISTA DE ORDENS: ", res)
        
  //       if (res.data && res.data.length > 0)
  //         this.storeService.setUserTrades(res.data)
  //     })
  //   })
  // }

  onSubmit(form) {
    console.log("Entrou no submit")
    console.log("VALOR DE FORM: ", form)

    this.bitcoinService.getTimeStamp().subscribe(resTime => {
      console.log("VALOR DE TIMESTAMP: ", resTime)
      let accesKey = "10a592fc-7de0-4cb3-8187-2820ae7ea8c8";
      let secretKey = "o3BJxTkDUDts1MJkpDbUzRUS9hBOn6xw";
      let timeStamp = resTime.data;
      
      let bodyObj = {
        "symbol": "BTC_BRL",
        "type": "LIMIT",
        "side": "BUY",
        "price": "36000.00",
        "amount": "0.001"
      }

      const md5 = new Md5();
      let md5Value = md5.appendStr(JSON.stringify(bodyObj)).end();   
      let stringToHMAC = this.getStringToHMAC("POST", "/v1/orders/create", md5Value.toString(), timeStamp);
      let hmac256 = sha256.hmac(secretKey, stringToHMAC);
            
      this.bitcoinService.createLimitedBuyOrder(accesKey, hmac256, timeStamp, bodyObj).subscribe(res => {
        console.log("Ordem de compra de Mercado criada: ", res)
        
      })
    })
    
    // this.storeService.getBids().subscribe(bids => {
    //   // console.log("VALOR DE BIDS: ", bids)

    //   bids.forEach(bid => {
    //     let b = bid[0];
    //     let precoCompra = parseFloat(form.precoCompra.replaceAll('.', '').replace(',', '.'))
    //     let menorValorCompra = precoCompra - 150
    //     let maiorValorCompra = precoCompra + 150
    //     console.log("VALOR PREÇO COMPRA: ", precoCompra)
    //     console.log("VALOR DE B: ", parseFloat(b))
    //     console.log("VALOR MENOR COMPRA: ", menorValorCompra)
    //     console.log("VALOR MAIOR COMPRA: ", maiorValorCompra)

    //     if (parseFloat(b) >= menorValorCompra && parseFloat(b) <= maiorValorCompra) {
          

    //       console.log("=======================================================================================")
    //       console.log("ENCONTROU COMPRA PRA FAZER")
    //       console.log("=======================================================================================")
    //     }
    //   });
    // });

    // if (form.status !== 'INVALID') {
    //   console.log("Entrou no if do submit")
    //   this.storeService.valorCompra = form.controls.precoCompra.value;
    //   this.storeService.qtdCompra = form.controls.qtdCompra.value;
    //   this.storeService.valorVenda = form.controls.precoVenda.value;
    //   this.storeService.qtdVenda = form.controls.qtdVenda.value;
    // }
  }

  executarOrdem() {
    //obter os dados para montar a ordem de compra ou venda
    //verificar se condição foi atendida
    //executar compra ou venda
  }
}