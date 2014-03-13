var hasOwnProp = Object.prototype.hasOwnProperty;

function extend(target, source) {
    typeof target !== 'object' && (target = {});

    for(var i = 1, len = arguments.length; i < len; i++) {
        var obj = arguments[i];
        if(obj) {
            for(var key in obj) {
                hasOwnProp.call(obj, key) && (target[key] = obj[key]);
            }
        }
    }

    return target;
}

module.exports = extend;