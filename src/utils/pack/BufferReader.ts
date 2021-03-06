// 二进制数据读取类
class BufferReader
{
	constructor(buffer: ArrayBuffer|Uint8Array, byteOffset?: number, byteLength?: number) {
		if (buffer) {
			let arrybuf: ArrayBuffer = (buffer instanceof Uint8Array) ? buffer.buffer : buffer;
			this._dataview = new DataView(arrybuf, byteOffset, byteLength);
		}
	}

	// buffer size
	public get Length(): number { return this._dataview.byteLength; }
	public get AvaliableLength(): number { return this._dataview.byteLength - this._pos; }
	// current read position
	public get Position(): number { return this._pos; }
	public set Position(pos: number) { this._pos = Math.min(pos, this._dataview.byteLength); }
	// get ArrayBuffer
	public get Buffer(): ArrayBuffer { return this._dataview.buffer; }
	//get relation position from begin of Buffer()
	public get BufferPosition(): number { return this._pos + this._dataview.byteOffset; }
	// get DataView
	public get DataView(): DataView { return this._dataview; }
	
	public getInt8(): number { return this._getNumber(1, this._dataview.getInt8); }
	public getUint8(): number { return this._getNumber(1, this._dataview.getUint8); }
	public getInt16(): number { return this._getNumber(2, this._dataview.getInt16); }
	public getUint16(): number { return this._getNumber(2, this._dataview.getUint16); }
	public getFloat32(): number { return this._getNumber(4, this._dataview.getFloat32); }
	public getFloat64(): number { return this._getNumber(8, this._dataview.getFloat64); }
	public getInt32(): number { return this._getNumber(4, this._dataview.getInt32); }
	public getUint32(): number { return this._getNumber(4, this._dataview.getUint32); }
	public getBuffer(buffSize: number): ArrayBuffer {
		if (this._pos + buffSize > this._dataview.byteLength) {
			console.error(`read buffer failure. available length not enought.[${this.AvaliableLength}:${buffSize}]`);
		} else {
			const start_pos = this._dataview.byteOffset + this._pos;
			if (this._dataview.byteOffset)
			this._pos += buffSize;
			return this._dataview.buffer.slice(start_pos, start_pos + buffSize);
		}
		return new ArrayBuffer(0);
	}

	// -------------------- private side --------------------
	private _getNumber(size: number, readfunc: Function): number {
		if (this.AvaliableLength < size) {
			console.error(`read buffer failure. available length not enought.[${this.AvaliableLength}:${size}]`);
		} else {
			const old_pos = this._pos;
			this._pos += size;
			return readfunc.call(this._dataview, old_pos, this._littleEndian);
		}
		return 0;
	}

	private static __zero_data_view = new DataView(new ArrayBuffer(0));
	private _dataview: DataView = BufferReader.__zero_data_view;
	private _pos = 0;
	private _littleEndian:boolean;
}
