import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { StoreService } from 'src/shared/store.service';

@Component({
  selector: 'app-modal-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.css']
})
export class ModalMessageComponent implements OnInit {
  constructor(public bsModalRef: BsModalRef, private storeService: StoreService) {  }
  modalStatus: boolean;
  modalMessage: string;

  ngOnInit() {
    this.storeService.getModalStatus().subscribe(status => {
      this.modalStatus = status;
      this.storeService.getModalMessage().subscribe(msg => {
        this.modalMessage = msg;
      });
    });
  }
}
