import { Component, OnInit } from '@angular/core';
import { BitcoinService } from '../../service/bitcoin.service';

@Component({
  selector: 'app-latest-tickers',
  templateUrl: './latest-tickers.component.html',
  styleUrls: ['./latest-tickers.component.css']
})

export class LatestTickersComponent implements OnInit {
  constructor(private bitcoinService: BitcoinService) { }
  data: any[];
  
  ngOnInit() {
    this.listarUltimosTickers();
  }

  listarUltimosTickers() {
    this.bitcoinService.getLatestTickers().subscribe(res => {
        this.data = res.data;
    });
  }

  public tratarMoeda(valor: string) {
    return parseFloat(valor).toLocaleString('pt-br', {minimumFractionDigits: 2})
  }
}