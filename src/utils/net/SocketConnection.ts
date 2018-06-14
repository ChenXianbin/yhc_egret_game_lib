"use strict";

namespace yhc
{
	// 网络日志打印...
	class NetLogger
	{
		public static Info(message: string, ...optionalParams : any[]) : void { console.info("[NET]" + message, ...optionalParams); }
		public static Debug(message : string, ...optionalParams : any[]) : void { console.debug("[NET]" + message, ...optionalParams); }
		public static Warn(message : string, ...optionalParams : any[]) : void { console.warn("[NET]" + message, ...optionalParams); }
		public static Error(message : string, ...optionalParams : any[]) : void { console.error("[NET]" + message, ...optionalParams); }
	}

	// 网络状态枚举
	export enum EConnectStatus
	{
		Uninit, //未初始化
		Connecting, //正在连接
		Conntected, //已连接
		WaitReconnect, //等待自动重连
		Disconnected, //断开连接
	}

	export class SocketConnection
	{
		// 建立连接
		public Connect(url: string, protocols?: string | string[]) : boolean{
			this._url = url;
			this._protocols = protocols;
			this._enable_reconnect = true;
			if (this._status != EConnectStatus.WaitReconnect) {
				this._reconntect_count = 1;
			}
			if (this._ws != null) {
				this.Close();
			}

			this._ws = new WebSocket(url)
            this._ws.binaryType = "arraybuffer";
			this._ws.onclose = this.OnCloseEvent.bind(this);
			this._ws.onerror = this.OnErrorEvent.bind(this);
			this._ws.onmessage = this.OnMessageEvent.bind(this);
			this._ws.onopen = this.OnOpenEvent.bind(this);
			this._status = EConnectStatus.Connecting;
			return true;
		}

		//断开连接
		public Disconnect(reason: string = "", enableRetry?:boolean/*是否断线自动重连?*/): void {
			if (this._status == EConnectStatus.Disconnected || this._status == EConnectStatus.Uninit)
				return;
			// !!! ATTENTION : 避免产生断线重连，此处先将重连次数设置为max !!!
			this._enable_reconnect = enableRetry;
			let ev = new CloseEvent("SocketCloseEvent", {code:4999, reason});
			this.OnCloseEvent(ev);
		}

		//获取连接状态
		public Status() : EConnectStatus{ return this._status; }
		public get RetryMaxCount() { return this._reconnect_max; }
		public set RetryMaxCount(v: number) { this._reconnect_max = v; if (this._reconnect_max > 0) { this._enable_reconnect = true; } }
		public get RetryIntervalMS() { return this._reconntec_interval_ms; }
		public set RetryIntervalMS(v: number) { this._reconntec_interval_ms = v; }
		public get OnClose(): (ev: CloseEvent)=>any { return this._on_close; }
		public get OnError(): (ev: Event)=>any { return this._on_error; }
		public get OnMessage(): (ev: MessageEvent)=>any { return this._on_message; }
		public get OnOpen(): (ev: Event)=>any { return this._on_open; }
		public set OnClose(func: (ev: CloseEvent)=>any) { this._on_close = func; }
		public set OnError(func: (ev: Event)=>any) { this._on_error = func; }
		public set OnMessage(func: (ev: MessageEvent)=>any) { this._on_message = func; }
		public set OnOpen(func: (ev: Event)=>any) { this._on_open = func; }

		// 发送网络数据
		public SendData(data : any) : void {
			if (this.Status() != EConnectStatus.Conntected) {
				NetLogger.Error("Cannot Send Data When Not Connected!");
				return;
			}
			if (this._ws == null) {
				NetLogger.Error("ATTENTION : Conntected But WS Target Is null");
				this.Disconnect("Send WS Empty Close", false);
			}
			this._ws.send(data);
		}

		protected Close() : void {
			if (this._status == EConnectStatus.Disconnected || this._status == EConnectStatus.Uninit) {
				return;
			}
			this._status = EConnectStatus.Disconnected;
			if (this._reconnect_timer != null) {
				clearTimeout(this._reconnect_timer);
				this._reconnect_timer = null;
			}
			if (this._ws != null) {
				this._ws.onclose = this._ws.onerror = this._ws.onmessage = this._ws.onopen = null;
				this._ws.close();
				this._ws = null;
			}
		}

		private OnCloseEvent(ev : CloseEvent) : void {
			NetLogger.Debug(`Recv Conntection Close Event code : ${ev.code}. reason: ${ev.reason}`);
			if (this._enable_reconnect && this._reconntect_count <= this._reconnect_max) {
				this.Reconntect();
			}
			else {
				this.Close();
				if (this._on_close) {
					NetLogger.Info("Socket Dispatch Close Event");
					this._on_close(ev);
				}
			}
		}

		private OnErrorEvent(ev : Event) : void {
			NetLogger.Debug("Recv Connection Error");
			if (this._reconntect_count <= this._reconnect_max) {
				this.Reconntect();
			}
			else {
				this.Close();
				if (this._on_error) {
					NetLogger.Info("Socket Dispatch Error Event");
					this._on_error(ev);
				}
			}
		}

		private OnMessageEvent(ev : MessageEvent) : void {
			if (this._on_message) {
				this._on_message(ev);
			}
		}

		private OnOpenEvent(ev : Event) : void {
			NetLogger.Debug("Connection Success [%s]", this._url);
			this._status = EConnectStatus.Conntected;
			this._reconntect_count = 0;
			if (this._on_open) {
				this._on_open(ev);
			}
		}

		// 重试连接
		private Reconntect() : void {
			if (this._status == EConnectStatus.WaitReconnect)
				return;
			++this._reconntect_count;
			this._status = EConnectStatus.WaitReconnect;
			if (this._reconnect_timer != null) {
				console.assert(false, "meet terrible  errrrrrrrrrrrrrrrrrrrrrrrrrrror here!");
			}
			this._reconnect_timer = setTimeout(() => {
				this._reconnect_timer = null;
				this.Connect(this._url, this._protocols);
			}, this._reconntec_interval_ms);
		}

		private _ws : WebSocket = null;
		private _url = "";
		private _protocols?: string | string[] = null;
		private _status = EConnectStatus.Uninit;
		private _reconntec_interval_ms = 1000;//自动重连间隔
		private _reconnect_max = 0;//自动重连最大上限
		private _reconntect_count = 0;//当前自动重连次数
		private _reconnect_timer = null;
		private _enable_reconnect = false;

		private _on_close: (ev: CloseEvent)=>any = null;
		private _on_error: (ev: Event)=>any = null;
		private _on_message: (ev: MessageEvent)=>any = null;
		private _on_open: (ev: Event)=>any = null;
	}
}
