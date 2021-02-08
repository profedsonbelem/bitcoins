import { Component, OnInit } from '@angular/core';
import { BitcoinService } from 'src/service/bitcoin.service';
import { StoreService } from 'src/shared/store.service';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.css']
})

export class HistoryDetailComponent implements OnInit {
  constructor(private bitcoinService: BitcoinService, private storeService: StoreService) { }
  negociacoesRecentes: any[];
  livroDeOfertas: any[];
  listaAsk: any[];
  listaBid: any[];

    ngOnInit() {
        setInterval(() => {
            this.listarNegociacoesRecentes();
            this.listarLivroDeOfertas();
        }, 1000);
    }

    listarNegociacoesRecentes() {
        this.bitcoinService.getRecentTrades('BTC_BRL').subscribe(res => {
            this.negociacoesRecentes = res.data;
        });
    }

    listarLivroDeOfertas() {
        this.bitcoinService.getLivroDeOfertas('BTC_BRL').subscribe(res => {
            this.livroDeOfertas = res.data;
            
            if (res && res.data) {
                if (res.data.asks && res.data.asks.length > 0) {
                    this.listaAsk = [];
                    res.data.asks.sort(function(a,b) { return parseFloat(b) - parseFloat(a);})
                    res.data.asks.map(ofertaAsk => {
                        this.listaAsk.push(ofertaAsk)
                    })
                }
            
                if (res.data.bids && res.data.bids.length > 0) {
                    this.listaBid = [];
                    res.data.bids.sort(function(a,b) { return parseFloat(b) - parseFloat(a);})
                    res.data.bids.map(ofertaBid => {
                        this.listaBid.push(ofertaBid)
                    })
                }

                this.storeService.setBids(this.listaBid);

                // this.verificarCondicao();
            }
        })
    }

    verificarCondicao() {
        //lembrar de fazer a função totalmente assíncrona caso possível
        // console.log("ENTROU NA VERIFICAÇÃO DE CONDIÇÃO")
        // console.log("VALOR DE STORE VALOR COMPRA: ", this.storeService.valorCompra)
        // console.log("VALOR DE STORE QTD COMPRA: ", this.storeService.qtdCompra)
        
        this.listaAsk.map(ask => {
            if (ask[0] == this.storeService.valorVenda && ask[1] == this.storeService.qtdVenda) {
                console.log("Venda elegível encontrada");
                //chamar end point para fazer a venda
            }
        })

        this.listaBid.map(bid => {
            // console.log("VALOR DE BID NA VERIFICAÇÃO: ", bid)
            if (bid[0] == this.storeService.valorCompra && bid[1] == this.storeService.qtdCompra) {
                console.log("Compra elegível encontrada");
                //chamar end point para fazer a compra
            }
        })
    }

    getGate(dataTimeStamp: any) {
        const data = new Date(dataTimeStamp)

        var h = data.getHours();
        var m = data.getMinutes();
        var s = data.getSeconds();

        m = this.checkTime(m);
        s = this.checkTime(s);

        return `${h}:${m}:${s}`
    }

    checkTime(i) {
        if (i < 10)
            i = "0" + i;

        return i;
    }

    public tratarMoeda(valor: string) {
        return parseFloat(valor).toLocaleString('pt-br', {minimumFractionDigits: 2})
    }
}