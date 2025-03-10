import { Treemap, Legend, Tooltip, Label, LabelList, Customized, Area, Bar, Line, Scatter, XAxis, YAxis, ZAxis, Brush, CartesianAxis, CartesianGrid, ReferenceLine, ReferenceDot, ReferenceArea, ErrorBar, Funnel, Pie, Radar, RadialBar, PolarAngleAxis, PolarRadiusAxis } from "recharts";
export declare const rechartsScope: {
    AreaChart: import("react").ForwardRefExoticComponent<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps & import("react").RefAttributes<{
        readonly eventEmitterSymbol: Symbol;
        clipPathId: string;
        accessibilityManager: import("recharts/types/chart/AccessibilityManager").AccessibilityManager;
        throttleTriggeredAfterMouseMove: import("lodash").DebouncedFunc<(e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any>;
        container?: HTMLElement;
        componentDidMount(): void;
        displayDefaultTooltip(): void;
        getSnapshotBeforeUpdate(prevProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>): null;
        componentDidUpdate(prevProps: import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps): void;
        componentWillUnmount(): void;
        getTooltipEventType(): import("recharts/types/util/types").TooltipEventType;
        getMouseInfo(event: import("recharts/types/chart/generateCategoricalChart").MousePointer): {
            xValue: any;
            yValue: any;
            chartX: number;
            chartY: number;
        } | {
            activeTooltipIndex: number;
            activeLabel: any;
            activePayload: any[];
            activeCoordinate: import("recharts/types/util/types").ChartCoordinate;
            chartX: number;
            chartY: number;
        };
        inRange(x: number, y: number, scale?: number): any;
        parseEventsOfWrapper(): any;
        addListener(): void;
        removeListener(): void;
        handleLegendBBoxUpdate: (box: DOMRect) => void;
        handleReceiveSyncEvent: (cId: string | number, data: import("recharts/types/chart/types").CategoricalChartState, emitter: Symbol) => void;
        handleBrushChange: ({ startIndex, endIndex }: {
            startIndex: number;
            endIndex: number;
        }) => void;
        handleMouseEnter: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggeredAfterMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any;
        handleItemMouseEnter: (el: any) => void;
        handleItemMouseLeave: () => void;
        handleMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer & Partial<Omit<import("react").MouseEvent<Element, MouseEvent>, keyof import("recharts/types/chart/generateCategoricalChart").MousePointer>>) => void;
        handleMouseLeave: (e: any) => void;
        handleOuterEvent: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").TouchEvent<Element>) => void;
        handleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleMouseDown: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleMouseUp: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleTouchMove: (e: import("react").TouchEvent<Element>) => void;
        handleTouchStart: (e: import("react").TouchEvent<Element>) => void;
        handleTouchEnd: (e: import("react").TouchEvent<Element>) => void;
        handleDoubleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleContextMenu: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggerSyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        applySyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        filterFormatItem(item: any, displayName: any, childIndex: any): any;
        renderCursor: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
        renderPolarAxis: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderPolarGrid: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderLegend: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderTooltip: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderBrush: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderReferenceElement: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderActivePoints: ({ item, activePoint, basePoint, childIndex, isRange }: any) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>[];
        renderGraphicChild: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
        renderCustomized: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderClipPath(): import("react").JSX.Element;
        getXScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getYScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getXScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getYScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getItemByXY(chartXY: {
            x: number;
            y: number;
        }): {
            graphicalItem: any;
            payload: any;
        };
        renderMap: {
            CartesianGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            ReferenceArea: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceLine: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceDot: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            XAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            YAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Brush: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            Bar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Line: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Area: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Radar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            RadialBar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Scatter: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Pie: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Funnel: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Tooltip: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
                once: boolean;
            };
            PolarGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            PolarAngleAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            PolarRadiusAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Customized: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
        };
        render(): import("react").JSX.Element;
        context: unknown;
        setState<K extends keyof import("recharts/types/chart/types").CategoricalChartState>(state: import("recharts/types/chart/types").CategoricalChartState | ((prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>) => import("recharts/types/chart/types").CategoricalChartState | Pick<import("recharts/types/chart/types").CategoricalChartState, K>) | Pick<import("recharts/types/chart/types").CategoricalChartState, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>;
        state: Readonly<import("recharts/types/chart/types").CategoricalChartState>;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
    }>>;
    BarChart: import("react").ForwardRefExoticComponent<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps & import("react").RefAttributes<{
        readonly eventEmitterSymbol: Symbol;
        clipPathId: string;
        accessibilityManager: import("recharts/types/chart/AccessibilityManager").AccessibilityManager;
        throttleTriggeredAfterMouseMove: import("lodash").DebouncedFunc<(e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any>;
        container?: HTMLElement;
        componentDidMount(): void;
        displayDefaultTooltip(): void;
        getSnapshotBeforeUpdate(prevProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>): null;
        componentDidUpdate(prevProps: import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps): void;
        componentWillUnmount(): void;
        getTooltipEventType(): import("recharts/types/util/types").TooltipEventType;
        getMouseInfo(event: import("recharts/types/chart/generateCategoricalChart").MousePointer): {
            xValue: any;
            yValue: any;
            chartX: number;
            chartY: number;
        } | {
            activeTooltipIndex: number;
            activeLabel: any;
            activePayload: any[];
            activeCoordinate: import("recharts/types/util/types").ChartCoordinate;
            chartX: number;
            chartY: number;
        };
        inRange(x: number, y: number, scale?: number): any;
        parseEventsOfWrapper(): any;
        addListener(): void;
        removeListener(): void;
        handleLegendBBoxUpdate: (box: DOMRect) => void;
        handleReceiveSyncEvent: (cId: string | number, data: import("recharts/types/chart/types").CategoricalChartState, emitter: Symbol) => void;
        handleBrushChange: ({ startIndex, endIndex }: {
            startIndex: number;
            endIndex: number;
        }) => void;
        handleMouseEnter: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggeredAfterMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any;
        handleItemMouseEnter: (el: any) => void;
        handleItemMouseLeave: () => void;
        handleMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer & Partial<Omit<import("react").MouseEvent<Element, MouseEvent>, keyof import("recharts/types/chart/generateCategoricalChart").MousePointer>>) => void;
        handleMouseLeave: (e: any) => void;
        handleOuterEvent: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").TouchEvent<Element>) => void;
        handleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleMouseDown: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleMouseUp: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleTouchMove: (e: import("react").TouchEvent<Element>) => void;
        handleTouchStart: (e: import("react").TouchEvent<Element>) => void;
        handleTouchEnd: (e: import("react").TouchEvent<Element>) => void;
        handleDoubleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleContextMenu: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggerSyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        applySyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        filterFormatItem(item: any, displayName: any, childIndex: any): any;
        renderCursor: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
        renderPolarAxis: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderPolarGrid: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderLegend: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderTooltip: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderBrush: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderReferenceElement: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderActivePoints: ({ item, activePoint, basePoint, childIndex, isRange }: any) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>[];
        renderGraphicChild: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
        renderCustomized: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderClipPath(): import("react").JSX.Element;
        getXScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getYScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getXScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getYScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getItemByXY(chartXY: {
            x: number;
            y: number;
        }): {
            graphicalItem: any;
            payload: any;
        };
        renderMap: {
            CartesianGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            ReferenceArea: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceLine: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceDot: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            XAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            YAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Brush: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            Bar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Line: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Area: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Radar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            RadialBar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Scatter: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Pie: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Funnel: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Tooltip: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
                once: boolean;
            };
            PolarGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            PolarAngleAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            PolarRadiusAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Customized: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
        };
        render(): import("react").JSX.Element;
        context: unknown;
        setState<K extends keyof import("recharts/types/chart/types").CategoricalChartState>(state: import("recharts/types/chart/types").CategoricalChartState | ((prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>) => import("recharts/types/chart/types").CategoricalChartState | Pick<import("recharts/types/chart/types").CategoricalChartState, K>) | Pick<import("recharts/types/chart/types").CategoricalChartState, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>;
        state: Readonly<import("recharts/types/chart/types").CategoricalChartState>;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
    }>>;
    LineChart: import("react").ForwardRefExoticComponent<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps & import("react").RefAttributes<{
        readonly eventEmitterSymbol: Symbol;
        clipPathId: string;
        accessibilityManager: import("recharts/types/chart/AccessibilityManager").AccessibilityManager;
        throttleTriggeredAfterMouseMove: import("lodash").DebouncedFunc<(e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any>;
        container?: HTMLElement;
        componentDidMount(): void;
        displayDefaultTooltip(): void;
        getSnapshotBeforeUpdate(prevProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>): null;
        componentDidUpdate(prevProps: import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps): void;
        componentWillUnmount(): void;
        getTooltipEventType(): import("recharts/types/util/types").TooltipEventType;
        getMouseInfo(event: import("recharts/types/chart/generateCategoricalChart").MousePointer): {
            xValue: any;
            yValue: any;
            chartX: number;
            chartY: number;
        } | {
            activeTooltipIndex: number;
            activeLabel: any;
            activePayload: any[];
            activeCoordinate: import("recharts/types/util/types").ChartCoordinate;
            chartX: number;
            chartY: number;
        };
        inRange(x: number, y: number, scale?: number): any;
        parseEventsOfWrapper(): any;
        addListener(): void;
        removeListener(): void;
        handleLegendBBoxUpdate: (box: DOMRect) => void;
        handleReceiveSyncEvent: (cId: string | number, data: import("recharts/types/chart/types").CategoricalChartState, emitter: Symbol) => void;
        handleBrushChange: ({ startIndex, endIndex }: {
            startIndex: number;
            endIndex: number;
        }) => void;
        handleMouseEnter: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggeredAfterMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any;
        handleItemMouseEnter: (el: any) => void;
        handleItemMouseLeave: () => void;
        handleMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer & Partial<Omit<import("react").MouseEvent<Element, MouseEvent>, keyof import("recharts/types/chart/generateCategoricalChart").MousePointer>>) => void;
        handleMouseLeave: (e: any) => void;
        handleOuterEvent: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").TouchEvent<Element>) => void;
        handleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleMouseDown: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleMouseUp: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleTouchMove: (e: import("react").TouchEvent<Element>) => void;
        handleTouchStart: (e: import("react").TouchEvent<Element>) => void;
        handleTouchEnd: (e: import("react").TouchEvent<Element>) => void;
        handleDoubleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleContextMenu: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggerSyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        applySyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        filterFormatItem(item: any, displayName: any, childIndex: any): any;
        renderCursor: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
        renderPolarAxis: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderPolarGrid: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderLegend: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderTooltip: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderBrush: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderReferenceElement: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderActivePoints: ({ item, activePoint, basePoint, childIndex, isRange }: any) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>[];
        renderGraphicChild: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
        renderCustomized: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderClipPath(): import("react").JSX.Element;
        getXScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getYScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getXScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getYScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getItemByXY(chartXY: {
            x: number;
            y: number;
        }): {
            graphicalItem: any;
            payload: any;
        };
        renderMap: {
            CartesianGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            ReferenceArea: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceLine: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceDot: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            XAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            YAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Brush: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            Bar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Line: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Area: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Radar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            RadialBar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Scatter: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Pie: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Funnel: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Tooltip: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
                once: boolean;
            };
            PolarGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            PolarAngleAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            PolarRadiusAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Customized: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
        };
        render(): import("react").JSX.Element;
        context: unknown;
        setState<K extends keyof import("recharts/types/chart/types").CategoricalChartState>(state: import("recharts/types/chart/types").CategoricalChartState | ((prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>) => import("recharts/types/chart/types").CategoricalChartState | Pick<import("recharts/types/chart/types").CategoricalChartState, K>) | Pick<import("recharts/types/chart/types").CategoricalChartState, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>;
        state: Readonly<import("recharts/types/chart/types").CategoricalChartState>;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
    }>>;
    ComposedChart: import("react").ForwardRefExoticComponent<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps & import("react").RefAttributes<{
        readonly eventEmitterSymbol: Symbol;
        clipPathId: string;
        accessibilityManager: import("recharts/types/chart/AccessibilityManager").AccessibilityManager;
        throttleTriggeredAfterMouseMove: import("lodash").DebouncedFunc<(e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any>;
        container?: HTMLElement;
        componentDidMount(): void;
        displayDefaultTooltip(): void;
        getSnapshotBeforeUpdate(prevProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>): null;
        componentDidUpdate(prevProps: import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps): void;
        componentWillUnmount(): void;
        getTooltipEventType(): import("recharts/types/util/types").TooltipEventType;
        getMouseInfo(event: import("recharts/types/chart/generateCategoricalChart").MousePointer): {
            xValue: any;
            yValue: any;
            chartX: number;
            chartY: number;
        } | {
            activeTooltipIndex: number;
            activeLabel: any;
            activePayload: any[];
            activeCoordinate: import("recharts/types/util/types").ChartCoordinate;
            chartX: number;
            chartY: number;
        };
        inRange(x: number, y: number, scale?: number): any;
        parseEventsOfWrapper(): any;
        addListener(): void;
        removeListener(): void;
        handleLegendBBoxUpdate: (box: DOMRect) => void;
        handleReceiveSyncEvent: (cId: string | number, data: import("recharts/types/chart/types").CategoricalChartState, emitter: Symbol) => void;
        handleBrushChange: ({ startIndex, endIndex }: {
            startIndex: number;
            endIndex: number;
        }) => void;
        handleMouseEnter: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggeredAfterMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any;
        handleItemMouseEnter: (el: any) => void;
        handleItemMouseLeave: () => void;
        handleMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer & Partial<Omit<import("react").MouseEvent<Element, MouseEvent>, keyof import("recharts/types/chart/generateCategoricalChart").MousePointer>>) => void;
        handleMouseLeave: (e: any) => void;
        handleOuterEvent: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").TouchEvent<Element>) => void;
        handleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleMouseDown: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleMouseUp: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleTouchMove: (e: import("react").TouchEvent<Element>) => void;
        handleTouchStart: (e: import("react").TouchEvent<Element>) => void;
        handleTouchEnd: (e: import("react").TouchEvent<Element>) => void;
        handleDoubleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleContextMenu: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggerSyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        applySyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        filterFormatItem(item: any, displayName: any, childIndex: any): any;
        renderCursor: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
        renderPolarAxis: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderPolarGrid: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderLegend: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderTooltip: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderBrush: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderReferenceElement: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderActivePoints: ({ item, activePoint, basePoint, childIndex, isRange }: any) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>[];
        renderGraphicChild: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
        renderCustomized: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderClipPath(): import("react").JSX.Element;
        getXScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getYScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getXScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getYScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getItemByXY(chartXY: {
            x: number;
            y: number;
        }): {
            graphicalItem: any;
            payload: any;
        };
        renderMap: {
            CartesianGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            ReferenceArea: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceLine: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceDot: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            XAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            YAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Brush: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            Bar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Line: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Area: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Radar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            RadialBar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Scatter: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Pie: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Funnel: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Tooltip: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
                once: boolean;
            };
            PolarGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            PolarAngleAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            PolarRadiusAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Customized: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
        };
        render(): import("react").JSX.Element;
        context: unknown;
        setState<K extends keyof import("recharts/types/chart/types").CategoricalChartState>(state: import("recharts/types/chart/types").CategoricalChartState | ((prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>) => import("recharts/types/chart/types").CategoricalChartState | Pick<import("recharts/types/chart/types").CategoricalChartState, K>) | Pick<import("recharts/types/chart/types").CategoricalChartState, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>;
        state: Readonly<import("recharts/types/chart/types").CategoricalChartState>;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
    }>>;
    PieChart: import("react").ForwardRefExoticComponent<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps & import("react").RefAttributes<{
        readonly eventEmitterSymbol: Symbol;
        clipPathId: string;
        accessibilityManager: import("recharts/types/chart/AccessibilityManager").AccessibilityManager;
        throttleTriggeredAfterMouseMove: import("lodash").DebouncedFunc<(e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any>;
        container?: HTMLElement;
        componentDidMount(): void;
        displayDefaultTooltip(): void;
        getSnapshotBeforeUpdate(prevProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>): null;
        componentDidUpdate(prevProps: import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps): void;
        componentWillUnmount(): void;
        getTooltipEventType(): import("recharts/types/util/types").TooltipEventType;
        getMouseInfo(event: import("recharts/types/chart/generateCategoricalChart").MousePointer): {
            xValue: any;
            yValue: any;
            chartX: number;
            chartY: number;
        } | {
            activeTooltipIndex: number;
            activeLabel: any;
            activePayload: any[];
            activeCoordinate: import("recharts/types/util/types").ChartCoordinate;
            chartX: number;
            chartY: number;
        };
        inRange(x: number, y: number, scale?: number): any;
        parseEventsOfWrapper(): any;
        addListener(): void;
        removeListener(): void;
        handleLegendBBoxUpdate: (box: DOMRect) => void;
        handleReceiveSyncEvent: (cId: string | number, data: import("recharts/types/chart/types").CategoricalChartState, emitter: Symbol) => void;
        handleBrushChange: ({ startIndex, endIndex }: {
            startIndex: number;
            endIndex: number;
        }) => void;
        handleMouseEnter: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggeredAfterMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any;
        handleItemMouseEnter: (el: any) => void;
        handleItemMouseLeave: () => void;
        handleMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer & Partial<Omit<import("react").MouseEvent<Element, MouseEvent>, keyof import("recharts/types/chart/generateCategoricalChart").MousePointer>>) => void;
        handleMouseLeave: (e: any) => void;
        handleOuterEvent: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").TouchEvent<Element>) => void;
        handleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleMouseDown: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleMouseUp: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleTouchMove: (e: import("react").TouchEvent<Element>) => void;
        handleTouchStart: (e: import("react").TouchEvent<Element>) => void;
        handleTouchEnd: (e: import("react").TouchEvent<Element>) => void;
        handleDoubleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleContextMenu: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggerSyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        applySyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        filterFormatItem(item: any, displayName: any, childIndex: any): any;
        renderCursor: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
        renderPolarAxis: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderPolarGrid: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderLegend: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderTooltip: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderBrush: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderReferenceElement: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderActivePoints: ({ item, activePoint, basePoint, childIndex, isRange }: any) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>[];
        renderGraphicChild: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
        renderCustomized: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderClipPath(): import("react").JSX.Element;
        getXScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getYScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getXScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getYScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getItemByXY(chartXY: {
            x: number;
            y: number;
        }): {
            graphicalItem: any;
            payload: any;
        };
        renderMap: {
            CartesianGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            ReferenceArea: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceLine: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceDot: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            XAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            YAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Brush: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            Bar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Line: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Area: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Radar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            RadialBar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Scatter: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Pie: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Funnel: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Tooltip: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
                once: boolean;
            };
            PolarGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            PolarAngleAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            PolarRadiusAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Customized: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
        };
        render(): import("react").JSX.Element;
        context: unknown;
        setState<K extends keyof import("recharts/types/chart/types").CategoricalChartState>(state: import("recharts/types/chart/types").CategoricalChartState | ((prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>) => import("recharts/types/chart/types").CategoricalChartState | Pick<import("recharts/types/chart/types").CategoricalChartState, K>) | Pick<import("recharts/types/chart/types").CategoricalChartState, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>;
        state: Readonly<import("recharts/types/chart/types").CategoricalChartState>;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
    }>>;
    RadarChart: import("react").ForwardRefExoticComponent<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps & import("react").RefAttributes<{
        readonly eventEmitterSymbol: Symbol;
        clipPathId: string;
        accessibilityManager: import("recharts/types/chart/AccessibilityManager").AccessibilityManager;
        throttleTriggeredAfterMouseMove: import("lodash").DebouncedFunc<(e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any>;
        container?: HTMLElement;
        componentDidMount(): void;
        displayDefaultTooltip(): void;
        getSnapshotBeforeUpdate(prevProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>): null;
        componentDidUpdate(prevProps: import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps): void;
        componentWillUnmount(): void;
        getTooltipEventType(): import("recharts/types/util/types").TooltipEventType;
        getMouseInfo(event: import("recharts/types/chart/generateCategoricalChart").MousePointer): {
            xValue: any;
            yValue: any;
            chartX: number;
            chartY: number;
        } | {
            activeTooltipIndex: number;
            activeLabel: any;
            activePayload: any[];
            activeCoordinate: import("recharts/types/util/types").ChartCoordinate;
            chartX: number;
            chartY: number;
        };
        inRange(x: number, y: number, scale?: number): any;
        parseEventsOfWrapper(): any;
        addListener(): void;
        removeListener(): void;
        handleLegendBBoxUpdate: (box: DOMRect) => void;
        handleReceiveSyncEvent: (cId: string | number, data: import("recharts/types/chart/types").CategoricalChartState, emitter: Symbol) => void;
        handleBrushChange: ({ startIndex, endIndex }: {
            startIndex: number;
            endIndex: number;
        }) => void;
        handleMouseEnter: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggeredAfterMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any;
        handleItemMouseEnter: (el: any) => void;
        handleItemMouseLeave: () => void;
        handleMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer & Partial<Omit<import("react").MouseEvent<Element, MouseEvent>, keyof import("recharts/types/chart/generateCategoricalChart").MousePointer>>) => void;
        handleMouseLeave: (e: any) => void;
        handleOuterEvent: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").TouchEvent<Element>) => void;
        handleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleMouseDown: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleMouseUp: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleTouchMove: (e: import("react").TouchEvent<Element>) => void;
        handleTouchStart: (e: import("react").TouchEvent<Element>) => void;
        handleTouchEnd: (e: import("react").TouchEvent<Element>) => void;
        handleDoubleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleContextMenu: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggerSyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        applySyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        filterFormatItem(item: any, displayName: any, childIndex: any): any;
        renderCursor: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
        renderPolarAxis: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderPolarGrid: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderLegend: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderTooltip: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderBrush: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderReferenceElement: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderActivePoints: ({ item, activePoint, basePoint, childIndex, isRange }: any) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>[];
        renderGraphicChild: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
        renderCustomized: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderClipPath(): import("react").JSX.Element;
        getXScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getYScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getXScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getYScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getItemByXY(chartXY: {
            x: number;
            y: number;
        }): {
            graphicalItem: any;
            payload: any;
        };
        renderMap: {
            CartesianGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            ReferenceArea: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceLine: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceDot: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            XAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            YAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Brush: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            Bar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Line: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Area: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Radar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            RadialBar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Scatter: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Pie: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Funnel: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Tooltip: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
                once: boolean;
            };
            PolarGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            PolarAngleAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            PolarRadiusAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Customized: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
        };
        render(): import("react").JSX.Element;
        context: unknown;
        setState<K extends keyof import("recharts/types/chart/types").CategoricalChartState>(state: import("recharts/types/chart/types").CategoricalChartState | ((prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>) => import("recharts/types/chart/types").CategoricalChartState | Pick<import("recharts/types/chart/types").CategoricalChartState, K>) | Pick<import("recharts/types/chart/types").CategoricalChartState, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>;
        state: Readonly<import("recharts/types/chart/types").CategoricalChartState>;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
    }>>;
    RadialBarChart: import("react").ForwardRefExoticComponent<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps & import("react").RefAttributes<{
        readonly eventEmitterSymbol: Symbol;
        clipPathId: string;
        accessibilityManager: import("recharts/types/chart/AccessibilityManager").AccessibilityManager;
        throttleTriggeredAfterMouseMove: import("lodash").DebouncedFunc<(e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any>;
        container?: HTMLElement;
        componentDidMount(): void;
        displayDefaultTooltip(): void;
        getSnapshotBeforeUpdate(prevProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>): null;
        componentDidUpdate(prevProps: import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps): void;
        componentWillUnmount(): void;
        getTooltipEventType(): import("recharts/types/util/types").TooltipEventType;
        getMouseInfo(event: import("recharts/types/chart/generateCategoricalChart").MousePointer): {
            xValue: any;
            yValue: any;
            chartX: number;
            chartY: number;
        } | {
            activeTooltipIndex: number;
            activeLabel: any;
            activePayload: any[];
            activeCoordinate: import("recharts/types/util/types").ChartCoordinate;
            chartX: number;
            chartY: number;
        };
        inRange(x: number, y: number, scale?: number): any;
        parseEventsOfWrapper(): any;
        addListener(): void;
        removeListener(): void;
        handleLegendBBoxUpdate: (box: DOMRect) => void;
        handleReceiveSyncEvent: (cId: string | number, data: import("recharts/types/chart/types").CategoricalChartState, emitter: Symbol) => void;
        handleBrushChange: ({ startIndex, endIndex }: {
            startIndex: number;
            endIndex: number;
        }) => void;
        handleMouseEnter: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggeredAfterMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any;
        handleItemMouseEnter: (el: any) => void;
        handleItemMouseLeave: () => void;
        handleMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer & Partial<Omit<import("react").MouseEvent<Element, MouseEvent>, keyof import("recharts/types/chart/generateCategoricalChart").MousePointer>>) => void;
        handleMouseLeave: (e: any) => void;
        handleOuterEvent: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").TouchEvent<Element>) => void;
        handleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleMouseDown: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleMouseUp: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleTouchMove: (e: import("react").TouchEvent<Element>) => void;
        handleTouchStart: (e: import("react").TouchEvent<Element>) => void;
        handleTouchEnd: (e: import("react").TouchEvent<Element>) => void;
        handleDoubleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleContextMenu: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggerSyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        applySyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        filterFormatItem(item: any, displayName: any, childIndex: any): any;
        renderCursor: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
        renderPolarAxis: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderPolarGrid: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderLegend: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderTooltip: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderBrush: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderReferenceElement: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderActivePoints: ({ item, activePoint, basePoint, childIndex, isRange }: any) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>[];
        renderGraphicChild: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
        renderCustomized: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderClipPath(): import("react").JSX.Element;
        getXScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getYScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getXScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getYScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getItemByXY(chartXY: {
            x: number;
            y: number;
        }): {
            graphicalItem: any;
            payload: any;
        };
        renderMap: {
            CartesianGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            ReferenceArea: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceLine: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceDot: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            XAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            YAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Brush: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            Bar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Line: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Area: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Radar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            RadialBar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Scatter: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Pie: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Funnel: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Tooltip: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
                once: boolean;
            };
            PolarGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            PolarAngleAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            PolarRadiusAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Customized: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
        };
        render(): import("react").JSX.Element;
        context: unknown;
        setState<K extends keyof import("recharts/types/chart/types").CategoricalChartState>(state: import("recharts/types/chart/types").CategoricalChartState | ((prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>) => import("recharts/types/chart/types").CategoricalChartState | Pick<import("recharts/types/chart/types").CategoricalChartState, K>) | Pick<import("recharts/types/chart/types").CategoricalChartState, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>;
        state: Readonly<import("recharts/types/chart/types").CategoricalChartState>;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
    }>>;
    ScatterChart: import("react").ForwardRefExoticComponent<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps & import("react").RefAttributes<{
        readonly eventEmitterSymbol: Symbol;
        clipPathId: string;
        accessibilityManager: import("recharts/types/chart/AccessibilityManager").AccessibilityManager;
        throttleTriggeredAfterMouseMove: import("lodash").DebouncedFunc<(e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any>;
        container?: HTMLElement;
        componentDidMount(): void;
        displayDefaultTooltip(): void;
        getSnapshotBeforeUpdate(prevProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>): null;
        componentDidUpdate(prevProps: import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps): void;
        componentWillUnmount(): void;
        getTooltipEventType(): import("recharts/types/util/types").TooltipEventType;
        getMouseInfo(event: import("recharts/types/chart/generateCategoricalChart").MousePointer): {
            xValue: any;
            yValue: any;
            chartX: number;
            chartY: number;
        } | {
            activeTooltipIndex: number;
            activeLabel: any;
            activePayload: any[];
            activeCoordinate: import("recharts/types/util/types").ChartCoordinate;
            chartX: number;
            chartY: number;
        };
        inRange(x: number, y: number, scale?: number): any;
        parseEventsOfWrapper(): any;
        addListener(): void;
        removeListener(): void;
        handleLegendBBoxUpdate: (box: DOMRect) => void;
        handleReceiveSyncEvent: (cId: string | number, data: import("recharts/types/chart/types").CategoricalChartState, emitter: Symbol) => void;
        handleBrushChange: ({ startIndex, endIndex }: {
            startIndex: number;
            endIndex: number;
        }) => void;
        handleMouseEnter: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggeredAfterMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any;
        handleItemMouseEnter: (el: any) => void;
        handleItemMouseLeave: () => void;
        handleMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer & Partial<Omit<import("react").MouseEvent<Element, MouseEvent>, keyof import("recharts/types/chart/generateCategoricalChart").MousePointer>>) => void;
        handleMouseLeave: (e: any) => void;
        handleOuterEvent: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").TouchEvent<Element>) => void;
        handleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleMouseDown: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleMouseUp: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleTouchMove: (e: import("react").TouchEvent<Element>) => void;
        handleTouchStart: (e: import("react").TouchEvent<Element>) => void;
        handleTouchEnd: (e: import("react").TouchEvent<Element>) => void;
        handleDoubleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleContextMenu: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggerSyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        applySyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        filterFormatItem(item: any, displayName: any, childIndex: any): any;
        renderCursor: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
        renderPolarAxis: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderPolarGrid: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderLegend: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderTooltip: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderBrush: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderReferenceElement: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderActivePoints: ({ item, activePoint, basePoint, childIndex, isRange }: any) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>[];
        renderGraphicChild: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
        renderCustomized: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderClipPath(): import("react").JSX.Element;
        getXScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getYScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getXScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getYScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getItemByXY(chartXY: {
            x: number;
            y: number;
        }): {
            graphicalItem: any;
            payload: any;
        };
        renderMap: {
            CartesianGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            ReferenceArea: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceLine: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceDot: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            XAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            YAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Brush: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            Bar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Line: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Area: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Radar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            RadialBar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Scatter: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Pie: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Funnel: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Tooltip: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
                once: boolean;
            };
            PolarGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            PolarAngleAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            PolarRadiusAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Customized: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
        };
        render(): import("react").JSX.Element;
        context: unknown;
        setState<K extends keyof import("recharts/types/chart/types").CategoricalChartState>(state: import("recharts/types/chart/types").CategoricalChartState | ((prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>) => import("recharts/types/chart/types").CategoricalChartState | Pick<import("recharts/types/chart/types").CategoricalChartState, K>) | Pick<import("recharts/types/chart/types").CategoricalChartState, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>;
        state: Readonly<import("recharts/types/chart/types").CategoricalChartState>;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
    }>>;
    FunnelChart: import("react").ForwardRefExoticComponent<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps & import("react").RefAttributes<{
        readonly eventEmitterSymbol: Symbol;
        clipPathId: string;
        accessibilityManager: import("recharts/types/chart/AccessibilityManager").AccessibilityManager;
        throttleTriggeredAfterMouseMove: import("lodash").DebouncedFunc<(e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any>;
        container?: HTMLElement;
        componentDidMount(): void;
        displayDefaultTooltip(): void;
        getSnapshotBeforeUpdate(prevProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>): null;
        componentDidUpdate(prevProps: import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps): void;
        componentWillUnmount(): void;
        getTooltipEventType(): import("recharts/types/util/types").TooltipEventType;
        getMouseInfo(event: import("recharts/types/chart/generateCategoricalChart").MousePointer): {
            xValue: any;
            yValue: any;
            chartX: number;
            chartY: number;
        } | {
            activeTooltipIndex: number;
            activeLabel: any;
            activePayload: any[];
            activeCoordinate: import("recharts/types/util/types").ChartCoordinate;
            chartX: number;
            chartY: number;
        };
        inRange(x: number, y: number, scale?: number): any;
        parseEventsOfWrapper(): any;
        addListener(): void;
        removeListener(): void;
        handleLegendBBoxUpdate: (box: DOMRect) => void;
        handleReceiveSyncEvent: (cId: string | number, data: import("recharts/types/chart/types").CategoricalChartState, emitter: Symbol) => void;
        handleBrushChange: ({ startIndex, endIndex }: {
            startIndex: number;
            endIndex: number;
        }) => void;
        handleMouseEnter: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggeredAfterMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer) => any;
        handleItemMouseEnter: (el: any) => void;
        handleItemMouseLeave: () => void;
        handleMouseMove: (e: import("recharts/types/chart/generateCategoricalChart").MousePointer & Partial<Omit<import("react").MouseEvent<Element, MouseEvent>, keyof import("recharts/types/chart/generateCategoricalChart").MousePointer>>) => void;
        handleMouseLeave: (e: any) => void;
        handleOuterEvent: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").TouchEvent<Element>) => void;
        handleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleMouseDown: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleMouseUp: (e: import("react").MouseEvent<Element, MouseEvent> | import("react").Touch) => void;
        handleTouchMove: (e: import("react").TouchEvent<Element>) => void;
        handleTouchStart: (e: import("react").TouchEvent<Element>) => void;
        handleTouchEnd: (e: import("react").TouchEvent<Element>) => void;
        handleDoubleClick: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        handleContextMenu: (e: import("react").MouseEvent<Element, MouseEvent>) => void;
        triggerSyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        applySyncEvent: (data: import("recharts/types/chart/types").CategoricalChartState) => void;
        filterFormatItem(item: any, displayName: any, childIndex: any): any;
        renderCursor: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
        renderPolarAxis: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderPolarGrid: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderLegend: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderTooltip: () => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderBrush: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderReferenceElement: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderActivePoints: ({ item, activePoint, basePoint, childIndex, isRange }: any) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>[];
        renderGraphicChild: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
        renderCustomized: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        renderClipPath(): import("react").JSX.Element;
        getXScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getYScales(): {
            [x: string]: Function | import("recharts/types/util/types").ScaleType;
        };
        getXScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getYScaleByAxisId(axisId: string): Function | import("recharts/types/util/types").ScaleType;
        getItemByXY(chartXY: {
            x: number;
            y: number;
        }): {
            graphicalItem: any;
            payload: any;
        };
        renderMap: {
            CartesianGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            ReferenceArea: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceLine: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            ReferenceDot: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            XAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            YAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Brush: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            Bar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Line: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Area: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Radar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            RadialBar: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Scatter: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Pie: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Funnel: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => any[];
            };
            Tooltip: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").JSX.Element;
                once: boolean;
            };
            PolarGrid: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
                once: boolean;
            };
            PolarAngleAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            PolarRadiusAxis: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
            Customized: {
                handler: (element: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, displayName: string, index: number) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
            };
        };
        render(): import("react").JSX.Element;
        context: unknown;
        setState<K extends keyof import("recharts/types/chart/types").CategoricalChartState>(state: import("recharts/types/chart/types").CategoricalChartState | ((prevState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>) => import("recharts/types/chart/types").CategoricalChartState | Pick<import("recharts/types/chart/types").CategoricalChartState, K>) | Pick<import("recharts/types/chart/types").CategoricalChartState, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>;
        state: Readonly<import("recharts/types/chart/types").CategoricalChartState>;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<import("recharts/types/chart/generateCategoricalChart").CategoricalChartProps>, nextState: Readonly<import("recharts/types/chart/types").CategoricalChartState>, nextContext: any): void;
    }>>;
    Treemap: typeof Treemap;
    ResponsiveContainer: import("react").ForwardRefExoticComponent<import("recharts").ResponsiveContainerProps & import("react").RefAttributes<HTMLDivElement | {
        current: HTMLDivElement;
    }>>;
    Legend: typeof Legend;
    Tooltip: typeof Tooltip;
    Cell: import("react").FunctionComponent<import("recharts").CellProps>;
    Text: ({ x: propsX, y: propsY, lineHeight, capHeight, scaleToFit, textAnchor, verticalAnchor, fill, ...props }: import("recharts").TextProps) => React.JSX.Element;
    Label: typeof Label;
    LabelList: typeof LabelList;
    Customized: typeof Customized;
    Area: typeof Area;
    Bar: typeof Bar;
    Line: typeof Line;
    Scatter: typeof Scatter;
    XAxis: typeof XAxis;
    YAxis: typeof YAxis;
    ZAxis: typeof ZAxis;
    Brush: typeof Brush;
    CartesianAxis: typeof CartesianAxis;
    CartesianGrid: typeof CartesianGrid;
    ReferenceLine: typeof ReferenceLine;
    ReferenceDot: typeof ReferenceDot;
    ReferenceArea: typeof ReferenceArea;
    ErrorBar: typeof ErrorBar;
    Funnel: typeof Funnel;
    Cross: import("react").FC<import("recharts").CrossProps>;
    Curve: import("react").FC<import("recharts").CurveProps>;
    Dot: import("react").FC<import("recharts").DotProps>;
    Polygon: import("react").FC<import("recharts").PolygonProps>;
    Rectangle: import("react").FC<import("recharts").RectangleProps>;
    Sector: import("react").FC<import("recharts").SectorProps>;
    Pie: typeof Pie;
    Radar: typeof Radar;
    RadialBar: typeof RadialBar;
    PolarAngleAxis: typeof PolarAngleAxis;
    PolarGrid: {
        ({ cx, cy, innerRadius, outerRadius, gridType, radialLines, ...props }: import("recharts").PolarGridProps): React.JSX.Element;
        displayName: string;
    };
    PolarRadiusAxis: typeof PolarRadiusAxis;
};
