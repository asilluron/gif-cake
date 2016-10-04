
var version = nw.App.manifest.version;
var win = nw.Window.get();

var tray = new nw.Tray(
  {
    icon: 'tray.png',
    iconsAreTemplates: false
  });

var menu = new nw.Menu();

menu.append(new nw.MenuItem(
  {
    label: 'Gif Cake'
  }));

menu.append(new nw.MenuItem(
  {
    type: 'separator'
  }));

menu.append(new nw.MenuItem(
  {
    label: 'v' + version
  }));

menu.append(new nw.MenuItem(
  {
    type: 'separator'
  }));

menu.append(new nw.MenuItem(
  {
    label: 'Exit',
    click: function () {
      nw.App.quit();
    }
  }));

tray.menu = menu;

var option = {
  key: 'Command+Alt+G',
  active: function () {
    win.show();

    setTimeout(function () {
      win.focus();
     // $('#term').focus();
    }, 0);
  },
  failed: function (e) {
    console.log(e);
  }
};

var shortcut = new nw.Shortcut(option);

nw.App.registerGlobalHotKey(shortcut);
