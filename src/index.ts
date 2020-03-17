import { getEDeskyID } from "./edesky";
import { getLocation } from "./ruian";
import { guessMunicipalityCOA } from "./coa";
import { DataSource, addExtraData } from "./sources";
import { parseXml } from "libxmljs";
import { parseAllValidSubjects } from "./parsing";
import { readFileSync, writeFileSync } from "fs";
import { Subjekt } from "./types";

/** A simple response envelope with basic metadata */
interface Envelope {
  /**
   * When was the data generated?
   *
   * A simplified extended ISO format (ISO 8601) as created by `Date.toISOString`.
   */
  timestamp: string;

  /** Number of results returned in `municipalities` */
  itemCount: Number;

  /** The data itself */
  municipalities: Subjekt[];
}

function simplifiedSubjectName(name: string): string {
  const prefixes = [
    /obec\s*/i,
    /město\s*/i,
    /statutární město\s*/i,
    /městys\s*/i
  ];
  for (const pattern of prefixes) {
    name = name.replace(pattern, "");
  }
  return name;
}

function parseItemLimit(
  str: string | undefined,
  defaultV: number = Number.MAX_VALUE
): number {
  if (str != null) {
    const val = parseInt(str);
    return isNaN(val) ? defaultV : val;
  } else {
    return defaultV;
  }
}

function isInterestingSubject(s: Subjekt): boolean {
  return s.pravniForma.type === 801 || s.pravniForma.type === 811;
}

async function convertData(
  dataSources: DataSource<any>[],
  inputName: string,
  outputName: string = "obce.json"
) {
  console.info(`Parsing ${inputName}, this can take a while.`);
  const doc = parseXml(readFileSync(inputName).toString());
  const subjects = parseAllValidSubjects(doc).filter(isInterestingSubject);
  const limit = parseItemLimit(process.env["LIMIT"]);
  if (limit != Number.MAX_VALUE) {
    console.log(`Limiting data to a subset of ${limit} items as requested.`);
  }
  console.info(`Parsed ${subjects.length} items, downloading extra data.`);
  const data = await addExtraData(subjects.slice(0, limit), dataSources);
  const envelope: Envelope = {
    timestamp: new Date().toISOString(),
    itemCount: data.length,
    municipalities: data
  };
  writeFileSync(outputName, JSON.stringify(envelope, null, 2));
  console.info(`Output written to ${outputName}.`);
}

function envOrDie(key: string): string {
  const val = process.env[key];
  if (val == null) {
    throw `Please define the ${key} env variable.`;
  }
  return val;
}

const RUIAN_API_KEY = envOrDie("RUIAN_API_KEY");

const dataSources: DataSource<any>[] = [
  {
    id: "souradnice",
    fetch: async s => {
      const addressPoint = s.adresaUradu?.adresniBod;
      return addressPoint != null
        ? await getLocation(addressPoint, RUIAN_API_KEY)
        : Promise.resolve(null);
    }
  },
  {
    id: "eDeskyID",
    fetch: async s => getEDeskyID(simplifiedSubjectName(s.nazev))
  },
  {
    id: "erb",
    fetch: async s => guessMunicipalityCOA(simplifiedSubjectName(s.nazev))
  }
];

convertData(dataSources, "all.xml");
