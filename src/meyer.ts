import { writeFileSync, readFileSync } from "fs";
import { normalizeTitleCase } from './naming'
import { isObject } from "util";

//FIX: Very experimental file without any proper checking, just to prove concept.

function loadDataSourceMayor() {
    try {
        const encoded = readFileSync(`./.data/ovm.json`).toString();
        return JSON.parse(encoded);
    } catch {
        console.warn("Missing or corrupted 'ovm.json' file!");
        return [];
    }
}

const properName = (name : string | null) => {
    if (name == null) return null;
    return normalizeTitleCase(name); //???: Borrowing function for different purpose, but it works.
}

export function mapMeyersTestable(
    datasource : any
) {
    const dataset = datasource["položky"];
    if (dataset == null) {
        return [];
    }
    const municipalities = dataset.filter((obj : any) => obj["právní-forma"] === "právní-forma/801");

    return municipalities.map((obj : any) => {
        return {
            ico: obj["ičo"],
            meyer: obj["osoba-v-čele"] ? obj["osoba-v-čele"].map((m : any) => properName(m["jméno"])).join(', ') : null
        }
    });
}

export function findMeyerTestable(
    ico : string | null,
    datasource: Array<Object>
): string | null {
    if (ico == null) 
        return null;
    
    if (!datasource.length) {
        console.warn("Missing or corrupted Meyer metadata source!");
        return null;
    }

    const mayer = datasource.find((m : any) => m.ico === ico) as any;
    if (!isObject(mayer))
        return null;

    return (mayer['meyer']) as string | null;
}

const mayors = mapMeyersTestable(loadDataSourceMayor());
export function findMayer(
    ico : string | null
): string | null {
    return findMeyerTestable(ico, mayors);
}