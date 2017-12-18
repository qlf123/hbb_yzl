//模板页
function Template(opts) {
	var _this = this;
	this.opts = opts;
	this.currentPage = 0;
	this.obj; //页面数据
	this.layer; //后台layer数据
	this.pageId; //单个页面id
	this.heightop;
	this.album = []; //保存页面数据
	this.opus = [];
	// TODO：web端不需要先选择图片
	//if (!localStorage.opusId && localStorage.picnum != '0') {
	//	this.photo = JSON.parse(localStorage.photo); //选择的图片
	//	// console.log(this.photo);
	//} else {
	//	this.photo = [];
	//}
	this.photo = [];
	this.indexOfImg = 0; //图片序数 
	this.w; //相框宽
	this.h; //相框高
	this.l; //横坐标
	this.t; //纵坐标
	this.dx = 0; //移动横向距离
	this.dy = 0; //移动纵向距离
	this.a; //视觉宽度
	this.b; //视觉高度
	this.angel = 0; //图片角度
	this.axis; //拖拽方向
	this.totalPages; //总页数
	this.left; //左边坐标
	this.top; //上坐标
	this.oldl; //记录旧x坐标
	this.oldh; //记录旧y坐标
	this.minX;
	this.maxX;
	this.minY;
	this.maxY;
	this.albumId;
	this.year;
	this.pic;
	this.picSzie;
	this.updateOpus = false; //更新作品
	this.page = (function() {
		var config = {
				$bookBlock : $( '#bb-bookblock' ),
				$navNext : $( '#bb-nav-next' ),
				$navPrev : $( '#bb-nav-prev' ),
				$navFirst : $( '#bb-nav-first' ),
				$navLast : $( '#bb-nav-last' )
			},
			init = function() {
				config.$bookBlock.bookblock( {
					speed : 800,
					shadowSides : 0.8,
					shadowFlip : 0.7
				} );
				initEvents();
			},
			initEvents = function() {

				var $slides = config.$bookBlock.children();

				// add navigation events
				config.$navNext.on( 'click touchstart', function() {
					_this.loadAlbum();
					config.$bookBlock.bookblock('update');
					config.$bookBlock.bookblock('next');
					return false;
				} );

				config.$navPrev.on( 'click touchstart', function() {
					config.$bookBlock.bookblock( 'prev' );
					return false;
				} );

				config.$navFirst.on( 'click touchstart', function() {
					config.$bookBlock.bookblock( 'first' );
					return false;
				} );

				config.$navLast.on( 'click touchstart', function() {
					config.$bookBlock.bookblock( 'last' );
					return false;
				} );

				// add swipe events
				$slides.on( {
					'swipeleft' : function( event ) {
						config.$bookBlock.bookblock( 'next' );
						return false;
					},
					'swiperight' : function( event ) {
						config.$bookBlock.bookblock( 'prev' );
						return false;
					}
				} );

				// add keyboard events
				$( document ).keydown( function(e) {
					var keyCode = e.keyCode || e.which,
						arrow = {
							left : 37,
							up : 38,
							right : 39,
							down : 40
						};

					switch (keyCode) {
						case arrow.left:
							config.$bookBlock.bookblock( 'prev' );
							break;
						case arrow.right:
							config.$bookBlock.bookblock( 'next' );
							break;
					}
				} );
			};
		return { init : init };
	})();
	this.rate;
}

