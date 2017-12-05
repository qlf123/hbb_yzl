//定义活动画册对象
function Album(opts) {
	this.opts = opts;
}

Album.prototype = {
	//设置类名
	setClass: function() {}
};
//-------------------------------------------------------------------
//成长档案
function Growth(options) {
	Album.call(this, options.opts); // 继承参数
	this.url = options.url;
	this.pageSize = options.size;
	this.currentPage = options.number;
	this.object = options.object;
	this.tempUri = options.tempUri;
	this.readUri = options.readUri; //模板列表
	this.previousDate;
	this.workIndex = 1;
	this.priority = options.priority;
}

Growth.prototype = new Album();
Growth.prototype.constructor = Growth;
//获取列表
Growth.prototype.getAlbList = function() {
	var _this = this;
	var _data = $.customParam({
		'size': _this.pageSize,
		'number': _this.currentPage,
		'token': localStorage.token,
		// 'sort': [{
		// 	'property': 'updatedAt',
		// 	'direction': 'DESC'
		// }],
		'priority': _this.priority
	});
	$.ajax({
		type: 'post',
		dataType: "json",
		url: _this.url + this.readUri,
		async: false,
		data: _data,
	}).done(function(obj) {
		//存在数据  
		_this.obj = obj.data;
		if (_this.obj.content) {
			_this.createAlbList();
		}
	}).fail(function() {
		console.log('没有图片');
	});
};
//创建列表
Growth.prototype.createAlbList = function() {
	//页面数量
	var _this = this;
	var a;
	if (localStorage.type == 4) {
		a = './page/yhx_studentlist.html';
	} else {
		a = './page/yhx_photolist.html';
	}
	var total = this.obj.content.length;
	//是第几页currentpage，假如5作品，每次看一页，4就代表最后一页
	if (this.currentPage == 0 && this.object == '.myProduct') {
		var work = '<div class="yhx_work" id="yhx_work' + this.workIndex + '"></div>';
		$(this.object).append(work);
	}
	for (var i = 0; i < total; i++) {
		//如果不是我的作品页加载以下代码
		if (this.object != '.myProduct') {
			if (this.object == '.topTheme') {
				// 去掉两边空格
				var reg = /(^\s+)|(\s+$)/g;
				this.obj.content[i].title = this.obj.content[i].title.replace(reg, "");
				var $img = '<a data-type="' + this.obj.content[i].templateTypeId + '" data="' + this.obj.content[i].title + '" data-picnum="' + this.obj.content[i].pictureCount + '" data-temp="' + this.obj.content[i].id + '">' +
					'<img src="' + this.tempUri + this.obj.content[i].iconUri + '?f=png&w=300&h=168&q=10">' +
					'<h2>' + this.obj.content[i].title + '</h2>' +
					'<img class="img-designing" src="./images/design_03.png">' +
					'</a>';
			} else if (this.object == '.subTheme') {
				var reg = /(^\s+)|(\s+$)/g;
				this.obj.content[i].title = this.obj.content[i].title.replace(reg, "");
				var $img = '<a data-type="' + this.obj.content[i].templateTypeId + '" data="' + this.obj.content[i].title + '" data-picnum="' + this.obj.content[i].pictureCount + '" data-temp="' + this.obj.content[i].id + '">' +
					'<img src="' + this.tempUri + this.obj.content[i].iconUri + '?f=png&w=300&h=225">' +
					'<h2>' + this.obj.content[i].title + '</h2>' +
					'<img class="sub-designing" src="./images/design_03.png">' +
					'</a>';
			}

			$(this.object).append($img);
			$(this.object + '>a').off('click').on('click', function() {
				localStorage.templateId = $(this).attr('data-temp'); //点击时获取
				localStorage.title = $(this).attr('data'); //作品标题
				localStorage.picnum = $(this).attr('data-picnum'); //需要的图片数量

				//红英幼儿园模板不需要照片，直接跳转到模板页
				if (localStorage.picnum == "0" && localStorage.type == 4) {
					a = './page/yhx_templatepage.html?intercept=true';
				}
				if ($(this).attr('data-type') == 2) {
					a = './page/yhx_birthday.html';
				}

				if ($(this).attr('data-type') == 1 && localStorage.type == 4) {
					a = './page/yhx_studentlist.html';
					delete localStorage.special;
				}

				if ($(this).attr('data-type') == 1 && localStorage.type == 3) {
					a = './page/yhx_photolist.html';
				}
				//此模板不需要照片红英幼儿园这个
				if (localStorage.picnum == "0" && localStorage.type == 3) {
					a = './page/yhx_templatepage.html?intercept=true';
				}
				//-------------找生日---------------
				if ($(this).attr('data-type') == 2 && localStorage.type == 4) {
					a = './page/yhx_studentlist.html';
					localStorage.special = true; //区分找生日模板
				}
				//---------------------------------------------------------------------------------
				if ($(this).attr('data') == '找生日' || $(this).attr('data') == '过年啦' || $(this).attr('data') == '新年物语' || $(this).attr('data') == '生日不见了' || $(this).attr('data') == '成长故事') {
					$(this).attr('href', a);
				}
			});
		} else {
			//我的作品页加载一下代码
			var $opusDate = '<span>' + formatDate(this.obj.content[i].createdAt) + '</span></br>';
			var $img = '<div class="opusBox" id="opusBox' + this.currentPage + i + '">' +
				'<a href="./yhx_templatepage.html?intercept=true">' +
				'<img src = "' + this.tempUri + this.obj.content[i].pages[0].iconUri + '">' +
				'</a>' +
				'<div class="selectBox" id="selectBox' + this.currentPage + i + '"></div>' +
				'</div>';
			//前段样式根据日期划分板块
			if (!this.previousDate) {
				this.previousDate = $opusDate;
				$('#yhx_work' + this.workIndex).append($opusDate);
			} else {
				if (this.previousDate != $opusDate) {
					this.workIndex++;
					work = '<div class="yhx_work" id="yhx_work' + this.workIndex + '"></div>';
					$(this.object).append(work);
					$('#yhx_work' + this.workIndex).append($opusDate);
					this.previousDate = $opusDate;
				}
			}
			$('#yhx_work' + this.workIndex).append($img);
		}
	}
	this.setListCss();
};
//设置列表css样式
Growth.prototype.setListCss = function() {
	var _this = this;
	switch (this.object) {
		//推荐
		case '.topTheme':
			{
				$(this.object + '>a>img').css({
					'width': $(_this.object).width(),
					'height': $(_this.object).height()
				});

				$('.topTheme>a>h2').css({
					'top': -$('.topTheme').height() / 2,
					'position': 'relative'
				});

				$('.img-designing').css({
					'width': '2.5rem',
					'height': '0.55rem',
					'z-index': 999,
					'position': 'relative',
					'top': -$('.topTheme').height() / 2 + 30,
					'left': '41%'
				});
			}
			break;
			//主题区
		case '.subTheme':
			{
				$(this.object + '>a>img:first-child').css({
					'width': $(_this.object).width() / 2,
					'height': $(_this.object).width() * 0.375
				});
				$('.subTheme>a>h2').css({
					'top': -$('.subTheme>a').height() / 2,
					'position': 'relative'
				});

				$('.sub-designing').each(function() {
					$(this).css({
						'width': '2rem',
						'height': '0.4rem',
						'z-index': 1000,
						'position': 'absolute',
						'top': $(this).parent().position().top + $('.subTheme>a').height() / 2 + 10
					});

					// console.log($(this).parent().position().top+ $('.subTheme>a').height() / 2+10);
				});

				$('.sub-designing:even').css('left', '20%');
				$('.sub-designing:odd').css('left', '70%');
			}
			break;
		case '.myProduct':
			{
				$(this.object + '>a>img').css({
					'width': $(_this.object).width() / 2,
					'height': $(_this.object).width() * 0.375
				});
				$(this.object + '>span').css({
					//我的作品也日期栏样式 
					'height': $(this.object).width() * 0.1,
					'display': 'inline-block'
				});
			}
			break;
	}
	//------------------模板过少，新年物语和生日不见了可使用-------------------------------
	$('a').each(function(index) {
		if ($(this).attr('data') == '新年物语' || $(this).attr('data') == '生日不见了' || $(this).attr('data') == '成长故事') {
			$('a:eq(' + index + ')>img:last-child').css('display', 'none');
		}
	});
};
//-------------------------------------------------------------
//作品

