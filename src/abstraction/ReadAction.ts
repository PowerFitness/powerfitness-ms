/* eslint-disable @typescript-eslint/no-explicit-any */
import Action from './Action';

export interface RowDataPacket {
    [column: string]: any;
    [column: number]: any;
}

export abstract class ReadAction extends Action<Array<RowDataPacket>> {}
