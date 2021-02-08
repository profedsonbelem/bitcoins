import { Component, OnInit } from '@angular/core';
import { BitcoinService } from 'src/service/bitcoin.service';
import { StoreService } from 'src/shared/store.service';

@Component({
  selector: 'app-pair-detail',
  templateUrl: './pair-detail.component.html',
  styleUrls: ['./pair-detail.component.css']
})

export class PairDetailComponent implements OnInit {
  constructor(private bitcoinService: BitcoinService, private storeService: StoreService) { }
  tickerInfo: any;
  ask: any;
  high24h: any;
  low24h: any;

  ngOnInit() {
    setInterval(() => {
      this.obterTickerInfo();
    }, 1000);

  }

  obterTickerInfo() {
    this.bitcoinService.getLatestTickerByPair('BTC_BRL').subscribe(res => {
      this.tickerInfo = res.data;

      if (this.tickerInfo && this.tickerInfo.ask) {
        this.ask = parseFloat(this.tickerInfo.ask).toLocaleString('pt-br', {minimumFractionDigits: 2});
        this.high24h = parseFloat(this.tickerInfo.high24h).toLocaleString('pt-br', {minimumFractionDigits: 2});
        this.low24h = parseFloat(this.tickerInfo.low24h).toLocaleString('pt-br', {minimumFractionDigits: 2});
        this.storeService.setValorCorrenteBTC(this.ask);
      }
      // console.log("VALOR DE TICKER INFO: ", res.data)
    })
  }
}