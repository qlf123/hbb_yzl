function DButton(opts) {
	this.text = opts.text;
	this.type = opts.type;
	this.dhref = opts.dhref;
}

function Dialog(opts) {
	this.msg = opts.msg;
	this.type = opts.type;
	this.bgcolor = opts.bgcolor;
	this.btns = opts.btns;
}

Dialog.prototype = {

	show: function() {
		var _this = this;
		if (0 == _this.type) {
			_this.commonBuilder();
		}
	},

	commonBuilder: function() {
		var _this = this;

		var contentDiv = _this.contentBuilder();

		contentDiv.appendChild(_this.msgBuilder());

		contentDiv.appendChild(_this.lineBuilder());

		contentDiv.appendChild(_this.btnBuilder());

		// contentDiv.style.display="none";

		var body = $("body");

		body.append(contentDiv);

		// $(contentDiv).fadeIn("slow");
	},

	msgBuilder: function() {
		var _this = this;
		var msgDiv = document.createElement("div");
		msgDiv.style.position = 'relative';
		msgDiv.style.fontSize = '0.8rem';
		msgDiv.style.textAlign = 'center';
		msgDiv.innerText = _this.msg;
		msgDiv.style.lineHeight = '4rem';
		return msgDiv;
	},

	contentBuilder: function() {
		var _this = this;
		var contentDiv = document.createElement("div");
		contentDiv.style.left = "10%";
		contentDiv.style.top = "20%";
		contentDiv.style.width = "80%"
		contentDiv.style.backgroundColor = _this.bgcolor;
		contentDiv.style.position = 'fixed';
		contentDiv.style.borderRadius = "0.4rem";
		contentDiv.style.zIndex = 100;
		return contentDiv;
	},

	lineBuilder: function() {
		var lineDiv = document.createElement("div");
		lineDiv.style.margin = 0;
		lineDiv.style.backgroundColor = "#D5D5D5";
		lineDiv.style.height = '0.05rem';
		lineDiv.style.position = 'relative';
		lineDiv.style.marginTop = "10%"
		lineDiv.style.top = '-1rem'
		return lineDiv;
	},

	btnBuilder: function() {
		var _this = this;
		var btnList = _this.btns;
		var btnDiv = document.createElement("div");
		var sWidth = 100 / btnList.length;

		for (var i = 0; i < btnList.length; i++) {
			var btn = document.createElement("div");
			btn.style.textAlign = 'center'
			btn.style.fontSize = '1rem'
			btn.style.width = sWidth + "%";
			btn.style.position = 'relative';
			btn.style.color = '#ff4f4f';
			btn.style.lineHeight = "33%";
			btn.style.marginTop = '2%';
			btn.style.marginBottom = '10%';
			btn.innerText = btnList[i].text;
			if (0 == btnList[i].type) {
				btn.onclick = function() {
					btn.href = window.history.back();
				}
			} else if (1 == btnList[i].type) {
				btn.onclick = function() {
					btn.parentNode.parentNode.parentNode.removeChild(btn.parentNode.parentNode);
				}
			}
			btnDiv.appendChild(btn);
		}

		return btnDiv;
	}

};