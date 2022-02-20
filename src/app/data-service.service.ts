import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import * as saveAs from 'file-saver';

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
  isAuthed = false;
  myPasswords: Array<Password>;
  currPasswords: Array<Password>;
  categories: Array<Category>;
  autocomplete = {email: [], password: [], tags: []};

  constructor(private storage: Storage) {
    this.loadPasswords();
  }

  async loadPasswords() {
    const value: Array<Password> = await this.storage.get('passwords') || [];
    this.myPasswords = value;
    this.currPasswords = value;
    this.setAutoComplete();
  }

  async loadUser() {
    this.login = await this.storage.get('login') || '';
  }

  setLogin(pass) {
    this.login = pass;
    this.isAuthed = true;
    this.storage.set('login', pass);
  }

  setAutoComplete() {
    const tempPass = {};
    const tempEmail = {};
    const tempTags = {};
    for (const item of this.myPasswords) {
      if (!tempPass[item.pass]) {
        tempPass[item.pass] = 0;
      }
      tempPass[item.pass] += 1;

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
    this.autocomplete.password = Object.keys(tempPass);
    this.autocomplete.email = Object.keys(tempEmail);
    this.autocomplete.tags = Object.keys(tempTags);

    const isLess = (a, b, obj) => {
      if (obj[a] < obj[b]) {
        return 1;
      }
      return -1;
    };

    this.autocomplete.password.sort((a, b) => isLess(a, b, tempPass));
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
    this.setAutoComplete();
    this.save();
  }

  save() {
    this.storage.set('passwords', this.myPasswords);
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
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        this.myPasswords = JSON.parse(fileReader.result);
        this.setAutoComplete();
        this.filterPass();
      }
      this.save();
    };
    fileReader.readAsText(file);
  }

  savePasswordFile() {
    const file = new Blob([JSON.stringify(this.myPasswords)], {type: 'text/txt;charset=utf-8'});
    saveAs(file, 'pword.txt');
  }


  toggleShowHidePass(pass: Password, index: number) {
    this.currPasswords[index] = {...pass, shown: !pass.shown};
  }
}
