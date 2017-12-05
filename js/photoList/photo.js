function Photo(opts) {
	this.opts = opts;
	this.pic = []; //服务器的数据
	this.photo = []; //选择的图片:存取地址
	this.choose = true;
	this.year;
	this.index = this.begin = 0; //图片开始索引
	this.picSzie; //图片长度
	this.albumId;
}
Photo.prototype = {
	//查询图片年份
	queryByYear: function() {
		var _this = this;
		//教师端
		if (localStorage.type == 4) {
			$.ajax({
				type: 'get',
				url: this.opts.url,
				contentType: "application/json",
				dataType: "json",
				data: {
					token: localStorage.token
				}
			}).done(function(obj) {
				_this.year = obj.data;
				_this.getPhoto();
			}).fail(function() {
				console.log('没有图片');
			});
		} else if (localStorage.type == 3) {
			//家长端
			this.getAlbumId();
		}
	},
	//获取albumid
	getAlbumId: function() {
		var _this = this;
		$.ajax({
			type: 'get',
			url: this.opts.albUri,
			contentType: "application/json",
			dataType: "json",
			data: {
				token: localStorage.token
			}
		}).done(function(obj) {
			// console.log(obj);
			_this.albumId = obj.data;
			_this.getPhoto();
		}).fail(function() {
			console.log('没有图片');
		});
	},
	getPhoto: function() {
		var _this = this;
		if (localStorage.type == 4) {
			var data = $.customParam({
				year: this.year[0],
				token: localStorage.token
			});
			var _url = this.opts.uri;
		} else if (localStorage.type == 3) {
			var data = $.customParam({
				albumId: this.albumId._id,
				token: localStorage.token
			});
			var _url = this.opts.photoUri;
		}
		$.ajax({
			type: 'get',
			url: _url,
			contentType: "application/json",
			dataType: "json",
			data: data
		}).done(function(obj) {
			if (null == obj.data || undefined == obj.data || (null != obj.data && undefined != obj.data && 0 == obj.data.length)) {
				var dialog = new Dialog({
					msg: '请先发布班级圈，完善您的照片库哦~',
					type: 0,
					bgcolor: '#eeeeee',
					btns: [{
						text: '好哒知道啦',
						type: 0,
						dhref: null
					}]
				});
				dialog.show();
				return;
			}
			_this.pic = obj.data;
			_this.picSzie = _this.pic.length;
			_this.init();
		}).fail(function() {
			console.log('没有图片');
		});
	},
	init: function() {
		var $photoList = $(this.opts.object);
		//遍历图片数组
		$("body").append(
			'<div class="modal fade" id="picker" tabindex="-1" role="dialog"  aria-hidden="true">' +
			'<div class="modal-dialog" style="top:8rem;">' +
			'<div class="modal-content">' +
			'<div class="modal-header" style="height:10%;">' +
			'<button class="close" aria-hidden="true" data-dismiss="modal">x</button>' +
			'<p style="float:left;margin:0 auto;margin-left:25%;margin-top:5%;font-family:MyNewFont;">您最多只能选择' + this.opts.picLength + '张图片哦' +
			'</p>' +
			'</div>' +
			'<div class="modal-footer" data-dismiss="modal">' +
			'<a id="close" href="#" style="color:#ff4f4f;margin-left:30%;float:left;width:30%;font-family:MyNewFont;" data-dismiss="modal">好哒知道啦</a>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div  class="modal fade" id="warning" tabindex="-1" role="dialog"  aria-hidden="true">' +
			'<div class="modal-dialog" style="top:8rem;">' +
			'<div class="modal-content">' +
			'<div class="modal-header">' +
			'<button class="close" aria-hidden="true" data-dismiss="modal">&times;</button>' +
			'<p style="margin-left:25%;font-family:MyNewFont;">亲，您还没选择照片哦</p>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>');
		var bottom = '<div class="footer"><a style="display:block;"><button>一键生成<span>(<span>' + this.photo.length + '</span>/' + this.opts.picLength + ')</span></button></a></div>';
		$photoList.after(bottom);
		this.switchSzie($photoList);
		//点击切换
		if (this.picSzie > this.opts.pageSize) {
			this.loadPage($photoList);
		}
		this.photoPicker($photoList);
	},
	//图片显示:判断长度
	switchSzie: function($photoList) {
		// 图片数量小于页面规格数量
		if (this.picSzie <= this.opts.pageSize) {
			this.addpic($photoList, this.picSzie);
		} else {
			//图片数量大于页面规格数量
			this.addpic($photoList, this.opts.pageSize);
			this.begin += this.opts.pageSize;
			this.index++;
			this.picSzie = this.pic.length - this.opts.pageSize * this.index;
		}
		this.photoPicker($photoList);
	},
	// 添加图片
	addpic: function($photoList, length) {
		for (var i = this.begin; i < this.begin + length; i++) {
			var str = '<div class="photoList" id="photo-' + i + '">' +
				'<img class="photoImg" src="' + this.opts.picurl + this.pic[i].path + '?f=png&w=100&h=100">' +
				'<img class="photo-status" status="0" src="../images/teacher_09.png">' +
				'</div>';
			$photoList.append(str);
		}
		this.photoPicker($photoList);
	},
	// //加载页面
	loadPage: function($photoList) {
		var _this = this;
		var height = 0; //dom高
		var diffHeight = $('.photoListBox').height();
		height += diffHeight;
		var clientH = $(window).height();
		$(window).scroll(function() {
			// console.log(clientH + $(window).scrollTop(), height);
			if (clientH + $(window).scrollTop() > height * 0.9) {
				// console.log(clientH, $(window).scrollTop(), height);
				if (_this.picSzie > _this.opts.pageSize) {
					_this.switchSzie($photoList);
					height += diffHeight;
					// clientH += diffHeight;
				} else if (_this.picSzie > 0 && _this.picSzie <= _this.opts.pageSize) {
					_this.addpic($photoList, _this.picSzie);
					_this.picSzie = 0;
				}
			}
		});
	},
	// 选择图片
	photoPicker: function() {
		var _this = this;
		$('.photoList').each(function(index) {
			$(this).off('click').on('click', function() {
				var $pic = $('#photo-' + index + '>.photo-status');
				switch ($pic.attr('status')) {
					case '0':
						{
							if (_this.choose) {
								$pic.attr('src', '../images/teacher_11.png');
								_this.photo.push({
									url: _this.pic[index].path,
									height: _this.pic[index].imageLength,
									width: _this.pic[index].imageWidth
								});
								$('.footer>a>button>span>span').html(_this.photo.length);
								// console.log(_this.photo);
								$pic.attr('status', '1');
								$('.footer>a>button').css('background-color', '#ffe863');
								$('.footer>a>button').css('color', '#4c4c4b');
								if (_this.photo.length == _this.opts.picLength + 1) {
									//删除该元素 恢复状态
									_this.photo.pop();
									$pic.attr('src', '../images/teacher_09.png');
									$pic.attr('status', '0');
									$('.footer>a>button>span>span').html(_this.photo.length);
									$('#picker').modal('show');
									//不能再点击图片啦
									_this.choose = false;
								}
							}
						}
						break;
					case '1':
						{
							$pic.attr('src', '../images/teacher_09.png');
							$pic.attr('status', '0');
							_this.photo.splice($.inArray({
								url: _this.pic[index].path,
								width: _this.pic[index].imageWidth,
								height: _this.pic[index].imageLength
							}, _this.photo), 1);
							$('.footer>a>button>span>span').html(_this.photo.length);
							if (!_this.photo.length) {
								$('.footer>a>button').css('background-color', '#f0efed');
								$('.footer>a>button').css('color', '#b8b8b6');
							}
							// console.log(_this.photo);
							if (_this.photo.length <= _this.opts.picLength) {
								_this.choose = true;
							}
						}
						break;
				}
			});
		});
		$('.footer>a').on('click', function() {
			//判断至少有1张图片
			if (_this.photo.length) {
				$(this).attr('href', './yhx_templatepage.html?intercept=true');
				localStorage.photo = JSON.stringify(_this.photo); //保存选择图片
				// console.log(localStorage.photo);
			} else {
				$('#warning').modal('show');
			}
		});
	}
};