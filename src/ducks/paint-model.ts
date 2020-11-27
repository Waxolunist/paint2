export interface Painting {
  id?: number;
  dataUrl?: string;
  readonly blobUrl: string;
  freeMemory: () => void;
  cleanState: () => Promise<void>;
}

export const defaultDataUrl =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export class PaintingImpl implements Painting {
  id?: number;
  dataUrl? = defaultDataUrl;
  #blobUrl: string;

  constructor(dataUrl?: string, id?: number | string) {
    if (id) this.id = parseInt(id as string);
    if (dataUrl) this.dataUrl = dataUrl;
    this.#blobUrl = '';
  }

  get blobUrl(): string {
    return this.#blobUrl;
  }

  async cleanState(): Promise<void> {
    this.freeMemory();
    const response = await fetch(this.dataUrl!);
    this.#blobUrl = URL.createObjectURL(await response.blob());
    delete this.dataUrl;
  }

  freeMemory(): void {
    if (this.#blobUrl) URL.revokeObjectURL(this.#blobUrl);
  }
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

export class PaintingRawData implements PaintingRawData {
  paintingId: number;
  strokes: Stroke[];

  constructor(paintingId: number, strokes: Stroke[]) {
    this.paintingId = paintingId;
    this.strokes = strokes;
  }
}

export interface CRUDPayload {
  painting: Painting;
  rawData?: PaintingRawData;
}

export interface PaintState {
  paintings: Painting[];
  activePainting?: CRUDPayload;
  initialized: boolean;
}
