# tsxecharts
React component wrapper for ECharts based on TypeScript.  
<a href="https://www.npmjs.com/package/tsxecharts"><img alt="NPM Package" src="https://img.shields.io/npm/v/tsxecharts.svg?style=flat-square"></a>
<a href="https://www.npmjs.com/package/tsxecharts"><img alt="NPM Size" src="https://img.shields.io/bundlephobia/minzip/tsxecharts"></a>
<a href="https://www.npmjs.com/package/tsxecharts"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/tsxecharts?logo=npm&style=flat-square"></a>
<a href="/LICENSE"><img src="https://img.shields.io/github/license/lloydzhou/tsxecharts?style=flat-square" alt="MIT License"></a>

## 项目设计
1. 参考[vuecharts3](https://github.com/lloydzhou/vuecharts)对echarts进行封装
2. 将echarts官方抽象的`series`以及其他的一些组件抽象成为`React`的组件使用，每一个组件负责管理自己的配置项。
3. 这些配置项统一的合并到`Chart`画布组件。再统一的通过`chart.setOption`更新到图表上


## 安装
```
yarn add tsxecharts
```

## Components

1. 定义一个`Chart`组件作为画布
2. 将[echarts官方配置项](https://echarts.apache.org/zh/option.html#title)每一个配置项使用统一的工厂函数构造成`React Component`
3. 项目导出组件列表

||导出组件|
|---|---|
|series|`Line`, `Bar`, `Pie`, `Scatter`, `EffectScatter`, `Radar`, `Tree`, `Treemap`, `Sunburst`, `Boxplot`, `Candlestick`, `Heatmap`, `Map`, `Parallel`, `Lines`, `Graph`, `Sankey`, `Funnel`, `Gauge`, `PictorialBar`, `ThemeRiver`, `Custom`|
|axis|`XAxis`, `YAxis`, `Polar`, `RadiusAxis`, `AngleAxis`, `RadarAxis`, `ParallelCoordinates`(`parallel`), `ParallelAxis`, `SingleAxis`, `Calendar`|
|dataZoom|`DataZoom`, `Inside`, `Slider`|
|visualMap|`VisualMap`, `Continuous`, `Piecewise`|
|graphic|`Graphic`, `Group`, `Image`, `Text`, `Rect`, `Circle`, `Ring`, `Sector`, `Arc`, `Polygon`, `Polyline`, `GraphicLine`(`graphic.elements-line`), `BezierCurve`|
|other|`Title`, `Legend`, `Grid`, `Tooltip`, `AxisPointer`, `Toolbox`, `Brush`, `Geo`, `Timeline`, `Dataset`, `Aria`|



## DEMO
[online demo](https://codesandbox.io/s/tsxecharts-demo-r9wi86?file=/src/App.tsx)

```
import 'echarts'
import Echarts from 'vuecharts3'
import { Chart, Line, Bar, Title, Grid, XAxis, YAxis, Tooltip } from 'tsxecharts'

function App() {

  return (
    <div className="App">
      <Chart width={800}>
        <Grid top={100} />
        <Title text="顶部标题" subtext="顶部小标题" left="center" top={10} />
        <Title text="底部标题" top="bottom" left="center" />
        <Bar name="data1" data={[0.32, 0.45, 0.2]} />
        <Bar name="data2" data={[0.2, 0.5, 0.3]} />
        <Line name="data2" data={[0.2, 0.5, 0.3]} />
        <XAxis data={['x1', 'x2', 'x3']} />
        <YAxis />
        <Tooltip trigger="axis" />
      </Chart>
    </div>
  )
}

```

![image](https://user-images.githubusercontent.com/1826685/174950158-e5f8258d-b0b9-4c39-be90-7eefbb7667f0.png)


## 自定义组件

1. 通过自定义组件实现官方切换图像的[example](https://echarts.apache.org/examples/zh/editor.html?c=treemap-sunburst-transition)

```
function TreemapSunburstTransition() {

  const [type, setType] = useState('')
  const [data, setData] = useState()
  const interval = useRef()
  const id = 'echarts-package-size'

  useEffect(() => {
    const url = "https://fastly.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/echarts-package-size.json"
    fetch(url).then(res => res.json()).then(data => {
      setData(data.children)
      let type = ''
      console.log('data.value', data.children)
      interval.current && clearInterval(interval.current);
      // @ts-ignore
      interval.current = setInterval(function () {
        setType(type = type === 'treemap' ? 'sunburst' : 'treemap')
        console.log('state.type', type)
      }, 3000);
    })
    return () => interval.current && clearInterval(interval.current)
  }, [])

  if (type === 'treemap') {
    return <Treemap id={id} animationDurationUpdate={1000} roam={false} nodeClick={undefined} data={data} universalTransition label={{show: true}} breadcrumb={{show: false}} />
  }
  return <Sunburst id={id} radius={['20%', '90%']} animationDurationUpdate={1000} nodeClick={undefined} data={data} universalTransition label={{show: false}} itemStyle={{borderWidth: 1, borderColor: 'rgba(255,255,255,.5)'}} />
}


function App() {

  return (
    <div className="App">
      <Chart width={800}>
        <TreemapSunburstTransition />
      </Chart>
    </div>
  )
}
```

![](https://fastly.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/thumb/treemap-sunburst-transition.webp?_v_=1655181358610)


