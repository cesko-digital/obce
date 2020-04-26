import { findMayerTestable, mapMayersTestable } from '../src/mayer'
import { readFileSync } from 'fs';

const parsedFixtureDatasource = (name: string) => {
    const encoded =readFileSync(`tests/fixtures/${name}`).toString()
    return mapMayersTestable(JSON.parse(encoded));
};

test("Test parsing of the known Meyer", () => {
    expect(findMayerTestable("00637157", parsedFixtureDatasource('ovm.test.json'))).toBe('Jan Máca');
});

test("Test parsing missing Mayer", () => {
    expect(findMayerTestable("00295833", parsedFixtureDatasource('ovm.test.json'))).toBe(null);
});

test("Test parsing with missing datasource", () => {
    const consoleSpy = jest.spyOn(console, 'warn');
    findMayerTestable("0", []);
    expect(consoleSpy).toHaveBeenCalledWith('Missing or corrupted Meyer metadata source!');
});