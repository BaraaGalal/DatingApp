import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../Models/member';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../Models/Pagination';
import { userParams } from '../Models/userParams';
import { AccountService } from './account.service';
import { take } from 'rxjs/operators';
import { User } from '../Models/user';
import { getPaginationHeaders, getPaginationResult } from './paginationHelper';


@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  user: User;
  userParams: userParams;
  // this varaible for caching
  // and we will use map (map like Dictionary) have a value and key
  // so we use the Object for the key and for each key will store the responce
  // B/C every key is unique
  // and the value will be the response we get back from the server
  memberCache =new Map();

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user=> {
      this.user = user;
      this.userParams = new userParams(user);
    });
   }


   addLike(username: string) {
     return this.http.post(`${this.baseUrl}likes/${username}`,{});
   }

   getLikes(predicate: string, pageNumber: number, pageSize: number) {
     let params = getPaginationHeaders(pageNumber, pageSize);
     params = params.append('predicate', predicate);
    return getPaginationResult<Partial<Member[]>>(`${this.baseUrl}likes`, params, this.http);
   }


  getMembers(userParams: userParams) {
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if(response) return of(response);

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize)

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginationResult<Member[]>(this.baseUrl + 'users', params, this.http).pipe(
      map(responce => {
        this.memberCache.set(Object.values(userParams).join('-'), responce);
        return responce;
      })
    )
  }


  getUserParams() {
    return this.userParams;
  }

  settUserParams(params: userParams) {
    this.userParams = params;
  }

  resutUserParams() {
    this.userParams = new userParams(this.user);
    return this.userParams
  }

  getMember(username: string) {
    // we need to use caching for each user name
    // so if we log (this.memberCache)
    // the result is the map with key and value
    // so the value is the PaginatedResult from the server which contains all the user
    // and that depends on what the Filtering is used and how many element will get back
    // =>   console.log(this.memberCache);

    // so now what we need we get all the value of (this.memberCache)
    // we dont need a key
    // and what we use is sprite operator
    // but what if we want to do another query
    //  the PaginatedResult will be array of (PaginatedResult)
    // =>  const members = [...this.memberCache.values()]
    // =>  console.log(members);


    // to fix this we will use reduce function
    // B/C we need the result in a single array we don't need array of PaginatedResult
    const member = [...this.memberCache.values()]
    //S13E17
     .reduce((arr, elem) => arr.concat(elem.result), [])
     .find((member: Member) => member.username === username);
     if(member) return of(member)
    return this.http.get<Member>(`${this.baseUrl}Users/${username}`);
  }

  updateMember(member: Member) {
    return this.http.put(`${this.baseUrl}users`, member).pipe(
      // B/C the update does not return anything
      // we use anonymous function
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(`${this.baseUrl}users/set-main-photo/${photoId}`, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(`${this.baseUrl}Users/delete-photo/${photoId}`)
  }

}

