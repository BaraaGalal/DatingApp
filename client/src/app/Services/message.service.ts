import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { getPaginationHeaders, getPaginationResult } from './paginationHelper';
import { Message } from '../Models/message';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from './../Models/user';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Group } from './../Models/group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hupUrl;
  private hubConnecton: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient) { }

  createHubConnection(user: User, otherUsername: string) {
    this.hubConnecton = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnecton.start()
      .catch(error => console.log(error));

    this.hubConnecton.on("ReceiveMessageThread", messages => {
      this.messageThreadSource.next(messages);
    })

    // S17E11
    this.hubConnecton.on("NewMessage", message => {
      this.messageThread$.pipe(take(1)).subscribe(messages => {
        this.messageThreadSource.next([...messages, message])
      })
    })

    this.hubConnecton.on("UpdatedGroup", (group: Group) => {
      if (group.connections.username === otherUsername) {
        this.messageThread$.pipe(take(1)).subscribe(messages => {
          messages.forEach(message => {
            if(!message.dateRead) {
              message.dateRead = new Date(Date.now());
            }
          })
          this.messageThreadSource.next([...messages]);
        })
      }
    })
  }

  stopHbConnection() {
    if (this.hubConnecton) {
      this.hubConnecton.stop();
    }
  }


  getMessages(pageNumber, pageSize, container: string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginationResult<Message[]>(this.baseUrl + 'messages', params, this.http);
  }

  getMessageThread(username: string) {
    // return this.http.get<Message[]>(`${this.baseUrl}messages/thread/${username}`);
    return this.http.get<Message[]>(this.baseUrl + "messages/thread/" + username);
  }

  async sendMessage(username: string, content: string) {
    try {
      return await this.hubConnecton.invoke('SendMessage', { recipientUsername: username, content });
    }
    catch (error) {
      return console.log(error);
    }
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + "messages/" + id);
  }
}
