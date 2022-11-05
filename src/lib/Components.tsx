import type {
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
  // 
  ContinousVisualMapOption,
  PiecewiseVisualMapOption,
  // 
  InsideDataZoomOption,
  SliderDataZoomOption,
  // 
  TitleOption,
  LegendOption,
  ScrollableLegendOption,
  GridOption,
  XAXisOption,
  YAXisOption,
  RadiusAxisOption,
  AngleAxisOption,
  PolarOption,
  // RadarOption,
  TooltipOption,
  AxisPointerOption,
  ToolboxComponentOption,
  AriaOption,
  // ParallelAxisOption,
  BrushOption,
  GeoOption,
  SingleAxisOption,
  TimelineOption,
  CalendarOption,
  DatasetOption,
} from 'echarts/types/dist/shared'

import { FC, useEffect, useState, useCallback } from 'react'
import { useChartContext } from './Chart'

export const uniqueId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const series = [
  'Line', 'Bar', 'Pie', 'Scatter', 'EffectScatter', 'Radar', 'Tree', 'Treemap',
  'Sunburst', 'Boxplot', 'Candlestick', 'Heatmap', 'Map', 'Parallel', 'Lines',
  'Graph', 'Sankey', 'Funnel', 'Gauge', 'PictorialBar', 'ThemeRiver', 'Custom',
]
export const visualMap = ['VisualMap', 'Continuous', 'Piecewise']
export const dataZoom = ['DataZoom', 'Inside', 'Slider']

const defaultTypeMap = {
  Legend: 'plain',
  XAxis: 'category',
  YAxis: 'value',
  RadiusAxis: 'value',
  AngleAxis: 'category',
  DataZoom: 'inside',
  VisualMap: 'continuous',
  AxisPointer: 'line',
  ParallelAxis: 'value',
  SingleAxis: 'value',
  Timeline: 'slider',
}

export interface ContainerProps {
  id?: string 
  type?: string
}

export type EFC<T> = FC<Partial<T & ContainerProps>>

function defineComponent<T>(name: string) {
  // @ts-ignore
  const type = defaultTypeMap[name] || (name.charAt(0).toLowerCase() + name.slice(1))
  const Component: EFC<T> = (props) => {
    const { id: pid, type: ptype, ...other } = props
    const key = series.indexOf(name) > -1
      ? 'series'
      : visualMap.indexOf(name) > -1
        ? 'visualMap'
        : dataZoom.indexOf(name) > -1
          ? 'dataZoom'
          : name.charAt(0).toLowerCase() + name.slice(1)
    const [id,] = useState(pid || uniqueId())
    // @ts-ignore
    const { removeOption, setOption } = useChartContext()
    const update = useCallback(() => {
      const options = {...other, type: ptype || type || undefined, id}
      setOption(key, options)
      // console.log('update', key, options, removeOption, setOption)
    }, [id, key, other, ptype, setOption])
    useEffect(() => {
      update()
      return () => removeOption(key, id)
    }, [key, id, removeOption, update])
    return null
  }
  Component.displayName = name
  return Component
}

export const Title: EFC<TitleOption> = defineComponent<TitleOption>('Title')
export const Legend: EFC<LegendOption & ScrollableLegendOption> = defineComponent<LegendOption & ScrollableLegendOption>('Legend')
export const Grid: EFC<GridOption> = defineComponent<GridOption>('Grid')
export const XAxis: EFC<XAXisOption> = defineComponent<XAXisOption>('XAxis')
export const YAxis: EFC<YAXisOption> = defineComponent<YAXisOption>('YAxis')
export const Polar: EFC<PolarOption> = defineComponent<PolarOption>('Polar')
// Radar和series.radar重合
export const RadarAxis: EFC<RadiusAxisOption> = defineComponent<RadiusAxisOption>('RadarAxis')
export const AngleAxis: EFC<AngleAxisOption> = defineComponent<AngleAxisOption>('AngleAxis')
export const DataZoom: EFC<InsideDataZoomOption & SliderDataZoomOption> = defineComponent<InsideDataZoomOption & SliderDataZoomOption>('DataZoom')
export const Inside: EFC<InsideDataZoomOption> = defineComponent<InsideDataZoomOption>('Inside')
export const Slider: EFC<SliderDataZoomOption> = defineComponent<SliderDataZoomOption>('Slider')

