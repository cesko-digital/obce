import {
  convertCoordinatesJtskToWgs
} from "../src/ruian";

test("Project S-JTSK coordinates to WGS84 using positive coordinates.", () => {
  const locations = [
    {propose: [1057130.96, 624293.63], expect:[50.0950516, 16.0892499]}, // Borohrádek
    {propose: [984393, 662822], expect:[50.7032552, 15.4298465]}, // Jablonec nad Jizerou
  ];

  for (const obj of locations) {
    const point = convertCoordinatesJtskToWgs(obj.propose[0], obj.propose[1]);
    expect(point[0]).toBeCloseTo(obj.expect[0], 3);
    expect(point[1]).toBeCloseTo(obj.expect[1], 3);
  }
});

test("Project S-JTSK coordinates to WGS84 using negative coordinates.", () => {
  const locations = [
    {propose: [-1105152.27, -452698.70], expect:[49.8168667, 18.5347505]}, // Stonava
    {propose: [-1017745.93, -888791.65], expect:[50.1151255, 12.3506929]}, // Františkovy Lázně
  ];

  for (const obj of locations) {
    const point = convertCoordinatesJtskToWgs(obj.propose[0], obj.propose[1]);
    expect(point[0]).toBeCloseTo(obj.expect[0], 3);
    expect(point[1]).toBeCloseTo(obj.expect[1], 3);
  }
});

test("Project S-JTSK coordinates to WGS84 using mixed coordinates.", () => {
    const locations = [
        {propose: [-1046499.62, 740088.59], expect:[50.0598097, 14.4656112]}, // Prague
        {propose: [1160842.70, -597998.01], expect:[49.1944937, 16.6103813]}, // Brno
    ];

    for (const obj of locations) {
        const point = convertCoordinatesJtskToWgs(obj.propose[0], obj.propose[1]);
        expect(point[0]).toBeCloseTo(obj.expect[0], 3);
        expect(point[1]).toBeCloseTo(obj.expect[1], 3);
    }
});