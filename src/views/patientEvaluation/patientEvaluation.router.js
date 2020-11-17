const arr= [];
function importPages(r, arr) {
  r.keys().forEach((key) => {
    let _keyarr = key.split(".");
    let _path = _keyarr[1];
    // if (_keyarr[2] === "param") {
    //   _path = _keyarr[1] + "/:row";
    // }
	arr.push({
	  path: _path,
	  name: _keyarr[1].substring(1, _keyarr[1].length + 1),
	  component: () => r(key),
	});	
    
  });
}
importPages(require.context("./page", false, /\.vue$/, "lazy"), arr);
export default arr;