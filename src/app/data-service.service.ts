import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

export interface Password {
  name: string;
  email: string;
  pass: string;
  notes: string;
  tags: Array<string>;
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
  myPasswords: Array<Password>;
  currPasswords: Array<Password>;
  categories: Array<Category>;
  autocomplete = {email: [], password: [], tags: []};

  constructor(private storage: Storage) {
    this.loadPasswords();
  }

  async loadPasswords() {
    if (this.myPasswords) {
      return this.myPasswords;
    }
    const value: Array<Password> = await this.storage.get('passwords') || [];
    this.myPasswords = value;
    this.currPasswords = value;
    this.setAutoComplete();
    return value;
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

    console.log(this.autocomplete);
    console.log(tempPass);
    console.log(tempEmail);
    console.log(tempTags);
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
    this.filter = cat.name;
    const newPass: Array<Password> = [];
    for (const pass of this.myPasswords) {
      if (pass.tags.indexOf(cat.name)) {
        newPass.push(pass);
      }
    }
    this.currPasswords = newPass;
  }
}
