import { Component, OnInit } from '@angular/core';

import { AppService } from './app.service';
import { IUser } from './app.interfaces';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from './core/theme.service';
import { UserDialogComponent } from './shared/user-dialog/user-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  users: IUser[] = [];

  constructor(
    public dialog: MatDialog,
    public theme: ThemeService,
    public appService: AppService,
  ) {
    this.theme.setDesign();
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.appService.get().subscribe((res: IUser[]) => {
      this.users = res;
    });
  }

  add() {
    const dialogRef = this.dialog.open(UserDialogComponent);

    dialogRef.afterClosed().subscribe(user => {
      this.load();
    });
  }

  edit(user: IUser) {
    this.dialog.open(UserDialogComponent, {
      data: user
    });
  }

  remove(user: IUser, removeIdx: number) {
    this.appService.delete(user._id).subscribe(() => {
      this.load();
    });
  }
}
