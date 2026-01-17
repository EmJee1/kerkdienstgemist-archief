export interface IServiceEnclosure {
  length: number;
  type: string;
  url: string;
}

export interface IServiceItunes {
  summary: string;
  duration: string;
  author?: string;
}

export interface IKDGService {
  title: string;
  link: string;
  pubDate: string;
  enclosure: IServiceEnclosure;
  content: string;
  contentSnippet: string;
  guid: string;
  isoDate: string;
  itunes: IServiceItunes;
}

export interface IService {
  title: string;
  file: string;
  pastor?: string;
  createdAt: Date;
}
