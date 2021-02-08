import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppComponent } from './app.component';
import { HomeComponent } from 'src/modules/home/home.component';
import { LatestTickersComponent } from 'src/modules/latest-tickers/latest-tickers.component';
import { BitcoinService } from 'src/service/bitcoin.service';
import { PairDetailComponent } from 'src/modules/pair-detail/pair-detail.component';
import { HistoryDetailComponent } from 'src/modules/history-detail/history-detail.component';
import { BuySellComponent } from 'src/modules/buy-sell/buy-sell.component';
import { StoreService } from 'src/shared/store.service';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { HistoryUserTradesComponent } from 'src/modules/history-user-trades/history-user-trades.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { UserTradesComponent } from 'src/modules/user-trades/user-trades.component';
import { ModalMessageComponent } from 'src/modules/modal-message/modal-message.component';
import { FinishedTradesComponent } from 'src/modules/finished-trades/finished-trades.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LatestTickersComponent,
    PairDetailComponent,
    HistoryDetailComponent,
    BuySellComponent,
    HistoryUserTradesComponent,
    UserTradesComponent,
    FinishedTradesComponent,
    ModalMessageComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    ReactiveFormsModule,
    CurrencyMaskModule,
    BrowserAnimationsModule,
    MatTabsModule,
    ModalModule.forRoot(),
    MatSliderModule,
    MatFormFieldModule,
  ],
  entryComponents: [
    ModalMessageComponent,
  ],
  providers: [BitcoinService, StoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
