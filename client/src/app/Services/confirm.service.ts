import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from './../Modals/confirm-dialog/confirm-dialog.component';
import { observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  bsModalRef: BsModalRef;

  constructor(private modalService: BsModalService) { }

  confirm(title= 'Confirnation', message= 'Are you sure u want to do this?',
     btnOkText= 'Ok', btnCancleText= 'cancle'): Observable<boolean> {
       const config = {
         initialState: {
           title,
           message,
           btnOkText,
           btnCancleText
         }
       }
       this.bsModalRef = this.modalService.show(ConfirmDialogComponent, config);

       return new Observable<boolean>(this.getResult());

     }

  private getResult() {
    return (observable) => {
      const subscription = this.bsModalRef.onHidden.subscribe(() => {
        observable.next(this.bsModalRef.content.result);
        observable.compleate();
      });

      return {
        unsubscribe() {
          subscription.unsubscribe();
        }
      }
    }
  }
}
