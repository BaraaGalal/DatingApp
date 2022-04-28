import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../../Models/member';
import { MemberService } from 'src/app/Services/member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { MessageService } from './../../../Services/message.service';
import { Message } from './../../../Models/message';
import { PresenceService } from './../../../Services/presence.service';
import { User } from './../../../Models/user';
import { AccountService } from 'src/app/Services/account.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  activeTab: TabDirective;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  messages: Message[] = [];
  user: User


  constructor(public presence: PresenceService, private route: ActivatedRoute, private router: Router,
              private messageService: MessageService, private accountService: AccountService) {
                this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              }


  ngOnInit(): void {
    // this.loadMember();
    this.route.data.subscribe(data => {
      this.member =data.member;
    })

    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]

    this.galleryImages = this.getImages();
  }

  getImages(): NgxGalleryImage[] {
    let imageUrls = [];
    for (let photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      });
    }
    return imageUrls;
  }

  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    })
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }


  // this function to load the tab i click
  // if i didnt click on the message butto the message will not be load
  onTabActivated(data: TabDirective) {
    this.activeTab = data
    if (this.activeTab.heading === "Messages" && this.messages.length === 0) {
      this.messageService.createHubConnection(this.user, this.member.username);
    }
    else {
      this.messageService.stopHbConnection();
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHbConnection();
  }
}
