import type {ReactNode} from 'react';
export default function VisualizationSurface({children,className=''}:{children:ReactNode;className?:string}){return <div className={`viz ${className}`}>{children}</div>}
