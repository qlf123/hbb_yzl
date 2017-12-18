var view_width = document.getElementsByTagName('html')[0].getBoundingClientRect().width;
var _html = document.getElementsByTagName('html')[0];
view_width>600?_html.style.fontSize = 600 / 16 + 'px':_html.style.fontSize = view_width / 16 + 'px';
