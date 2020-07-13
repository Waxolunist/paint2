export interface Painting {
  id: number;
  dataUrl: string;
  blobUrl?: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  points: Point[];
  erase: boolean;
  color: string;
}

export interface PaintingRawData {
  paintingId: number;
  strokes: Stroke[];
}

export interface CRUDPayload {
  painting: Painting;
  rawData: PaintingRawData;
}

export interface PaintState {
  paintings: Painting[];
  activePainting?: CRUDPayload;
}
