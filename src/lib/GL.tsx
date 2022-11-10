import { EFC, defineComponent } from './Components'

interface GlobeProps {
  [key: string]: any
}

export const Globe: EFC<GlobeProps> = defineComponent<GlobeProps>("Globe");
export const Geo3D: EFC<GlobeProps> = defineComponent<GlobeProps>("Geo3D");
export const Mapbox3D: EFC<GlobeProps> = defineComponent<GlobeProps>("Mapbox3D");
export const Grid3D: EFC<GlobeProps> = defineComponent<GlobeProps>("Grid3D");
export const XAxis3D: EFC<GlobeProps> = defineComponent<GlobeProps>("XAxis3D", "value");
export const YAxis3D: EFC<GlobeProps> = defineComponent<GlobeProps>("YAxis3D", "value");
export const ZAxis3D: EFC<GlobeProps> = defineComponent<GlobeProps>("ZAxis3D", "value");

export const Scatter3D: EFC<GlobeProps> = defineComponent<GlobeProps>("Scatter3D");
export const Bar3D: EFC<GlobeProps> = defineComponent<GlobeProps>("Bar3D");
export const Line3D: EFC<GlobeProps> = defineComponent<GlobeProps>("Line3D");
export const Lines3D: EFC<GlobeProps> = defineComponent<GlobeProps>("Lines3D");
export const Map3D: EFC<GlobeProps> = defineComponent<GlobeProps>("Map3D");
export const Surface: EFC<GlobeProps> = defineComponent<GlobeProps>("Surface");
export const Polygons3D: EFC<GlobeProps> = defineComponent<GlobeProps>("Polygons3D");
export const ScatterGL: EFC<GlobeProps> = defineComponent<GlobeProps>("ScatterGL");
export const GraphGL: EFC<GlobeProps> = defineComponent<GlobeProps>("GraphGL");
export const FlowGL: EFC<GlobeProps> = defineComponent<GlobeProps>("FlowGL");