Template.prototype = {
	//-----------------------------------获取页面----------------------------------------
	getPage: function() {
		var _this = this;
		if (localStorage.opusId) {
			var uri = this.opts.domain + this.opts.opusuri;
			var _data = $.customParam({
				size: this.opts.pageSize,
				number: this.currentPage,
				opusId: this.opts.opusId,
				token: localStorage.token
			});
		} else {
			var uri = this.opts.domain + this.opts.tempuri;
			var _data = $.customParam({
				size: this.opts.pageSize,
				number: this.currentPage,
				sort: [{
					'direction': 'ASC',
					'property': 'pageIndex'
				}],
				templateId: this.opts.templateId,
				token: localStorage.token
			});
		}

		$.ajax({
			type: 'post',
			dataType: "json",
			url: uri,
			data: _data,
			beforeSend: function() {
				$("body").append('<div class="loading-small"></div>');
			}
		}).done(function(obj) {
			//数据
			_this.obj = obj.data.content;
			// console.log(obj.data.content);
			_this.totalPages = obj.data.totalPages;
			$(".loading-small").remove();
			_this.createPages();
		}).fail(function() {
			alert('没有图片');
		});
	},
	//------------------------------------创建页面--------------------------------------
	createPages: function() {
		// console.log(this.obj);
		var length = this.obj.length;
		for (var i = 0; i < length; i++) {
			this.album.push(this.obj[i]);
			// console.log(this.album);
			this.pageId = 'temp-' + this.obj[i].pageIndex;
			var div = '<div class="temp-page bb-item"><div id="' + this.pageId + '"></div></div>';
			// console.log(this.obj.content[i].pageIndex);
			$(this.opts.container).append(div);
			this.eachPage(this.obj[i]);
		}
	},
	//遍历图层
	eachPage: function(_obj) {
		var j = 0;
		var pageIndex = _obj.pageIndex;
		while (j < _obj.layers.length) {
			var layer = _obj.layers[j];
			if (layer) {
				switch (layer.type) {
					case 1:
						{
							// 背景
							var url = this.opts.zimgUri + layer.uri;
							this.setbgcss(url, layer);
						}
						break;
					case 2:
						{
							// 照片框:注意z-index的值
							this.eachSetcss(layer, pageIndex);
						}
						break;
					case 3:
						{
							//遮罩
							this.eachSetcss(layer, pageIndex);
						}
						break;
					case 4:
						{
							// 文字
							this.eachSetcss(layer, pageIndex);
						}
						break;
					case 5:
						{
							// 姓名
							this.setFont(layer, pageIndex);
						}
						break;
					case 6:
						{
							// 时间
							this.setBirthday(layer, pageIndex);
						}
						break;
				}
			}
			j++;
		}
	},
	//-----------------------------------设置生日------------------------------------------
	setBirthday: function(layer, pageIndex) {
		//作品
		if (localStorage.update || localStorage.special) {
			delete localStorage.special;
			var yy = localStorage.studentBirthday.split('/');
			var mm = yy[1];
			var dd = yy[2];
			yy = yy[0].slice(2, 4);
		} else {
			// 模板
			var yy = localStorage.studentBirthday.split('年');
			var mm = yy[1];
			mm = mm.split('月');
			var dd = mm[1].slice(0, 2); //天
			mm = mm[0]; //月份
			yy = yy[0].slice(2, 4); //年份	
		}
		if (layer.fontContent.indexOf('YY') >= 0) {
			layer.fontContent = layer.fontContent.replace('YY', yy);
		}
		if (layer.fontContent.indexOf('MM') >= 0) {
			layer.fontContent = layer.fontContent.replace('MM', mm);
		}
		if (layer.fontContent.indexOf('DD') >= 0) {
			layer.fontContent = layer.fontContent.replace('DD', dd);
		}
		$('#' + this.pageId).append('<p class="' + pageIndex + layer.name + '">' + layer.fontContent + '</p>');
		$("." + pageIndex + layer.name).css({
			'top': layer.top + layer.fontSize / 3,
			'left': layer.left,
			'position': 'absolute',
			'z-index': layer.zIndex,
			'font-size': layer.fontSize,
			'font-family': 'birthday',
			'color': layer.fontColor,
			'line-height': 0
		});
	},
	setFont: function(layer, pageIndex) {
		if (layer.fontContent.indexOf('XX') >= 0) {
			layer.fontContent = layer.fontContent.replace('XX', localStorage.studentName);
		}
		if (layer.fontContent.indexOf('xx') >= 0) {
			layer.fontContent = layer.fontContent.replace('xx', localStorage.studentName);
		}

		$('#' + this.pageId).append('<p class="' + pageIndex + layer.name + '">' + layer.fontContent + '</p>');
		$("." + pageIndex + layer.name).css({
			'top': layer.top + layer.fontSize / 3,
			'left': layer.left,
			'position': 'absolute',
			'z-index': 10 + layer.zIndex,
			'font-size': layer.fontSize,
			'font-family': 'birthday',
			'color': layer.fontColor,
			'line-height': 0
		});
	},
	//设置背景样式
	setbgcss: function(url, layer) {
		var _this = this;
		var frameWidth = $(window).width(),
			psdWidth = layer.width,
			psdHeight = layer.height,
			rate = 16 / layer.width,
			//rate = frameWidth / layer.width,
			marginLeft = layer.width / rate - layer.width,
			margintop = layer.height / rate - layer.height;
		_this.rate = rate;
		this.heightop = margintop / 2;
		$('#' + this.pageId).css({
			'background-image': 'url(' + url + '?f=jpg&w=640&q=90)',
			'background-repeat': 'no-repeat',
			'width': layer.width * rate + 'rem',
			'height': layer.height * rate + 'rem',
			'background-size': '100% 100%'
		});
		$('#' + this.pageId).parent().css({
				'height': layer.height * rate + 'rem'
		})
	},
	//设置每页的样式
	eachSetcss: function(layer, pageIndex) {
		var _this = this;
		var url = layer.uri;
		if (layer.type == 2) {
			url = layer.maskUri;
		}
		$('#' + this.pageId).append('<img  class="' + pageIndex + layer.name + '" src="' + this.opts.zimgUri + url + '?f=png&w=600">');
		if (layer.type != 2) {
			$("." + pageIndex + layer.name).css({
				'top': layer.top * _this.rate + 'rem',
				'left': layer.left * _this.rate + 'rem',
				'width': layer.width * _this.rate + 'rem',
				'height': layer.height * _this.rate + 'rem',
				'position': 'absolute',
				'z-index': 10 + layer.zIndex
			});
		}
		if (layer.type == 3) {
			$("." + pageIndex + layer.name).css('pointer-events', ' none');
		}

		if (layer.type == 2) {
			//作品:z-index属性
			if (layer.content != null) {
				$('.' + pageIndex + layer.name).attr('src', _this.opts.picurl + layer.content.uri + '?f=png&w=640');
				this.angel = layer.content.rotate;
				$("." + pageIndex + layer.name).css({
					'top': layer.content.top * _this.rate + 'rem',
					'left': layer.content.left * _this.rate + 'rem',
					'width': layer.content.offsetWidth * _this.rate + 'rem',
					'height': layer.content.offsetHeight * _this.rate + 'rem',
					'z-index': 1,
					'position': 'absolute'
				});
			} else if (layer.content == null && _this.indexOfImg >= _this.photo.length) {
				//模板中选择图片过少
				$("." + pageIndex + layer.name).css({
					'display': 'none'
				});
			}
			$("." + pageIndex + layer.name).css({
				'transform': 'rotate(' + _this.angel + 'deg)',
				'-moz-transform': 'rotate(' + _this.angel + 'deg)',
				'-webkit-transform': 'rotate(' + _this.angel + 'deg)'
			});

			$("." + pageIndex + layer.name).wrap('<div id="frm' + pageIndex + layer.name + '" />').promise().done(function() {
				$('#frm' + pageIndex + layer.name).css({
					'width': layer.width * _this.rate + 'rem',
					'height': layer.height * _this.rate + 'rem',
					'overflow': 'hidden',
					'top': layer.top * _this.rate + 'rem',
					'position': 'absolute',
					'left': layer.left * _this.rate + 'rem',
					'webkit-mask': 'url(' + _this.opts.zimgUri + url + '?f=png&w=600)',
					'mask-image': 'url(' + _this.opts.zimgUri + url + '?f=png&w=600)',
					'-webkit-mask-image': 'url(' + _this.opts.zimgUri + url + '?f=png&w=600)',
					'-webkit-mask': 'url(' + _this.opts.zimgUri + url + '?f=png&w=600)',
					'-webkit-mask-size': '100%',
					'background-repeat': 'no-repeat',
					'z-index': layer.zIndex
				});
				if (_this.indexOfImg < _this.photo.length) {
					$('.' + pageIndex + layer.name).attr('src', _this.opts.picurl + _this.photo[_this.indexOfImg].url + '?f=png&w=640&q=1');
					//模板:图片需要进行初始位置的操作
					if (!localStorage.update) {
						_this.setImgCss(layer, '.' + pageIndex + layer.name, _this.photo[_this.indexOfImg]);
					}
					//拼接数据
					_this.indexOfImg++;
				}
			});
			if (localStorage.type == 4 && localStorage.update) {} else {
				var $frm = $('#frm' + pageIndex + layer.name);
				$frm.off('click').on('click', function() {
					//消除垃圾数据
					tr = $("." + pageIndex + layer.name).css('transform');
					if (tr != "none") {
						var values = tr.split('(')[1];
						values = values.split(')')[0];
						values = values.split(',');
						var b = values[1]; //计算角度
						_this.angel = Math.round(Math.asin(b) * (180 / Math.PI));
						_this.a = $("." + pageIndex + layer.name).width() * _this.rate + 'rem';
						_this.b = $("." + pageIndex + layer.name).height() * _this.rate + 'rem';
						_this.l = $("." + pageIndex + layer.name).position().left * _this.rate + 'rem';
						_this.t = $("." + pageIndex + layer.name).position().top * _this.rate + 'rem';
						_this.w = layer.width * _this.rate + 'rem';
						_this.h = layer.height * _this.rate + 'rem';
					}
					$('#rotate,#replace').remove();
					$frm.after('<img id="rotate" src="../images/teacher_14.png">' +
						'<img id="replace" src="../images/teacher_17.png">');
					_this.setStyle(layer * _this.rate + 'rem', $frm, "." + pageIndex + layer.name);
				});
			}

			//拖拽
			$("." + pageIndex + layer.name).bind(document, 'touchmove', function(e) {
				e.preventDefault();
				e.stopPropagation();
				$(this).draggable({
					start: function(event, ui) {
						// 记录旧坐标
						_this.oldl = ui.position.left;
						_this.oldt = ui.position.top;
					},
					drag: function(event, ui) {
						// 拖拽限制区域策略：避免露出白色区域
						if (_this.axis == 'x') {
							if (ui.position.left < _this.minX) {
								ui.position.left = _this.minX;
							}
							if (ui.position.left > _this.maxX) {
								ui.position.left = _this.maxX;
							}
							ui.position.top = _this.minY;
						} else if (_this.axis == 'y') {
							if (ui.position.top < _this.minY) {
								ui.position.top = _this.minY;
							}
							if (ui.position.top > _this.maxY) {
								ui.position.top = _this.maxY;
							}
							ui.position.left = _this.minX;
						}
					},
					stop: function(event, ui) {
						// 更新坐标
						_this.left = _this.obj.content.left = ui.position.left;
						_this.top = _this.obj.content.top = ui.position.top;
						_this.dx = _this.left - _this.oldl;
						_this.dy = _this.top - _this.oldt;
					},
					axis: _this.axis
				});
			});
		}
	},
	//-------------------------------模板图片初始化--------------------------------------
	//设置替换图片样式
	setImgCss: function(frame, img, obj) {
		this.w = frame.width;
		this.h = frame.height;
		this.a = obj.width;
		this.b = obj.height;
		this.l = 0;
		this.t = 0;
		this.dx = this.dy = 0;
		// console.log(this.a,this.b);
		var resize = {
			a: this.a, //图片视觉宽
			b: this.b, //图片视觉高
			w: this.w, //相框宽
			h: this.h, //相框高
			l: this.l, //图片左坐标
			t: this.t, //图片上坐标
			dx: this.dx, //移动距离x
			dy: this.dy, //移动距离y
			angel: this.angel //旋转角度
		};
		var imgSzie = new Resize(resize);
		imgSzie.resize();
		this.a = parseInt(imgSzie.a);
		this.b = parseInt(imgSzie.b);
		this.l = parseInt(imgSzie.l);
		this.t = parseInt(imgSzie.t);
		this.axis = imgSzie.axis;
		this.targetImg(frame, img, obj);
	},
	//设置目标图片样式
	targetImg: function(layer, img, obj) {
		var _this = this;
		//uri已经存在时
		if (layer.content) {
			var uri = layer.content.uri;
		}

		$(img).css({
			'top': this.t,
			'left': this.l,
			'width': this.a,
			'height': this.b,
			'position': 'absolute',
			'z-index': 10
		});
		//填充数据
		layer.content = {
			uri: obj.url,
			offsetWidth: this.a,
			offsetHeight: this.b,
			width: obj.width,
			height: obj.height,
			top: this.t,
			left: this.l,
			rotate: 0
		};
		if (uri) {
			layer.content.uri = uri;
		}
	},
	//------------------------------------------------------------------------------------
	//设置旋转与替换的样式
	setStyle: function(layer, obj, objClass) {
		var _this = this;
		//旋转按钮
		$('#rotate').css({
			'width': obj.width() / 5.8,
			'height': obj.width() / 6,
			'display': 'block',
			'position': 'absolute',
			'top': obj.css('top'),
			'left': obj.css('left'),
			'margin-top': obj.height() / 2.5,
			'margin-left': obj.width() / 3.5,
			'z-index': 50
		});
		//替换按钮
		$('#replace').css({
			'width': obj.width() / 6.4,
			'height': obj.width() / 6,
			'display': 'block',
			'position': 'absolute',
			'top': obj.css('top'),
			'left': obj.css('left'),
			'margin-top': obj.height() / 2.5,
			'margin-left': 13 * obj.width() / 22,
			'z-index': 50
		});

		//旋转图片
		$('#rotate').off('click').on('click', function() {
			_this.rotate(layer, objClass);
		});
		//替换图片
		$('#replace').off('click').on('click', function() {
			_this.imgReplace(layer, objClass);
		});
	},
	//-------------------------------------替换图片---------------------------------------
	imgReplace: function(layer, objClass) {
		var _this = this;
		//if (localStorage.type == 3) {
		//	var url = this.opts.albUrl;
		//} else if (localStorage.type == 4) {
		//	var url = this.opts.timeLine;
		//} else {
		//	console.log('出现其他类型');
		//}
		var url = this.opts.timeLine;  // localStorage.type 4:教师，3：家长
		$.ajax({
			type: 'get',
			url: this.opts.domain + url,
			contentType: "application/json",
			dataType: "json",
			data: {
				token: localStorage.token
			}
		}).done(function(obj) {
			_this.year = obj.data;
			//if (localStorage.type == 3) {
			//	_this.albumId = obj.data;
			//} else if (localStorage.type == 4) {
			//	_this.year = obj.data;
			//} else {
			//	console.log('出现其他类型');
			//}
			_this.getPhoto(layer, objClass);
		}).fail(function() {
			console.log('没有图片');
		});
	},
	//获取图片
	getPhoto: function(layer, objClass) {
		var _this = this;
		//if (localStorage.type == 4) {
		//	var data = $.customParam({
		//		year: this.year[0],
		//		token: localStorage.token
		//	});
		//	var _url = this.opts.teUrl;
		//} else if (localStorage.type == 3) {
		//	var data = $.customParam({
		//		albumId: this.albumId._id,
		//		token: localStorage.token
		//	});
		//	var _url = this.opts.paUrl;
		//}
		var data = $.customParam({
			year: this.year[0],
			token: localStorage.token
		});
		var _url = this.opts.teUrl;
		$.ajax({
			type: 'get',
			url: this.opts.domain + _url,
			contentType: "application/json",
			dataType: "json",
			data: data
		}).done(function(obj) {
			if (null == obj.data || undefined == obj.data || (null != obj.data && undefined != obj.data && 0 == obj.data.length)) {
				var dialog = new Dialog({
					msg: '请先到班级圈发布状态，再来逛逛~',
					type: 0,
					bgcolor: '#eeeeee',
					btns: [{
						text: '好哒知道啦',
						type: 1,
						dhref: null
					}]
				});
				dialog.show();
				return;
			}
			_this.pic = obj.data;
			_this.picSzie = _this.pic.length;
			_this.createPicList(layer, objClass);
		}).fail(function() {
			console.log('没有图片');
		});
	},
	//创建图片列表：以模态框形式显示
	createPicList: function(layer, objClass) {
		var _this = this;
		$('.yhx-show').remove();
		// alert('我擦勒');
		var div = '<div class="yhx-show">';
		//------------------------------------------------------------------------------
		for (var i = 0, len = this.picSzie; i < len; i++) {
			div += '<div class="photoList" id="photo-' + i + '">' +
				'<img class="photoImg" data-height="' + _this.pic[i].imageLength + '"data-width="' + _this.pic[i].imageWidth + '" data-uri="' + this.pic[i].path + '" src="' + this.opts.picurl + this.pic[i].path + '?f=png&w=118&h=118">' +
				'</div>';
		}
		div += '</div>';
		$('#yhx-photo-footer').append(div);
		$('#yhx-photoList').modal('show');
		//保证学生列表显示框能够正确显示在可见区
		$('.yhx-show').css('position', 'absolute');
		//模态框高度判断:依据图片数量
		if (this.picSzie <= 32) {
			$('.yhx-show').parent().css('height', '100%');
		} else {
			$('.yhx-show').parent().css('height', $('.yhx-show').height() + 20);
		}
		//选择图片:更新样式
		$('.photoImg').each(function() {
			$(this).off('click').on('click', function() {
				// alert('我擦勒');
				delete $(objClass).attr('src');
				$(objClass).attr('src', _this.opts.picurl + $(this).attr('data-uri') + '?f=png&w=360');
				//content为空，无法抓取
				if (layer.content == null && _this.indexOfImg >= _this.photo.length) {
					//模板中选择图片过少
					layer.content = new Object();
					$(objClass).css({
						'display': 'block'
					});
				}
				var objImg = {
					url: $(this).attr('data-uri'),
					width: $(this).attr('data-width'),
					height: $(this).attr('data-height')
				};
				layer.content.uri = $(this).attr('data-uri');
				_this.setImgCss(layer, objClass, objImg); //替换图片之后初始化设置图片样式
				$('.yhx-show').remove();
				if (localStorage.type == 3 && localStorage.update) {
					_this.updateOpus = true;
				}
				setTimeout(function() {
					$('#yhx-photoList').modal('hide');
				}, 100);
			});
		});
	},
	//-------------------------------------旋转图片---------------------------------------
	rotate: function(layer, objClass) {
		// console.log(objClass); 
		if (localStorage.type == 3 && localStorage.update) {
			this.updateOpus = true;
		}
		this.angel += 90;
		layer.content.rotate = this.angel %= 360; //更新角度
		// console.log(this.angel);
		//交换宽高
		var t = this.a;
		this.a = this.b;
		this.b = t;
		this.l -= this.dx;
		this.t -= this.dy;
		var resize = {
			a: this.a, //图片视觉宽
			b: this.b, //图片视觉高
			w: this.w, //相框宽
			h: this.h, //相框高
			l: this.l, //图片左坐标
			t: this.t, //图片上坐标
			dx: this.dx, //移动距离x
			dy: this.dy, //移动距离y
			angel: this.angel //旋转角度
		};
		var img = new Resize(resize);
		img.stretch();
		this.a = parseInt(img.a);
		this.b = parseInt(img.b);
		this.l = this.left = parseInt(img.l); //记录坐标
		this.t = this.top = parseInt(img.t);
		this.axis = img.axis;
		this.resetcss(layer, objClass);
		img = resize = null;
		$(objClass).css({
			'-webkit-transform-origin': '(50%,50%)',
			'transform': 'rotate(' + this.angel + 'deg)',
			'-moz-transform': 'rotate(' + this.angel + 'deg)',
			'-webkit-transform': 'rotate(' + this.angel + 'deg)',
			'-o-transform': 'rotate(' + this.angel + 'deg)'
		});
		this.limiteArea();
	},
	//设定限制拖拽区域
	limiteArea: function() {
		switch (this.axis) {
			case 'y':
				{
					if (this.angel % 180) {
						this.minY = this.top - this.b / 2 + this.a / 2;
						this.maxY = this.top + this.b / 2 - this.a / 2;
						this.minX = this.left;
						this.maxX = this.left;
					} else {
						this.minY = -this.b + this.a;
						this.maxY = 0;
						this.maxX = this.minX = 0;
					}
				}
				break;
			case 'x':
				{
					if (this.angel % 180) {
						this.minX = this.l - this.a / 2 + this.w / 2;
						this.maxX = this.l + this.a / 2 - this.w / 2;
						this.minY = this.top;
						this.maxY = this.top;
					} else {
						this.minX = -this.a + this.w;
						this.maxX = 0;
						this.maxY = this.minY = 0;
					}

				}
				break;
			default:
				{
					this.maxY = this.minY = this.maxX = this.minX = 0;
				}
		}
		// console.log(this.minX, this.maxX, this.minY, this.maxY);
	},
	//重新设置样式
	resetcss: function(layer, objClass) {
		var _this = this;
		if (_this.angel % 180) {
			$(objClass).css({
				'left': _this.l,
				'top': _this.t,
				'width': _this.b,
				'height': _this.a
			});
			layer.content.offsetHeight = _this.a;
			layer.content.offsetWidth = _this.b;
			// console.log(_this.b / 2 + _this.l, _this.a / 2 + _this.t);
		} else {
			$(objClass).css({
				'left': _this.l,
				'top': _this.t,
				'width': _this.a,
				'height': _this.b
			});
			layer.content.offsetHeight = _this.b;
			layer.content.offsetWidth = _this.a;
			// console.log(_this.a / 2 + _this.l, _this.b / 2 + _this.t);
		}
		layer.content.top = this.t;
		layer.content.left = this.l;
		// console.log(layer.content);
	},
	//-----------------------------------加载页面-----------------------------------------
	//加载页面：怎么加载
	loadPage: function() {
		var _this = this;
		var height = 0; //dom高
		var runFlag = true;
		var diffHeight = $('.temp-page').height() * 2; //计算存在问题
		height += diffHeight;
		var clientH = $(window).height();
		// console.log($(window).height() + $(window).scrollTop(), height);
		$(window).scroll(function() {
			if (clientH + $(window).scrollTop() > height * 0.98) {
				// console.log(clientH + $(window).scrollTop(), height);
				if (_this.currentPage < _this.totalPages - 1) {
					height += diffHeight;
					_this.currentPage++;
					_this.getPage();
					// console.log(_this.currentPage);
					if (_this.currentPage == _this.totalPages - 1) {
						setTimeout(function() {
							// if (localStorage.update == 2 && localStorage.type == 4) {} else if (localStorage.update == 1 && localStorage.type == 3) {
							// 	_this.addSend('保存');
							// }
							if (localStorage.update == 2 && localStorage.type == 4) {} else if (localStorage.type == 3) {
								_this.addSend('保存');
								_this.addPrint('打印');
							} else {
								_this.addSend('发送');
							}
						}, 800);
					}
				} else if (_this.currentPage == 0 && runFlag) {
					setTimeout(function() {
						if (localStorage.update == 2 && localStorage.type == 4) {} else {
							_this.addSend('发送');
						}
					}, 800);
					runFlag = false;
				}
			}
		});

		if (_this.totalPages && this.obj.length <= 1) {
			if (localStorage.update == 2 && localStorage.type == 4) {} else {
				_this.addSend('发送');
			}
		}

	}, //添加发送按钮
	loadAlbum: function() {
		var _this = this;
		console.log('总数----------' + _this.totalPages)
		if (_this.currentPage < _this.totalPages - 1) {
			_this.currentPage++;
			console.log(_this.currentPage)
			_this.getPage();
		}
	}, //翻书加载
	addSend: function(btnWord) {
		var _this = this;
		var send = '<div class = "temp-send" >' +
			' <button id="yhx-send">' + btnWord + '</button>' +
			'</div>';
		$(this.opts.container).append(send);
		$('#yhx-send').unbind('click').bind('click', function() {
			//加入先点击打印，后来点保存，localStorage.printFlag已经是1，要改成0
			delete localStorage.printFlag;
			// 编写标题
			//if (localStorage.update && localStorage.type === '3') {
			$('#input').attr('placeholder', localStorage.title);
			//}

			$('#yhx-title').modal('show');
			//发送按钮
			$('#fin').off('click').on('click', function() {
				if (localStorage.update && localStorage.type === '3') {
					var _title = $('#input').val();

					if (_title == null || _title == undefined || _title == '' || _title == localStorage.title) {
						_this.updatePaOpus();
						if (!localStorage.printFlag) {
							//delete localStorage.templateId;
							delete localStorage.printFlag;
							delete localStorage.opusId;
							delete localStorage.orderId;
							delete localStorage.title;
							var str = localStorage.studentBirthday.replace('年', '-');
							str = str.replace('月', '-');
							str = str.replace('日', '');
							//回退到主界面电脑版
							// setTimeout(function() {
							// 	window.location.href = _this.opts.redomain + 'hbb_yzl_frontend/yhx_indexpa.html?parentId=' + localStorage.parentId + '&outerPersonId=' + localStorage.outerPersonId +
							// 		'&parentName=' + localStorage.parentName + '&outerToken=' + localStorage.outerToken + '&studentId=' + localStorage.studentId + '&studentName=' + localStorage.studentName +
							// 		'&schoolId=' + localStorage.schoolId + '&classId=' + localStorage.classId + '&className=' + localStorage.className + '&parentBirthday=' + localStorage.parentBirthday +
							// 		'&parentGender=' + localStorage.parentGender + '&parentPhone=' + localStorage.parentPhone + '&parentAddress=' + localStorage.parentAddress + '&studentAvatar=' + localStorage.studentAvatar +
							// 		'&studentBirthday=' + str + '&studentGender=' + localStorage.studentGender;
							// }, 1000);
							//返回首页手机版
							setTimeout(function() {
								window.location.href = _this.opts.redomain + 'hbb_yzl/yhx_indexpa.html?parentId=' + localStorage.parentId + '&outerPersonId=' + localStorage.outerPersonId +
									'&parentName=' + localStorage.parentName + '&outerToken=' + localStorage.outerToken + '&studentId=' + localStorage.studentId + '&studentName=' + localStorage.studentName +
									'&schoolId=' + localStorage.schoolId + '&classId=' + localStorage.classId + '&className=' + localStorage.className + '&parentBirthday=' + localStorage.parentBirthday +
									'&parentGender=' + localStorage.parentGender + '&parentPhone=' + localStorage.parentPhone + '&parentAddress=' + localStorage.parentAddress + '&studentAvatar=' + localStorage.studentAvatar +
									'&studentBirthday=' + str + '&studentGender=' + localStorage.studentGender;
							}, 1000);
						}
						return;
					}
					//只更新标题
					if (_title != localStorage.title && !_this.updateOpus) {
						localStorage.title = _title;
						_this.updateTitle();
					} else if (_title != localStorage.title && _this.updateOpus) {
						//更新标题和作品
						localStorage.title = _title;
						_this.updateTitleOp();
					} else if (_this.updateOpus) {
						//只更新作品
						_this.updatePaOpus();
					}
				} else {
					if (localStorage.type == 4) {
						_this.createTeOpus();
					} else if (localStorage.type == 3) {
						_this.createPaOpus();
					}
				}
			});
		});
		$(this.opts.container + '>.temp-page:last').css('margin-bottom', $('.temp-send').height());
	}, //打印按钮
	addPrint: function(btnWord) {
		var _this = this;
		var print = '<div class = "temp-print" >' +
			' <button id="yhx-printOpus">' + btnWord + '</button>' +
			'</div>';
		$(this.opts.container).append(print);
		$('.temp-send').css('width', '8rem');
		$('.temp-send>button').css('width', '8rem');
		$('#yhx-printOpus').unbind('click').bind('click', function() {
			//点击打印按钮，printFlag=1
			localStorage.printFlag = 1;
			// 编写电话号码
			//if (localStorage.update && localStorage.type === '3') {
			$('#input').attr('placeholder', localStorage.title);
			//}
			$('#yhx-title').modal('show');
			//发送按钮
			$('#fin').off('click').on('click', function() {
				if ($('#input').val() == localStorage.title) {
					localStorage.title = undefined;
					//localStorage.orderId = undefined;
					//delete localStorage.title;
				}
				if (localStorage.orderId && localStorage.opusId) {
					localStorage.update = 2;
				}
				if (localStorage.update && localStorage.type === '3') {
					var _title = $('#input').val();

					if (_title == null || _title == undefined || _title == '') {
						_this.updatePaOpus();
						return;
					}

					//只更新标题
					if (_title != localStorage.title && !_this.updateOpus) {
						localStorage.title = _title;
						_this.updateTitle();
					} else if (_title != localStorage.title && _this.updateOpus) {
						//更新标题和作品
						localStorage.title = _title;
						_this.updateTitleOp();
					} else if (_this.updateOpus) {
						//只更新作品
						_this.updatePaOpus();
					}
				} else {
					if (localStorage.type == 4) {
						_this.createTeOpus();
					} else if (localStorage.type == 3) {
						localStorage.title = $('#input').val();
						_this.createPaOpus();
					}
				}
			});

		});
		$(this.opts.container + '>.temp-page:last').css('margin-bottom', $('.temp-send').height());
		//监听打印模态框的数量变化来更新消费总额
		$('#quantity').bind('change', function() {
			$('#total').val($('#quantity').val() * 120);
		})
	}, //点击打印按钮接口
	recordPrint: function(opts) {
		$.ajax({
			type: 'post',
			dataType: 'json',
			url: opts.domain + 'temp/create/order',
			data: $.customParam({
				opusId: localStorage.opusId,
				token: localStorage.token
			})
		}).done(function(obj) {
			console.log(obj, '点击打印发送成功了！');
			localStorage.orderId = obj.data.id;
			localStorage.update = 2;
			console.log(localStorage.orderId);
		}).fail(function(obj) {
			alert(obj.msg, '更新作品失败');
		});
	},
	//显示打印模态框
	showPrint: function(opts) {
		var _this = this;
		var reg = /^\d+$/;
		$('#yhx-print').modal('show');
		//打印按钮
		$('#finPrint').off('click').on('click', function() {
			//如果电话或者数量为空，提示用户
			var quanti = $('#quantity').val();
			if ($('#quantity').val() == '' || $('#tel').val() == '' || reg.test(quanti) == false) {
				alert("请填写正确的数量和电话！");
				return;
			}
			//电话和数量不为空，执行以下内容
			var _quantity = $('#quantity').val();
			var _tel = $('#tel').val();
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: opts.domain + 'temp/update/order',
				data: $.customParam({
					orderId: localStorage.orderId,
					count: _quantity,
					phone: _tel,
					token: localStorage.token
				})
			}).done(function(obj) {
				console.log(obj, '打印发送成功了！');
				//回退到主界面
				//window.history.back();
				delete localStorage.opusId;
				delete localStorage.update;
				delete localStorage.printFlag;
				delete localStorage.orderId;
				delete localStorage.title;
				//把生日从中文转成反斜杠
				var str = localStorage.studentBirthday.replace('年', '-');
				str = str.replace('月', '-');
				str = str.replace('日', '');
				//返回首页电脑端
				// setTimeout(function() {
				// 	window.location.href = _this.opts.redomain + 'hbb_yzl_frontend/yhx_indexpa.html?parentId=' + localStorage.parentId + '&outerPersonId=' + localStorage.outerPersonId +
				// 		'&parentName=' + localStorage.parentName + '&outerToken=' + localStorage.outerToken + '&studentId=' + localStorage.studentId + '&studentName=' + localStorage.studentName +
				// 		'&schoolId=' + localStorage.schoolId + '&classId=' + localStorage.classId + '&className=' + localStorage.className + '&parentBirthday=' + localStorage.parentBirthday +
				// 		'&parentGender=' + localStorage.parentGender + '&parentPhone=' + localStorage.parentPhone + '&parentAddress=' + localStorage.parentAddress + '&studentAvatar=' + localStorage.studentAvatar +
				// 		'&studentBirthday=' + str + '&studentGender=' + localStorage.studentGender;
				// }, 1000);
				//返回首页手机版
				setTimeout(function() {
					window.location.href = _this.opts.redomain + 'hbb_yzl/yhx_indexpa.html?parentId=' + localStorage.parentId + '&outerPersonId=' + localStorage.outerPersonId +
						'&parentName=' + localStorage.parentName + '&outerToken=' + localStorage.outerToken + '&studentId=' + localStorage.studentId + '&studentName=' + localStorage.studentName +
						'&schoolId=' + localStorage.schoolId + '&classId=' + localStorage.classId + '&className=' + localStorage.className + '&parentBirthday=' + localStorage.parentBirthday +
						'&parentGender=' + localStorage.parentGender + '&parentPhone=' + localStorage.parentPhone + '&parentAddress=' + localStorage.parentAddress + '&studentAvatar=' + localStorage.studentAvatar +
						'&studentBirthday=' + str + '&studentGender=' + localStorage.studentGender;
				}, 1000);
			}).fail(function(obj) {
				alert(obj.msg, '更新作品失败');
				return;
			});
		});

		$(this.opts.container + '>.temp-page:last').css('margin-bottom', $('.temp-print').height());
	},
	//-----------------------------------创建教师作品-------------------------------------
	createTeOpus: function() {
		var _this = this;
		var _title = $('#input').val();
		if (!_title) {
			_title = localStorage.title;
		}
		// console.log(_title);
		for (var i = 0; i < this.album.length; i++) {
			if (this.album[i].id) {
				this.album[i].templatePageId = this.album[i].id;
				delete this.album[i].id;
			}
			var layer = this.album[i].layers;
			for (var j = 0; j < layer.length; j++) {
				if (layer[j].content == null) {
					delete layer[j].content;
				}
			}
		}

		$('#yhx-bear').modal('show');

		var jsonstu = JSON.parse(localStorage.stuList);
		for (var i = 0; i < jsonstu.length; i++) {
			var json = jsonstu[i].birthday;
			var str = json.replace('年', '/');
			str = str.replace('月', '/');
			str = str.replace('日', '');
			jsonstu[i].birthday = str;
		}

		$.ajax({
			type: 'post',
			dataType: 'json',
			url: this.opts.domain + this.opts.createUri,
			data: $.customParam({
				opusVo: {
					templateId: JSON.parse(localStorage.templateId),
					title: _title,
					pages: this.album
				},
				students: jsonstu,
				token: localStorage.token
			})
		}).done(function(obj) {
			console.log(obj, '创建作品成功了！');
			// $('#yhx-bear').modal('hide');
			//delete localStorage.templateId;
			$('#yhx-success').modal('show');
			//返回首页电脑版
			// setTimeout(function() {
			// 	window.location.href = _this.opts.redomain + 'hbb_yzl_frontend/yhx_indexte.html?userId=' + localStorage.userId + '&outerPersonId=' + localStorage.outerPersonId +
			// 		'&name=' + localStorage.name + '&outerToken=' + localStorage.outerToken + '&schoolId=' + localStorage.schoolId + '&classId=' + localStorage.classId +
			// 		'&className=' + localStorage.className + '&classType=' + localStorage.classType + '&avatar=' + localStorage.avatar + '&gender=' + localStorage.gender +
			// 		'&birthday=' + jsonstu + '&userType=' + localStorage.userType;
			// }, 1000);
			//返回首页手机版
			setTimeout(function() {
				window.location.href = _this.opts.redomain + 'hbb_yzl/yhx_indexte.html?userId=' + localStorage.userId + '&outerPersonId=' + localStorage.outerPersonId +
					'&name=' + localStorage.name + '&outerToken=' + localStorage.outerToken + '&schoolId=' + localStorage.schoolId + '&classId=' + localStorage.classId +
					'&className=' + localStorage.className + '&classType=' + localStorage.classType + '&avatar=' + localStorage.avatar + '&gender=' + localStorage.gender +
					'&birthday=' + jsonstu + '&userType=' + localStorage.userType;
			}, 1000);
		}).fail(function(obj) {
			alert(obj.msg, '创建作品出错');
		});
	},
	//------------------------------------创建家长作品------------------------------------
	createPaOpus: function() {
		var _this = this;
		var _title = $('#input').val();
		if (!_title) {
			_title = localStorage.title;
		}
		// console.log(_title);
		for (var i = 0; i < this.album.length; i++) {
			if (this.album[i].id) {
				this.album[i].templatePageId = this.album[i].id;
				delete this.album[i].id;
			}
			var layer = this.album[i].layers;
			for (var j = 0; j < layer.length; j++) {
				if (layer[j].content == null) {
					delete layer[j].content;
				}
			}
		}
		$('#yhx-bear').modal('show');
		$.ajax({
			type: 'post',
			dataType: 'json',
			url: this.opts.domain + this.opts.createUri,
			data: $.customParam({
				templateId: JSON.parse(localStorage.templateId),
				title: _title,
				pages: this.album,
				token: localStorage.token
			})
		}).done(function(obj) {
			console.log(obj, '创建作品成功了！');
			$('#yhx-success').modal('show');
			// $('#yhx-bear').modal('hide');
			//如果点击了打印按钮，判断是否跳出打印模态框
			//localStorage.opusId = obj.data.
			localStorage.opusId = obj.data.id;
			if (localStorage.printFlag == 1) {
				$('#yhx-bear').modal('hide');
				$('#yhx-success').modal('hide');
				if (localStorage.orderId == undefined) {
					_this.recordPrint(_this.opts);
				}
				_this.showPrint(_this.opts);
			}

			if (localStorage.printFlag != 1) {
				//delete localStorage.templateId;
				delete localStorage.printFlag;
				delete localStorage.opusId;
				delete localStorage.orderId;
				delete localStorage.title;
				var str = localStorage.studentBirthday.replace('年', '-');
				str = str.replace('月', '-');
				str = str.replace('日', '');
				//回退到主界面电脑版
				// setTimeout(function() {
				// 	window.location.href = _this.opts.redomain + 'hbb_yzl_frontend/yhx_indexpa.html?parentId=' + localStorage.parentId + '&outerPersonId=' + localStorage.outerPersonId +
				// 		'&parentName=' + localStorage.parentName + '&outerToken=' + localStorage.outerToken + '&studentId=' + localStorage.studentId + '&studentName=' + localStorage.studentName +
				// 		'&schoolId=' + localStorage.schoolId + '&classId=' + localStorage.classId + '&className=' + localStorage.className + '&parentBirthday=' + localStorage.parentBirthday +
				// 		'&parentGender=' + localStorage.parentGender + '&parentPhone=' + localStorage.parentPhone + '&parentAddress=' + localStorage.parentAddress + '&studentAvatar=' + localStorage.studentAvatar +
				// 		'&studentBirthday=' + str + '&studentGender=' + localStorage.studentGender;
				// }, 1000);
				//返回首页手机版
				setTimeout(function() {
					window.location.href = _this.opts.redomain + 'hbb_yzl/yhx_indexpa.html?parentId=' + localStorage.parentId + '&outerPersonId=' + localStorage.outerPersonId +
						'&parentName=' + localStorage.parentName + '&outerToken=' + localStorage.outerToken + '&studentId=' + localStorage.studentId + '&studentName=' + localStorage.studentName +
						'&schoolId=' + localStorage.schoolId + '&classId=' + localStorage.classId + '&className=' + localStorage.className + '&parentBirthday=' + localStorage.parentBirthday +
						'&parentGender=' + localStorage.parentGender + '&parentPhone=' + localStorage.parentPhone + '&parentAddress=' + localStorage.parentAddress + '&studentAvatar=' + localStorage.studentAvatar +
						'&studentBirthday=' + str + '&studentGender=' + localStorage.studentGender;
				}, 1000);
			}
		}).fail(function(obj) {
			alert(obj.msg, '创建作品出错');
		});
	},
	//---------------------------------------更新作品------------------------------------
	updatePaOpus: function() {
		var _this = this;
		for (var i = 0; i < this.album.length; i++) {
			var layer = this.album[i].layers;
			for (var j = 0; j < layer.length; j++) {
				if (layer[j].content == null) {
					delete layer[j].content;
				}
			}
		}
		$('#yhx-bear').modal('show');
		$.ajax({
			type: 'post',
			dataType: 'json',
			//url: this.opts.domain + this.opts.updateUri,
			url: this.opts.domain + 'outeropus/update/pageinfos',
			data: $.customParam({
				pages: this.album,
				token: localStorage.token
			})
		}).done(function(obj) {
			console.log(obj, '更新作品成功了！');
			$('#yhx-success').modal('show');
			//如果点击了打印按钮，判断是否跳出打印模态框
			if (localStorage.printFlag == 1) {
				$('#yhx-bear').modal('hide');
				$('#yhx-success').modal('hide');
				if (localStorage.orderId == undefined) {
					_this.recordPrint(_this.opts);
				}
				_this.showPrint(_this.opts);
			}
			if (localStorage.printFlag != 1) {
				//回退到主界面
				delete localStorage.orderId;
				delete localStorage.opusId;
				delete localStorage.update;
				delete localStorage.printFlag;
				delete localStorage.title;
				window.history.back();
			}
		}).fail(function(obj) {
			alert(obj.msg, '更新作品失败');
		});
	},
	//---------------------------------------更新标题------------------------------------
	updateTitle: function() {
		var _this = this;
		$.ajax({
			type: 'post',
			dataType: 'json',
			url: this.opts.domain + 'outeropus/update/title',
			data: $.customParam({
				title: decodeURIComponent(localStorage.title),
				opusId: JSON.parse(localStorage.opusId),
				token: localStorage.token
			})
		}).done(function(obj) {
			console.log(obj, '更新作品标题成功了！');
			$('#yhx-success').modal('show');
			//如果点击了打印按钮，判断是否跳出打印模态框
			if (localStorage.printFlag == 1) {
				$('#yhx-bear').modal('hide');
				$('#yhx-success').modal('hide');
				if (localStorage.orderId == undefined) {
					_this.recordPrint(_this.opts);
				}
				_this.showPrint(_this.opts);
			}
			if (localStorage.printFlag != 1) {
				//回退到主界面
				delete localStorage.orderId;
				delete localStorage.opusId;
				delete localStorage.update; //删除作品模板判断
				delete localStorage.printFlag;
				delete localStorage.title;
				window.history.back();
			}
		}).fail(function(obj) {
			alert(obj.msg, '更新作品标题失败');
		});
	},
	//----------------------------------更新标题与作品------------------------------------
	updateTitleOp: function() {
		var _this = this;
		$('#yhx-bear').modal('show');
		$.ajax({
			type: 'post',
			dataType: 'json',
			url: this.opts.domain + 'outeropus/update/title',
			data: $.customParam({
				title: decodeURIComponent(localStorage.title),
				opusId: JSON.parse(localStorage.opusId),
				token: localStorage.token
			})
		}).done(function(obj) {
			console.log(obj, '更新作品标题成功了！');
			//回退到主界面
			_this.updatePaOpus();
		}).fail(function(obj) {
			alert(obj.msg, '更新作品标题失败');
		});
	},
	//-----------------------------------绑定事件------------------------------------------
	pageOnClick: function() {
		var _this = this;
		$('#btn-share').off('click').on('click', function() {
			$('#modal-con').text('')
			$('#modal-con').append('<div id="qrcode"></div>')
			$('.modal-dialog').css({
				'margin-top': '-100px'
			})
			var qrcode = new QRCode("qrcode")
			console.log(window.location.href)
			qrcode.makeCode(window.location.href)
			$('#warn').modal('show');
		})
		$('#btn-print').off('click').on('click', function() {
			$('#modal-con').text('')
			$('#modal-con').append('联系XXX人员制定内容')
			$('#warn').modal('show');
		})
		$('#btn-save').off('click').on('click', function() {
			console.log(_this.opts)
			$.ajax({
				type: 'post',
				dataType: "json",
				url: _this.opts.domain + _this.opts.removeOpusuri,
				data: {
					opusId: localStorage.opusId || _this.opts.opusId,
					token: localStorage.token
				}
			}).done(function() {
				$('#modal-con').text('')
				$('#modal-con').append('删除成功')
				$('#warn').modal('show');
			}).fail(function() {
				$('#modal-con').text('')
				$('#modal-con').append('删除失败')
				$('#warn').modal('show');
			});
		})
	}
};