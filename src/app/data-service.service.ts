import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import * as saveAs from 'file-saver';
import {PasswordEncryptionService} from './password-encryption.service';

export interface Password {
  name: string;
  email: string;
  pass: string;
  notes: string;
  tags: Array<string>;
  shown: boolean;
}

export interface Category {
  name: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataProvider {
  filter = 'all';
  login = '';
  isFirstLogin = true;
  myPasswords: Array<Password>;
  currPasswords: Array<Password>;
  categories: Array<Category>;
  autocomplete = {email: [], password: [], tags: []};

  constructor(private storage: Storage) {}

  async loadPasswords() {
    // decrypt passwords from local storage
    try {
      const encryptor = new PasswordEncryptionService(this.login);
      const encryptedPass: string = await this.storage.get('passwords');
      const decryptedPass = encryptor.decrypt(encryptedPass);
      const passwords: Password[] = JSON.parse(decryptedPass) || [];
      this.myPasswords = passwords;
      this.currPasswords = passwords;
    } catch (err) {
      this.myPasswords = [];
      this.currPasswords = [];
    }
    this.setAutoComplete();
  }

  async isCorrectPassword(pass) {
    try {
      const encryptor = new PasswordEncryptionService(pass);
      const encryptedPass: string = await this.storage.get('passwords');
      const decryptedPass = encryptor.decrypt(encryptedPass);
      JSON.parse(decryptedPass);
      return true;
    } catch (err) {
      return false;
    }
  }

  async loadUser() {
    this.isFirstLogin = !!await this.storage.get('isFirstLogin');
  }

  setLogin(pass) {
    this.login = pass;
    this.storage.set('isFirstLogin', false);
  }

  setAutoComplete() {
    const tempEmail = {};
    const tempTags = {};
    for (const item of this.myPasswords) {

      if (!tempEmail[item.email]) {
        tempEmail[item.email] = 0;
      }
      tempEmail[item.email] += 1;

      for (const tag of item.tags) {
        if (!tempTags[tag]) {
          tempTags[tag] = 0;
        }
        tempTags[tag] += 1;
      }
    }
    this.autocomplete.email = Object.keys(tempEmail);
    this.autocomplete.tags = Object.keys(tempTags);

    const isLess = (a, b, obj) => {
      if (obj[a] < obj[b]) {
        return 1;
      }
      return -1;
    };

    this.autocomplete.email.sort((a, b) => isLess(a, b, tempEmail));
    this.autocomplete.tags.sort((a, b) => isLess(a, b, tempTags));

    this.categories = [];
    for (const item of this.autocomplete.tags) {
      this.categories.push({name: item, count: tempTags[item]});
    }
    this.autocomplete.tags.shift();
  }

  addPassword(passwordObj: Password) {
    this.myPasswords.push(passwordObj);
    this.currPasswords.push(passwordObj);
    this.setAutoComplete();
    this.save();
  }

  save() {
    // encrypt passwords for saving to local storage
    const encryptor = new PasswordEncryptionService(this.login);
    const encryptedPass = encryptor.encrypt(JSON.stringify(this.myPasswords));
    this.storage.set('passwords', encryptedPass);
  }

  removePassword(index: number) {
    this.setAutoComplete();
    this.myPasswords.splice(index, 1);
    this.save();
  }

  setFilter(cat) {
    this.filter = cat;
    this.filterPass();
  }

  filterPass(value = '') {
    this.currPasswords = this.myPasswords.filter(
      (pass) => {
        const name = pass.name.toLowerCase();
        return name.includes(value) && pass.tags.includes(this.filter);
      });
  }

  filterAc(value = '', type) {
    if (type === 'pass') {
      return this.autocomplete.password.filter(
        (item) => {
          item = item.trim();
          return item.includes(value) && item !== value;
        });
    }
    if (type === 'email') {
      return this.autocomplete.email.filter(
        (item) => {
          item = item.trim();
          return item.includes(value) && item !== value;
        });
    }
    if (type === 'tags') {
      return this.autocomplete.tags.filter(
        (item) => {
          item = item.trim();
          return item.includes(value) && item !== value;
        });
    }
  }

  loadPasswordFile(file) {
    const encryptor = new PasswordEncryptionService(this.login);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        // Decrypt passwords from file
        const decryptedRes = encryptor.decrypt(fileReader.result);
        this.myPasswords = JSON.parse(decryptedRes);
        this.setAutoComplete();
        this.filterPass();
      }
      this.save();
    };
    fileReader.readAsText(file);
  }

  savePasswordFile() {
    // Encrypt passwords and save to file
    const encryptor = new PasswordEncryptionService(this.login);
    const passwordStr = JSON.stringify(this.myPasswords);
    const encryptedPass = encryptor.encrypt(passwordStr);

    const file = new Blob([encryptedPass], {type: 'text/txt;charset=utf-8'});
    saveAs(file, 'password_export.txt');
  }


  toggleShowHidePass(pass: Password, index: number) {
    this.currPasswords[index] = {...pass, shown: !pass.shown};
  }
}
