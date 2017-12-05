var view_width = document.getElementsByTagName('html')[0].getBoundingClientRect().width;
var _html = document.getElementsByTagName('html')[0];
view_width>960?_html.style.fontSize = 960 / 16 + 'px':_html.style.fontSize = view_width / 16 + 'px';
