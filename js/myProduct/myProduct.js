$(function() {
	//我的作品
	var domain = configure();
	var $product = $('.myProduct');
	var proOpts = {
		size: 8,
		number: 0,
		url: domain.domain,
		readUri: '/outeropus/read/opusinfos',
		object: '.myProduct',
		tempUri: domain.tempUri,
		imgServerUri: domain.imgServerUri
	};

	var myProduct = new Opus(proOpts);
	myProduct.getAlbList();
	myProduct.loadPage(); //添加下拉加载方法
	//家长端：可以更新
	if (localStorage.type == 3) {
		localStorage.update = 1;
		delModal();
	} else {
		localStorage.update = 2; //教师端:不能更新
	}
});

//时间戳转换
function formatDate(now) {
	var oDate = new Date(now);
	var year = oDate.getFullYear();
	var month = (oDate.getMonth() + 1 < 10 ? '0' + (oDate.getMonth() + 1) : oDate.getMonth() + 1);
	var date = (oDate.getDate() < 10 ? '0' + (oDate.getDate()) : oDate.getDate());
	return year + "-" + month + "-" + date;
}