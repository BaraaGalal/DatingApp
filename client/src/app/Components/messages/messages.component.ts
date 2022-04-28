import { Component, OnInit } from '@angular/core';
import { Message } from './../../Models/message';
import { Pagination } from './../../Models/Pagination';
import { MessageService } from './../../Services/message.service';
import { ConfirmService } from './../../Services/confirm.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  pagination: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private messageSercice: MessageService, private confirmService: ConfirmService) { }

  ngOnInit(): void {
    this.loadMessages();

  }

  loadMessages() {
    this.loading = true;
    this.messageSercice.getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe(response => {
        this.messages = response.result;
        this.pagination = response.pagination;
        this.loading = false;
      })
  }

  deleteMessage(id: number) {
    this.confirmService.confirm('Are You Sure You Want To Delete This Message', 'This Cannot be undone')
      .subscribe(result => {
        if (result) {
          this.messageSercice.deleteMessage(id).subscribe(() => {
            this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
          })
        }
      })
  }

  pageChanged(event: any) {
    if (this.pageNumber != event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }
}
