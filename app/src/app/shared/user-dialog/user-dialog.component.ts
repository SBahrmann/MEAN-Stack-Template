import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IUser } from 'src/app/app.interfaces';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent {

  user: IUser = {
    _id: '',
    name: '',
    email: '',
    theme: undefined,
    password: this.generatePassword(),
    resetPassword: true,
  }

  edit = false;
  isUpdate = false;
  showPassword = false;
  validate = {
    minLength: true,
    hasAlphabetic: true,
    hasNumber: true,
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IUser,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    private snackBar: MatSnackBar,
    private appService: AppService,
  ) {
    if (data) {
      this.edit = true;
      this.user = data;
    }
  }

  generatePassword() {
    let length = 16;
    let password = "";
    let possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

    for (let i = 0; i < length; i++) {
      let randomChar = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
      password += randomChar;
    }

    return password;
  }

  setPassword() {
    this.user.password = this.generatePassword();
  }

  handleRegister(): void {
    this.appService.post(this.user).subscribe({
      next: (res: any) => {
        this.snackBar.open(
          'Benutzer wurde erstellt',
          'OK',
          { duration: 3000 });
        this.dialogRef.close(res);

      },
      error: (error) => {
        this.user.password = '';
        this.snackBar.open(error.statusText,
          'OK',
          { duration: 3000 });
      }
    });
  }

  handleUpdate(): void {
    this.appService.put(this.user).subscribe({
      next: (res: any) => {
        if (res.message === "User exists") {
          this.snackBar.open(
            'Benutzer existiert bereits',
            'OK',
            { duration: 3000 });
        } else {
          this.snackBar.open(
            'Benutzer aktualisiert',
            'OK',
            { duration: 3000 });
          this.user.password = '';
          this.dialogRef.close(res);
        }
      },
      error: (error: any) => {
        this.snackBar.open(error.statusText,
          'OK',
          { duration: 3000 });
      }
    });
  }

  validateUser() {
    if (this.user.password) {
      this.validate.hasNumber = /\d/.test(this.user.password);
      this.validate.minLength = this.user.password.length >= 8;
      this.validate.hasAlphabetic = /[a-zA-Z]/.test(this.user.password);
    }
    return Object.values(this.validate).every(value => value === true);
  }
}
