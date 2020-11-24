import { Loading } from 'element-ui';

let instance = null

let loadingInstance = {
	open(){
	  if(instance==null){
      instance = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
	  return this
	},
  close(){
	  if(instance!=null){
	    instance.close()
      instance = null
    }
  }
}
export default loadingInstance;
