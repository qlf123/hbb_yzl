$(function() {
    //照片选取页面
    var domain = configure();
    var options = {
        object: '.photoListBox',
        url: domain.domain + 'hbbclient/teacher/read/timeline',
        uri: domain.domain + 'hbbclient/teacher/read/photos',
        albUri: domain.domain + 'hbbclient/parent/read/album',
        photoUri: domain.domain + 'hbbclient/parent/read/photos',
        picurl: domain.imgServerUri, //图片服务器地址
        pageSize: 32, //页面数量
        picLength: JSON.parse(localStorage.picnum) //最多选择图片
    }
    var photoList = new Photo(options);
    photoList.queryByYear();
});