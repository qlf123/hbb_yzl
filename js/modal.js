function opusModal() {
	$("body").append(
		'<div class="modal fade" id="noOpus" tabindex="-1" role="dialog"  aria-hidden="true">' +
		'<div class="modal-dialog" style="margin-top:8rem;">' +
		'<div class="modal-content">' +
		'<div class="modal-header" style="background-color:#ffe863;padding-left:95%;">' +
		'<button class="close" aria-hidden="true" data-dismiss="modal">&times;</button>' +
		'</div>' +
		'<div class="modal-footer" style="height:10%;background-color:#ffe863;">' +
		'<p style="float:left;margin:0 auto;margin-left:25%;margin-top:5%;font-family:MyNewFont;">' +
		'您还没有创建作品哦' +
		'</p>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>');
}

function delModal() {
	$("body").append(
		'<div class="modal fade" id="delete" tabindex="-1" role="dialog"  aria-hidden="true">' +
		'<div class="modal-dialog" style="top:8rem;">' +
		'<div class="modal-content">' +
		'<div class="modal-header" style="height:15%;">' +
		'<button class="close" aria-hidden="true" data-dismiss="modal">&times;</button>' +
		'<p style="float:left; margin: 0 auto; margin-left: 25%; margin-top: 5%;font-family: MyNewFont;font-size: 0.7rem;">您确定要删除此作品吗？<br>删除内容不可恢复哦' +
		'</p>' +
		'</div>' +
		'<div class="modal-footer" style="height:10%;">' +
		'<a id="deleteOpus" style="float: left;width: 50%;margin-top: 5%;color: #ff4f4f;font-family: MyNewFont;text-align: center;font-size: 1rem;">残忍删除' +
		'</a>' +
		'<a class="close" aria-hidden="true" data-dismiss="modal" style="float:left;margin-top: 1%;left: 50%;font-family: MyNewFont;width: 50%;color: #ff4f4f;text-align: center;font-size: 1rem;">继续保留' +
		'</a>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>');
}
//添加推出与继续编辑模态框
function　addModal() {
	$("body").append(
		'<div  class="modal fade" id="yhx-title" tabindex="-1" role="dialog"  aria-hidden="true">' +
		'<div class="modal-dialog" style="top:8rem;">' +
		'<div class="modal-content" style="background-color:#f0efed;">' +
		'<div class="modal-header">' +
		'<button class="close" style="margin-top:-0.5rem;" aria-hidden="true" data-dismiss="modal">&times;</button>' +
		'<input id="input" maxlength="7" style="margin-left:2rem;text-align:center;width:10rem;height:1.5rem;font-family: MyNewFont;font-size: 1rem;" placeholder="模板名称自定义">' +
		'</div>' +
		'<div class="modal-footer" style="padding:0;"><a id="fin" style="display:block;" data-dismiss="modal">' +
		'<p id=""style="text-align:center;font-size:1rem;font-family:MyNewFont;color:#ff4f4f;">确认</p></a>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'<div  class="modal fade" id="yhx-bear" tabindex="-1" role="dialog"  aria-hidden="true">' +
		'<div class="modal-dialog" style="margin:0;">' +
		'<div class="modal-content">' +
		'<div class="modal-header" style="padding:0;">' +
		'<img src="../images/yhx_bear.gif" style="width:100%;">' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'<div  class="modal fade" id="yhx-success" tabindex="-1" role="dialog"  aria-hidden="true">' +
		'<div class="modal-dialog" style="top:12rem;left:6rem;width:4rem;">' +
		'<div class="modal-content" style="border:0;">' +
		'<div class="modal-header" style="padding:0;">' +
		'<p style="line-height: 2rem;text-align: center;font-family: MyNewFont;">发送成功</p>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'<div  class="modal fade" id="yhx-photoList" tabindex="-1" role="dialog"  aria-hidden="true">' +
		'<div class="modal-dialog" style="margin: 0;width:100%;height:100%">' +
		'<div class="modal-content" style="border:none;border-radius:0;">' +
		'<div class="modal-header" style="border:none;padding:0;height:1rem;">' +
		'<button class="close" style="margin-right:0.2rem;font-size:1.4rem;color:#ff4f4f;" aria-hidden="true" data-dismiss="modal">&times;</button>' +
		'</div>' +
		'<div class="modal-footer" style="padding:10px 0;border:none;width:100%;height:100%"" id="yhx-photo-footer">' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>');
}
//增加打印按钮模态框
function　printModal() {
	$("body").append(
		'<div  class="modal fade" id="yhx-print" tabindex="-1" role="dialog"  aria-hidden="true" style="width:12.44rem;height:14rem;margin:0 auto;margin-top:3rem;">' +
		'<div class="modal-dialog" style="top:3rem;">' +
		'<div class="modal-content" style="background-color:#f0efed;">' +
		'<div class="modal-header">' +
		'<button class="close" style="margin-top:-0.5rem;" aria-hidden="true" data-dismiss="modal">&times;</button>' +
		'<p style="text-align:center;font-size:0.7rem;font-family:MyNewFont;color:black;">请您填写如下订购信息:</p>' +
		'</div>' +
		'<div class="modal-body">' +
		'<p style="font-size:0.7rem;font-family:MyNewFont;color:black;display:inline-block;margin-left:1.7rem;margin-top:-0.6rem;">单价：120元 / 本</p></br>' +
		'<p style="font-size:0.7rem;font-family:MyNewFont;color:black;display:inline-block;margin-left:1.7rem;">本数：</p>' +
		'<input id="quantity" style="display:inline;text-align:center;width:2rem;font-family: MyNewFont;font-size: 0.7rem;" placeholder="1">' +
		'<p style="font-size:0.7rem;font-family:MyNewFont;color:black;display:inline;">&nbsp;&nbsp;本</p></br>' +
		'<p style="margin-left:1.7rem;font-size:0.7rem;font-family:MyNewFont;color:black;display:inline-block;">总价：</p>' +
		'<input id="total" style="display:inline;text-align:center;width:2rem;font-family: MyNewFont;font-size: 0.7rem;" placeholder="120" disabled="true">' +
		'<p style="font-size:0.7rem;font-family:MyNewFont;color:black;display:inline;">&nbsp;&nbsp;元</p></br>' +
		'<p style="margin-left:1.7rem;font-family: MyNewFont;font-size:0.7rem;display:inline;block">手机号:</p>' +
		'<input id="tel" style="display:inline;text-align:center;width:5rem;font-family: MyNewFont;font-size: 0.7rem;" placeholder=""></br>' +
		'<p style="text-align:center;font-size:0.6rem;font-family:MyNewFont;color:black;display:inline;">稍后客服会电话联系您，请耐心等候~</p>' +
		'</div>' +
		'<div class="modal-footer" style="padding:0;"><a  style="display:block;" >' +
		'<p id="finPrint" style="text-align:center;font-size:0.7rem;font-family:MyNewFont;color:#ff4f4f;margin:0 auto;">确认</p></a>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>');
}

function backModal() {
	$("body").append(
		'<div class="modal fade" id="yhx-back" tabindex="-1" role="dialog"  aria-hidden="true">' +
		'<div class="modal-dialog">' +
		'<div class="modal-content">' +
		'<div class="modal-header" style="height:10%;padding:30px 15px;">' +
		'<button class="close" aria-hidden="true" data-dismiss="modal">&times;</button>' +
		'<p style="float:left;margin:0 auto;margin-left:25%;margin-top:5%;font-family:MyNewFont;">您确定要离开当前模板吗？<br>' +
		'编辑内容将不会被保存哦' +
		'</p>' +
		'</div>' +
		'<div class="modal-footer">' +
		'<a id="yhx-leave" href="#" style="margin-left: 0%;float:left;width:30%;font-family:MyNewFont;" data-dismiss="modal">残忍离开</a>' +
		'<a id="yhx-keep" href="#" style="margin-left: 50%;float:left;width:30%;font-family:MyNewFont;" data-dismiss="modal">继续留下</a>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>');
}