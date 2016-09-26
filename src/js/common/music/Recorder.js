/**
 * ...
 * @author Shirne
 */

(function(w) {
//	构造函数
	function Recorder(contentid,id,args)
	{
		this.flag='recorder_'+id;
		w[this.flag]=this;
		
		this.id=id;
		this.isReady=false;
		this.isRecord=false;
		this.isPlaying=false;
		this.object=null;
		this.argument=args;
		this.wrapper=document.getElementById(args['containerid']);
		
		var flashvars = {
			'onReady':this.flag+'.ready',
			'reciveURL':args.reciveURL
		};
		var params = {
			menu: "false",
			scale: "noScale",
			allowFullscreen: "true",
			allowScriptAccess: "always",
			bgcolor: "",
			wmode: "direct" // can cause issues with FP settings & webcam
		};
		var attributes = {
			id:id
		};
		swfobject.embedSWF(
			args.swfurl, 
			contentid, "500", "300", "11.7.0", 
			"expressInstall.swf", 
			flashvars, params, attributes);
		
		this.hide();
	}
	
	Recorder.prototype.hide=function(){
		this.wrapper.className='flashhide';
	}
	Recorder.prototype.show=function(){
		this.wrapper.className='';
	}
	
	Recorder.prototype.ready=function()
	{
		this.isReady=true;
		this.object=document.getElementById(this.id);
		
		if(this.argument.debug){
			this.object.Rcallback('debug',"1");
		}
		//绑定事件
		for(var i in this)
		{
			if(i.indexOf('on')==0)
			{
				this.object.Rcallback(i,this.flag+'.'+i);
			}
		}
		//检测麦克风支持,结果回调给onMicroSupport
		this.object.Rmicrosupport();
	}
	
	Recorder.prototype.micro=function(){
		this.object.Rmicro();
	}
	
	Recorder.prototype.start=function(){
		if(this.isRecord)return;
		this.object.Rstart();
	}
	
	Recorder.prototype.stop=function(){
		this.object.Rstop();
	}
	
	Recorder.prototype.send=function(opt){
		this.object.Rsend(opt);
	}
	
	Recorder.prototype.clear=function(){
		this.object.Rclear();
	}
	
	
	
	Recorder.prototype.play=function(){
		if(this.isPlaying)return;
		this.object.Rplay();
	}
	
	
	Recorder.prototype.stopPlay=function(){
		this.object.RstopPlay();
	}
	
	//=================回调事件=================
	
	//接收结果文本,json格式的xml结构体
	Recorder.prototype.onResult=function(result,xml){
		this.log(xml);
		//alert('返回结果:'+result);
		if(this.argument.onResult){
			this.argument.onResult(result,xml);
		}
	}
	Recorder.prototype.onEmpty=function(){
		//alert('没有录到声音');
		if(this.argument.onEmpty){
			this.argument.onEmpty();
		}
	}
	//是否支持麦克风
	Recorder.prototype.onMicroSupport=function(result){
		if(!result){
			alert('当前设备不支持麦克风!');
		}else{
			this.log('支持麦克风！');
			this.micro();
		}
	}
	//在没有允许麦克风的情况下调用  true/false
	Recorder.prototype.onMicro=function(result){
		if(!result){
			//显示flash
			this.show();
			//alert();
			//调用flash的麦克风确认
			//this.micro();
		}else{
			this.log('已允许麦克风');
		}
	}
	
	
	//调用麦克风返回的结果,是否允许
	Recorder.prototype.onMicroResult=function(result){
		if(!result){
			alert('您没有允许麦克风设备，不能录音');
		}else{
			this.log('允许了麦克风');
			this.hide();
		}
	}
	
	//开始录音
	Recorder.prototype.onStart=function(){
		
		this.isRecord=true;
		this.log('开始录音');
		if(this.argument.onStart){
			this.argument.onStart();
		}
	}
	//结束录音
	Recorder.prototype.onStop=function(){
		
		this.isRecord=false;
		this.log('结束录音');
		if(this.argument.onStop){
			this.argument.onStop();
		}
	}
	//正在录音
	Recorder.prototype.onRecording=function(progress,alevel)
	{
		this.log('正在录音：'+progress+','+alevel);
		if(this.argument.onRecording)
		{
			this.argument.onRecording(progress,alevel);
		}
	}
	//清除录音
	Recorder.prototype.onClear=function(result)
	{
		this.log('清除录音');
		if(this.argument.onClear)
		{
			this.argument.onClear();
		}
	}
	
	Recorder.prototype.onPlay=function(result)
	{
		this.isPlaying=true;
		this.log('播放录音');
	}
	
	Recorder.prototype.onPlaying=function(progress){
		this.log('播放录音进度:' + progress);
		if(this.argument.onPlaying){
			this.argument.onPlaying(progress);
		}
	}
	
	Recorder.prototype.onPausePlay=function(result){
		this.isPlaying=false;
		this.log('暂停播放');
		if(this.argument.onPausePlay){
			this.argument.onPausePlay();
		}
	}
	
	Recorder.prototype.onStopPlay=function(result){
		this.isPlaying=false;
		this.log('停止播放');
		if(this.argument.onStopPlay){
			this.argument.onStopPlay();
		}
	}
	
	//=================回调事件 END=============
	
	
	Recorder.prototype.log=function(message){if(console && console.log) console.log(message);
}
	w.Recorder=Recorder;
})(window);