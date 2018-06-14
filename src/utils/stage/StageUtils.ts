class StageUtils {
	private static _stage:egret.Stage;
	
	public static init(stage:egret.Stage) {
		this._stage = stage;	
	}
	
	public static get stage() {
		return this._stage;
	}
	
	public static get stageWidth() {
		return this._stage.width;
	}
	
	public static get stageHeight() {
		return this._stage.height;
	}
	
	public static set scaleMode(scaleMode:string) {
		this._stage.scaleMode = scaleMode;
	}
	
	public static set frameRate(frameRate:number) {
		this._stage.frameRate = frameRate;
	}
}