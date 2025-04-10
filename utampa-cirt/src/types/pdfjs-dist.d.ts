declare module "pdfjs-dist/build/pdf" {
  export const getDocument: (options: { data: ArrayBuffer }) => Promise<{
    promise: Promise<{
      numPages: number;
      getPage: (pageNumber: number) => Promise<{
        getTextContent: () => Promise<{
          items: Array<{ str: string }>;
        }>;
      }>;
    }>;
  }>;
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
}

declare module "pdfjs-dist/build/pdf.worker.entry" {
  const worker: string;
  export default worker;
}
