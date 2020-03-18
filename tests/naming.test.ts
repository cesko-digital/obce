import {
  normalizeTitleCase,
  stripOfficialNamePrefix,
  normalizeMunicipalityName
} from "../src/naming";

test("Normalize city name case", () => {
  expect(normalizeTitleCase("PEC POD SNĚŽKOU")).toBe("Pec pod Sněžkou");
  expect(normalizeTitleCase("KLÁŠTEREC NAD OHŘÍ")).toBe("Klášterec nad Ohří");
  expect(normalizeTitleCase("ROKYTNICE V ORLICKÝCH HORÁCH")).toBe(
    "Rokytnice v Orlických horách"
  );
  expect(normalizeTitleCase("KOSTELEC NAD ČERNÝMI LESY")).toBe(
    "Kostelec nad Černými lesy"
  );
  expect(normalizeTitleCase("ŽĎÁR NAD SÁZAVOU")).toBe("Žďár nad Sázavou");
  expect(normalizeTitleCase("FRYŠAVA POD ŽÁKOVOU HOROU")).toBe(
    "Fryšava pod Žákovou horou"
  );
  expect(normalizeTitleCase("PRAHA-ÚJEZD")).toBe("Praha-Újezd");
  expect(normalizeTitleCase("BRŤOV - JENEČ")).toBe("Brťov-Jeneč");
});

test("Strip official city name prefix", () => {
  expect(stripOfficialNamePrefix("MĚSTO HRONOV")).toBe("HRONOV");
  expect(stripOfficialNamePrefix("MĚSTYS Tištín")).toBe("Tištín");
  expect(stripOfficialNamePrefix("STATUTÁRNÍ MĚSTO LIBEREC")).toBe("LIBEREC");
});

test("Normalize municipality name", () => {
  expect(normalizeMunicipalityName("STATUTÁRNÍ MĚSTO LIBEREC")).toBe("Liberec");
  expect(normalizeMunicipalityName("Statutární město Frýdek-Místek")).toBe(
    "Frýdek-Místek"
  );
  expect(
    normalizeMunicipalityName("Městská část Brno Řečkovice a Mokrá Hora")
  ).toBe("Brno Řečkovice a Mokrá Hora");
  expect(normalizeMunicipalityName("MĚSTO SVOBODA NAD ÚPOU")).toBe(
    "Svoboda nad Úpou"
  );
});

test("Proper en-dash handling in multi-word names", () => {
  expect(normalizeMunicipalityName("Karlovy Vary-Drahovice")).toBe(
    "Karlovy Vary – Drahovice"
  );
  expect(normalizeMunicipalityName("Brandýs nad Labem-Stará Boleslav")).toBe(
    "Brandýs nad Labem – Stará Boleslav"
  );
});
