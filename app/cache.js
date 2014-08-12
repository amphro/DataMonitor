
function CycleList(size) {
    this.size = size || 20;
    this.array = [];
}

CycleList.prototype.push = function(val) {
    if (this.array.length >= this.size) {
        this.array = this.array.splice(1);
    }
    this.array.push(val);
};

var cache = {};

module.exports = {
    addValue : function(type, value) {
        if (!this.hasCacheForType(type)) {
            cache[type] = new CycleList();
        }
        cache[type].push(value);
    },
    getValues : function(type) {
        if (this.hasCacheForType(type)) {
            // TODO Should probably retun an immutable list
            return cache[type].array;
        }
        return null;
    },
    hasCacheForType : function(type) {
        return cache.hasOwnProperty(type);
    }
};
