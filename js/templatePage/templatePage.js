//获取模板具体页
$(function() {
	domain = configure();
	addModal();
	printModal();
	//模板所有的加上拦截
	//教师端作品制作不加拦截
	//家长端作品制作加拦截 
	// if (localStorage.type == 4 && localStorage.update) {} else {
	// 	window.onbeforeunload = onbeforeunload_handler;
	// 	// window.onunload = onunload_handler;

	// 	function onbeforeunload_handler() {
	// 		var warning = "您确定要离开当前模板吗？";
	// 		return warning;
	// 	}

	// 	function onunload_handler() {
	// 		var warning = "谢谢光临";
	// 		alert(warning);
	// 	}
	// }
	// backModal();
	// XBack.listen(function() {
	// 	alert('我要拦截你');
	// });

	//模板
	// var temp = new Temp(opts);

	opts = {
		domain: domain.domain,
		pageSize: 2,
		templateId: localStorage.templateId,
		currentPage: 0,
		picurl: domain.imgServerUri,
		container: '.templatePage',
		stuId: localStorage.studId,
		orgId: localStorage.orgId,
		classId: localStorage.classId,
		zimgUri: domain.tempUri, //模板/作品图片服务器地址
		teUrl: 'hbbclient/teacher/read/photos',
		paUrl: 'hbbclient/parent/read/photos',
		timeLine: 'hbbclient/teacher/read/timeline',
		albUrl: 'hbbclient/parent/read/album',
		photoSzie: 28,
		tempuri: 'outertemplate/read/pageinfos',
		opusuri: 'outeropus/read/pageinfos'
	};
	opts.redomain = opts.domain.split('j')[0];
	//模板
	//教师端
	if (localStorage.update) {
		//更新作品
		var opusId = location.search;
		opts.opusId = localStorage.opusId = opusId.substring(opusId.lastIndexOf('=') + 1, opusId.length);
		//家长端:可以更新
		if (localStorage.update == 1) {
			opts.updateUri = 'outeropus/update/pageinfos';
			localStorage.unread--;
		}
	} else {
		//创建作品
		delete localStorage.update;
		delete localStorage.opusId;
		if (localStorage.type == 4) {
			opts.createUri = 'outeropus/create/teacher/opus';
		} else if (localStorage.type == 3) {
			opts.createUri = 'outeropus/create/parent/opus';
		}
	}
	var temp = new Template(opts);
	temp.getPage();
	setTimeout(function() {
		temp.loadPage();
	}, 500);
});