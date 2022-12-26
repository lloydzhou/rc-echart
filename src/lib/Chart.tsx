import React, {
  createContext,
  useContext,
  createRef,
  useCallback,
  useEffect,
  useRef,
  forwardRef,
} from "react";
import {
  ECharts,
  EChartsCoreOption,
  init as initChart,
  throttle,
} from "echarts/core";
import { addListener, removeListener } from "resize-detector";

export const ChartContext = createContext({});

interface ChartProps {
  onRendered: (chart: ECharts) => any;
  onFinished: (chart: ECharts) => any;
  width: number | "auto" | undefined;
  height: number | "auto" | undefined;
  autoResize: boolean;
  theme: string | object;
  notMerge: boolean;
  lazyUpdate: boolean;
  group?: string;
}

export const Chart = forwardRef<
  ECharts | null,
  Partial<EChartsCoreOption & ChartProps>
>((props, ref) => {
  const {
    children,
    className = "",
    style = {},
    onRendered,
    onFinished,
    width = 600,
    height = 300,
    autoResize,
    theme,
    notMerge,
    lazyUpdate,
    group,
    ...other
  } = props;

  const container = createRef<HTMLDivElement>();

  const options = useRef(new Map());
  const chart = useRef<ECharts | null>();

  const setOption = (key: string, option: any) => {
    // 1. 移除option中无用的key
    Object.keys(option).forEach((name) => {
      if (option[name] === undefined || option[name] === null) {
        delete option[name];
      }
    });
    // 2. 往当前的state.options中合并新的组件配置
    options.current.set(key, (options.current.get(key), []).concat(option))
    // 4. 提交更新到echarts
    commit();
  };

  const removeOption = (key: string, id: string) => {
    if (options.current.has(key)) {
      // 1. 移除组件配置
      // @ts-ignore
      options.current.set(key, (options.current.get(key), []).filter((i: any) => i.id !== id))
      // 3. 提交更新到echarts
      commit();
    }
  };

  // 这里实际上形成了一个批量更改一次提交的过程
  // 避免了一个子组件有变化（例如series中的数据）
  // 提交的时候影响到另一个子组件（例如xAxis）
  const commit = throttle(
    useCallback(() => {
      if (chart.current) {
        // 提交画布更新的时候，使用replaceMerge选项
        // @ts-ignore
        const opt = Object.fromEntries(options.current.entries())
        console.log('options', opt, options.current)
        chart.current.setOption(opt, {
          lazyUpdate,
          replaceMerge: Array.from(options.current.keys()),
        });
        // chart.current.setOption(options.current, {
        //   lazyUpdate,
        //   replaceMerge: Array.from(replaceMerge.current),
        // });
        // 提交画布更新之后，重置replaceMerge
        // options.current.clear()
        // replaceMerge.current = new Set();
      }
    }, [lazyUpdate]),
    50,
    true
  );

  // @ts-ignore
  const rendered = () => onRendered && onRendered(chart.current);
  // @ts-ignore
  const finished = () => onFinished && onFinished(chart.current);

  const init = useCallback(() => {
    const instance = initChart(
      container.current as HTMLDivElement,
      theme as string | object
    );
    if (group) {
      instance.group = group as string;
    }
    instance.on("rendered", rendered);
    instance.on("finished", finished);
    chart.current = instance;
    if (typeof ref === "function") {
      ref(instance);
    } else if (ref) {
      // @ts-ignore
      ref.current = instance;
    }
    Object.keys(other).map(key => setOption(key, other[key]))
    // 使用默认的option初始化画布
    commit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  // watch size
  useEffect(() => {
    if (chart.current && width && height) {
      chart.current.resize({ width, height });
    }
  }, [width, height, chart]);

  // autoresize
  useEffect(() => {
    const resizeListener = throttle(() => {
      chart.current && chart.current.resize();
    }, 100);
    if (container.current && chart.current && autoResize) {
      addListener(container.current, resizeListener);
    }
    return () => {
      if (container.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        removeListener(container.current, resizeListener);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoResize, chart, container.current]);

  return (
    <ChartContext.Provider
      value={{ options, chart: chart.current, setOption, removeOption }}
    >
      <div
        ref={container}
        className={`echarts ${className}`}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          ...(style as object),
        }}
      >
        {children as any}
      </div>
    </ChartContext.Provider>
  );
});

export const useChartContext = () => useContext(ChartContext);

export default Chart;
