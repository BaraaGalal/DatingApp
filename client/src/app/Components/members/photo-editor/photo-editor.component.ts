import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/Models/member';
import { FileUploader } from 'ng2-file-upload';
import { environment } from './../../../../environments/environment';
import { AccountService } from 'src/app/Services/account.service';
import { take } from 'rxjs/operators';
import { User } from 'src/app/Models/user';
import { MemberService } from 'src/app/Services/member.service';
import { Photo } from 'src/app/Models/photo';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member
  uploader:FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;

  constructor(private acountService: AccountService, private memberService: MemberService) {
    this.acountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
   }

  ngOnInit(): void {
    this.initializeUploader();
  }

  setMainPhoto(photo: Photo){
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.acountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p =>{
        if (p.isMain) p.isMain = false;
        if(p.id === photo.id)  p.isMain = true;

      })
    })
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if(response) {
        const photo: Photo = JSON.parse(response);
        this.member.photos.push(photo);
        if (photo.isMain) {
          this.user.photoUrl = photo.url
          this.member.photoUrl = photo.url
          this.acountService.setCurrentUser(this.user)
        }
      }
    }
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe(() => {
                                              // this filter method will return an array of photos(!= id)
      this.member.photos = this.member.photos.filter(ww => ww.id !== photoId)
    })
  }


}
