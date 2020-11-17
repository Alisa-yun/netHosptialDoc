const arr= [];
function importPages(r, arr) {
  r.keys().forEach((key) => {
    let _keyarr = key.split(".");
    let _path = _keyarr[1];
    // if (_keyarr[2] === "param") {
    //   _path = _keyarr[1] + "/:row";
    // }
	if(_path == '/index'){
		arr.unshift({
		  path: _path,
		  name: _keyarr[1].substring(1, _keyarr[1].length + 1),
		  component: () => r(key),
		});
		arr.unshift({
		  path: '/',
		  component: () => r(key),
		});
	}else if(_path == '/consultDetail'){
	arr.push({
	  path: _path,
	  name: _keyarr[1].substring(1, _keyarr[1].length + 1),
	  component: () => r(key),
	  meta: { requireAuth: true },
	});	
	}
	else{
	arr.push({
	  path: _path,
	  name: _keyarr[1].substring(1, _keyarr[1].length + 1),
	  component: () => r(key),
	});	
	}
   
  });
}
importPages(require.context("./page", true, /\.vue$/, "lazy"), arr);
 // console.log(arr)
export default arr;