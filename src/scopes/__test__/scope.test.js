import { scope } from "../Scope";

// Test Scope
describe("scope object", () => {
    test("contains React and hooks", () => {
        expect(scope.React).toBeDefined();
        expect(scope.useState).toBeDefined();
        expect(scope.useEffect).toBeDefined();
        expect(scope.useContext).toBeDefined();
        expect(scope.useReducer).toBeDefined();
        expect(scope.useRef).toBeDefined();
        expect(scope.useMemo).toBeDefined();
        expect(scope.useCallback).toBeDefined();
    });

    test("contains motion and motion hooks/components", () => {
        expect(scope.motion).toBeDefined();
        expect(scope.useAnimate).toBeDefined();
        expect(scope.useScroll).toBeDefined();
        expect(scope.LazyMotion).toBeDefined();
        expect(scope.useReducedMotion).toBeDefined();
    });

    test("contains recharts components", () => {
        expect(scope.AreaChart).toBeDefined();
        expect(scope.ResponsiveContainer).toBeDefined();
        expect(scope.CartesianGrid).toBeDefined();
        expect(scope.LineChart).toBeDefined();
        expect(scope.XAxis).toBeDefined();
    });

    test("contains lucid react components", () => {
        expect(scope.Camera).toBeDefined();
        expect(scope.StarHalf).toBeDefined();
        expect(scope.Smile).toBeDefined();
        expect(scope.Landmark).toBeDefined();
        expect(scope.House).toBeDefined();
    });

    // Fa icons are available, but only through the lazy scope -- referencing one
    // fetches the pack (~424KB gzipped) on demand. This eager scope must stay
    // free of them, or every consumer pays that cost whether they use it or not.
    test("does NOT contain react-icons/fa components", () => {
        expect(scope.FaBeer).toBeUndefined();
        expect(scope.FaHeart).toBeUndefined();
        expect(Object.keys(scope).filter((k) => /^Fa[A-Z0-9]/.test(k))).toHaveLength(0);
    });

    test("contains EditableText custom components", () => {
        expect(scope.EditableText).toBeDefined();
    });

    test("contains Helmet-async", () => {
        expect(scope.Helmet).toBeDefined();
        expect(scope.HelmetProvider).toBeDefined();
    });

});
