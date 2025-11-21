import { distributeTextToSegments, concatTextNodes } from "../editText";

describe("distributeTextToSegments", () => {
    test("1 segment - entire text goes to the first segment", () => {
        const segs = ["Hello"];
        const text = "Hello again friend";

        expect(distributeTextToSegments(text, segs)).toEqual([
            "Hello again friend"
        ]);
    });

    test("2 segments - split at the second segment marker", () => {
        const segs = ["Hello", "World"];
        const text = "Hi Hello how are you World yep";

        expect(distributeTextToSegments(text, segs)).toEqual([
            "Hi Hello how are you ",
            "World yep"
        ]);
    });

    test("3 segments - split at all markers in order", () => {
        const segs = ["A", "B", "C"];
        const text = "X A Y B Z C Q";

        expect(distributeTextToSegments(text, segs)).toEqual([
            "X A Y ",
            "B Z ",
            "C Q"
        ]);
    });

    test("markers at start and end work correctly", () => {
        const segs = ["Start", "Middle", "End"];
        const text = "Start---Middle***End";

        expect(distributeTextToSegments(text, segs)).toEqual([
            "Start---",
            "Middle***",
            "End"
        ]);
    });

    test("missing segment marker - everything into segment 0, others preserved", () => {
        const segs = ["Hello", "World"];
        const text = "This does not contain World segment";

        expect(distributeTextToSegments(text, segs)).toEqual([
            "This does not contain World segment",
            "World"
        ]);
    });

    test("missing later markers in 3 segments - fallback to segment 0 only", () => {
        const segs = ["A", "B", "C"];
        const text = "A B but never C appears";

        expect(distributeTextToSegments(text, segs)).toEqual([
            "A ",
            "B but never ",
            "C appears"
        ]);
    });

    test("extra text after final marker goes to last segment", () => {
        const segs = ["A", "B"];
        const text = "something A foo B bar baz";

        expect(distributeTextToSegments(text, segs)).toEqual([
            "something A foo ",
            "B bar baz"
        ]);
    });

    test("multiple occurrences of a segment - use the first match", () => {
        const segs = ["X", "Y"];
        const text = "one X two X three Y four";

        expect(distributeTextToSegments(text, segs)).toEqual([
            "one X two X three ",
            "Y four"
        ]);
    });

    test("empty newText - segments become empty except preserved ones", () => {
        const segs = ["Hello", "World"];
        const text = "";

        expect(distributeTextToSegments(text, segs)).toEqual([]);
    });
});

describe("concatTextNodes", () => {
    test("returns empty string for empty array", () => {
        expect(concatTextNodes([])).toBe("");
    });

    test("concatenates a single text node", () => {
        const nodes = [
            { type: "text", value: "Hello" }
        ];

        expect(concatTextNodes(nodes)).toBe("Hello");
    });

    test("concatenates multiple text nodes in order", () => {
        const nodes = [
            { type: "text", value: "Hello" },
            { type: "text", value: " " },
            { type: "text", value: "World" },
        ];

        expect(concatTextNodes(nodes)).toBe("Hello World");
    });

    test("ignores element nodes completely", () => {
        const nodes = [
            { type: "text", value: "Hello" },
            { type: "element", element: "<b>ignored</b>", key: "1" },
            { type: "text", value: "World" }
        ];

        expect(concatTextNodes(nodes)).toBe("HelloWorld");
    });

    test("handles nodes with no text nodes", () => {
        const nodes = [
            { type: "element", element: "<b>a</b>", key: "a" },
            { type: "element", element: "<i>b</i>", key: "b" }
        ];

        expect(concatTextNodes(nodes)).toBe("");
    });

    test("preserves whitespace exactly as provided", () => {
        const nodes = [
            { type: "text", value: " Hi " },
            { type: "text", value: "There " },
            { type: "text", value: "  " }
        ];

        expect(concatTextNodes(nodes)).toBe(" Hi There   ");
    });

    test("ignores nested text inside element nodes", () => {
        const nodes = [
            { type: "text", value: "Hello" },
            { type: "element", element: { type: "span", children: [" world"] }, key: "x" },
            { type: "text", value: "!" }
        ];

        // only top-level text nodes count
        expect(concatTextNodes(nodes)).toBe("Hello!");
    });

    test("works with numeric text-like values and special characters", () => {
        const nodes = [
            { type: "text", value: "Count: " },
            { type: "text", value: "123" },
            { type: "text", value: "*`!" }
        ];

        expect(concatTextNodes(nodes)).toBe("Count: 123*`!");
    });
});
