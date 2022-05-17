import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  orderBy,
  DocumentReference,
  CollectionReference,
  addDoc,
  setDoc,
  query,
  doc,
  docData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, concatMap } from 'rxjs/operators';

export interface IUser {
  displayName: string;
  photoDataUrl: string;
}

export interface IMessage {
  uid: string;
  message: string;
  timestamp: number;
}

export interface IChat extends IUser, IMessage {}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  userDoc: DocumentReference<any>;
  messageCollection: CollectionReference<any>;
  userCollection: CollectionReference<any>;

  constructor(public af: Firestore) {
    /* this.messageCollection = this.af.collection<IMessage>('chat', (ref) =>
      ref.orderBy('timestamp')
      this.userCollection = this.af.collection<IUser>('users');
    ); */
    this.messageCollection = collection(this.af, 'chat');
    this.userCollection = collection(this.af, 'users');
  }

  messageAdd(message: IMessage) {
    //return this.messageCollection.add(message);
    return addDoc(this.messageCollection, message);
  }

  chatInit(): Observable<IChat[]> {
    /* return this.messageCollection.valueChanges({ idField: 'messageId' }).pipe(
      concatMap(async (messages) => {
        const users = await this.userCollection
          .valueChanges({ idField: 'uid' })
          .pipe(first())
          .toPromise(Promise);
        return messages.map((message) => {
          const user = users.find((u) => u.uid === message.uid);
          return Object.assign(message, user);
        });
      })
    ); */
    return collectionData(query(this.messageCollection, orderBy('timestamp')), {
      idField: 'messageId',
    }).pipe(
      concatMap(async (messges) => {
        const users = await collectionData(this.userCollection, {
          idField: 'uid',
        })
          .pipe(first())
          .toPromise(Promise);
        return messges.map((message) => {
          const user = users.find((u) => u.uid === message.uid);
          return Object.assign(message, user);
        });
      })
    );
  }

  userInit(uid: string): Promise<IUser> {
    //this.userDoc = this.af.doc<IUser>(`users/${uid}`);
    //return this.userDoc.valueChanges().pipe(first()).toPromise(Promise);
    this.userDoc = doc(this.af, `users/${uid}`);
    return docData(this.userDoc).pipe(first()).toPromise(Promise);
  }
  userSet(user: IUser): Promise<void> {
    //return this.userDoc.set(user);
    return setDoc(this.userDoc, user);
  }
}
