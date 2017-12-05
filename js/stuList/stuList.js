$(function() {
	var domain = configure();

	//配置信息
	var opts = {
		obj: '.studentList',
		studomain: domain.domain + 'hbbclient/teacher/read/sutdents',
		imgServerUri: domain.imgServerUri,
		class_id: 117,
		school_id: 52,
		access_token: 111
	};

	var studentList = new Student(opts);
	studentList.getStuList();
	setTimeout(function() {
		studentList.loadPage();
	}, 500);
});