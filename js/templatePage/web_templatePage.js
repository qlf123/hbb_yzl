//获取模板具体页
$(function() {
	domain = configure();
	opts = {
		domain: domain.domain,
		pageSize: 2,
		currentPage: 0,
		picurl: domain.imgServerUri,
		container: '.templatePage',
		zimgUri: domain.tempUri, //模板/作品图片服务器地址
		opusuri: 'outeropus/read/pageinfos'
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
		localStorage.opusId = data[0][1];
		localStorage.token = data[1][1];
	}
	opts.opusId = localStorage.opusId
	var temp = new Template(opts);
	temp.getPage();
	setTimeout(function() {
		temp.loadPage();
	}, 500);
});