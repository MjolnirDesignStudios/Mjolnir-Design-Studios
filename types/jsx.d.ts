import { MeshProps, PlaneGeometryProps, PrimitiveProps } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: MeshProps;
      planeGeometry: PlaneGeometryProps;
      primitive: PrimitiveProps;
    }
  }
}