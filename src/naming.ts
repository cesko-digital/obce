/**
 * Strip the “kind” prefix from a municipality name
 *
 * Ie. “Město Boskovice” -> “Boskovice”
 */
export function simplifiedSubjectName(name: string): string {
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

/**
 * Normalize municipality name by stripping official prefix and fixing case.
 *
 * This is just a combination of `stripOfficialNamePrefix` and `normalizeTitleCase`.
 */
export function normalizeMunicipalityName(name: string): string {
  return normalizeTitleCase(stripOfficialNamePrefix(name));
}

/**
 * Strip the official name prefix such as “obec” or “městská část” from a municipality name.
 *
 * Also strips any whitespace after the prefix, ignores case when matching, does not touch anything else.
 */
export function stripOfficialNamePrefix(name: string): string {
  const prefixes = [
    "obec",
    "město",
    "městys",
    "městská část",
    "městský obvod",
    "statutární město"
  ];
  const patterns = prefixes.map(p => RegExp(`^${p}\\s*`, "i"));
  patterns.forEach(p => (name = name.replace(p, "")));
  return name;
}

/**
 * Normalize case and hyphens in municipality name
 *
 * The rules around hyphen (spojovník / rozdělovník) vs. hyphens (pomlčka):
 *
 * > Spojovník se píše k vyznačení těsného spojení v místních jménech a v názvech
 * správních oblastí, např. Brno-Slatina, Frýdek-Místek, Garmisch-Partenkirchen,
 * Praha-Hlubočepy, Bohumín-sever, Ostrava-město, Praha-západ. Pokud je alespoň
 * jedna ze složek víceslovná, lze z důvodu přehlednosti nahradit spojovník
 * pomlčkou oddělenou mezerami, tedy např. Praha 6 – Ruzyně, Liberec VII – Horní
 * Růžodol, Karlovy Vary – Drahovice, Brno – Královo Pole (viz Pomlčka).
 */
export function normalizeTitleCase(name: string): string {
  // The parts of the name separated by hyphens
  const parts = name.split(/\s*-\s*/);
  if (parts.length > 2) {
    console.warn(
      `Multiple hyphens in municipality name: ${name}, are we handling this case correctly?`
    );
  }

  var separator = "-"; // plain hyphen
  var out: string[] = [];
  for (const part of parts) {
    const words = part.split(/\s+/);
    out.push(words.map(titleCaseWord).join(" "));
    // Multi-word name parts should be separated by a dash
    if (words.length > 1) {
      separator = " – "; // en dash
    }
  }

  return out.join(separator);
}

function titleCaseWord(word: string): string {
  const prepositions = ["v", "nad", "pod", "u", "na", "při", "mezi", "a"];
  const exceptions = ["horách", "lesy", "horou"];

  const keepLowercase = (s: string) =>
    prepositions.indexOf(s) != -1 || exceptions.indexOf(s) != -1;

  const upperCaseFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const transformCase = (s: string) => {
    s = s.toLowerCase();
    if (s === "" || keepLowercase(s)) {
      return s;
    } else {
      return upperCaseFirst(s);
    }
  };

  return transformCase(word);
}
