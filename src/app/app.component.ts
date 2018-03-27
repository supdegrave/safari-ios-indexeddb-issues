import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IndexedDbService } from './indexeddb.service';
import { from } from 'rxjs/observable/from';
import { interval } from 'rxjs/observable/interval';
import { concatMap, tap, takeWhile } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  private _dbName = 'fnord';
  private _storeName = 'blarg';
  private _db;

  status: string = 'Just chillin\'...';
  currentDbSize: number = 0;
  floodStart: Date;
  floodEnd: Date;
  statusHistory: string[] = [];
  buttonsDisabled: boolean = true;

  dataSizes: number[] = [100, 250, 500, 1024];
  intervalSizes: number[] = [0, 100, 200, 500];

  dataSize: number;
  intervalSize: number;

  get insertDisabled() {
    return (this.dataSize === undefined && this.intervalSize === undefined) || this.buttonsDisabled;
  }

  get floodDuration() {
    const diff = (this.floodEnd.getTime() - this.floodStart.getTime()) / 1000;
    return Math.abs(diff);
  }

  constructor(private idb: IndexedDbService) {
    idb.setName(this._dbName);
    idb.initializeObjectStores([this._storeName]);
  }

  ngOnInit() {
    this.buttonsDisabled = true;
    this.status = 'Calculating IndexedDB size...';
    this.idb.scan(this._storeName)
      .subscribe(
        next => next.value && (this.currentDbSize += next.value.length),
        console.error,
        () => {
          this.status = 'Just chillin\'...';
          this.buttonsDisabled = false;
        }
      );
  }

  insertDataClick() {
    const sizeInMB = this.dataSize;
    const interval = this.intervalSize;
    const status = `Adding ${sizeInMB}MB ${interval > 0 ? `with ${interval}ms` : 'without'} interval`;

    this.buttonsDisabled = true;
    this.floodStart = new Date();
    this.floodEnd = null;
    this.status = status;
    this.statusHistory.push(status);

    setTimeout(() => {
      const sizeInBytes = sizeInMB * 1024 * 1024;

      if (interval > 0) {
        this.intervalInsert(sizeInBytes, interval);
      } else {
        this.blastInsert(sizeInBytes);
      }
    }, 500);
  }

  clearDbClick() {
    this.buttonsDisabled = true;
    this.status = 'Clearing IndexedDB...';
    const dbReq = indexedDB.open(this._dbName);

    dbReq.onsuccess = () => {
      const db = dbReq.result;
      Array.from(db.objectStoreNames).forEach(store => {
        const clearReq = db.transaction([store], 'readwrite')
          .objectStore(store)
          .clear();
        clearReq.onsuccess = () => {
          this.status = 'Just chillin\'...';
          this.statusHistory.push(`Cleared IndexedDB`);
          this.currentDbSize = 0;
          this.buttonsDisabled = false;
        };
        clearReq.onerror = console.error;
      });
    };
    dbReq.onerror = () => console.error(dbReq.error);
  }

  dataChanged(event) {
    this.dataSize = event.target.selectedOptions[0].value;
  }

  intervalChanged(event) {
    this.intervalSize = event.target.selectedOptions[0].value;
  }

  private intervalInsert(sizeInBytes: number, intval: number) {
    let sizeOfRun: number = 0;

    interval(intval).pipe(
      takeWhile(() => sizeOfRun < sizeInBytes),
      concatMap((next) => {
        const chunkSize = Math.round(Math.random() * 1024 * 1024);
        const chunk = new Array(chunkSize + 1).join('あ');
        sizeOfRun += chunkSize;
        this.currentDbSize += chunk.length;
        const key = new Date().getTime().toString();
        return this.idb.put(this._storeName, key, chunk)
      })
    ).subscribe(this.floodObserver);
  }

  private blastInsert(sizeInBytes: number) {
    let sizeOfRun: number = 0;
    const chunks = [];
    let chunkSize;

    while (sizeOfRun < sizeInBytes) {
      chunkSize = Math.round(Math.random() * 1024 * 1024);
      chunks.push(new Array(chunkSize + 1).join('あ'));
      sizeOfRun += chunkSize;
    }

    from(chunks).pipe(
      concatMap(
        chunk => {
          this.currentDbSize += chunk.length;
          const key = new Date().getTime().toString();
          return this.idb.put(this._storeName, key, chunk)
        }
      )
    ).subscribe(this.floodObserver);
  }

  private floodObserver = {
      next: (next) => {},
      error: console.error,
      complete: () => {
        this.status = 'Just chillin\'...';
        this.floodEnd = new Date();
        this.statusHistory.push(`-> Completed in ${this.floodDuration} seconds`);
        this.buttonsDisabled = false;
      }
  }
}
