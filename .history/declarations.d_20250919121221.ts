declare module "react-native-maps" {
  import * as React from "react";
    import { ViewProps } from "react-native";

  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export interface MarkerProps {
    coordinate: { latitude: number; longitude: number };
    title?: string;
    description?: string;
    pinColor?: string;
  }

  export class Marker extends React.Component<MarkerProps> {}

  export interface MapViewProps extends ViewProps {
    region?: Region;
    initialRegion?: Region;
  }

  export default class MapView extends React.Component<MapViewProps> {}
}
