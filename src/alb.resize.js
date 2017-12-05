// 定义旋转
function Resize(options) {

	if (!(this instanceof Resize)) {
		return new Resize(options);
	}
	this.initialize.apply(this, arguments);
}
Resize.prototype = {
	initialize: function(options) {
		this.setOptions(options);
		//配置参数
		this.a = this.config.a;
		this.b = this.config.b;
		this.w = this.config.w;
		this.h = this.config.h;
		this.l = this.config.l;
		this.t = this.config.t;
		this.dx = this.config.dx;
		this.dy = this.config.dy;
		this.angel = this.config.angel;
		this.ox = this.w / 2 //图片中心横坐标
		this.oy = this.h / 2; //图片中心纵坐标
		this.axis = ''; //拖拽方向
	},
	//初始化图片信息：处理本地上传图片宽高
	resize: function() {

		var ratew = this.a / this.w; //宽比
		var rateh = this.b / this.h; //高比
		if (ratew < rateh) {
			this.a = this.w;
			this.b = this.b / ratew;
			this.axis = 'y';
		} else if (ratew == rateh) {
			this.a = this.w;
			this.b = this.h;
		} else {
			this.a = this.a / rateh;
			this.b = this.h;
			this.axis = 'x';
		}
		this.l = (this.w - this.a) / 2;
		this.t = (this.h - this.b) / 2;
	},
	//拉伸图片信息
	stretch: function() {
		var ratew = this.a / this.w;
		var rateh = this.b / this.h;
		// console.log(this.a, ratew, rateh);
		if (ratew < rateh) {
			this.t += (this.a - this.a / ratew) / 2; //纵坐标加上变化的值
			this.l += (this.b - this.b / ratew) / 2;
			this.a = this.w;
			this.b = this.b / ratew;
			this.axis = 'y';
			if (this.angel % 180) {
				var dx = this.l + this.b / 2 - this.ox;
				var dy = this.t + this.a / 2 - this.oy;
			} else {
				var dx = this.l + this.a / 2 - this.ox;
				var dy = this.t + this.b / 2 - this.oy;
			}
		} else if (ratew == rateh) {
			this.a = this.w;
			this.b = this.h;
			this.axis = '';
		} else {
			this.l += (this.b - this.b / rateh) / 2; //
			this.t += (this.a - this.a / rateh) / 2; //计算有误差
			this.a = this.a / rateh;
			this.b = this.h;
			this.axis = 'x';
			//修复图片中心位置
			if (this.angel % 180) {
				var dx = this.l + this.b / 2 - this.ox;
				var dy = this.t + this.a / 2 - this.oy;
			} else {
				var dx = this.l + this.a / 2 - this.ox;
				var dy = this.t + this.b / 2 - this.oy;
			}
		}
		this.l -= dx;
		this.t -= dy;
		// console.log(this.l, this.t, this.a, this.b);
	},
	//归并参数值
	setOptions: function(options) {
		var defaults = {
			a: null, //图片视觉宽
			b: null, //图片视觉高
			w: null, //相框宽
			h: null, //相框高
			l: null, //图片左坐标
			t: null, //图片上坐标
			dx: null, //移动距离x
			dy: null, //移动距离y
			angel: null //旋转角度
		};
		this.config = $.extend({}, defaults, options);
	}
};