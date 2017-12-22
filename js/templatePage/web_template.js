
//模板页
function Template(opts) {
	var _this = this;
	this.opts = opts;
	this.currentPage = 0;
	this.obj; //页面数据
	this.layer; //后台layer数据
	this.pageId; //单个页面id
	this.album = []; //保存页面数据
	this.opus = [];
	this.photo = [];
	this.indexOfImg = 0; //图片序数 
	this.angel = 0; //图片角度
	this.totalPages; //总页数
	this.rate;
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
}
Template.prototype = {
	//-----------------------------------获取页面----------------------------------------
	getPage: function() {
		var _this = this;
		var uri = this.opts.domain + this.opts.opusuri;
		var _data = $.customParam({
			size: this.opts.pageSize,
			number: this.currentPage,
			opusId: this.opts.opusId,
			token: localStorage.token
			//token:'a01c9f84c0d68e9a'
		});
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
			_this.totalPages = obj.data.totalPages;
			$(".loading-small").remove();
			_this.createPages();
		}).fail(function() {
			alert('没有图片');
		});
	},
	//------------------------------------创建页面--------------------------------------
	createPages: function() {
		var length = this.obj.length;
		for (var i = 0; i < length; i++) {
			this.album.push(this.obj[i]);
			this.pageId = 'temp-' + this.obj[i].pageIndex;
			var div = '<div class="temp-page bb-item"><div id="' + this.pageId + '"></div></div>';
			$(this.opts.container).append(div);
			this.eachPage(this.obj[i]);
		}
	},
	//遍历图层
	eachPage: function(_obj) {
		var j = 0;
		var k = 0;
		var pageIndex = _obj.pageIndex;
		while (k < _obj.layers.length) {
			var layer = _obj.layers[k];
			if (layer.name == 'bg') {
				rate = 16 / layer.width;
			}
			k++;
		}
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
		$('#' + this.pageId).append('<p class="' + pageIndex + layer.name + '">' + layer.fontContent + '</p>');
		$("." + pageIndex + layer.name).css({
			'top': (layer.top + layer.fontSize / 3) * rate + 'rem',
			'left': layer.left * rate + 'rem',
			'position': 'absolute',
			'z-index': layer.zIndex,
			'font-size': layer.fontSize * rate + 'rem',
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
			'top': (layer.top + layer.fontSize / 3) * rate + 'rem',
			'left': layer.left * rate + 'rem',
			'position': 'absolute',
			'z-index': 10 + layer.zIndex,
			'font-size': layer.fontSize * rate + 'rem',
			'font-family': 'birthday',
			'color': layer.fontColor,
			'line-height': 0
		});
	},
	//设置背景样式
	setbgcss: function(url, layer) {
		$('#' + this.pageId).css({
			'background-image': 'url(' + url + '?f=jpg&w=960&q=90)',
			'background-repeat': 'no-repeat',
			'width': layer.width * rate + 'rem',
			'height': layer.height * rate + 'rem',
			'background-size': '100% 100%'
		});
		$('#' + this.pageId).parent().css({
			'height': layer.height * rate + 'rem'
		});

	},
	//设置每页的样式
	eachSetcss: function(layer, pageIndex) {
		var _this = this;
		var url = layer.uri;
		if (layer.type == 2) {
			url = layer.maskUri;
		}
		$('#' + this.pageId).append('<img  class="' + pageIndex + layer.name + '" src="' + this.opts.zimgUri + url + '?f=png&w=960">');
		if (layer.type != 2) {
			$("." + pageIndex + layer.name).css({
				'top': layer.top * rate + 'rem',
				'left': layer.left * rate + 'rem',
				'width': layer.width * rate + 'rem',
				'height': layer.height * rate + 'rem',
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
				$('.' + pageIndex + layer.name).attr('src', _this.opts.picurl + layer.content.uri + '?f=png&w=960');
				this.angel = layer.content.rotate;
				$("." + pageIndex + layer.name).css({
					'top': layer.content.top * rate + 'rem',
					'left': layer.content.left * rate + 'rem',
					'width': layer.content.offsetWidth * rate + 'rem',
					'height': layer.content.offsetHeight * rate + 'rem',
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
					'width': layer.width * rate + 'rem',
					'height': layer.height * rate + 'rem',
					'overflow': 'hidden',
					'top': layer.top * rate + 'rem',
					'position': 'absolute',
					'left': layer.left * rate + 'rem',
					'webkit-mask': 'url(' + _this.opts.zimgUri + url + '?f=png&w=960)',
					'mask-image': 'url(' + _this.opts.zimgUri + url + '?f=png&w=960)',
					'-webkit-mask-image': 'url(' + _this.opts.zimgUri + url + '?f=png&w=960)',
					'-webkit-mask': 'url(' + _this.opts.zimgUri + url + '?f=png&w=960)',
					'-webkit-mask-size': '100%',
					'background-repeat': 'no-repeat',
					'z-index': layer.zIndex
				});
				if (_this.indexOfImg < _this.photo.length) {
					$('.' + pageIndex + layer.name).attr('src', _this.opts.picurl + _this.photo[_this.indexOfImg].url + '?f=png&w=960&q=1');
					//拼接数据
					_this.indexOfImg++;
				}
			});
		}
	},
	//-----------------------------------加载页面-----------------------------------------
	//加载页面：怎么加载
	loadPage: function() {
		var _this = this;
		var height = 0; //dom高
		var diffHeight = $('.temp-page').height() * 1; //计算存在问题
		height += diffHeight;
		var clientH = $(window).height();
		$(window).scroll(function() {
			if (clientH + $(window).scrollTop() > height * 0.98) {
				if (_this.currentPage < _this.totalPages - 1) {
					height += diffHeight;
					_this.currentPage++;
					_this.getPage();
					if (_this.currentPage == _this.totalPages - 1) {
						setTimeout(function() {}, 800);
					}
				} else if (_this.currentPage == 0) {
					setTimeout(function() {}, 800);
				}
			}
		});
	},
	loadAlbum: function() {
		var _this = this;
		console.log('总数----------' + _this.totalPages)
		if (_this.currentPage < _this.totalPages - 1) {
			_this.currentPage++;
			console.log(_this.currentPage)
			_this.getPage();
		}
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
		$('#btn-delete').off('click').on('click', function() {
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
		$('#btn-edit').off('click').on('click', function() {
			
		})
	}
};