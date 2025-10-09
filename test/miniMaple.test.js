import { MiniMaple } from "../src/miniMaple";

test('base test', () => {

    const miniMaple = new MiniMaple()

    expect(miniMaple.differentiate("4x^2+2x^2, x")).toEqual(
        "12*x"
    )
});

test('error test 1', () => {

    const miniMaple = new MiniMaple()

    expect(miniMaple.differentiate("4x^2+2x^2")).toEqual(
        'Формат: "выражение, переменная"'
    )
});

test('different powers test', () => {

    const miniMaple = new MiniMaple()

    expect(miniMaple.differentiate("4x^2+3x^5, x")).toEqual(
        '15*x^4 + 8*x'
    )
});

test('another char test', () => {

    const miniMaple = new MiniMaple()

    expect(miniMaple.differentiate("4x^2+3x^5, y")).toEqual(
        '0'
    )
});

test('many chars test', () => {

    const miniMaple = new MiniMaple()

    expect(miniMaple.differentiate("4x^2+3x^5+7y^2+6y^5, y")).toEqual(
        '30*y^4 + 14*y'
    )
});

test('error test 2', () => {

    const miniMaple = new MiniMaple()

    expect(miniMaple.differentiate("4x^2+3x^5+7y^2+6y^5, yt")).toEqual(
        'Переменная должна быть одной буквой'
    )
});

test('error test 3', () => {

    const miniMaple = new MiniMaple()

    expect(miniMaple.differentiate("4x^2+3x^5/7y^2+6y^5, y")).toEqual(
        'Недопустимые символы в выражении'
    )
});

test('error test 4', () => {

    const miniMaple = new MiniMaple()

    expect(miniMaple.differentiate("")).toEqual(
        'Пустой ввод'
    )
});