function Opus(options) {
	this.url = options.url;
	this.pageSize = options.size;
	this.currentPage = options.number;
	this.object = options.object;
	this.tempUri = options.tempUri;
	this.readUri = options.readUri;
	this.previousDate;
	this.imgServerUri = options.imgServerUri;
	this.workIndex = 1;
}

Opus.prototype = {
	//获取作品列表
	getAlbList: function() {
		var _this = this;
		var _data = $.customParam({
			'size': _this.pageSize,
			'number': _this.currentPage,
			'sort': [{
				'property': 'opusInfo.createdAt',
				'direction': 'DESC'
			}],
			'token': localStorage.token
		});
		$.ajax({
			type: 'post',
			dataType: "json",
			url: this.url + this.readUri,
			async: false,
			data: _data,
		}).done(function(obj) {
			//数据  
			// console.log('obj.data');
			if (obj.data.content == null) {
				opusModal();
				setTimeout(function() {
					$('#noOpus').modal('show');
				}, 800);
			} else {
				_this.obj = obj.data;
				_this.createAlbList();
			}
		}).fail(function() {
			console.log('没有图片');
		});
	},
	//创建作品列表
	createAlbList: function() {
		var _this = this;
		var a = './page/yhx_photolist.html';
		var total = this.obj.content.length;
		if (this.currentPage == 0 && this.object == '.myProduct') {
			var work = '<div class="yhx_work" id="yhx_work' + this.workIndex + '"></div>';
			$(this.object).append(work);
		}
		for (var i = 0; i < total; i++) {
			//我的作品页加载一下代码
			var date = formatDate(this.obj.content[i].opusInfo.createdAt).split('-'); //日期
			var yy = date[0]; //年份
			var mm = date[1] //月份
			var dd = date[2]; //天
			var $opusDate = '<div class="yhx-opusDate"><img src="../images/teacher_21.png"><span><b>' + mm + '月' + dd + '日</b></span><span><b>' + yy + '年' + '</b></span></div>';
			if (localStorage.type == 3) {
				var $img = '<div class="opusBox" id="opusBox' + this.currentPage + i + '">' +
					'<a style="display:block;text-decoration:none;" href="./yhx_templatepage.html?intercept=true&opusId=' + this.obj.content[i].opusInfo.id + '">' +
					'<img style="display:none;" data-sourceType="' + this.obj.content[i].sourceType + '" class="yhx-source" src = "../images/parent_05.png">' +
					'<img src = "' + this.tempUri + this.obj.content[i].opusInfo.iconUri + '?f=png&w=200&h=200">' +
					'<h2>' + this.obj.content[i].opusInfo.title + '</h2>' +
					'<img class="yhx-opusUnread" data="' + this.obj.content[i].unread + '" src="../images/parent_08.png" style="display:none;z-index:1001">' +
					'</a>' +
					'<div class="yhx_delete" id="yhx_delete' + this.currentPage + i + '" data="' + this.obj.content[i].opusInfo.id + '"></div>' +
					'</div>';
			} else if (localStorage.type == 4) {
				var $img = '<div class="opusBox" id="opusBox' + this.currentPage + i + '">' +
					'<a href="./yhx_templatepage.html?intercept=false&opusId=' + this.obj.content[i].opusInfo.id + '">' +
					'<img src = "' + this.tempUri + this.obj.content[i].opusInfo.iconUri + '?f=png&w=200&h=200">' +
					'<h2>' + this.obj.content[i].opusInfo.title + '</h2>' +
					'</a>' +
					'<div class="selectBox" data-opus="' + this.obj.content[i].opusInfo.id + '"id="selectBox' + this.currentPage + i + '">' +
					'<p>' + this.obj.content[i].targetCount + '</p>' +
					'</div>' +
					'</div>';
			}

			$('.opusBox>a').bind('click', function(e) {
				$('.opusBox>a').css('textDecoration', 'none');
				//做测试用稍后删除
				//localStorage.title = $(this).attr('data');
				//e.preventDefault();
			});
			//前段样式根据日期划分板块
			if (!this.previousDate) {
				this.previousDate = $opusDate;
				$('#yhx_work' + this.workIndex).append($opusDate);
			} else {
				if (this.previousDate != $opusDate) {
					this.workIndex++;
					work = '<div class="yhx_work" id="yhx_work' + this.workIndex + '"></div>';
					$(this.object).append(work);
					$('#yhx_work' + this.workIndex).append($opusDate);
					this.previousDate = $opusDate;
				}
			}
			$('#yhx_work' + this.workIndex).append($img);
			//教师端
			if (localStorage.type == 4) {
				$('#selectBox' + this.currentPage + i).unbind('click').bind('click', function() {
					$('.bg-mask').css('display', 'block');
					//$("body").css("cursor", "pointer");
					$('body').css('-webkit-overflow-scrolling', 'touch');
					$("body").css('overflow', 'hidden');
					$("body").css('width', '100%');
					$("body").css('height', '100%');
					$('.yhx-show').remove();
					_this.getStudname(this);

					//为弹出框绑定touchstart事件
					$(".yhx-show").unbind('click').bind("touchstart", function(e) {
						startX = e.originalEvent.changedTouches[0].pageX,
							startY = e.originalEvent.changedTouches[0].pageY;
					});
					//为弹出框绑定touchmove事件
					$(".yhx-show").unbind('click').bind("touchmove", function(e) {
						//e.preventDefault();
						var _target = e.target;
						var _ss = $(_target).parents().slice(-6)[0];
						var _point = e.originalEvent.touches[0];
						var _top = _ss.scrollTop;
						// 什么时候到底部，注意需要-2，如果不减，在下面判断会出错
						var _bottomFaVal = _ss.scrollHeight - _ss.offsetHeight - 2;
						//记录拖拉后的坐标
						moveEndX = e.originalEvent.changedTouches[0].pageX,
							moveEndY = e.originalEvent.changedTouches[0].pageY,
							X = moveEndX - startX,
							Y = moveEndY - startY;
						//到达顶端
						var fontSize = $('body').css('fontSize');
						var studentHeight = $('.student').css('height').replace("px", "");

						//测试拖拽
						// if (e.originalEvent.targetTouches.length == 1) {
						// 	var touch = e.originalEvent.targetTouches[0];
						// 	$(_target).css('left', touch.pageX + 'px');
						// 	$(_target).css('top', touch.pageY + 'px');
						// }
						// console.log(e.originalEvent.changedTouches[0]);
						//console.log(_ss.scrollHeight+"  "+ _ss.offsetHeight+"top "+_top+"bottom "+_bottomFaVal);
						//console.log(_bottomFaVal+"  "+studentHeight);
						//首次打开，不满一页，自动禁止yhx——show的事件
						if (_bottomFaVal < studentHeight) {
							e.preventDefault();
						} else if (_top > _bottomFaVal) {
							// 到达底部
							$('body').bind('touchmove', function(ev) {
								ev.preventDefault();
							});
						} else if (_top > 0 && _top < _bottomFaVal) {
							//滑动中
						}
						//判断用户的滑动行为
						if (Math.abs(X) > Math.abs(Y) && X > 0) {
							//alert("left 2 right");
						} else if (Math.abs(X) > Math.abs(Y) && X < 0) {
							//alert("right 2 left");
						} else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
							//alert("top 2 bottom");
							$('body').unbind('touchmove');
							if (_top < 5) {
								$('body').bind('touchmove', function(ev) {
									ev.preventDefault();
								});
								//alert(_top);
							}
						} else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
							//alert("bottom 2 top");
							if (_top == 0) {
								$('body').unbind('touchmove');
							}
						} else {
							//alert("just touch");
						}
					});
				});
			}
			//家长端:删除作品
			// if (localStorage.type == 3) {
			// 	$('.yhx_delete').each(function(index) {
			// 		$(this).off('click').on('click', function(event) {
			// 			event.stopPropagation();
			// 			var obj = $(this).parent();
			// 			$('#delete').modal('show');
			// 			$('#deleteOpus').off('clcik').on('click', function() {
			// 				console.log('----------');
			// 				console.log('delete: ' +index);
			// 				_this.removeOpus(obj, $('.yhx_delete:eq(' + index + ')').attr('data'));
			// 				console.log('----------');
			// 			});
			// 		});
			// 	});
			// }
			if (localStorage.type == 3) {
				$('.yhx_delete').each(function() {
					$(this).off('click').on('click', function(event) {
						event.stopPropagation();
						var obj = $(this).parent();
						var delete_target = event.target;
						$('#delete').modal('show');
						$('#deleteOpus').off('clcik').on('click', function() {
							console.log('----------');
							_this.removeOpus(obj, $(delete_target).attr('data'));
						});
					});
				});
			}
		}

		this.setListCss();
	},
	//设置列表样式
	setListCss: function() {
		$(this.object + '>a>img').css({
			'width': $(this.object).width() / 2,
			'height': $(this.object).width() * 0.375
		});
		$(this.object + '>span').css({
			//我的作品也日期栏样式
			'height': $(this.object).width() * 0.1,
			'display': 'inline-block'
		});
		$('.opusBox>a>h2').css({
			'top': -$('.opusBox').height() / 1.8,
			'font-family': 'MyNewFont',
			'position': 'relative'
		}).promise().done(function() {
			//设置小红点样式
			$('.yhx-opusUnread').each(function() {
				if (JSON.parse($(this).attr('data'))) {
					$(this).css({
						'display': 'block',
						'position': 'relative',
						'top': -$('.opusBox').height() / 2 - JSON.parse($('.opusBox>a>h2').css('font-size').slice(0, 2)),
						'width': '5%',
						'height': '5%',
						'left': $('.opusBox').width() / 2 + JSON.parse($('.opusBox>a>h2').css('font-size').slice(0, 2))
					});
					$(this).attr('data', false);
				}
			});
		});
		//判断源头：0，家长1：教师
		$('.yhx-source').each(function() {
			if (JSON.parse($(this).attr('data-sourceType'))) {
				$(this).css({
					'display': 'block',
					'width': '20%',
					'height': '20%'
				});
			}
		});

	},
	//加载事件
	loadPage: function() {
		var _this = this;
		var height = 0; //dom高
		var diffHeight = $('.myProduct').height();
		height += diffHeight;
		var clientH = $(window).height();
		// console.log(clientH, height);
		$(window).scroll(function() {
			if (clientH + $(window).scrollTop() > height * 0.99) {
				if (_this.currentPage <= _this.obj.totalPages) {
					_this.currentPage++;
					_this.getAlbList();
					// console.log(_this.workIndex);
					height += $('#yhx_work' + _this.workIndex).height();
				}
			}
		});
	},
	getStudname: function(obj) {
		var _this = this;
		$.ajax({
			type: 'post',
			dataType: "json",
			url: this.url + 'outeropus/read/students4opus',
			async: false,
			data: {
				token: localStorage.token,
				opusId: $(obj).attr('data-opus')
			}
		}).done(function(res) {
			_this.createStuList(obj, res.data);
		}).fail(function() {
			console.log('没有图片');
		});
	},
	createStuList: function(obj, res) {
		//学生列表拼接
		var div = '<div class="yhx-show"><p>&times;</p>';
		for (var i = 0, len = res.length; i < len; i++) {

			var reg = /^[\u4E00-\u9FA5]{2,9}$/;
			var staName = res[i].user_display_name;
			var sName = staName;
			if (reg.test(staName)) {
				if (staName.length > 2) {
					sName = staName.substring(staName.length - 2);
				} else {
					sName = '小' + staName.substring(staName.length - 1);
				}
			}
			var background = res[i].avatar_color;
			if (res[i].user_avatar.trim() !== "") {
				background = 'url(' + this.imgServerUri + res[i].user_avatar + ')no-repeat;background-size: contain;';
				sName = "";
			}
			//名字长度
			if (res[i].user_display_name.length >= 5) {
				var display_name = res[i].user_display_name.substring(0, 4);
			} else {
				var display_name = res[i].user_display_name;
			}
			div += '<div class="student">' +
				'<div class="student_hp" style="background:' + background + ';background-color:' + res[i].avatar_color + '">' + sName + '</div>' +
				'<div class="student_name">' + display_name + '</div>' +
				'</div>';
		}
		div += '</div><div class="underlayer" style="width:16rem;height:100%;position:fixed;top:0;left:0;z-index:999;"></div>';
		$(obj).after(div);
		$('.yhx-show').css({
			//'top': $(obj).position().top - $(obj).height(),
			'background-color': '#f2f0ec',
			'z-index': 1000,
			'border-radius': '0.5rem'
		});
		// if ($('.yhx-show').parent().position().left > 0) {
		// 	$('.yhx-show').css('left', -$('.yhx-show').parent().position().left);
		// }
		$('.underlayer').bind('click', function() {
			$('.underlayer').remove();
			$('body').removeAttr('style');
			$('.yhx-show').remove();
			$('body').unbind('touchmove');
			$('body').unbind('touchmove');
		});
		$('.underlayer').bind('touchmove', function() {
			$('.underlayer').remove();
			$('body').removeAttr('style');
			$('.yhx-show').remove();
			$('body').unbind('touchmove');
			$('body').unbind('touchmove');
		});
		$('.yhx-show>p', '.opusBox').unbind('click').bind('click', function() {
			$('.underlayer').remove();
			$('body').removeAttr('style');
			$('.yhx-show').remove();
			$('body').unbind('touchmove');
		});
	},
	//家长端删除作品
	removeOpus: function(obj, id) {
		$.ajax({
			type: 'post',
			dataType: "json",
			url: this.url + 'outeropus/remove/opus',
			data: {
				token: localStorage.token,
				opusId: id
			}
		}).done(function(res) {
			// console.log(res);
			setTimeout(function() {
				$('#delete').modal('hide');
			}, 10);
			if ($(obj).parent().contents().length <= 2) {
				$(obj).parent().remove();
			}
			// $('#delete').remove();
			$(obj).remove();
		}).fail(function() {
			console.log('没有图片');
		});
	}
};