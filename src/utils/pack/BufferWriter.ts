// 二进制数据读取类
class BufferWriter
{
	constructor(initSize?: number, appendSize: number = 32) {
		this._buffer_expand_size = appendSize;
		this._uint8arry = new Uint8Array(initSize);
		this._dataview = new DataView(this._uint8arry.buffer);
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
	
	public setInt8(value: number): void { this._setNumber(value, 1, this._dataview.setInt8); }
	public setUint8(value: number): void { this._setNumber(value, 1, this._dataview.setUint8); }
	public setInt16(value: number): void { this._setNumber(value, 2, this._dataview.setInt16); }
	public setUint16(value: number): void { this._setNumber(value, 2, this._dataview.setUint16); }
	public setFloat32(value: number): void { this._setNumber(value, 4, this._dataview.setFloat32); }
	public setFloat64(value: number): void { this._setNumber(value, 8, this._dataview.setFloat64); }
	public setInt32(value: number): void { this._setNumber(value, 4, this._dataview.setInt32); }
	public setUint32(value: number): void { this._setNumber(value, 4, this._dataview.setUint32); }
	public setBuffer(buffer: Uint8Array|ArrayBuffer, offset?: number, length?: number): void {
		const wbuffer: Uint8Array = new Uint8Array((buffer instanceof Uint8Array) ? buffer : buffer, offset, length);
		const wlength = wbuffer.byteLength;
		this._validateBuffer(wlength)
		this._uint8arry.set(wbuffer, this._pos);
		this._pos += wlength;
	}

	// -------------------- private side --------------------

	private _setNumber(value: number, size: number, readfunc: Function): void {
		this._validateBuffer(size);
		const old_pos = this._pos;
		this._pos += size;
		readfunc.call(this._dataview, old_pos, value, this._littleEndian);
	}

	private _validateBuffer(len: number): void {
		const data_size = len + this._pos;
		if (this._dataview.byteLength < data_size) {
			const be = this._buffer_expand_size;
			var new_buffer = (be == 0) ? new Uint8Array(data_size) : new Uint8Array(((data_size / be >> 0) + 1) * be);
			new_buffer.set(this._uint8arry);
			this._uint8arry = new_buffer;
			this._dataview = new DataView(new_buffer.buffer);
		}
	};

	private _buffer_expand_size: number = 32;
	private _uint8arry: Uint8Array;
	private _dataview: DataView;
	private _pos = 0;
	private _littleEndian:boolean;
}
