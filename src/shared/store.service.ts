import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class StoreService {
    private valorCorrenteBTC: BehaviorSubject<string> = new BehaviorSubject(null);

    getValorCorrenteBTC(): Observable<string> {
        return this.valorCorrenteBTC.asObservable();
    }

    setValorCorrenteBTC(valor: string) {
        this.valorCorrenteBTC.next(valor);
    }

    private bids: BehaviorSubject<any[]> = new BehaviorSubject(null);

    getBids(): Observable<any[]> {
        return this.bids.asObservable();
    }

    setBids(bidsArray: any[]) {
        this.bids.next(bidsArray);
    }

    private userTrades: BehaviorSubject<any[]> = new BehaviorSubject(null);

    getUserTrades(): Observable<any[]> {
        return this.userTrades.asObservable();
    }

    setUserTrades(userTradesArray: any[]) {
        this.userTrades.next(userTradesArray);
    }

    private modalStatus: BehaviorSubject<boolean> = new BehaviorSubject(null);

    getModalStatus(): Observable<boolean> {
        return this.modalStatus.asObservable();
    }

    setModalStatus(status: boolean) {
        this.modalStatus.next(status);
    }

    private modalMessage: BehaviorSubject<string> = new BehaviorSubject(null);

    getModalMessage(): Observable<string> {
        return this.modalMessage.asObservable();
    }

    setModalMessage(message: string) {
        this.modalMessage.next(message);
    }

    livroDeOfertas: any;
    valorCompra: any;
    qtdCompra: any;
    valorVenda: any;
    qtdVenda: any;
}
