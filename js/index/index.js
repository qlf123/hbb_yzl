//组建主页
$(function() {
	var domain = configure();
	//登陆：修改未读信息的值
	if (localStorage.unread && localStorage.type == 3) {
		$('#yhx-size').html(localStorage.unread);
	}
	var loginInfo = null;
	var url = location.search;
	delete localStorage.update;
	delete localStorage.opusId;
	delete localStorage.token;

	loginInfo = url2json(url);
	login(loginInfo, domain);
	//家长端:记录值
	if (localStorage.type == 3) {
		localStorage.classId = loginInfo.classId;
		localStorage.className = loginInfo.className;
		localStorage.name = decodeURIComponent(loginInfo.name);
		localStorage.outerPersonId = loginInfo.outerPersonId;
		localStorage.outerToken = loginInfo.outerToken;
		localStorage.parentAddress = loginInfo.parentAddress;
		localStorage.parentBirthday = loginInfo.parentBirthday;
		localStorage.parentGender = loginInfo.parentGender;
		localStorage.parentId = loginInfo.parentId;
		localStorage.parentPhone = loginInfo.parentPhone;
		localStorage.parentName = loginInfo.parentName;
		localStorage.personId = loginInfo.personId;
		localStorage.schoolId = loginInfo.schoolId;
		localStorage.studentBirthday = loginInfo.studentBirthday;
		localStorage.studentId = loginInfo.studentId;
		localStorage.studentName = decodeURIComponent(loginInfo.studentName);
	} else if (localStorage.type == 4) {
		//教师端
		localStorage.avatar = loginInfo.avatar;
		localStorage.birthday = loginInfo.birthday;
		localStorage.classId = loginInfo.classId;
		localStorage.className = loginInfo.className;
		localStorage.classType = loginInfo.classType;
		localStorage.gender = loginInfo.gender;
		localStorage.name = decodeURIComponent(loginInfo.name);
		localStorage.outerPersonId = loginInfo.outerPersonId;
		localStorage.outerToken = loginInfo.outerToken;
		localStorage.schoolId = loginInfo.schoolId;
		localStorage.userId = loginInfo.userId;
		localStorage.userType = loginInfo.userType;
	}

	//推荐主题
	var topOpts = {
		opts: {
			yhxBox: '.topTheme',
			yhxClass: 'new'
		},
		size: 1,
		number: 0,
		url: domain.domain,
		readUri: 'outertemplate/read/infos',
		object: '.topTheme',
		tempUri: domain.tempUri,
		priority: 5
	};
	var topTheme = new Growth(topOpts);
	topTheme.getAlbList();

	//主题区
	var subOpts = {
		opts: {
			yhxBox: '.subTheme',
			yhxClass: 'new'
		},
		size: 6,
		number: 0,
		url: domain.domain,
		readUri: 'outertemplate/read/infos',
		object: '.subTheme',
		tempUri: domain.tempUri,
		priority: 0
	};
	var subTheme = new Growth(subOpts);
	subTheme.getAlbList();
	if (localStorage.type == 3) {
		getUnread(domain.domain);
	}
});
//获取未读数据数量
function getUnread(domain) {
	$.ajax({
		type: 'post',
		dataType: "json",
		url: domain + 'outeropus/read/unreadnum',
		data: {
			token: localStorage.token
		}
	}).done(function(obj) {
		//数据  
		// console.log(obj.data);
		localStorage.unread = obj.data;
		//存在未读信息的话增加未读提示
		if (obj.data) {
			$('.myProduct').append('<img id="yhx-unread" src="./images/parent_03.png"><p id="yhx-size">' + localStorage.unread + '</p>')
		}
	}).fail(function() {
		console.log('没有图片');
	});
}

function url2json(url) {
	var json = {};
	String.prototype.replaceAll = function(s1, s2) {
		return this.replace(new RegExp(s1, "gm"), s2);
	}
	url = url.replaceAll("-", "/");
	// console.log(url);
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		var arr = str.split('&');
		for (var i = 0; i < arr.length; i++) {
			var arr2 = arr[i].split('=');
			json[arr2[0]] = arr2[1];
		}
	}
	return json;
}

function login(loginInfo, domain) {
	// 家长
	if (localStorage.type == 3) {
		parentToken(loginInfo, domain);
		// console.log(localStorage.type);
	} else if (localStorage.type == 4) {
		//教师
		teacherToken(loginInfo, domain);
		// console.log(localStorage.type);
	}
}

function teacherToken(loginInfo, domain) {
	$.ajax({
		type: "post",
		async: false,
		url: domain.domain + "hbbclient/teacher/create/token",
		dataType: "json",
		data: $.customParam({
			outerPersonId: loginInfo.outerPersonId,
			name: decodeURIComponent(loginInfo.name),
			outerToken: loginInfo.outerToken,
			schoolId: loginInfo.schoolId,
			classId: loginInfo.classId
		}),
		beforeSend: function() {},
		success: function(obj) {
			// alert("我是教师！");
			console.log(obj.data);
			localStorage.token = obj.data; //存储token值
		},
		error: function() {
			alert('获取教师token失败');
		}
	});
}

function parentToken(loginInfo, domain) {
	$.ajax({
		type: "post",
		async: false,
		url: domain.domain + "hbbclient/parent/create/token",
		dataType: "json",
		data: $.customParam({
			outerPersonId: loginInfo.outerPersonId,
			name: decodeURIComponent(loginInfo.parentName),
			outerToken: loginInfo.outerToken,
			student: {
				studentId: loginInfo.studentId,
				studentName: decodeURIComponent(loginInfo.studentName),
				schoolId: loginInfo.schoolId,
				classId: loginInfo.classId,
				birthday: loginInfo.studentBirthday
			}
		})
	}).done(function(obj) {
		// alert("我是教师！");
		// console.log(obj.data);
		localStorage.token = obj.data; //存储token值
	}).fail(function() {
		alert('获取家长token失败');
	});
}