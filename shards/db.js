const { LocalStorage } = require('node-localstorage');

const dbA = new LocalStorage('data-m-z');
const dbB = new LocalStorage('data-n-z');

const whichDB = name => (name.match(/^[A-M]|^[a-m]/) ? dbA : dbB);

const loadCats = db => JSON.parse(db.getItem('cats') || '[]');

const hasCat = name =>
  loadCats(whichDB(name))
    .map(cat => cat.name)
    .includes(name);

module.exports = {
  addCat(newCat) {
    if (!hasCat(newCat.name)) {
      let cats = loadCats(whichDB(newCat.name));
      cats.push(newCat);
      whichDB(newCat.name).setItem('cats', JSON.stringify(cats, null, 2));
    }
  },

  findCatByName(name) {
    let cats = loadCats(whichDB(name));
    return cats.find(cat => cat.name === name);
  },

  findCatsByColor(color) {
    return [...loadCats(dbA).filter(cat => cat.color === color), ...loadCats(dbB).filter(cat => cat.color === color)];
  }
};
