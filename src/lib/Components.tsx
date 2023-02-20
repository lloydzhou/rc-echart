import type {
  //
  TitleOption,
  LegendOption,
  ScrollableLegendOption,
  GridOption,
  XAXisOption,
  YAXisOption,
  PolarOption,
  RadiusAxisOption,
  AngleAxisOption,
  RadarOption,
  // DataZoom
  InsideDataZoomOption,
  SliderDataZoomOption,
  // visualmap
  ContinousVisualMapOption,
  PiecewiseVisualMapOption,
  TooltipOption,
  AxisPointerOption,
  ToolboxComponentOption,
  BrushOption,
  GeoOption,
  ParallelCoordinateSystemOption,
  // ParallelAxisOption, // can not import
  SingleAxisOption,
  TimelineOption,
  // Graphic 这里只能导出一种类型
  GraphicComponentLooseOption,
  CalendarOption,
  DatasetOption,
  AriaOption,
  // series
  LineSeriesOption,
  BarSeriesOption,
  ScatterSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
  MapSeriesOption,
  TreeSeriesOption,
  TreemapSeriesOption,
  GraphSeriesOption,
  GaugeSeriesOption,
  FunnelSeriesOption,
  ParallelSeriesOption,
  SankeySeriesOption,
  BoxplotSeriesOption,
  CandlestickSeriesOption,
  EffectScatterSeriesOption,
  LinesSeriesOption,
  HeatmapSeriesOption,
  PictorialBarSeriesOption,
  ThemeRiverSeriesOption,
  SunburstSeriesOption,
  CustomSeriesOption,
} from "echarts/types/dist/shared";
import {
  GraphicComponentElementOption,
  GraphicComponentGroupOption,
  GraphicComponentZRPathOption,
  GraphicComponentImageOption,
  GraphicComponentTextOption,
  GraphicComponentDisplayableOption,
} from "echarts/types/src/component/graphic/GraphicModel";
import { ParallelAxisOption } from "echarts/types/src/coord/parallel/AxisModel";
import { throttle } from "echarts/core";
import {
  ReactChild,
  FC,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { ChartContext, useChartContext } from "./Chart";
import { TransitionOptionMixin } from "echarts/types/src/animation/customGraphicTransition";
import { ElementKeyframeAnimationOption } from "echarts/types/src/animation/customGraphicKeyframeAnimation";

export const uniqueId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

export const series = [
  "Line",
  "Bar",
  "Pie",
  "Scatter",
  "EffectScatter",
  "Radar",
  "Tree",
  "Treemap",
  "Sunburst",
  "Boxplot",
  "Candlestick",
  "Heatmap",
  "Map",
  "Parallel",
  "Lines",
  "Graph",
  "Sankey",
  "Funnel",
  "Gauge",
  "PictorialBar",
  "ThemeRiver",
  "Custom",
];
export const visualMap = ["VisualMap", "Continuous", "Piecewise"];
export const dataZoom = ["DataZoom", "Inside", "Slider"];

const defaultTypeMap = {
  Legend: "plain",
  XAxis: "category",
  YAxis: "value",
  RadiusAxis: "value",
  AngleAxis: "category",
  DataZoom: "inside",
  VisualMap: "continuous",
  AxisPointer: "line",
  ParallelAxis: "value",
  SingleAxis: "value",
  Timeline: "slider",
};

export interface ContainerProps {
  id?: string;
  type?: string;
  children?: ReactChild | ReactChild[];
  action?: "merge" | "replace" | "remove";
}

export type EFC<T> = FC<Partial<T & ContainerProps>>;

const lower = (name: string) =>
  name.charAt(0).toLowerCase() + name.slice(1);

function defaultType(name: string) {
  // @ts-ignore
  return defaultTypeMap[name as keyof defaultTypeMap] || lower(name);
}
function getKeyByName(name: string) {
  return series.indexOf(name) > -1
    ? "series"
    : visualMap.indexOf(name) > -1
    ? "visualMap"
    : dataZoom.indexOf(name) > -1
    ? "dataZoom"
    : lower(name);
}

export function defineComponent<T>(
  name: string,
  type: string = "",
  key: string = ""
) {
  type = type || defaultType(name);
  key = key || getKeyByName(name);
  const Component: EFC<T> = (props) => {
    const { id: pid, type: ptype, children, action, ...other } = props;
    const [id] = useState(pid || uniqueId());
    // @ts-ignore
    const { removeOption, setOption } = useChartContext();
    // Graphic
    const childrenOptions = useRef<GraphicComponentLooseOption[]>([]);
    // Graphic.elements.Group需要支持children
    const setChildrenOption = (key: string, option: any) => {
      // 尝试先移除一下相同的id，避免出现相同的id配置项
      removeChildrenOption(key, option.id);
      // Graphic.Group支持使用children配置，但是实际到echarts内部却是统一在elements数组里面
      // 尝试使用group.z赋值给option.z
      // @ts-ignore
      childrenOptions.current.push({ ...option, z: option.z || other.z });
      update();
    };
    const removeChildrenOption = (key: string, id: string) => {
      childrenOptions.current = childrenOptions.current.filter(
        (i: any) => i.id !== id
      );
      update();
    };

    const update = throttle(
      useCallback(() => {
        const options = {
          ...other,
          type: ptype || type || undefined,
          id,
        };
        if (key === "graphic") {
          if (type === "group") {
            // @ts-ignore
            options["children"] = childrenOptions.current;
          }
          // @ts-ignore
          options["$action"] = action || "merge";
        }
        setOption(key, options);
        // eslint-disable-next-line
      }, [id, key, other, ptype, setOption]),
      40,
      true
    );
    useEffect(() => {
      update();
      return () => removeOption(key, id);
      // eslint-disable-next-line
    }, [key, id, removeOption, update]);

    return key === "graphic" && type === "group" ? (
      <ChartContext.Provider
        value={{
          setOption: setChildrenOption,
          removeOption: removeChildrenOption,
        }}
      >
        {children}
      </ChartContext.Provider>
    ) : null;
  };
  Component.displayName = name;
  return Component;
}

export const Title: EFC<TitleOption> = defineComponent<TitleOption>("Title");
export const Legend: EFC<LegendOption | ScrollableLegendOption> =
  defineComponent<LegendOption | ScrollableLegendOption>("Legend");
export const Grid: EFC<GridOption> = defineComponent<GridOption>("Grid");
export const XAxis: EFC<XAXisOption> = defineComponent<XAXisOption>("XAxis");
export const YAxis: EFC<YAXisOption> = defineComponent<YAXisOption>("YAxis");
export const Polar: EFC<PolarOption> = defineComponent<PolarOption>("Polar");
// Radar和series.radar重合
export const RadiusAxis: EFC<RadiusAxisOption> =
  defineComponent<RadiusAxisOption>("RadiusAxis");
export const AngleAxis: EFC<AngleAxisOption> =
  defineComponent<AngleAxisOption>("AngleAxis");
export const RadarAxis: EFC<RadarOption> =
  defineComponent<RadarOption>("RadarAxis");
// DataZoom
export const DataZoom: EFC<InsideDataZoomOption | SliderDataZoomOption> =
  defineComponent<InsideDataZoomOption | SliderDataZoomOption>("DataZoom");
export const Inside: EFC<InsideDataZoomOption> =
  defineComponent<InsideDataZoomOption>("Inside");
export const Slider: EFC<SliderDataZoomOption> =
  defineComponent<SliderDataZoomOption>("Slider");

// visualMap
export const VisualMap: EFC<
  ContinousVisualMapOption | PiecewiseVisualMapOption
> = defineComponent<ContinousVisualMapOption | PiecewiseVisualMapOption>(
  "VisualMap"
);
export const Continuous: EFC<ContinousVisualMapOption> =
  defineComponent<ContinousVisualMapOption>("Continuous");
export const Piecewise: EFC<PiecewiseVisualMapOption> =
  defineComponent<PiecewiseVisualMapOption>("Piecewise");

export const Tooltip: EFC<TooltipOption> =
  defineComponent<TooltipOption>("Tooltip");
export const AxisPointer: EFC<AxisPointerOption> =
  defineComponent<AxisPointerOption>("AxisPointer");
export const Toolbox: EFC<ToolboxComponentOption> =
  defineComponent<ToolboxComponentOption>("Toolbox");
export const Brush: EFC<BrushOption> = defineComponent<BrushOption>("Brush");
export const Geo: EFC<GeoOption> = defineComponent<GeoOption>("Geo");
// Parallel: [], // 这个和series.parallel重合了  ParallelCoordinates
export const ParallelCoordinates: EFC<ParallelCoordinateSystemOption> =
  defineComponent<ParallelCoordinateSystemOption>("Parallel", "", "parllel");
// can not import ParallelAxisOption
export const ParallelAxis: EFC<ParallelAxisOption> =
  defineComponent<ParallelAxisOption>("ParallelAxis");
export const SingleAxis: EFC<SingleAxisOption> =
  defineComponent<SingleAxisOption>("SingleAxis");
export const Timeline: EFC<TimelineOption> =
  defineComponent<TimelineOption>("Timeline");
// TODO Graphic: 这里可以尝试把Graphic里面的暴露出来
export const Graphic = defineComponent<GraphicComponentElementOption>(
  "Graphic",
  "graphic",
  "graphic"
);
export const Group = defineComponent<
  GraphicComponentGroupOption & { z?: number }
>("Group", "group", "graphic");
export const Image = defineComponent<GraphicComponentImageOption>(
  "Image",
  "image",
  "graphic"
);
export const Text = defineComponent<GraphicComponentTextOption>(
  "Text",
  "text",
  "graphic"
);
export const Rect = defineComponent<GraphicComponentZRPathOption>(
  "Rect",
  "rect",
  "graphic"
);
export const Circle = defineComponent<GraphicComponentZRPathOption>(
  "Circle",
  "circle",
  "graphic"
);
export const Ring = defineComponent<GraphicComponentZRPathOption>(
  "Ring",
  "ring",
  "graphic"
);
export const Sector = defineComponent<GraphicComponentZRPathOption>(
  "Sector",
  "sector",
  "graphic"
);
export const Arc = defineComponent<GraphicComponentZRPathOption>(
  "Arc",
  "arc",
  "graphic"
);
export const Polygon = defineComponent<GraphicComponentZRPathOption>(
  "Polygon",
  "polygon",
  "graphic"
);
export const Polyline = defineComponent<GraphicComponentZRPathOption>(
  "Polyline",
  "polyline",
  "graphic"
);
// graphic.elements-line 不能和series.line重名
export const GraphicLine = defineComponent<GraphicComponentZRPathOption>(
  "GraphicLine",
  "line",
  "graphic"
);
export const BezierCurve = defineComponent<GraphicComponentZRPathOption>(
  "BezierCurve",
  "bezierCurve",
  "graphic"
);

export const Calendar: EFC<CalendarOption> =
  defineComponent<CalendarOption>("Calendar");
export const Dataset: EFC<DatasetOption> =
  defineComponent<DatasetOption>("Dataset");
export const Aria: EFC<AriaOption> = defineComponent<AriaOption>("Aria");

// series
export const Line: EFC<LineSeriesOption> =
  defineComponent<LineSeriesOption>("Line");
export const Bar: EFC<BarSeriesOption> =
  defineComponent<BarSeriesOption>("Bar");
export const Pie: EFC<PieSeriesOption> =
  defineComponent<PieSeriesOption>("Pie");
export const Scatter: EFC<ScatterSeriesOption> =
  defineComponent<ScatterSeriesOption>("Scatter");
export const EffectScatter: EFC<EffectScatterSeriesOption> =
  defineComponent<EffectScatterSeriesOption>("EffectScatter");
export const Radar: EFC<RadarSeriesOption> =
  defineComponent<RadarSeriesOption>("Radar");
export const Tree: EFC<TreeSeriesOption> =
  defineComponent<TreeSeriesOption>("Tree");
export const Treemap: EFC<TreemapSeriesOption> =
  defineComponent<TreemapSeriesOption>("Treemap");
export const Sunburst: EFC<SunburstSeriesOption> =
  defineComponent<SunburstSeriesOption>("Sunburst");
export const Boxplot: EFC<BoxplotSeriesOption> =
  defineComponent<BoxplotSeriesOption>("Boxplot");
export const Candlestick: EFC<CandlestickSeriesOption> =
  defineComponent<CandlestickSeriesOption>("Candlestick");
export const Heatmap: EFC<HeatmapSeriesOption> =
  defineComponent<HeatmapSeriesOption>("Heatmap");
export const Map: EFC<MapSeriesOption> =
  defineComponent<MapSeriesOption>("Map");
export const Parallel: EFC<ParallelSeriesOption> =
  defineComponent<ParallelSeriesOption>("Parallel");
export const Lines: EFC<LinesSeriesOption> =
  defineComponent<LinesSeriesOption>("Lines");
export const Graph: EFC<GraphSeriesOption> =
  defineComponent<GraphSeriesOption>("Graph");
export const Sankey: EFC<SankeySeriesOption> =
  defineComponent<SankeySeriesOption>("Sankey");
export const Funnel: EFC<FunnelSeriesOption> =
  defineComponent<FunnelSeriesOption>("Funnel");
export const Gauge: EFC<GaugeSeriesOption> =
  defineComponent<GaugeSeriesOption>("Gauge");
export const PictorialBar: EFC<PictorialBarSeriesOption> =
  defineComponent<PictorialBarSeriesOption>("PictorialBar");
export const ThemeRiver: EFC<ThemeRiverSeriesOption> =
  defineComponent<ThemeRiverSeriesOption>("ThemeRiver");
export const Custom: EFC<CustomSeriesOption> =
  defineComponent<CustomSeriesOption>("Custom");
