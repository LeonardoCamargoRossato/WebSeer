declare module 'wordcloud' {
  type WordEntry=[string,number];
  interface WordCloudOptions{
    list:WordEntry[];
    gridSize?:number;
    weightFactor?:number|((weight:number)=>number);
    fontFamily?:string;
    color?:string|((word:string,weight:number)=>string);
    backgroundColor?:string;
    rotateRatio?:number;
    rotationSteps?:number;
    minRotation?:number;
    maxRotation?:number;
    shape?:string;
    ellipticity?:number;
    drawOutOfBound?:boolean;
    shrinkToFit?:boolean;
  }
  export default function WordCloud(element:HTMLElement|HTMLElement[],options:WordCloudOptions):void;
}
