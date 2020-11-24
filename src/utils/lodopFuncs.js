import { MessageBox } from 'element-ui'

// ====页面动态加载C-Lodop云打印必须的文件CLodopfuncs.js====
var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
var oscript = document.createElement('script');
// 让本机的浏览器打印(更优先一点)：
oscript = document.createElement('script');
oscript.src = 'http://localhost:8000/CLodopfuncs.js?priority=2';
head.insertBefore(oscript, head.firstChild);
// 加载双端口(8000和18000）避免其中某个端口被占用：
oscript = document.createElement('script');
oscript.src = 'http://localhost:18000/CLodopfuncs.js?priority=1';
head.insertBefore(oscript, head.firstChild);

// 下载loadLodop
function loadLodop() {
  window.open('./lodop/CLodop_Setup_for_Win32NT.exe');
}

// ====获取LODOP对象的主过程：====
function getLodop() {
  let LODOP;
  try {
    LODOP = getCLodop();
    if (!LODOP && document.readyState !== 'complete') {
      MessageBox.alert('C-Lodop打印控件还没准备好，请稍后再试！');
      return
    }
    return LODOP
  } catch (err) {
    MessageBox({
      title: '温馨提示',
      type: 'warning',
      showCancelButton: true,
      message: '您还未安装打印控件，点击确定下载打印控件，安装成功后刷新页面即可进行打印',
      callback: res => {
        if (res === 'confirm') {
          loadLodop()
        }
      }
    })
  }
}

export default getLodop