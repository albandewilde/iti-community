import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../user.model';
import { UserQueries } from '../../services/user.queries';
import { NzMessageService } from 'ng-zorro-antd/message';

export class UserProfileForm {
  id: string;
  username: string;
  photoUrl?: string;
  _file?: File;
  user: User;

  constructor(
    _user: User
  ) {
    this.id = _user.id;
    this.username = _user.username;
    this.photoUrl = _user.photoUrl;
    this.user = _user;
  }

  get file() {
    return this._file;
  }

  set file(file: File | undefined) {
    this._file = file;
    if (file) {
      this.toBase64(file).then(s => {
        this.photoUrl = s;
      })
    }
  }

  toBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  hasChanged(): boolean {
    return !!this.file || this.username !== this.user.username
  }
}

@Component({
  selector: 'app-user-profile-modal',
  templateUrl: './user-profile-modal.component.html',
  styleUrls: ['./user-profile-modal.component.less']
})
export class UserProfileModalComponent implements OnInit {
  @Input()
  user: User;

  @ViewChild("f")
  form: NgForm;
  supportedTypes = "";
  isVisible: boolean = false;
  model: UserProfileForm;

  constructor(
    private _userService: UserService,
    private _sanitizer: DomSanitizer,
    private _userQueries: UserQueries,
    private _nzMessageService: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.model = new UserProfileForm(this.user);
  }

  get photoUrl(): SafeResourceUrl | undefined {
    if (this.model.photoUrl) {
      return this._sanitizer.bypassSecurityTrustResourceUrl(this.model.photoUrl);
    }
  }

  async isUsedPseudo(psd: string): Promise<boolean> {
    return await this._userQueries.exists(psd)
  }

  async onOk() {
    const username = this.model.username
    const pp = this.model.file

    if (this.model.hasChanged()) {
      // Unique password
      if (username != this.user.username && await this.isUsedPseudo(this.model.username)) {
        this._nzMessageService.error("Ce pseudo est déjà utilisé, veuillez en choisir un autre")
        return
      }

      this._userService.update({
        id: this.user.id,
        username: username,
        photo: pp,
      })
    }

    this.close();
  }

  onFileUpload = (file: File) => {
    this.model.file = file;
    return false;
  }

  onCancel() {
    this.close();
  }

  open() {
    this.model = new UserProfileForm(this.user);
    this.form.resetForm(this.model);
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }
}