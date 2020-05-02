import { findMeyerTestable, mapMeyersTestable } from '../src/meyer'
import { readFileSync } from 'fs';

const parsedFixtureDatasource = (name: string) => {
    const encoded =readFileSync(`tests/fixtures/${name}`).toString()
    return mapMeyersTestable(JSON.parse(encoded));
};

test("Test parsing of the known Meyer", () => {
    expect(findMeyerTestable("00637157", parsedFixtureDatasource('ovm.test.json'))).toBe('Jan Máca');
});

test("Test parsing missing Mayer", () => {
    expect(findMeyerTestable("00295833", parsedFixtureDatasource('ovm.test.json'))).toBe(null);
});

test("Test parsing with missing datasource", () => {
    const consoleSpy = jest.spyOn(console, 'warn');
    findMeyerTestable("0", []);
    expect(consoleSpy).toHaveBeenCalledWith('Missing or corrupted Meyer metadata source!');
});