
var gui = require('nw.gui');
var version = gui.App.manifest.version;
var win = gui.Window.get();

var tray = new gui.Tray(
  {
    icon: 'tray.png',
    iconsAreTemplates: false
  });

var menu = new gui.Menu();

menu.append(new gui.MenuItem(
  {
    label: 'Gif Cake'
  }));

menu.append(new gui.MenuItem(
  {
    type: 'separator'
  }));

menu.append(new gui.MenuItem(
  {
    label: 'v' + version
  }));


menu.append(new gui.MenuItem(
  {
    type: 'separator'
  }));

menu.append(new gui.MenuItem(
  {
    label: 'Exit',
    click: function () {
      gui.App.quit();
    },
  }));

tray.menu = menu;

var option = {
  key: 'Ctrl+Alt+G',
  active: function () {
    win.show();

    setTimeout(function () {
      win.focus();
      $('#term').focus();
    }, 0);
  },
  failed: function (e) {
    console.log(e);
  }
};

var shortcut = new gui.Shortcut(option);

gui.App.registerGlobalHotKey(shortcut);
