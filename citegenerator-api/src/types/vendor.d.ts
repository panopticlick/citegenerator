declare module "citation-js" {
  export default class Cite {
    constructor(data: unknown);
    format(type: string, options?: unknown): string;
  }
}

declare module "jsdom" {
  export class JSDOM {
    constructor(html: string);
    window: { document: Document };
  }
}
