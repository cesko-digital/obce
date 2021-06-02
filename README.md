# České obce

Strojově čitelný seznam všech českých obcí se základními metadaty (IČO, název, zeměpisné souřadnice, …).

Základní data pochází ze [seznamu orgánů veřejné moci](https://www.czechpoint.cz/public/vyvojari/otevrena-data/) od projektu Czech Point ([jeho dokumentace](https://www.czechpoint.cz/data/files/SOVM_datove_soubory.pdf)). Dodatečná data:

* ID elektronické úřední desky ze systému [edesky.cz](https://edesky.cz). Detekce je zatím velmi hloupá, potřebuje zlepšit (pull requesty vítány!).
* Zeměpisné souřadnice z [RÚIAN](https://www.cuzk.cz/Uvod/Produkty-a-sluzby/RUIAN/RUIAN.aspx) (načítáme přes [api.store](https://www.api.store/cuzk.cz/)).
* Erb obce načítaný velmi chabou heuristikou z Wikipedie, potřebuje zlepšit (viz [#12](https://github.com/cesko-digital/obce/issues/12)).
* Okres obce, načítaný přes WikiData (viz [#30](https://github.com/cesko-digital/obce/issues/30))

Wishlist:

* [Běžný název obce pro zobrazení uživateli](https://github.com/cesko-digital/obce/issues/14)
* [„Váha“ obce, například pro vyhledávání](https://github.com/cesko-digital/obce/issues/13)

## Příklad

```json
{
  "erb": "https://commons.wikimedia.org/wiki/File:N%C3%A1chod_CoA_CZ.svg",
  "eDeskyID": "43",
  "souradnice": [
    50.41632706234231,
    16.163860651213163
  ],
  "zkratka": "NACHOD",
  "ICO": "00272868",
  "nazev": "MĚSTO NÁCHOD",
  "hezkyNazev": "Náchod",
  "datovaSchrankaID": "gmtbqhx",
  "pravniForma": {
    "type": 801,
    "label": "Obec"
  },
  "mail": [
    "podatelna@mestonachod.cz"
  ],
  "adresaUradu": {
    "ulice": "Masarykovo náměstí",
    "cisloDomovni": "40",
    "cisloOrientacni": null,
    "obec": "Náchod",
    "obecKod": "573868",
    "PSC": "54701",
    "castObce": "Náchod",
    "kraj": "Královéhradecký",
    "adresniBod": "7440171"
  }
}
```

Rádi bychom místo příkladu dodali dokumentované schéma, proti kterému bude výstup validovaný, viz [#9](https://github.com/cesko-digital/obce/issues/9).

## Dost řečí, kde jsou data?

https://data.cesko.digital/obce/1/obce.json

Číslo `1` v URL značí hlavní komponentu verze, která se bude zvedat, pokud dojde ke zpětně nekompatibilním změnám ([semver](https://semver.org)).

Aktualizace probíhá jednou týdně v noci ze soboty na neděli.

## Hacking

* Větev `master` je release větev, každá změna v ní vede k přegenerování celého datasetu. Což trvá dlouho a nechceme to dělat často.
* Proto jde většina běžné práce do větve `next` a do `master` se merguje občas.
* Pro lokální testování budete potřebovat API klíč od [api.store](https://www.api.store/cuzk.cz/).
* Verzování releasů: x.y.z, kde _x_ se mění při zpětně nekompatibilních změnách, _y_ při zpětně kompatibilních změnách a _z_ tam, kde jsme neměnili formát dat, jen kód pro jejich generování.
* Kdybyste chtěli přispět (budeme moc rádi!), tak zdrojový kód a commity anglicky, všecko ostatní může být česky.

```bash
$ wget -O all.xml.gz 'https://www.czechpoint.cz/spravadat/ovm/datafile.do?format=xml&service=seznamovm'
$ gunzip all.xml.gz
$ yarn install
$ yarn test
$ RUIAN_API_KEY=… LIMIT=10 yarn start
```

## Licencování

Kód je licencovaný pod MIT licencí, data zatím nevíme, viz [#5](https://github.com/cesko-digital/obce/issues/5).
