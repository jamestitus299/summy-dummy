import React, { useCallback, useEffect, useRef, useState } from "react";

import ReactCanvas from "../coreComponents/ReactCanvas";

/**
 * Manual/visual verification harness for the loading overlay.
 *
 * The overlay's window is normally a single macrotask -- a few milliseconds --
 * which is too short to judge by eye. So this samples the DOM once per frame
 * (requestAnimationFrame ~= one frame boundary) and reports how many frames
 * `#react-code-loader` was actually present for, alongside how long the run
 * took. "Present for >= 1 frame" is the real question: it means the browser
 * had a committed overlay to paint.
 *
 * The SLOW case makes it visible to the naked eye too: the loader is committed
 * and painted BEFORE evaluation begins, so a blocking loop in the code keeps
 * the overlay on screen for the whole block.
 */

const CASES = {
    fast: {
        label: "Fast code",
        expectLoader: true,
        note: "Normal component. Loader should appear for at least one frame.",
        code: `export default function Fast() {
  return <div style={{ padding: 24, fontFamily: 'system-ui' }}>rendered fast</div>;
}`,
    },
    slow: {
        label: "Slow code (1.5s block)",
        expectLoader: true,
        note: "Blocks the main thread during evaluation. The overlay is painted first, so you should SEE it for ~1.5s.",
        code: `const until = Date.now() + 1500;
while (Date.now() < until) {} // deliberately synchronous

export default function Slow() {
  return <div style={{ padding: 24, fontFamily: 'system-ui' }}>rendered after blocking 1.5s</div>;
}`,
    },
    broken: {
        label: "Broken code",
        expectLoader: true,
        note: "Loader shows, then yields to the error toast (an error is a resolved outcome).",
        code: `export default function Broken( {`,
    },
    nothing: {
        label: "Renders nothing",
        expectLoader: true,
        note: "Valid JS that never renders. Loader shows, then the 'did not render anything' error replaces it.",
        code: `const unused = 1;`,
    },
    empty: {
        label: "Empty code",
        expectLoader: false,
        note: "Empty code renders nothing at all -- no output and no loader.",
        code: ``,
    },
    noLoader: {
        label: "showLoader={false}",
        expectLoader: false,
        note: "Opted out: fully synchronous, output present in the first commit, loader never mounts.",
        code: `export default function NoLoader() {
  return <div style={{ padding: 24, fontFamily: 'system-ui' }}>no loader requested</div>;
}`,
        showLoader: false,
    },
} as const;

type CaseKey = keyof typeof CASES;

type Result = {
    loaderFrames: number;
    totalFrames: number;
    ms: number;
    sawContentOrError: boolean;
};

export const SSpinnerCheck: React.FC = () => {
    const [caseKey, setCaseKey] = useState<CaseKey>("fast");
    // Bumping `runId` remounts the canvas, which is what re-arms the deferral.
    const [runId, setRunId] = useState(0);
    const [result, setResult] = useState<Result | null>(null);
    const hostRef = useRef<HTMLDivElement>(null);

    const active = CASES[caseKey];
    const showLoader = (active as { showLoader?: boolean }).showLoader;

    const run = useCallback(() => {
        setResult(null);
        setRunId((n) => n + 1);
    }, []);

    // Sample once per frame until output/error appears, then report.
    useEffect(() => {
        if (runId === 0) return;

        let cancelled = false;
        let loaderFrames = 0;
        let totalFrames = 0;
        const started = performance.now();

        const sample = () => {
            if (cancelled) return;
            const host = hostRef.current;
            if (!host) return;

            totalFrames += 1;
            if (host.querySelector("#react-code-loader")) loaderFrames += 1;

            const settled =
                !!host.querySelector("#react-code-error") ||
                (host.querySelector("#react-code-canvas")?.children.length ?? 0) > 0;

            // Keep sampling a few frames past settling so a late loader would show up.
            if ((settled && totalFrames > 3) || performance.now() - started > 5000) {
                setResult({
                    loaderFrames,
                    totalFrames,
                    ms: Math.round(performance.now() - started),
                    sawContentOrError: settled,
                });
                return;
            }
            requestAnimationFrame(sample);
        };

        requestAnimationFrame(sample);
        return () => {
            cancelled = true;
        };
    }, [runId]);

    const verdict =
        result === null
            ? null
            : active.expectLoader
                ? result.loaderFrames > 0
                : result.loaderFrames === 0;

    return (
        <div style={{ padding: 24, fontFamily: "system-ui, sans-serif", maxWidth: 900 }}>
            <h2 style={{ marginTop: 0 }}>Loading overlay check</h2>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {(Object.keys(CASES) as CaseKey[]).map((key) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => {
                            setCaseKey(key);
                            setResult(null);
                            setRunId(0);
                        }}
                        style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            cursor: "pointer",
                            border: `1px solid ${key === caseKey ? "#2563eb" : "#d4d4d8"}`,
                            background: key === caseKey ? "#eff6ff" : "#fff",
                            fontWeight: key === caseKey ? 600 : 400,
                        }}
                    >
                        {CASES[key].label}
                    </button>
                ))}
            </div>

            <p style={{ fontSize: 13, color: "#52525b", margin: "0 0 12px" }}>{active.note}</p>

            <button
                type="button"
                onClick={run}
                style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                }}
            >
                {runId === 0 ? "Mount canvas & measure" : "Re-run"}
            </button>

            {result && (
                <div
                    style={{
                        marginTop: 16,
                        padding: "12px 14px",
                        borderRadius: 8,
                        border: `1px solid ${verdict ? "#86efac" : "#fca5a5"}`,
                        background: verdict ? "#f0fdf4" : "#fef2f2",
                        fontSize: 14,
                    }}
                >
                    <strong style={{ color: verdict ? "#166534" : "#991b1b" }}>
                        {verdict ? "PASS" : "FAIL"}
                    </strong>{" "}
                    — loader present for <strong>{result.loaderFrames}</strong> of{" "}
                    {result.totalFrames} sampled frames, settled in {result.ms}ms.
                    <div style={{ marginTop: 4, color: "#52525b", fontSize: 13 }}>
                        expected: {active.expectLoader ? "at least 1 loader frame" : "no loader frames"}
                        {!result.sawContentOrError && " — warning: never settled (timed out)"}
                    </div>
                </div>
            )}

            <div
                ref={hostRef}
                style={{
                    marginTop: 16,
                    minHeight: 160,
                    border: "1px solid #e4e4e7",
                    borderRadius: 8,
                    overflow: "hidden",
                }}
            >
                {runId > 0 && (
                    <ReactCanvas
                        key={`${caseKey}-${runId}`}
                        code={active.code}
                        showError
                        {...(showLoader === false ? { showLoader: false } : {})}
                    />
                )}
            </div>
        </div>
    );
};
