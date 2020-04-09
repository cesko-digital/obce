import axios from "axios";
import proj4 from "proj4";

export type WGS84 = { _type: "WGS84" };
export type S_JTSK = { _type: "S-JTSK" };
export type CoordinateSystem = WGS84 | S_JTSK;
export type Location<T extends CoordinateSystem> = [number, number] & T;

const ENDPOINT = "https://api.apitalks.store/cuzk.cz/adresni-mista-cr?";

export async function getLocation(
  addressPoint: string,
  apiKey: string
): Promise<Location<WGS84> | null> {
  const response = await axios.get(ENDPOINT, {
    headers: {
      "x-api-key": apiKey
    },
    params: {
      filter: `{"where":{"KOD_ADM": ${addressPoint}}}`
    }
  });

  const items = response.data.data;

  if (Array.isArray(items) && items.length > 0) {
    const x = parseFloat(items[0].SOURADNICE_X);
    const y = parseFloat(items[0].SOURADNICE_Y);
    if (x != null && y != null) {
      return convertCoordinatesJtskToWgs(x, y);
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export function convertCoordinatesJtskToWgs(
  X: number,
  Y: number
) : Location<WGS84> {
  const epsg = {
    5514: '+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=572.213,85.334,461.94,-4.9732,-1.529,-5.2484,3.5378 +units=m +no_defs',
    4326: '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees',
  };

  if (X < 0) {
    X = -X;
  }
  if (Y < 0) {
    Y = -Y;
  }

  return proj4(epsg[5514], epsg[4326]).forward([-X, -Y]) as Location<WGS84>
};