
//获取模板具体页
$(function() {
	domain = configure();
	opts = {
		domain: domain.domain,
		pageSize: 2, //TODO:12-5 做翻书效果，每次加载一张也可
		currentPage: 0,
		picurl: domain.imgServerUri,
		container: '.templatePage',
		zimgUri: domain.tempUri, //模板/作品图片服务器地址
		opusuri: 'outeropus/read/pageinfos',
		removeOpusuri: 'outeropus/remove/opus'
	};
	opts.redomain = opts.domain.split('j')[0];
	//查看作品
	var url = location.search;
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		var arr = str.split('&');
		var data = [];
		for (var i = 0; i < arr.length; i++) {
			var arr2 = arr[i].split('=');
			data.push(arr2);
		}
		console.log('参数------------' + data)
		localStorage.opusId = data[0][1];
		localStorage.token = data[1][1];
		if(!data[2]){
			console.log('园长进入')
			$('#header').hide()
		} else {
			console.log('教师进入')
		}
	}
	opts.opusId = localStorage.opusId
	var temp = new Template(opts);
	temp.getPage();
	temp.pageOnClick();
	setTimeout(function() {
		temp.page.init();
	}, 500)
});