// visualMap
export const VisualMap: EFC<ContinousVisualMapOption & PictorialBarSeriesOption> = defineComponent<ContinousVisualMapOption & PictorialBarSeriesOption>('VisualMap')
export const Continuous: EFC<ContinousVisualMapOption> = defineComponent<ContinousVisualMapOption>('Continuous')
export const Piecewise: EFC<PiecewiseVisualMapOption> = defineComponent<PiecewiseVisualMapOption>('Piecewise')

export const Tooltip: EFC<TooltipOption> = defineComponent<TooltipOption>('Tooltip')
export const AxisPointer: EFC<AxisPointerOption> = defineComponent<AxisPointerOption>('AxisPointer')
export const Toolbox: EFC<ToolboxComponentOption> = defineComponent<ToolboxComponentOption>('Toolbox')
export const Brush: EFC<BrushOption> = defineComponent<BrushOption>('Brush')
export const Geo: EFC<GeoOption> = defineComponent<GeoOption>('Geo')
// Parallel: [], // 这个和series.parallel重合了
// ParallelAxis: keys<ParallelAxisOption>(),
export const SingleAxis: EFC<SingleAxisOption> = defineComponent<SingleAxisOption>('SingleAxis')
export const Timeline: EFC<TimelineOption> = defineComponent<TimelineOption>('Timeline')
// TODO Graphic: [],
export const Calendar: EFC<CalendarOption> = defineComponent<CalendarOption>('Calendar')
export const Dataset: EFC<DatasetOption> = defineComponent<DatasetOption>('Dataset')
export const Aria: EFC<AriaOption> = defineComponent<AriaOption>('Aria')

// series
export const Line: EFC<LineSeriesOption> = defineComponent<LineSeriesOption>('Line')
export const Bar: EFC<BarSeriesOption> = defineComponent<BarSeriesOption>('Bar')
export const Pie: EFC<PieSeriesOption> = defineComponent<PieSeriesOption>('Pie')
export const Scatter: EFC<ScatterSeriesOption> = defineComponent<ScatterSeriesOption>('Scatter')
export const EffectScatter: EFC<EffectScatterSeriesOption> = defineComponent<EffectScatterSeriesOption>('EffectScatter')
export const Radar: EFC<RadarSeriesOption> = defineComponent<RadarSeriesOption>('Radar')
export const Tree: EFC<TreeSeriesOption> = defineComponent<TreeSeriesOption>('Tree')
export const Treemap: EFC<TreemapSeriesOption> = defineComponent<TreemapSeriesOption>('Treemap')
export const Sunburst: EFC<SunburstSeriesOption> = defineComponent<SunburstSeriesOption>('Sunburst')
export const Boxplot: EFC<BoxplotSeriesOption> = defineComponent<BoxplotSeriesOption>('Boxplot')
export const Candlestick: EFC<CandlestickSeriesOption> = defineComponent<CandlestickSeriesOption>('Candlestick')
export const Heatmap: EFC<HeatmapSeriesOption> = defineComponent<HeatmapSeriesOption>('Heatmap')
export const Map: EFC<MapSeriesOption> = defineComponent<MapSeriesOption>('Map')
export const Parallel: EFC<ParallelSeriesOption> = defineComponent<ParallelSeriesOption>('Parallel')
export const Lines: EFC<LinesSeriesOption> = defineComponent<LinesSeriesOption>('Lines')
export const Graph: EFC<GraphSeriesOption> = defineComponent<GraphSeriesOption>('Graph')
export const Sankey: EFC<SankeySeriesOption> = defineComponent<SankeySeriesOption>('Sankey')
export const Funnel: EFC<FunnelSeriesOption> = defineComponent<FunnelSeriesOption>('Funnel')
export const Gauge: EFC<GaugeSeriesOption> = defineComponent<GaugeSeriesOption>('Gauge')
export const PictorialBar: EFC<PictorialBarSeriesOption> = defineComponent<PictorialBarSeriesOption>('PictorialBar')
export const ThemeRiver: EFC<ThemeRiverSeriesOption> = defineComponent<ThemeRiverSeriesOption>('ThemeRiver')
export const Custom: EFC<CustomSeriesOption> = defineComponent<CustomSeriesOption>('Custom')

