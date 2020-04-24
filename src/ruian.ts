import axios from "axios";
import proj4 from "proj4";

export type WGS84Location = [number, number]

const ENDPOINT = "https://api.apitalks.store/cuzk.cz/adresni-mista-cr?";

export async function getLocation(
  addressPoint: string,
  apiKey: string
): Promise<WGS84Location | null> {
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
) : WGS84Location {
  if (X < 0) {
    X = -X;
  }
  if (Y < 0) {
    Y = -Y;
  }

  proj4.defs("EPSG:5514", 
     "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 "
   + "+k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +pm=greenwich +units=m +no_defs"
   + "+towgs84=570.8,85.7,462.8,4.998,1.587,5.261,3.56"
  );

  var point = proj4.transform(proj4.Proj("EPSG:5514"), proj4.Proj("WGS84"), proj4.toPoint([-Y, -X]));
  return [point.y, point.x] as WGS84Location;
};
