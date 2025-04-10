declare module "pdf-parse/lib/pdf-parse.js" {
  interface PDFOptions {
    max?: number;
    version?: string;
  }

  interface PDFData {
    text: string;
    numpages: number;
    info: {
      PDFFormatVersion: string;
      IsAcroFormPresent: boolean;
      IsXFAPresent: boolean;
      [key: string]: any;
    };
    metadata: any;
    version: string;
  }

  function pdfParse(dataBuffer: Buffer, options?: PDFOptions): Promise<PDFData>;
  export default pdfParse;
}
