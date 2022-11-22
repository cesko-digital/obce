import axios from "axios"

const ENDPOINT = (query: string) => `https://query.wikidata.org/sparql?query=${query}`

export async function getDistrict(ico: string): Promise<string | null> {

    // The query: https://w.wiki/Yxv
    const query = `SELECT%20%3FdistrictLabel%20WHERE%20%7B%0A%20%20%0A%20%20%20%20OPTIONAL%20%7B%0A%20%20%20%20%23%20Select%20Municipalites%20with%20propper%20R%C3%9AIAN%0A%20%20%20%20%7B%20%3Fitem%20wdt%3AP31%20wd%3AQ5153359%3B%20wdt%3AP7606%20%3Flua%3B%20%20.%20%7D%20%20%0A%20%20%20%20UNION%0A%20%20%20%20%23%20as%20some%20of%20them%20don%27t%20have%20it%2C%20select%20Municipalities%20with%20Czech%20LUA%20(NUTS4)%0A%20%20%20%20%23%20!!!%20beware%20that%20in%20some%20cases%20data%20marked%20as%20LUA%20are%20districts%0A%20%20%20%20%23%20%20%3D%3E%20select%20only%20LUA%20with%20length%20greater%20then%20RUIAN%20(%22CZxxxxxx%22)%0A%20%20%20%20%7B%20%3Fitem%20wdt%3AP31%20wd%3AQ5153359%3B%20wdt%3AP782%20%3Flua%20.%20FILTER%20(STRLEN(STR(%3Flua))%20%3E%206)%20%7D%0A%20%20%7D%0A%0A%20%20%3Fitem%20wdt%3AP131%20%3Fdistrict.%0A%20%20%3Fitem%20wdt%3AP373%20%3Fname.%0A%20%20%3Fitem%20wdt%3AP4156%20%3Fico.%0A%20%20%0A%20%20%20SERVICE%20wikibase%3Alabel%20%7B%0A%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22cs%22.%0A%20%20%20%20%3Fdistrict%20%20rdfs%3Alabel%20%3FdistrictLabel.%0A%20%20%7D%0A%20%20%0A%20%20FILTER%20(%3Fico%20%3D%20%22${ico}%22)%0A%20%20%0A%20%20%7D%0A`
    try {
        const res = await axios.get(ENDPOINT(query))
        // Sometimes 2 (or more) districts are returned: "okres XXX" and "obvod obce s rozšířenou působností XXX".
        // We only care about the first one.
        const districts = res.data.results.bindings.map((b: any) => b.districtLabel.value)
                .filter((d: string) => d.startsWith("okres"))
                .map((d: string) => d.replace("okres ", ""))

        // returning districts[0] outright could return undefined
        return districts.length > 0 ? districts[0] : null 
    } catch(error) {
        console.log(`(${error}) Failed to obtain district for ICO ${ico}.`)
        return null
    } 

} 