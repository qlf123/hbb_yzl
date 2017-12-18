// 学生列表
function Student(opts) {
	this.opts = opts;
	this.object;
	this.student = [];
	this.stuList = [];
	this.choose = true;
}

Student.prototype = {
	url2json: function(url){
		var json={};
		if(url.indexOf("?")!=-1) {
			var str = url.substr(1);
			var arr=str.split('&');
			for (var i = 0; i < arr.length; i++) {
				var arr2 = arr[i].split('=');
				json[arr2[0]] = arr2[1];
			}
		}
		return json;
	},
	//获取学生列表
	getStuList: function() {
		var _this = this;
		$.ajax({
			type: 'get',
			url: this.opts.studomain,
			contentType: "application/json",
			dataType: "json",
			data: {
				token: _this.url2json(location.search).token
			}
		}).done(function(obj) {
			//数据
			_this.object = obj.data;
			_this.createStuL();
		}).fail(function() {
			console.log('没有学生');
		});
	},
	createStuL: function() {
		var _this = this;
		var header = '<div class="header">' +
			'<div class="student_hp" id="checkAll" state="2" style="background:#D9E024">全班</div>' +
			'</div>';

		$("body").append('<div class="modal fade" id="warn" tabindex="-1" role="dialog"  aria-hidden="true">' +
			'<div class="modal-dialog" style="top:8rem;">' +
			'<div class="modal-content">' +
			'<div class="modal-header">' +
			'<button class="close" aria-hidden="true" data-dismiss="modal">x</button>' +
			'<p style="margin-left:25%;font-family:MyNewFont;">亲，您还没选择学生哦</p>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>');
		$(this.opts.obj).append(header);
		var length = this.object.length ? this.object.length : 0;
		var str = '';
		for (var i = 0; i < length; i++) {
			this.eachStu(i, str);
		}
		//var bottom = '<div class="footer"><a><button>开始制作</button></a>';
		//$(this.opts.obj).append(bottom);
		//绑定进入制作页面
		$('.btn').off('click').on('click', function() {
			if (_this.student.length) {
				// TODO：localStorage.special=ture 找生日模板
				if (localStorage.special) {
					localStorage.studentBirthday = _this.student[0].birthday;
					localStorage.studentName = _this.student[0].studentName;
					window.location.href = '../page/yhx_birthday.html';
				} else {
					// TODO localStorage.picnum 需要的图片数量 web端不需要提前选照片
					window.location.href = '../page/web_templatepage_edit.html?intercept=true';
					//if (localStorage.picnum == '0') {
					//	window.location.href = '../page/yhx_templatepage.html?intercept=true';
					//} else {
					//	window.location.href = '../page/yhx_photolist.html';
					//}
				}
				localStorage.stuList = JSON.stringify(_this.student); //存储的选择学生
			} else {
				$('#warn').modal('show');
			}
		});
		if (localStorage.special) {
			$('.header').css('display', 'none');
			this.paStuClick();
		} else {
			this.stuOnclick();
		}
	},
	//拼凑学生列表
	eachStu: function(i, str) {
		var reg = /^[\u4E00-\u9FA5]{2,9}$/;
		var staName = this.object[i].user_display_name;
		var sName = staName;
		if (reg.test(staName)) {
			if (staName.length > 2) {
				sName = staName.substring(staName.length - 2);
			} else {
				sName = '小' + staName.substring(staName.length - 1);
			}
		}
		var background = this.object[i].avatar_color;
		if (this.object[i].user_avatar.trim() !== "") {
			background = 'url(' + this.opts.imgServerUri + this.object[i].user_avatar + ')no-repeat;background-size:contain;';
			sName = "";
		}
		//存储学生列表
		var date = new Date(this.object[i].birthday);
		//date = date.toLocaleDateString();
		date = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
		this.stuList.push({
			studentId: this.object[i].user_id,
			studentName: this.object[i].name,
			birthday: date
		});
		//名字长度
		if (this.object[i].user_display_name.length >= 5) {
			var display_name = this.object[i].user_display_name.substring(0, 4);
		} else {
			var display_name = this.object[i].user_display_name;
		}
		str += '<div class="student">' +
			'<div class="student_hp" state="0" id="check_'+ i +'">' + display_name + '</div>' +
			'</div>';

		$(this.opts.obj).append(str);
	},

	//往下加载页面
	loadPage: function() {
		var _this = this;
		var height = 0; //dom高
		var runFlag = true;
		var diffHeight = $('.student').height() * 5; //计算存在问题
		height += diffHeight;
		var clientH = $(window).height();
		$(window).scroll(function() {
			$(".studentList").css("position", "relative");
			$(".studentList").css("top", "-1.5rem");
			if ($(window).scrollTop() == 0) {
				$(".studentList").css("top", "0");
			}
		});
	},

	//添加绑定事件
	stuOnclick: function() {
		var _this = this;
		$('.student').each(function(index) {
			$(this).on('click', function() {
				var $pic = $('#check_' + index);
				switch ($pic.attr('state')) {
					case '0':
						{
							if (_this.choose) {
								$pic.css({
									'border': '3px solid #afbba5',
									'line-height': '94px'
								})
								_this.student.push(_this.stuList[index]);
								$pic.attr('state', '1');
								if (_this.student.length == _this.object.length) {
									$('#checkAll').attr({
										'state': 3
									}).css({
										'border': '3px solid #afbba5',
										'line-height': '94px'
									});
								}
							}
						}
						break;
					case '1':
						{
							$pic.css({
								'border': '0',
								'line-height': '100px'
							})
							$pic.attr('state', '0');
							$('#checkAll').attr({
								'state': 3
							}).css({
								'border': '0',
								'line-height': '100px'
							});
							_this.choose = true;
							_this.student.splice($.inArray(_this.stuList[index], _this.student), 1);
						}
						break;
				}
			});
		});
		$('.header').off('click').on('click', function() {
			var $flag = $('#checkAll');
			if ($flag.attr('state') == 2) {
				_this.choose = false;
				$('.student_hp').css({
					'border': '3px solid #afbba5',
					'line-height': '94px'
				});
				$flag.attr('state', '3');
				//_this.student = [];
				_this.student = _this.stuList.slice(0);
				console.log('选中学生列表------------' + _this.student)
				$flag.attr('src', '../images/teacher_11.png');
			} else {
				$flag.attr('src', '../images/teacher_09.png');
				$flag.attr('state', 2);
				_this.choose = true;
				$('.student_hp').css({
					'border': '0',
					'line-height': '100px'
				});
				_this.student = [];
				console.log('选中学生列表------------' + _this.student)
			}
		});
	},
	//教师端生日模板特别事件
	paStuClick: function() {
		var _this = this;
		$('.student').each(function(index) {
			$(this).off('click').on('click', function() {
				var $pic = $('#check' + index + '>img');
				switch ($pic.attr('state')) {
					case '0':
						{
							if (_this.choose) {
								$pic.attr('src', '../images/teacher_11.png');
								_this.student.push(_this.stuList[index]);
								$pic.attr('state', '1');
								$('.footer>a>button').css('background-color', '#ffe863');
								$('.footer>a>button').css('color', '#4c4c4b');
								if (_this.student.length == 1) {
									_this.choose = false;
								}
							}
						}
						break;
					case '1':
						{
							$pic.attr('src', '../images/teacher_09.png');
							$pic.attr('state', '0');
							$('#checkAll>img').attr({
								'src': '../images/teacher_09.png',
								'state': 2
							});
							_this.choose = true;
							_this.student.splice($.inArray(_this.stuList[index], _this.student), 1);
							if (!_this.student.length) {
								$('.footer>a>button').css('background-color', '#f0efed');
								$('.footer>a>button').css('color', '#b8b8b6');
							}
						}
						break;
				}
			});
		});
	}
};