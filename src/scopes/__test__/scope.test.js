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

    test("contains lucid react-icons/fa components", () => {
        expect(scope.FaBeer).toBeDefined();
        expect(scope.FaHeart).toBeDefined();
    });

    test("contains EditableText custom components", () => {
        expect(scope.EditableText).toBeDefined();
    });

    test("contains Helmet-async", () => {
        expect(scope.Helmet).toBeDefined();
        expect(scope.HelmetProvider).toBeDefined();
    });

});
