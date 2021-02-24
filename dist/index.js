"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
/**
 * A Map with additional utility methods. This is used throughout discord.js rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 * @extends {Map}
 * @property {number} size - The amount of elements in this collection.
 */
class Collection extends Map {
    constructor(entries) {
        super(entries);
        /**
         * Cached array for the `array()` method - will be reset to `null` whenever `set()` or `delete()` are called
         * @name Collection#_array
         * @type {?Array}
         * @private
         */
        Object.defineProperty(this, '_array', { value: null, writable: true, configurable: true });
        /**
         * Cached array for the `keyArray()` method - will be reset to `null` whenever `set()` or `delete()` are called
         * @name Collection#_keyArray
         * @type {?Array}
         * @private
         */
        Object.defineProperty(this, '_keyArray', { value: null, writable: true, configurable: true });
    }
    /**
     * Identical to [Map.get()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get).
     * Gets an element with the specified key, and returns its value, or `undefined` if the element does not exist.
     * @param {*} key - The key to get from this collection
     * @returns {* | undefined}
     */
    get(key) {
        return super.get(key);
    }
    /**
     * Identical to [Map.set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set).
     * Sets a new element in the collection with the specified key and value.
     * @param {*} key - The key of the element to add
     * @param {*} value - The value of the element to add
     * @returns {Collection}
     */
    set(key, value) {
        this._array = null;
        this._keyArray = null;
        return super.set(key, value);
    }
    /**
     * Identical to [Map.has()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has).
     * Checks if an element exists in the collection.
     * @param {*} key - The key of the element to check for
     * @returns {boolean} `true` if the element exists, `false` if it does not exist.
     */
    has(key) {
        return super.has(key);
    }
    /**
     * Identical to [Map.delete()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete).
     * Deletes an element from the collection.
     * @param {*} key - The key to delete from the collection
     * @returns {boolean} `true` if the element was removed, `false` if the element does not exist.
     */
    delete(key) {
        this._array = null;
        this._keyArray = null;
        return super.delete(key);
    }
    /**
     * Identical to [Map.clear()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear).
     * Removes all elements from the collection.
     * @returns {undefined}
     */
    clear() {
        return super.clear();
    }
    /**
     * Creates an ordered array of the values of this collection, and caches it internally. The array will only be
     * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
     * itself. If you don't want this caching behavior, use `[...collection.values()]` or
     * `Array.from(collection.values())` instead.
     * @returns {Array}
     */
    array() {
        var _a;
        if (((_a = this._array) === null || _a === void 0 ? void 0 : _a.length) !== this.size)
            this._array = [...this.values()];
        return this._array;
    }
    /**
     * Creates an ordered array of the keys of this collection, and caches it internally. The array will only be
     * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
     * itself. If you don't want this caching behavior, use `[...collection.keys()]` or
     * `Array.from(collection.keys())` instead.
     * @returns {Array}
     */
    keyArray() {
        var _a;
        if (((_a = this._keyArray) === null || _a === void 0 ? void 0 : _a.length) !== this.size)
            this._keyArray = [...this.keys()];
        return this._keyArray;
    }
    first(amount) {
        if (typeof amount === 'undefined')
            return this.values().next().value;
        if (amount < 0)
            return this.last(amount * -1);
        amount = Math.min(this.size, amount);
        const iter = this.values();
        return Array.from({ length: amount }, () => iter.next().value);
    }
    firstKey(amount) {
        if (typeof amount === 'undefined')
            return this.keys().next().value;
        if (amount < 0)
            return this.lastKey(amount * -1);
        amount = Math.min(this.size, amount);
        const iter = this.keys();
        return Array.from({ length: amount }, () => iter.next().value);
    }
    last(amount) {
        const arr = this.array();
        if (typeof amount === 'undefined')
            return arr[arr.length - 1];
        if (amount < 0)
            return this.first(amount * -1);
        if (!amount)
            return [];
        return arr.slice(-amount);
    }
    lastKey(amount) {
        const arr = this.keyArray();
        if (typeof amount === 'undefined')
            return arr[arr.length - 1];
        if (amount < 0)
            return this.firstKey(amount * -1);
        if (!amount)
            return [];
        return arr.slice(-amount);
    }
    random(amount) {
        let arr = this.array();
        if (typeof amount === 'undefined')
            return arr[Math.floor(Math.random() * arr.length)];
        if (!arr.length || !amount)
            return [];
        arr = arr.slice();
        return Array.from({ length: Math.min(amount, arr.length) }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }
    randomKey(amount) {
        let arr = this.keyArray();
        if (typeof amount === 'undefined')
            return arr[Math.floor(Math.random() * arr.length)];
        if (!arr.length || !amount)
            return [];
        arr = arr.slice();
        return Array.from({ length: Math.min(amount, arr.length) }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }
    find(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this))
                return val;
        }
        return undefined;
    }
    findKey(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this))
                return key;
        }
        return undefined;
    }
    sweep(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const previousSize = this.size;
        for (const [key, val] of this) {
            if (fn(val, key, this))
                this.delete(key);
        }
        return previousSize - this.size;
    }
    filter(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const results = new this.constructor[Symbol.species]();
        for (const [key, val] of this) {
            if (fn(val, key, this))
                results.set(key, val);
        }
        return results;
    }
    partition(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const results = [
            new this.constructor[Symbol.species](),
            new this.constructor[Symbol.species](),
        ];
        for (const [key, val] of this) {
            if (fn(val, key, this)) {
                results[0].set(key, val);
            }
            else {
                results[1].set(key, val);
            }
        }
        return results;
    }
    flatMap(fn, thisArg) {
        const collections = this.map(fn, thisArg);
        return new this.constructor[Symbol.species]().concat(...collections);
    }
    map(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const iter = this.entries();
        return Array.from({ length: this.size }, () => {
            const [key, value] = iter.next().value;
            return fn(value, key, this);
        });
    }
    mapValues(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const coll = new this.constructor[Symbol.species]();
        for (const [key, val] of this)
            coll.set(key, fn(val, key, this));
        return coll;
    }
    some(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this))
                return true;
        }
        return false;
    }
    every(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (!fn(val, key, this))
                return false;
        }
        return true;
    }
    /**
     * Applies a function to produce a single value. Identical in behavior to
     * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
     * @param {Function} fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
     * and `collection`
     * @param {*} [initialValue] Starting value for the accumulator
     * @returns {*}
     * @example collection.reduce((acc, guild) => acc + guild.memberCount, 0);
     */
    reduce(fn, initialValue) {
        let accumulator;
        if (typeof initialValue !== 'undefined') {
            accumulator = initialValue;
            for (const [key, val] of this)
                accumulator = fn(accumulator, val, key, this);
            return accumulator;
        }
        let first = true;
        for (const [key, val] of this) {
            if (first) {
                accumulator = val;
                first = false;
                continue;
            }
            accumulator = fn(accumulator, val, key, this);
        }
        // No items iterated.
        if (first) {
            throw new TypeError('Reduce of empty collection with no initial value');
        }
        return accumulator;
    }
    each(fn, thisArg) {
        this.forEach(fn, thisArg);
        return this;
    }
    tap(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        fn(this);
        return this;
    }
    /**
     * Creates an identical shallow copy of this collection.
     * @returns {Collection}
     * @example const newColl = someColl.clone();
     */
    clone() {
        return new this.constructor[Symbol.species](this);
    }
    /**
     * Combines this collection with others into a new collection. None of the source collections are modified.
     * @param {...Collection} collections Collections to merge
     * @returns {Collection}
     * @example const newColl = someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
     */
    concat(...collections) {
        const newColl = this.clone();
        for (const coll of collections) {
            for (const [key, val] of coll)
                newColl.set(key, val);
        }
        return newColl;
    }
    /**
     * Checks if this collection shares identical items with another.
     * This is different to checking for equality using equal-signs, because
     * the collections may be different objects, but contain the same data.
     * @param {Collection} collection Collection to compare with
     * @returns {boolean} Whether the collections have identical contents
     */
    equals(collection) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!collection)
            return false; // runtime check
        if (this === collection)
            return true;
        if (this.size !== collection.size)
            return false;
        for (const [key, value] of this) {
            if (!collection.has(key) || value !== collection.get(key)) {
                return false;
            }
        }
        return true;
    }
    /**
     * The sort method sorts the items of a collection in place and returns it.
     * The sort is not necessarily stable in Node 10 or older.
     * The default sort order is according to string Unicode code points.
     * @param {Function} [compareFunction] Specifies a function that defines the sort order.
     * If omitted, the collection is sorted according to each character's Unicode code point value,
     * according to the string conversion of each element.
     * @returns {Collection}
     * @example collection.sort((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
     */
    sort(compareFunction = (x, y) => Number(x > y) || Number(x === y) - 1) {
        const entries = [...this.entries()];
        entries.sort((a, b) => compareFunction(a[1], b[1], a[0], b[0]));
        // Perform clean-up
        super.clear();
        this._array = null;
        this._keyArray = null;
        // Set the new entries
        for (const [k, v] of entries) {
            super.set(k, v);
        }
        return this;
    }
    /**
     * The intersect method returns a new structure containing items where the keys are present in both original structures.
     * @param {Collection} other The other Collection to filter against
     * @returns {Collection}
     */
    intersect(other) {
        return other.filter((_, k) => this.has(k));
    }
    /**
     * The difference method returns a new structure containing items where the key is present in one of the original structures but not the other.
     * @param {Collection} other The other Collection to filter against
     * @returns {Collection}
     */
    difference(other) {
        return other.filter((_, k) => !this.has(k)).concat(this.filter((_, k) => !other.has(k)));
    }
    /**
     * The sorted method sorts the items of a collection and returns it.
     * The sort is not necessarily stable in Node 10 or older.
     * The default sort order is according to string Unicode code points.
     * @param {Function} [compareFunction] Specifies a function that defines the sort order.
     * If omitted, the collection is sorted according to each character's Unicode code point value,
     * according to the string conversion of each element.
     * @returns {Collection}
     * @example collection.sorted((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
     */
    sorted(compareFunction = (x, y) => Number(x > y) || Number(x === y) - 1) {
        return new this.constructor[Symbol.species]([...this.entries()]).sort((av, bv, ak, bk) => compareFunction(av, bv, ak, bk));
    }
}
exports.Collection = Collection;
Collection.default = Collection;
module.exports = Collection;
exports.default = Collection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXMiOlsiaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBUUE7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQWlCLFNBQVEsR0FBUztJQU12QyxZQUFtQixPQUErQztRQUNqRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFZjs7Ozs7V0FLRztRQUNILE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUUzRjs7Ozs7V0FLRztRQUNILE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxHQUFHLENBQWMsR0FBTTtRQUM3QixPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFNLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLEdBQUcsQ0FBQyxHQUFNLEVBQUUsS0FBUTtRQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEdBQUcsQ0FBQyxHQUFNO1FBQ2hCLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsR0FBTTtRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FB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TyxHQUFHLFVBQVUsQ0FBQztBQUU1QixrQkFBZSxVQUFVLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIENvbGxlY3Rpb25Db25zdHJ1Y3RvciB7XG5cdG5ldyAoKTogQ29sbGVjdGlvbjx1bmtub3duLCB1bmtub3duPjtcblx0bmV3IDxLLCBWPihlbnRyaWVzPzogUmVhZG9ubHlBcnJheTxyZWFkb25seSBbSywgVl0+IHwgbnVsbCk6IENvbGxlY3Rpb248SywgVj47XG5cdG5ldyA8SywgVj4oaXRlcmFibGU6IEl0ZXJhYmxlPHJlYWRvbmx5IFtLLCBWXT4pOiBDb2xsZWN0aW9uPEssIFY+O1xuXHRyZWFkb25seSBwcm90b3R5cGU6IENvbGxlY3Rpb248dW5rbm93biwgdW5rbm93bj47XG5cdHJlYWRvbmx5IFtTeW1ib2wuc3BlY2llc106IENvbGxlY3Rpb25Db25zdHJ1Y3Rvcjtcbn1cblxuLyoqXG4gKiBBIE1hcCB3aXRoIGFkZGl0aW9uYWwgdXRpbGl0eSBtZXRob2RzLiBUaGlzIGlzIHVzZWQgdGhyb3VnaG91dCBkaXNjb3JkLmpzIHJhdGhlciB0aGFuIEFycmF5cyBmb3IgYW55dGhpbmcgdGhhdCBoYXNcbiAqIGFuIElELCBmb3Igc2lnbmlmaWNhbnRseSBpbXByb3ZlZCBwZXJmb3JtYW5jZSBhbmQgZWFzZS1vZi11c2UuXG4gKiBAZXh0ZW5kcyB7TWFwfVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpemUgLSBUaGUgYW1vdW50IG9mIGVsZW1lbnRzIGluIHRoaXMgY29sbGVjdGlvbi5cbiAqL1xuY2xhc3MgQ29sbGVjdGlvbjxLLCBWPiBleHRlbmRzIE1hcDxLLCBWPiB7XG5cdHByaXZhdGUgX2FycmF5ITogVltdIHwgbnVsbDtcblx0cHJpdmF0ZSBfa2V5QXJyYXkhOiBLW10gfCBudWxsO1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IGRlZmF1bHQ6IHR5cGVvZiBDb2xsZWN0aW9uID0gQ29sbGVjdGlvbjtcblx0cHVibGljIFsnY29uc3RydWN0b3InXTogdHlwZW9mIENvbGxlY3Rpb247XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKGVudHJpZXM/OiBSZWFkb25seUFycmF5PHJlYWRvbmx5IFtLLCBWXT4gfCBudWxsKSB7XG5cdFx0c3VwZXIoZW50cmllcyk7XG5cblx0XHQvKipcblx0XHQgKiBDYWNoZWQgYXJyYXkgZm9yIHRoZSBgYXJyYXkoKWAgbWV0aG9kIC0gd2lsbCBiZSByZXNldCB0byBgbnVsbGAgd2hlbmV2ZXIgYHNldCgpYCBvciBgZGVsZXRlKClgIGFyZSBjYWxsZWRcblx0XHQgKiBAbmFtZSBDb2xsZWN0aW9uI19hcnJheVxuXHRcdCAqIEB0eXBlIHs/QXJyYXl9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ19hcnJheScsIHsgdmFsdWU6IG51bGwsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSk7XG5cblx0XHQvKipcblx0XHQgKiBDYWNoZWQgYXJyYXkgZm9yIHRoZSBga2V5QXJyYXkoKWAgbWV0aG9kIC0gd2lsbCBiZSByZXNldCB0byBgbnVsbGAgd2hlbmV2ZXIgYHNldCgpYCBvciBgZGVsZXRlKClgIGFyZSBjYWxsZWRcblx0XHQgKiBAbmFtZSBDb2xsZWN0aW9uI19rZXlBcnJheVxuXHRcdCAqIEB0eXBlIHs/QXJyYXl9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ19rZXlBcnJheScsIHsgdmFsdWU6IG51bGwsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSk7XG5cdH1cblxuXHQvKipcblx0ICogSWRlbnRpY2FsIHRvIFtNYXAuZ2V0KCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL01hcC9nZXQpLlxuXHQgKiBHZXRzIGFuIGVsZW1lbnQgd2l0aCB0aGUgc3BlY2lmaWVkIGtleSwgYW5kIHJldHVybnMgaXRzIHZhbHVlLCBvciBgdW5kZWZpbmVkYCBpZiB0aGUgZWxlbWVudCBkb2VzIG5vdCBleGlzdC5cblx0ICogQHBhcmFtIHsqfSBrZXkgLSBUaGUga2V5IHRvIGdldCBmcm9tIHRoaXMgY29sbGVjdGlvblxuXHQgKiBAcmV0dXJucyB7KiB8IHVuZGVmaW5lZH1cblx0ICovXG5cdHB1YmxpYyBnZXQ8VCBleHRlbmRzIFY+KGtleTogSyk6IFQgfCB1bmRlZmluZWQge1xuXHRcdHJldHVybiBzdXBlci5nZXQoa2V5KSBhcyBUO1xuXHR9XG5cblx0LyoqXG5cdCAqIElkZW50aWNhbCB0byBbTWFwLnNldCgpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9NYXAvc2V0KS5cblx0ICogU2V0cyBhIG5ldyBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uIHdpdGggdGhlIHNwZWNpZmllZCBrZXkgYW5kIHZhbHVlLlxuXHQgKiBAcGFyYW0geyp9IGtleSAtIFRoZSBrZXkgb2YgdGhlIGVsZW1lbnQgdG8gYWRkXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgLSBUaGUgdmFsdWUgb2YgdGhlIGVsZW1lbnQgdG8gYWRkXG5cdCAqIEByZXR1cm5zIHtDb2xsZWN0aW9ufVxuXHQgKi9cblx0cHVibGljIHNldChrZXk6IEssIHZhbHVlOiBWKTogdGhpcyB7XG5cdFx0dGhpcy5fYXJyYXkgPSBudWxsO1xuXHRcdHRoaXMuX2tleUFycmF5ID0gbnVsbDtcblx0XHRyZXR1cm4gc3VwZXIuc2V0KGtleSwgdmFsdWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIElkZW50aWNhbCB0byBbTWFwLmhhcygpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9NYXAvaGFzKS5cblx0ICogQ2hlY2tzIGlmIGFuIGVsZW1lbnQgZXhpc3RzIGluIHRoZSBjb2xsZWN0aW9uLlxuXHQgKiBAcGFyYW0geyp9IGtleSAtIFRoZSBrZXkgb2YgdGhlIGVsZW1lbnQgdG8gY2hlY2sgZm9yXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgdGhlIGVsZW1lbnQgZXhpc3RzLCBgZmFsc2VgIGlmIGl0IGRvZXMgbm90IGV4aXN0LlxuXHQgKi9cblx0cHVibGljIGhhcyhrZXk6IEspOiBib29sZWFuIHtcblx0XHRyZXR1cm4gc3VwZXIuaGFzKGtleSk7XG5cdH1cblxuXHQvKipcblx0ICogSWRlbnRpY2FsIHRvIFtNYXAuZGVsZXRlKCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL01hcC9kZWxldGUpLlxuXHQgKiBEZWxldGVzIGFuIGVsZW1lbnQgZnJvbSB0aGUgY29sbGVjdGlvbi5cblx0ICogQHBhcmFtIHsqfSBrZXkgLSBUaGUga2V5IHRvIGRlbGV0ZSBmcm9tIHRoZSBjb2xsZWN0aW9uXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgdGhlIGVsZW1lbnQgd2FzIHJlbW92ZWQsIGBmYWxzZWAgaWYgdGhlIGVsZW1lbnQgZG9lcyBub3QgZXhpc3QuXG5cdCAqL1xuXHRwdWJsaWMgZGVsZXRlKGtleTogSyk6IGJvb2xlYW4ge1xuXHRcdHRoaXMuX2FycmF5ID0gbnVsbDtcblx0XHR0aGlzLl9rZXlBcnJheSA9IG51bGw7XG5cdFx0cmV0dXJuIHN1cGVyLmRlbGV0ZShrZXkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIElkZW50aWNhbCB0byBbTWFwLmNsZWFyKCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL01hcC9jbGVhcikuXG5cdCAqIFJlbW92ZXMgYWxsIGVsZW1lbnRzIGZyb20gdGhlIGNvbGxlY3Rpb24uXG5cdCAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG5cdCAqL1xuXHRwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG5cdFx0cmV0dXJuIHN1cGVyLmNsZWFyKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhbiBvcmRlcmVkIGFycmF5IG9mIHRoZSB2YWx1ZXMgb2YgdGhpcyBjb2xsZWN0aW9uLCBhbmQgY2FjaGVzIGl0IGludGVybmFsbHkuIFRoZSBhcnJheSB3aWxsIG9ubHkgYmVcblx0ICogcmVjb25zdHJ1Y3RlZCBpZiBhbiBpdGVtIGlzIGFkZGVkIHRvIG9yIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbiwgb3IgaWYgeW91IGNoYW5nZSB0aGUgbGVuZ3RoIG9mIHRoZSBhcnJheVxuXHQgKiBpdHNlbGYuIElmIHlvdSBkb24ndCB3YW50IHRoaXMgY2FjaGluZyBiZWhhdmlvciwgdXNlIGBbLi4uY29sbGVjdGlvbi52YWx1ZXMoKV1gIG9yXG5cdCAqIGBBcnJheS5mcm9tKGNvbGxlY3Rpb24udmFsdWVzKCkpYCBpbnN0ZWFkLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9XG5cdCAqL1xuXHRwdWJsaWMgYXJyYXk8VCBleHRlbmRzIFY+KCk6IFRbXSB7XG5cdFx0aWYgKHRoaXMuX2FycmF5Py5sZW5ndGggIT09IHRoaXMuc2l6ZSkgdGhpcy5fYXJyYXkgPSBbLi4udGhpcy52YWx1ZXMoKV07XG5cdFx0cmV0dXJuIHRoaXMuX2FycmF5IGFzIFRbXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGFuIG9yZGVyZWQgYXJyYXkgb2YgdGhlIGtleXMgb2YgdGhpcyBjb2xsZWN0aW9uLCBhbmQgY2FjaGVzIGl0IGludGVybmFsbHkuIFRoZSBhcnJheSB3aWxsIG9ubHkgYmVcblx0ICogcmVjb25zdHJ1Y3RlZCBpZiBhbiBpdGVtIGlzIGFkZGVkIHRvIG9yIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbiwgb3IgaWYgeW91IGNoYW5nZSB0aGUgbGVuZ3RoIG9mIHRoZSBhcnJheVxuXHQgKiBpdHNlbGYuIElmIHlvdSBkb24ndCB3YW50IHRoaXMgY2FjaGluZyBiZWhhdmlvciwgdXNlIGBbLi4uY29sbGVjdGlvbi5rZXlzKCldYCBvclxuXHQgKiBgQXJyYXkuZnJvbShjb2xsZWN0aW9uLmtleXMoKSlgIGluc3RlYWQuXG5cdCAqIEByZXR1cm5zIHtBcnJheX1cblx0ICovXG5cdHB1YmxpYyBrZXlBcnJheSgpOiBLW10ge1xuXHRcdGlmICh0aGlzLl9rZXlBcnJheT8ubGVuZ3RoICE9PSB0aGlzLnNpemUpIHRoaXMuX2tleUFycmF5ID0gWy4uLnRoaXMua2V5cygpXTtcblx0XHRyZXR1cm4gdGhpcy5fa2V5QXJyYXk7XG5cdH1cblxuXHQvKipcblx0ICogT2J0YWlucyB0aGUgZmlyc3QgdmFsdWUocykgaW4gdGhpcyBjb2xsZWN0aW9uLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gW2Ftb3VudF0gQW1vdW50IG9mIHZhbHVlcyB0byBvYnRhaW4gZnJvbSB0aGUgYmVnaW5uaW5nXG5cdCAqIEByZXR1cm5zIHsqfEFycmF5PCo+fSBBIHNpbmdsZSB2YWx1ZSBpZiBubyBhbW91bnQgaXMgcHJvdmlkZWQgb3IgYW4gYXJyYXkgb2YgdmFsdWVzLCBzdGFydGluZyBmcm9tIHRoZSBlbmQgaWZcblx0ICogYW1vdW50IGlzIG5lZ2F0aXZlXG5cdCAqL1xuXHRwdWJsaWMgZmlyc3Q8VCBleHRlbmRzIFY+KCk6IFQgfCB1bmRlZmluZWQ7XG5cdHB1YmxpYyBmaXJzdDxUIGV4dGVuZHMgVj4oYW1vdW50OiBudW1iZXIpOiBUW107XG5cdHB1YmxpYyBmaXJzdDxUIGV4dGVuZHMgVj4oYW1vdW50PzogbnVtYmVyKTogVCB8IFRbXSB8IHVuZGVmaW5lZCB7XG5cdFx0aWYgKHR5cGVvZiBhbW91bnQgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gdGhpcy52YWx1ZXMoKS5uZXh0KCkudmFsdWU7XG5cdFx0aWYgKGFtb3VudCA8IDApIHJldHVybiB0aGlzLmxhc3QoYW1vdW50ICogLTEpO1xuXHRcdGFtb3VudCA9IE1hdGgubWluKHRoaXMuc2l6ZSwgYW1vdW50KTtcblx0XHRjb25zdCBpdGVyID0gdGhpcy52YWx1ZXMoKTtcblx0XHRyZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogYW1vdW50IH0sICgpOiBUID0+IGl0ZXIubmV4dCgpLnZhbHVlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBPYnRhaW5zIHRoZSBmaXJzdCBrZXkocykgaW4gdGhpcyBjb2xsZWN0aW9uLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gW2Ftb3VudF0gQW1vdW50IG9mIGtleXMgdG8gb2J0YWluIGZyb20gdGhlIGJlZ2lubmluZ1xuXHQgKiBAcmV0dXJucyB7KnxBcnJheTwqPn0gQSBzaW5nbGUga2V5IGlmIG5vIGFtb3VudCBpcyBwcm92aWRlZCBvciBhbiBhcnJheSBvZiBrZXlzLCBzdGFydGluZyBmcm9tIHRoZSBlbmQgaWZcblx0ICogYW1vdW50IGlzIG5lZ2F0aXZlXG5cdCAqL1xuXHRwdWJsaWMgZmlyc3RLZXkoKTogSyB8IHVuZGVmaW5lZDtcblx0cHVibGljIGZpcnN0S2V5KGFtb3VudDogbnVtYmVyKTogS1tdO1xuXHRwdWJsaWMgZmlyc3RLZXkoYW1vdW50PzogbnVtYmVyKTogSyB8IEtbXSB8IHVuZGVmaW5lZCB7XG5cdFx0aWYgKHR5cGVvZiBhbW91bnQgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gdGhpcy5rZXlzKCkubmV4dCgpLnZhbHVlO1xuXHRcdGlmIChhbW91bnQgPCAwKSByZXR1cm4gdGhpcy5sYXN0S2V5KGFtb3VudCAqIC0xKTtcblx0XHRhbW91bnQgPSBNYXRoLm1pbih0aGlzLnNpemUsIGFtb3VudCk7XG5cdFx0Y29uc3QgaXRlciA9IHRoaXMua2V5cygpO1xuXHRcdHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBhbW91bnQgfSwgKCk6IEsgPT4gaXRlci5uZXh0KCkudmFsdWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE9idGFpbnMgdGhlIGxhc3QgdmFsdWUocykgaW4gdGhpcyBjb2xsZWN0aW9uLiBUaGlzIHJlbGllcyBvbiB7QGxpbmsgQ29sbGVjdGlvbiNhcnJheX0sIGFuZCB0aHVzIHRoZSBjYWNoaW5nXG5cdCAqIG1lY2hhbmlzbSBhcHBsaWVzIGhlcmUgYXMgd2VsbC5cblx0ICogQHBhcmFtIHtudW1iZXJ9IFthbW91bnRdIEFtb3VudCBvZiB2YWx1ZXMgdG8gb2J0YWluIGZyb20gdGhlIGVuZFxuXHQgKiBAcmV0dXJucyB7KnxBcnJheTwqPn0gQSBzaW5nbGUgdmFsdWUgaWYgbm8gYW1vdW50IGlzIHByb3ZpZGVkIG9yIGFuIGFycmF5IG9mIHZhbHVlcywgc3RhcnRpbmcgZnJvbSB0aGUgc3RhcnQgaWZcblx0ICogYW1vdW50IGlzIG5lZ2F0aXZlXG5cdCAqL1xuXHRwdWJsaWMgbGFzdDxUIGV4dGVuZHMgVj4oKTogVCB8IHVuZGVmaW5lZDtcblx0cHVibGljIGxhc3Q8VCBleHRlbmRzIFY+KGFtb3VudDogbnVtYmVyKTogVFtdO1xuXHRwdWJsaWMgbGFzdDxUIGV4dGVuZHMgVj4oYW1vdW50PzogbnVtYmVyKTogVCB8IFRbXSB8IHVuZGVmaW5lZCB7XG5cdFx0Y29uc3QgYXJyID0gdGhpcy5hcnJheSgpO1xuXHRcdGlmICh0eXBlb2YgYW1vdW50ID09PSAndW5kZWZpbmVkJykgcmV0dXJuIGFyclthcnIubGVuZ3RoIC0gMV0gYXMgVDtcblx0XHRpZiAoYW1vdW50IDwgMCkgcmV0dXJuIHRoaXMuZmlyc3QoYW1vdW50ICogLTEpO1xuXHRcdGlmICghYW1vdW50KSByZXR1cm4gW107XG5cdFx0cmV0dXJuIGFyci5zbGljZSgtYW1vdW50KSBhcyBUW107XG5cdH1cblxuXHQvKipcblx0ICogT2J0YWlucyB0aGUgbGFzdCBrZXkocykgaW4gdGhpcyBjb2xsZWN0aW9uLiBUaGlzIHJlbGllcyBvbiB7QGxpbmsgQ29sbGVjdGlvbiNrZXlBcnJheX0sIGFuZCB0aHVzIHRoZSBjYWNoaW5nXG5cdCAqIG1lY2hhbmlzbSBhcHBsaWVzIGhlcmUgYXMgd2VsbC5cblx0ICogQHBhcmFtIHtudW1iZXJ9IFthbW91bnRdIEFtb3VudCBvZiBrZXlzIHRvIG9idGFpbiBmcm9tIHRoZSBlbmRcblx0ICogQHJldHVybnMgeyp8QXJyYXk8Kj59IEEgc2luZ2xlIGtleSBpZiBubyBhbW91bnQgaXMgcHJvdmlkZWQgb3IgYW4gYXJyYXkgb2Yga2V5cywgc3RhcnRpbmcgZnJvbSB0aGUgc3RhcnQgaWZcblx0ICogYW1vdW50IGlzIG5lZ2F0aXZlXG5cdCAqL1xuXHRwdWJsaWMgbGFzdEtleSgpOiBLIHwgdW5kZWZpbmVkO1xuXHRwdWJsaWMgbGFzdEtleShhbW91bnQ6IG51bWJlcik6IEtbXTtcblx0cHVibGljIGxhc3RLZXkoYW1vdW50PzogbnVtYmVyKTogSyB8IEtbXSB8IHVuZGVmaW5lZCB7XG5cdFx0Y29uc3QgYXJyID0gdGhpcy5rZXlBcnJheSgpO1xuXHRcdGlmICh0eXBlb2YgYW1vdW50ID09PSAndW5kZWZpbmVkJykgcmV0dXJuIGFyclthcnIubGVuZ3RoIC0gMV07XG5cdFx0aWYgKGFtb3VudCA8IDApIHJldHVybiB0aGlzLmZpcnN0S2V5KGFtb3VudCAqIC0xKTtcblx0XHRpZiAoIWFtb3VudCkgcmV0dXJuIFtdO1xuXHRcdHJldHVybiBhcnIuc2xpY2UoLWFtb3VudCk7XG5cdH1cblxuXHQvKipcblx0ICogT2J0YWlucyB1bmlxdWUgcmFuZG9tIHZhbHVlKHMpIGZyb20gdGhpcyBjb2xsZWN0aW9uLiBUaGlzIHJlbGllcyBvbiB7QGxpbmsgQ29sbGVjdGlvbiNhcnJheX0sIGFuZCB0aHVzIHRoZSBjYWNoaW5nXG5cdCAqIG1lY2hhbmlzbSBhcHBsaWVzIGhlcmUgYXMgd2VsbC5cblx0ICogQHBhcmFtIHtudW1iZXJ9IFthbW91bnRdIEFtb3VudCBvZiB2YWx1ZXMgdG8gb2J0YWluIHJhbmRvbWx5XG5cdCAqIEByZXR1cm5zIHsqfEFycmF5PCo+fSBBIHNpbmdsZSB2YWx1ZSBpZiBubyBhbW91bnQgaXMgcHJvdmlkZWQgb3IgYW4gYXJyYXkgb2YgdmFsdWVzXG5cdCAqL1xuXHRwdWJsaWMgcmFuZG9tPFQgZXh0ZW5kcyBWPigpOiBUO1xuXHRwdWJsaWMgcmFuZG9tPFQgZXh0ZW5kcyBWPihhbW91bnQ6IG51bWJlcik6IFRbXTtcblx0cHVibGljIHJhbmRvbTxUIGV4dGVuZHMgVj4oYW1vdW50PzogbnVtYmVyKTogVCB8IFRbXSB7XG5cdFx0bGV0IGFyciA9IHRoaXMuYXJyYXkoKTtcblx0XHRpZiAodHlwZW9mIGFtb3VudCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiBhcnJbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCldIGFzIFQ7XG5cdFx0aWYgKCFhcnIubGVuZ3RoIHx8ICFhbW91bnQpIHJldHVybiBbXTtcblx0XHRhcnIgPSBhcnIuc2xpY2UoKTtcblx0XHRyZXR1cm4gQXJyYXkuZnJvbShcblx0XHRcdHsgbGVuZ3RoOiBNYXRoLm1pbihhbW91bnQsIGFyci5sZW5ndGgpIH0sXG5cdFx0XHQoKTogViA9PiBhcnIuc3BsaWNlKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpLCAxKVswXSxcblx0XHQpIGFzIFRbXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBPYnRhaW5zIHVuaXF1ZSByYW5kb20ga2V5KHMpIGZyb20gdGhpcyBjb2xsZWN0aW9uLiBUaGlzIHJlbGllcyBvbiB7QGxpbmsgQ29sbGVjdGlvbiNrZXlBcnJheX0sIGFuZCB0aHVzIHRoZSBjYWNoaW5nXG5cdCAqIG1lY2hhbmlzbSBhcHBsaWVzIGhlcmUgYXMgd2VsbC5cblx0ICogQHBhcmFtIHtudW1iZXJ9IFthbW91bnRdIEFtb3VudCBvZiBrZXlzIHRvIG9idGFpbiByYW5kb21seVxuXHQgKiBAcmV0dXJucyB7KnxBcnJheTwqPn0gQSBzaW5nbGUga2V5IGlmIG5vIGFtb3VudCBpcyBwcm92aWRlZCBvciBhbiBhcnJheVxuXHQgKi9cblx0cHVibGljIHJhbmRvbUtleSgpOiBLO1xuXHRwdWJsaWMgcmFuZG9tS2V5KGFtb3VudDogbnVtYmVyKTogS1tdO1xuXHRwdWJsaWMgcmFuZG9tS2V5KGFtb3VudD86IG51bWJlcik6IEsgfCBLW10ge1xuXHRcdGxldCBhcnIgPSB0aGlzLmtleUFycmF5KCk7XG5cdFx0aWYgKHR5cGVvZiBhbW91bnQgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcblx0XHRpZiAoIWFyci5sZW5ndGggfHwgIWFtb3VudCkgcmV0dXJuIFtdO1xuXHRcdGFyciA9IGFyci5zbGljZSgpO1xuXHRcdHJldHVybiBBcnJheS5mcm9tKFxuXHRcdFx0eyBsZW5ndGg6IE1hdGgubWluKGFtb3VudCwgYXJyLmxlbmd0aCkgfSxcblx0XHRcdCgpOiBLID0+IGFyci5zcGxpY2UoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCksIDEpWzBdLFxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogU2VhcmNoZXMgZm9yIGEgc2luZ2xlIGl0ZW0gd2hlcmUgdGhlIGdpdmVuIGZ1bmN0aW9uIHJldHVybnMgYSB0cnV0aHkgdmFsdWUuIFRoaXMgYmVoYXZlcyBsaWtlXG5cdCAqIFtBcnJheS5maW5kKCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2ZpbmQpLlxuXHQgKiA8d2Fybj5BbGwgY29sbGVjdGlvbnMgdXNlZCBpbiBEaXNjb3JkLmpzIGFyZSBtYXBwZWQgdXNpbmcgdGhlaXIgYGlkYCBwcm9wZXJ0eSwgYW5kIGlmIHlvdSB3YW50IHRvIGZpbmQgYnkgaWQgeW91XG5cdCAqIHNob3VsZCB1c2UgdGhlIGBnZXRgIG1ldGhvZC4gU2VlXG5cdCAqIFtNRE5dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL01hcC9nZXQpIGZvciBkZXRhaWxzLjwvd2Fybj5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIHRlc3Qgd2l0aCAoc2hvdWxkIHJldHVybiBib29sZWFuKVxuXHQgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBWYWx1ZSB0byB1c2UgYXMgYHRoaXNgIHdoZW4gZXhlY3V0aW5nIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm5zIHsqfVxuXHQgKiBAZXhhbXBsZSBjb2xsZWN0aW9uLmZpbmQodXNlciA9PiB1c2VyLnVzZXJuYW1lID09PSAnQm9iJyk7XG5cdCAqL1xuXHRwdWJsaWMgZmluZDxUIGV4dGVuZHMgVj4oZm46ICh2YWx1ZTogVCwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuKTogVCB8IHVuZGVmaW5lZDtcblx0cHVibGljIGZpbmQ8TCwgVCBleHRlbmRzIFY+KGZuOiAodGhpczogTCwgdmFsdWU6IFQsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4gYm9vbGVhbiwgdGhpc0FyZzogTCk6IFQgfCB1bmRlZmluZWQ7XG5cdHB1YmxpYyBmaW5kPFQgZXh0ZW5kcyBWPihmbjogKHZhbHVlOiBULCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IGJvb2xlYW4sIHRoaXNBcmc/OiB1bmtub3duKTogVCB8IHVuZGVmaW5lZCB7XG5cdFx0aWYgKHR5cGVvZiB0aGlzQXJnICE9PSAndW5kZWZpbmVkJykgZm4gPSBmbi5iaW5kKHRoaXNBcmcpO1xuXHRcdGZvciAoY29uc3QgW2tleSwgdmFsXSBvZiB0aGlzKSB7XG5cdFx0XHRpZiAoZm4odmFsIGFzIFQsIGtleSwgdGhpcykpIHJldHVybiB2YWwgYXMgVDtcblx0XHR9XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZWFyY2hlcyBmb3IgdGhlIGtleSBvZiBhIHNpbmdsZSBpdGVtIHdoZXJlIHRoZSBnaXZlbiBmdW5jdGlvbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlLiBUaGlzIGJlaGF2ZXMgbGlrZVxuXHQgKiBbQXJyYXkuZmluZEluZGV4KCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2ZpbmRJbmRleCksXG5cdCAqIGJ1dCByZXR1cm5zIHRoZSBrZXkgcmF0aGVyIHRoYW4gdGhlIHBvc2l0aW9uYWwgaW5kZXguXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byB0ZXN0IHdpdGggKHNob3VsZCByZXR1cm4gYm9vbGVhbilcblx0ICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVmFsdWUgdG8gdXNlIGFzIGB0aGlzYCB3aGVuIGV4ZWN1dGluZyBmdW5jdGlvblxuXHQgKiBAcmV0dXJucyB7Kn1cblx0ICogQGV4YW1wbGUgY29sbGVjdGlvbi5maW5kS2V5KHVzZXIgPT4gdXNlci51c2VybmFtZSA9PT0gJ0JvYicpO1xuXHQgKi9cblx0cHVibGljIGZpbmRLZXkoZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuKTogSyB8IHVuZGVmaW5lZDtcblx0cHVibGljIGZpbmRLZXk8VD4oZm46ICh0aGlzOiBULCB2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuLCB0aGlzQXJnOiBUKTogSyB8IHVuZGVmaW5lZDtcblx0cHVibGljIGZpbmRLZXkoZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuLCB0aGlzQXJnPzogdW5rbm93bik6IEsgfCB1bmRlZmluZWQge1xuXHRcdGlmICh0eXBlb2YgdGhpc0FyZyAhPT0gJ3VuZGVmaW5lZCcpIGZuID0gZm4uYmluZCh0aGlzQXJnKTtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgdGhpcykge1xuXHRcdFx0aWYgKGZuKHZhbCwga2V5LCB0aGlzKSkgcmV0dXJuIGtleTtcblx0XHR9XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZW1vdmVzIGl0ZW1zIHRoYXQgc2F0aXNmeSB0aGUgcHJvdmlkZWQgZmlsdGVyIGZ1bmN0aW9uLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB1c2VkIHRvIHRlc3QgKHNob3VsZCByZXR1cm4gYSBib29sZWFuKVxuXHQgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBWYWx1ZSB0byB1c2UgYXMgYHRoaXNgIHdoZW4gZXhlY3V0aW5nIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBudW1iZXIgb2YgcmVtb3ZlZCBlbnRyaWVzXG5cdCAqL1xuXHRwdWJsaWMgc3dlZXAoZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuKTogbnVtYmVyO1xuXHRwdWJsaWMgc3dlZXA8VD4oZm46ICh0aGlzOiBULCB2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuLCB0aGlzQXJnOiBUKTogbnVtYmVyO1xuXHRwdWJsaWMgc3dlZXAoZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuLCB0aGlzQXJnPzogdW5rbm93bik6IG51bWJlciB7XG5cdFx0aWYgKHR5cGVvZiB0aGlzQXJnICE9PSAndW5kZWZpbmVkJykgZm4gPSBmbi5iaW5kKHRoaXNBcmcpO1xuXHRcdGNvbnN0IHByZXZpb3VzU2l6ZSA9IHRoaXMuc2l6ZTtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgdGhpcykge1xuXHRcdFx0aWYgKGZuKHZhbCwga2V5LCB0aGlzKSkgdGhpcy5kZWxldGUoa2V5KTtcblx0XHR9XG5cdFx0cmV0dXJuIHByZXZpb3VzU2l6ZSAtIHRoaXMuc2l6ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJZGVudGljYWwgdG9cblx0ICogW0FycmF5LmZpbHRlcigpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9maWx0ZXIpLFxuXHQgKiBidXQgcmV0dXJucyBhIENvbGxlY3Rpb24gaW5zdGVhZCBvZiBhbiBBcnJheS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIHRlc3Qgd2l0aCAoc2hvdWxkIHJldHVybiBib29sZWFuKVxuXHQgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBWYWx1ZSB0byB1c2UgYXMgYHRoaXNgIHdoZW4gZXhlY3V0aW5nIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm5zIHtDb2xsZWN0aW9ufVxuXHQgKiBAZXhhbXBsZSBjb2xsZWN0aW9uLmZpbHRlcih1c2VyID0+IHVzZXIudXNlcm5hbWUgPT09ICdCb2InKTtcblx0ICovXG5cdHB1YmxpYyBmaWx0ZXIoZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuKTogdGhpcztcblx0cHVibGljIGZpbHRlcjxUPihmbjogKHRoaXM6IFQsIHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IGJvb2xlYW4sIHRoaXNBcmc6IFQpOiB0aGlzO1xuXHRwdWJsaWMgZmlsdGVyKGZuOiAodmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4gYm9vbGVhbiwgdGhpc0FyZz86IHVua25vd24pOiB0aGlzIHtcblx0XHRpZiAodHlwZW9mIHRoaXNBcmcgIT09ICd1bmRlZmluZWQnKSBmbiA9IGZuLmJpbmQodGhpc0FyZyk7XG5cdFx0Y29uc3QgcmVzdWx0cyA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yW1N5bWJvbC5zcGVjaWVzXTxLLCBWPigpIGFzIHRoaXM7XG5cdFx0Zm9yIChjb25zdCBba2V5LCB2YWxdIG9mIHRoaXMpIHtcblx0XHRcdGlmIChmbih2YWwsIGtleSwgdGhpcykpIHJlc3VsdHMuc2V0KGtleSwgdmFsKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdHM7XG5cdH1cblxuXHQvKipcblx0ICogUGFydGl0aW9ucyB0aGUgY29sbGVjdGlvbiBpbnRvIHR3byBjb2xsZWN0aW9ucyB3aGVyZSB0aGUgZmlyc3QgY29sbGVjdGlvblxuXHQgKiBjb250YWlucyB0aGUgaXRlbXMgdGhhdCBwYXNzZWQgYW5kIHRoZSBzZWNvbmQgY29udGFpbnMgdGhlIGl0ZW1zIHRoYXQgZmFpbGVkLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB1c2VkIHRvIHRlc3QgKHNob3VsZCByZXR1cm4gYSBib29sZWFuKVxuXHQgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBWYWx1ZSB0byB1c2UgYXMgYHRoaXNgIHdoZW4gZXhlY3V0aW5nIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm5zIHtDb2xsZWN0aW9uW119XG5cdCAqIEBleGFtcGxlIGNvbnN0IFtiaWcsIHNtYWxsXSA9IGNvbGxlY3Rpb24ucGFydGl0aW9uKGd1aWxkID0+IGd1aWxkLm1lbWJlckNvdW50ID4gMjUwKTtcblx0ICovXG5cdHB1YmxpYyBwYXJ0aXRpb24oZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuKTogW3RoaXMsIHRoaXNdO1xuXHRwdWJsaWMgcGFydGl0aW9uPFQ+KGZuOiAodGhpczogVCwgdmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4gYm9vbGVhbiwgdGhpc0FyZzogVCk6IFt0aGlzLCB0aGlzXTtcblx0cHVibGljIHBhcnRpdGlvbihmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IGJvb2xlYW4sIHRoaXNBcmc/OiB1bmtub3duKTogW3RoaXMsIHRoaXNdIHtcblx0XHRpZiAodHlwZW9mIHRoaXNBcmcgIT09ICd1bmRlZmluZWQnKSBmbiA9IGZuLmJpbmQodGhpc0FyZyk7XG5cdFx0Y29uc3QgcmVzdWx0czogW3RoaXMsIHRoaXNdID0gW1xuXHRcdFx0bmV3IHRoaXMuY29uc3RydWN0b3JbU3ltYm9sLnNwZWNpZXNdKCkgYXMgdGhpcyxcblx0XHRcdG5ldyB0aGlzLmNvbnN0cnVjdG9yW1N5bWJvbC5zcGVjaWVzXSgpIGFzIHRoaXMsXG5cdFx0XTtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgdGhpcykge1xuXHRcdFx0aWYgKGZuKHZhbCwga2V5LCB0aGlzKSkge1xuXHRcdFx0XHRyZXN1bHRzWzBdLnNldChrZXksIHZhbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHRzWzFdLnNldChrZXksIHZhbCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHRzO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1hcHMgZWFjaCBpdGVtIGludG8gYSBDb2xsZWN0aW9uLCB0aGVuIGpvaW5zIHRoZSByZXN1bHRzIGludG8gYSBzaW5nbGUgQ29sbGVjdGlvbi4gSWRlbnRpY2FsIGluIGJlaGF2aW9yIHRvXG5cdCAqIFtBcnJheS5mbGF0TWFwKCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2ZsYXRNYXApLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB0aGF0IHByb2R1Y2VzIGEgbmV3IENvbGxlY3Rpb25cblx0ICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVmFsdWUgdG8gdXNlIGFzIGB0aGlzYCB3aGVuIGV4ZWN1dGluZyBmdW5jdGlvblxuXHQgKiBAcmV0dXJucyB7Q29sbGVjdGlvbn1cblx0ICogQGV4YW1wbGUgY29sbGVjdGlvbi5mbGF0TWFwKGd1aWxkID0+IGd1aWxkLm1lbWJlcnMuY2FjaGUpO1xuXHQgKi9cblx0cHVibGljIGZsYXRNYXA8VD4oZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBDb2xsZWN0aW9uPEssIFQ+KTogQ29sbGVjdGlvbjxLLCBUPjtcblx0cHVibGljIGZsYXRNYXA8VCwgVGhpcz4oXG5cdFx0Zm46ICh0aGlzOiBUaGlzLCB2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBDb2xsZWN0aW9uPEssIFQ+LFxuXHRcdHRoaXNBcmc6IFRoaXMsXG5cdCk6IENvbGxlY3Rpb248SywgVD47XG5cdHB1YmxpYyBmbGF0TWFwPFQ+KGZuOiAodmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4gQ29sbGVjdGlvbjxLLCBUPiwgdGhpc0FyZz86IHVua25vd24pOiBDb2xsZWN0aW9uPEssIFQ+IHtcblx0XHRjb25zdCBjb2xsZWN0aW9ucyA9IHRoaXMubWFwKGZuLCB0aGlzQXJnKTtcblx0XHRyZXR1cm4gKG5ldyB0aGlzLmNvbnN0cnVjdG9yW1N5bWJvbC5zcGVjaWVzXSgpIGFzIENvbGxlY3Rpb248SywgVD4pLmNvbmNhdCguLi5jb2xsZWN0aW9ucyk7XG5cdH1cblxuXHQvKipcblx0ICogTWFwcyBlYWNoIGl0ZW0gdG8gYW5vdGhlciB2YWx1ZSBpbnRvIGFuIGFycmF5LiBJZGVudGljYWwgaW4gYmVoYXZpb3IgdG9cblx0ICogW0FycmF5Lm1hcCgpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9tYXApLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB0aGF0IHByb2R1Y2VzIGFuIGVsZW1lbnQgb2YgdGhlIG5ldyBhcnJheSwgdGFraW5nIHRocmVlIGFyZ3VtZW50c1xuXHQgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBWYWx1ZSB0byB1c2UgYXMgYHRoaXNgIHdoZW4gZXhlY3V0aW5nIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm5zIHtBcnJheX1cblx0ICogQGV4YW1wbGUgY29sbGVjdGlvbi5tYXAodXNlciA9PiB1c2VyLnRhZyk7XG5cdCAqL1xuXHRwdWJsaWMgbWFwPFQ+KGZuOiAodmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4gVCk6IFRbXTtcblx0cHVibGljIG1hcDxUaGlzLCBUPihmbjogKHRoaXM6IFRoaXMsIHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IFQsIHRoaXNBcmc6IFRoaXMpOiBUW107XG5cdHB1YmxpYyBtYXA8VD4oZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBULCB0aGlzQXJnPzogdW5rbm93bik6IFRbXSB7XG5cdFx0aWYgKHR5cGVvZiB0aGlzQXJnICE9PSAndW5kZWZpbmVkJykgZm4gPSBmbi5iaW5kKHRoaXNBcmcpO1xuXHRcdGNvbnN0IGl0ZXIgPSB0aGlzLmVudHJpZXMoKTtcblx0XHRyZXR1cm4gQXJyYXkuZnJvbShcblx0XHRcdHsgbGVuZ3RoOiB0aGlzLnNpemUgfSxcblx0XHRcdCgpOiBUID0+IHtcblx0XHRcdFx0Y29uc3QgW2tleSwgdmFsdWVdID0gaXRlci5uZXh0KCkudmFsdWU7XG5cdFx0XHRcdHJldHVybiBmbih2YWx1ZSwga2V5LCB0aGlzKTtcblx0XHRcdH0sXG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNYXBzIGVhY2ggaXRlbSB0byBhbm90aGVyIHZhbHVlIGludG8gYSBjb2xsZWN0aW9uLiBJZGVudGljYWwgaW4gYmVoYXZpb3IgdG9cblx0ICogW0FycmF5Lm1hcCgpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9tYXApLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB0aGF0IHByb2R1Y2VzIGFuIGVsZW1lbnQgb2YgdGhlIG5ldyBjb2xsZWN0aW9uLCB0YWtpbmcgdGhyZWUgYXJndW1lbnRzXG5cdCAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFZhbHVlIHRvIHVzZSBhcyBgdGhpc2Agd2hlbiBleGVjdXRpbmcgZnVuY3Rpb25cblx0ICogQHJldHVybnMge0NvbGxlY3Rpb259XG5cdCAqIEBleGFtcGxlIGNvbGxlY3Rpb24ubWFwVmFsdWVzKHVzZXIgPT4gdXNlci50YWcpO1xuXHQgKi9cblx0cHVibGljIG1hcFZhbHVlczxUPihmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IFQpOiBDb2xsZWN0aW9uPEssIFQ+O1xuXHRwdWJsaWMgbWFwVmFsdWVzPFRoaXMsIFQ+KGZuOiAodGhpczogVGhpcywgdmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4gVCwgdGhpc0FyZzogVGhpcyk6IENvbGxlY3Rpb248SywgVD47XG5cdHB1YmxpYyBtYXBWYWx1ZXM8VD4oZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBULCB0aGlzQXJnPzogdW5rbm93bik6IENvbGxlY3Rpb248SywgVD4ge1xuXHRcdGlmICh0eXBlb2YgdGhpc0FyZyAhPT0gJ3VuZGVmaW5lZCcpIGZuID0gZm4uYmluZCh0aGlzQXJnKTtcblx0XHRjb25zdCBjb2xsID0gbmV3IHRoaXMuY29uc3RydWN0b3JbU3ltYm9sLnNwZWNpZXNdKCkgYXMgQ29sbGVjdGlvbjxLLCBUPjtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgdGhpcykgY29sbC5zZXQoa2V5LCBmbih2YWwsIGtleSwgdGhpcykpO1xuXHRcdHJldHVybiBjb2xsO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGVyZSBleGlzdHMgYW4gaXRlbSB0aGF0IHBhc3NlcyBhIHRlc3QuIElkZW50aWNhbCBpbiBiZWhhdmlvciB0b1xuXHQgKiBbQXJyYXkuc29tZSgpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9zb21lKS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRnVuY3Rpb24gdXNlZCB0byB0ZXN0IChzaG91bGQgcmV0dXJuIGEgYm9vbGVhbilcblx0ICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVmFsdWUgdG8gdXNlIGFzIGB0aGlzYCB3aGVuIGV4ZWN1dGluZyBmdW5jdGlvblxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0ICogQGV4YW1wbGUgY29sbGVjdGlvbi5zb21lKHVzZXIgPT4gdXNlci5kaXNjcmltaW5hdG9yID09PSAnMDAwMCcpO1xuXHQgKi9cblx0cHVibGljIHNvbWUoZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuKTogYm9vbGVhbjtcblx0cHVibGljIHNvbWU8VD4oZm46ICh0aGlzOiBULCB2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuLCB0aGlzQXJnOiBUKTogYm9vbGVhbjtcblx0cHVibGljIHNvbWUoZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuLCB0aGlzQXJnPzogdW5rbm93bik6IGJvb2xlYW4ge1xuXHRcdGlmICh0eXBlb2YgdGhpc0FyZyAhPT0gJ3VuZGVmaW5lZCcpIGZuID0gZm4uYmluZCh0aGlzQXJnKTtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgdGhpcykge1xuXHRcdFx0aWYgKGZuKHZhbCwga2V5LCB0aGlzKSkgcmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgYWxsIGl0ZW1zIHBhc3NlcyBhIHRlc3QuIElkZW50aWNhbCBpbiBiZWhhdmlvciB0b1xuXHQgKiBbQXJyYXkuZXZlcnkoKV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZXZlcnkpLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB1c2VkIHRvIHRlc3QgKHNob3VsZCByZXR1cm4gYSBib29sZWFuKVxuXHQgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBWYWx1ZSB0byB1c2UgYXMgYHRoaXNgIHdoZW4gZXhlY3V0aW5nIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHQgKiBAZXhhbXBsZSBjb2xsZWN0aW9uLmV2ZXJ5KHVzZXIgPT4gIXVzZXIuYm90KTtcblx0ICovXG5cdHB1YmxpYyBldmVyeShmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IGJvb2xlYW4pOiBib29sZWFuO1xuXHRwdWJsaWMgZXZlcnk8VD4oZm46ICh0aGlzOiBULCB2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuLCB0aGlzQXJnOiBUKTogYm9vbGVhbjtcblx0cHVibGljIGV2ZXJ5KGZuOiAodmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4gYm9vbGVhbiwgdGhpc0FyZz86IHVua25vd24pOiBib29sZWFuIHtcblx0XHRpZiAodHlwZW9mIHRoaXNBcmcgIT09ICd1bmRlZmluZWQnKSBmbiA9IGZuLmJpbmQodGhpc0FyZyk7XG5cdFx0Zm9yIChjb25zdCBba2V5LCB2YWxdIG9mIHRoaXMpIHtcblx0XHRcdGlmICghZm4odmFsLCBrZXksIHRoaXMpKSByZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGxpZXMgYSBmdW5jdGlvbiB0byBwcm9kdWNlIGEgc2luZ2xlIHZhbHVlLiBJZGVudGljYWwgaW4gYmVoYXZpb3IgdG9cblx0ICogW0FycmF5LnJlZHVjZSgpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9yZWR1Y2UpLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB1c2VkIHRvIHJlZHVjZSwgdGFraW5nIGZvdXIgYXJndW1lbnRzOyBgYWNjdW11bGF0b3JgLCBgY3VycmVudFZhbHVlYCwgYGN1cnJlbnRLZXlgLFxuXHQgKiBhbmQgYGNvbGxlY3Rpb25gXG5cdCAqIEBwYXJhbSB7Kn0gW2luaXRpYWxWYWx1ZV0gU3RhcnRpbmcgdmFsdWUgZm9yIHRoZSBhY2N1bXVsYXRvclxuXHQgKiBAcmV0dXJucyB7Kn1cblx0ICogQGV4YW1wbGUgY29sbGVjdGlvbi5yZWR1Y2UoKGFjYywgZ3VpbGQpID0+IGFjYyArIGd1aWxkLm1lbWJlckNvdW50LCAwKTtcblx0ICovXG5cdHB1YmxpYyByZWR1Y2U8VD4oZm46IChhY2N1bXVsYXRvcjogVCwgdmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4gVCwgaW5pdGlhbFZhbHVlPzogVCk6IFQge1xuXHRcdGxldCBhY2N1bXVsYXRvciE6IFQ7XG5cblx0XHRpZiAodHlwZW9mIGluaXRpYWxWYWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGFjY3VtdWxhdG9yID0gaW5pdGlhbFZhbHVlO1xuXHRcdFx0Zm9yIChjb25zdCBba2V5LCB2YWxdIG9mIHRoaXMpIGFjY3VtdWxhdG9yID0gZm4oYWNjdW11bGF0b3IsIHZhbCwga2V5LCB0aGlzKTtcblx0XHRcdHJldHVybiBhY2N1bXVsYXRvcjtcblx0XHR9XG5cdFx0bGV0IGZpcnN0ID0gdHJ1ZTtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgdGhpcykge1xuXHRcdFx0aWYgKGZpcnN0KSB7XG5cdFx0XHRcdGFjY3VtdWxhdG9yID0gKHZhbCBhcyB1bmtub3duKSBhcyBUO1xuXHRcdFx0XHRmaXJzdCA9IGZhbHNlO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdGFjY3VtdWxhdG9yID0gZm4oYWNjdW11bGF0b3IsIHZhbCwga2V5LCB0aGlzKTtcblx0XHR9XG5cblx0XHQvLyBObyBpdGVtcyBpdGVyYXRlZC5cblx0XHRpZiAoZmlyc3QpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlZHVjZSBvZiBlbXB0eSBjb2xsZWN0aW9uIHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xuXHRcdH1cblxuXHRcdHJldHVybiBhY2N1bXVsYXRvcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBJZGVudGljYWwgdG9cblx0ICogW01hcC5mb3JFYWNoKCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL01hcC9mb3JFYWNoKSxcblx0ICogYnV0IHJldHVybnMgdGhlIGNvbGxlY3Rpb24gaW5zdGVhZCBvZiB1bmRlZmluZWQuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEZ1bmN0aW9uIHRvIGV4ZWN1dGUgZm9yIGVhY2ggZWxlbWVudFxuXHQgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBWYWx1ZSB0byB1c2UgYXMgYHRoaXNgIHdoZW4gZXhlY3V0aW5nIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm5zIHtDb2xsZWN0aW9ufVxuXHQgKiBAZXhhbXBsZVxuXHQgKiBjb2xsZWN0aW9uXG5cdCAqICAuZWFjaCh1c2VyID0+IGNvbnNvbGUubG9nKHVzZXIudXNlcm5hbWUpKVxuXHQgKiAgLmZpbHRlcih1c2VyID0+IHVzZXIuYm90KVxuXHQgKiAgLmVhY2godXNlciA9PiBjb25zb2xlLmxvZyh1c2VyLnVzZXJuYW1lKSk7XG5cdCAqL1xuXHRwdWJsaWMgZWFjaChmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IHZvaWQpOiB0aGlzO1xuXHRwdWJsaWMgZWFjaDxUPihmbjogKHRoaXM6IFQsIHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IHZvaWQsIHRoaXNBcmc6IFQpOiB0aGlzO1xuXHRwdWJsaWMgZWFjaChmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IHZvaWQsIHRoaXNBcmc/OiB1bmtub3duKTogdGhpcyB7XG5cdFx0dGhpcy5mb3JFYWNoKGZuIGFzICh2YWx1ZTogViwga2V5OiBLLCBtYXA6IE1hcDxLLCBWPikgPT4gdm9pZCwgdGhpc0FyZyk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogUnVucyBhIGZ1bmN0aW9uIG9uIHRoZSBjb2xsZWN0aW9uIGFuZCByZXR1cm5zIHRoZSBjb2xsZWN0aW9uLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB0byBleGVjdXRlXG5cdCAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFZhbHVlIHRvIHVzZSBhcyBgdGhpc2Agd2hlbiBleGVjdXRpbmcgZnVuY3Rpb25cblx0ICogQHJldHVybnMge0NvbGxlY3Rpb259XG5cdCAqIEBleGFtcGxlXG5cdCAqIGNvbGxlY3Rpb25cblx0ICogIC50YXAoY29sbCA9PiBjb25zb2xlLmxvZyhjb2xsLnNpemUpKVxuXHQgKiAgLmZpbHRlcih1c2VyID0+IHVzZXIuYm90KVxuXHQgKiAgLnRhcChjb2xsID0+IGNvbnNvbGUubG9nKGNvbGwuc2l6ZSkpXG5cdCAqL1xuXHRwdWJsaWMgdGFwKGZuOiAoY29sbGVjdGlvbjogdGhpcykgPT4gdm9pZCk6IHRoaXM7XG5cdHB1YmxpYyB0YXA8VD4oZm46ICh0aGlzOiBULCBjb2xsZWN0aW9uOiB0aGlzKSA9PiB2b2lkLCB0aGlzQXJnOiBUKTogdGhpcztcblx0cHVibGljIHRhcChmbjogKGNvbGxlY3Rpb246IHRoaXMpID0+IHZvaWQsIHRoaXNBcmc/OiB1bmtub3duKTogdGhpcyB7XG5cdFx0aWYgKHR5cGVvZiB0aGlzQXJnICE9PSAndW5kZWZpbmVkJykgZm4gPSBmbi5iaW5kKHRoaXNBcmcpO1xuXHRcdGZuKHRoaXMpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYW4gaWRlbnRpY2FsIHNoYWxsb3cgY29weSBvZiB0aGlzIGNvbGxlY3Rpb24uXG5cdCAqIEByZXR1cm5zIHtDb2xsZWN0aW9ufVxuXHQgKiBAZXhhbXBsZSBjb25zdCBuZXdDb2xsID0gc29tZUNvbGwuY2xvbmUoKTtcblx0ICovXG5cdHB1YmxpYyBjbG9uZSgpOiB0aGlzIHtcblx0XHRyZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3JbU3ltYm9sLnNwZWNpZXNdKHRoaXMpIGFzIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogQ29tYmluZXMgdGhpcyBjb2xsZWN0aW9uIHdpdGggb3RoZXJzIGludG8gYSBuZXcgY29sbGVjdGlvbi4gTm9uZSBvZiB0aGUgc291cmNlIGNvbGxlY3Rpb25zIGFyZSBtb2RpZmllZC5cblx0ICogQHBhcmFtIHsuLi5Db2xsZWN0aW9ufSBjb2xsZWN0aW9ucyBDb2xsZWN0aW9ucyB0byBtZXJnZVxuXHQgKiBAcmV0dXJucyB7Q29sbGVjdGlvbn1cblx0ICogQGV4YW1wbGUgY29uc3QgbmV3Q29sbCA9IHNvbWVDb2xsLmNvbmNhdChzb21lT3RoZXJDb2xsLCBhbm90aGVyQ29sbCwgb2hCb3lBQ29sbCk7XG5cdCAqL1xuXHRwdWJsaWMgY29uY2F0KC4uLmNvbGxlY3Rpb25zOiBDb2xsZWN0aW9uPEssIFY+W10pOiB0aGlzIHtcblx0XHRjb25zdCBuZXdDb2xsID0gdGhpcy5jbG9uZSgpO1xuXHRcdGZvciAoY29uc3QgY29sbCBvZiBjb2xsZWN0aW9ucykge1xuXHRcdFx0Zm9yIChjb25zdCBba2V5LCB2YWxdIG9mIGNvbGwpIG5ld0NvbGwuc2V0KGtleSwgdmFsKTtcblx0XHR9XG5cdFx0cmV0dXJuIG5ld0NvbGw7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoaXMgY29sbGVjdGlvbiBzaGFyZXMgaWRlbnRpY2FsIGl0ZW1zIHdpdGggYW5vdGhlci5cblx0ICogVGhpcyBpcyBkaWZmZXJlbnQgdG8gY2hlY2tpbmcgZm9yIGVxdWFsaXR5IHVzaW5nIGVxdWFsLXNpZ25zLCBiZWNhdXNlXG5cdCAqIHRoZSBjb2xsZWN0aW9ucyBtYXkgYmUgZGlmZmVyZW50IG9iamVjdHMsIGJ1dCBjb250YWluIHRoZSBzYW1lIGRhdGEuXG5cdCAqIEBwYXJhbSB7Q29sbGVjdGlvbn0gY29sbGVjdGlvbiBDb2xsZWN0aW9uIHRvIGNvbXBhcmUgd2l0aFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciB0aGUgY29sbGVjdGlvbnMgaGF2ZSBpZGVudGljYWwgY29udGVudHNcblx0ICovXG5cdHB1YmxpYyBlcXVhbHMoY29sbGVjdGlvbjogQ29sbGVjdGlvbjxLLCBWPik6IGJvb2xlYW4ge1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5uZWNlc3NhcnktY29uZGl0aW9uXG5cdFx0aWYgKCFjb2xsZWN0aW9uKSByZXR1cm4gZmFsc2U7IC8vIHJ1bnRpbWUgY2hlY2tcblx0XHRpZiAodGhpcyA9PT0gY29sbGVjdGlvbikgcmV0dXJuIHRydWU7XG5cdFx0aWYgKHRoaXMuc2l6ZSAhPT0gY29sbGVjdGlvbi5zaXplKSByZXR1cm4gZmFsc2U7XG5cdFx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgdGhpcykge1xuXHRcdFx0aWYgKCFjb2xsZWN0aW9uLmhhcyhrZXkpIHx8IHZhbHVlICE9PSBjb2xsZWN0aW9uLmdldChrZXkpKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHNvcnQgbWV0aG9kIHNvcnRzIHRoZSBpdGVtcyBvZiBhIGNvbGxlY3Rpb24gaW4gcGxhY2UgYW5kIHJldHVybnMgaXQuXG5cdCAqIFRoZSBzb3J0IGlzIG5vdCBuZWNlc3NhcmlseSBzdGFibGUgaW4gTm9kZSAxMCBvciBvbGRlci5cblx0ICogVGhlIGRlZmF1bHQgc29ydCBvcmRlciBpcyBhY2NvcmRpbmcgdG8gc3RyaW5nIFVuaWNvZGUgY29kZSBwb2ludHMuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJlRnVuY3Rpb25dIFNwZWNpZmllcyBhIGZ1bmN0aW9uIHRoYXQgZGVmaW5lcyB0aGUgc29ydCBvcmRlci5cblx0ICogSWYgb21pdHRlZCwgdGhlIGNvbGxlY3Rpb24gaXMgc29ydGVkIGFjY29yZGluZyB0byBlYWNoIGNoYXJhY3RlcidzIFVuaWNvZGUgY29kZSBwb2ludCB2YWx1ZSxcblx0ICogYWNjb3JkaW5nIHRvIHRoZSBzdHJpbmcgY29udmVyc2lvbiBvZiBlYWNoIGVsZW1lbnQuXG5cdCAqIEByZXR1cm5zIHtDb2xsZWN0aW9ufVxuXHQgKiBAZXhhbXBsZSBjb2xsZWN0aW9uLnNvcnQoKHVzZXJBLCB1c2VyQikgPT4gdXNlckEuY3JlYXRlZFRpbWVzdGFtcCAtIHVzZXJCLmNyZWF0ZWRUaW1lc3RhbXApO1xuXHQgKi9cblx0cHVibGljIHNvcnQoXG5cdFx0Y29tcGFyZUZ1bmN0aW9uOiAoZmlyc3RWYWx1ZTogViwgc2Vjb25kVmFsdWU6IFYsIGZpcnN0S2V5OiBLLCBzZWNvbmRLZXk6IEspID0+IG51bWJlciA9ICh4LCB5KTogbnVtYmVyID0+XG5cdFx0XHROdW1iZXIoeCA+IHkpIHx8IE51bWJlcih4ID09PSB5KSAtIDEsXG5cdCk6IHRoaXMge1xuXHRcdGNvbnN0IGVudHJpZXMgPSBbLi4udGhpcy5lbnRyaWVzKCldO1xuXHRcdGVudHJpZXMuc29ydCgoYSwgYik6IG51bWJlciA9PiBjb21wYXJlRnVuY3Rpb24oYVsxXSwgYlsxXSwgYVswXSwgYlswXSkpO1xuXG5cdFx0Ly8gUGVyZm9ybSBjbGVhbi11cFxuXHRcdHN1cGVyLmNsZWFyKCk7XG5cdFx0dGhpcy5fYXJyYXkgPSBudWxsO1xuXHRcdHRoaXMuX2tleUFycmF5ID0gbnVsbDtcblxuXHRcdC8vIFNldCB0aGUgbmV3IGVudHJpZXNcblx0XHRmb3IgKGNvbnN0IFtrLCB2XSBvZiBlbnRyaWVzKSB7XG5cdFx0XHRzdXBlci5zZXQoaywgdik7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBpbnRlcnNlY3QgbWV0aG9kIHJldHVybnMgYSBuZXcgc3RydWN0dXJlIGNvbnRhaW5pbmcgaXRlbXMgd2hlcmUgdGhlIGtleXMgYXJlIHByZXNlbnQgaW4gYm90aCBvcmlnaW5hbCBzdHJ1Y3R1cmVzLlxuXHQgKiBAcGFyYW0ge0NvbGxlY3Rpb259IG90aGVyIFRoZSBvdGhlciBDb2xsZWN0aW9uIHRvIGZpbHRlciBhZ2FpbnN0XG5cdCAqIEByZXR1cm5zIHtDb2xsZWN0aW9ufVxuXHQgKi9cblx0cHVibGljIGludGVyc2VjdChvdGhlcjogQ29sbGVjdGlvbjxLLCBWPik6IENvbGxlY3Rpb248SywgVj4ge1xuXHRcdHJldHVybiBvdGhlci5maWx0ZXIoKF8sIGspID0+IHRoaXMuaGFzKGspKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgZGlmZmVyZW5jZSBtZXRob2QgcmV0dXJucyBhIG5ldyBzdHJ1Y3R1cmUgY29udGFpbmluZyBpdGVtcyB3aGVyZSB0aGUga2V5IGlzIHByZXNlbnQgaW4gb25lIG9mIHRoZSBvcmlnaW5hbCBzdHJ1Y3R1cmVzIGJ1dCBub3QgdGhlIG90aGVyLlxuXHQgKiBAcGFyYW0ge0NvbGxlY3Rpb259IG90aGVyIFRoZSBvdGhlciBDb2xsZWN0aW9uIHRvIGZpbHRlciBhZ2FpbnN0XG5cdCAqIEByZXR1cm5zIHtDb2xsZWN0aW9ufVxuXHQgKi9cblx0cHVibGljIGRpZmZlcmVuY2Uob3RoZXI6IENvbGxlY3Rpb248SywgVj4pOiBDb2xsZWN0aW9uPEssIFY+IHtcblx0XHRyZXR1cm4gb3RoZXIuZmlsdGVyKChfLCBrKSA9PiAhdGhpcy5oYXMoaykpLmNvbmNhdCh0aGlzLmZpbHRlcigoXywgaykgPT4gIW90aGVyLmhhcyhrKSkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBzb3J0ZWQgbWV0aG9kIHNvcnRzIHRoZSBpdGVtcyBvZiBhIGNvbGxlY3Rpb24gYW5kIHJldHVybnMgaXQuXG5cdCAqIFRoZSBzb3J0IGlzIG5vdCBuZWNlc3NhcmlseSBzdGFibGUgaW4gTm9kZSAxMCBvciBvbGRlci5cblx0ICogVGhlIGRlZmF1bHQgc29ydCBvcmRlciBpcyBhY2NvcmRpbmcgdG8gc3RyaW5nIFVuaWNvZGUgY29kZSBwb2ludHMuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJlRnVuY3Rpb25dIFNwZWNpZmllcyBhIGZ1bmN0aW9uIHRoYXQgZGVmaW5lcyB0aGUgc29ydCBvcmRlci5cblx0ICogSWYgb21pdHRlZCwgdGhlIGNvbGxlY3Rpb24gaXMgc29ydGVkIGFjY29yZGluZyB0byBlYWNoIGNoYXJhY3RlcidzIFVuaWNvZGUgY29kZSBwb2ludCB2YWx1ZSxcblx0ICogYWNjb3JkaW5nIHRvIHRoZSBzdHJpbmcgY29udmVyc2lvbiBvZiBlYWNoIGVsZW1lbnQuXG5cdCAqIEByZXR1cm5zIHtDb2xsZWN0aW9ufVxuXHQgKiBAZXhhbXBsZSBjb2xsZWN0aW9uLnNvcnRlZCgodXNlckEsIHVzZXJCKSA9PiB1c2VyQS5jcmVhdGVkVGltZXN0YW1wIC0gdXNlckIuY3JlYXRlZFRpbWVzdGFtcCk7XG5cdCAqL1xuXHRwdWJsaWMgc29ydGVkKFxuXHRcdGNvbXBhcmVGdW5jdGlvbjogKGZpcnN0VmFsdWU6IFYsIHNlY29uZFZhbHVlOiBWLCBmaXJzdEtleTogSywgc2Vjb25kS2V5OiBLKSA9PiBudW1iZXIgPSAoeCwgeSk6IG51bWJlciA9PlxuXHRcdFx0TnVtYmVyKHggPiB5KSB8fCBOdW1iZXIoeCA9PT0geSkgLSAxLFxuXHQpOiB0aGlzIHtcblx0XHRyZXR1cm4gKG5ldyB0aGlzLmNvbnN0cnVjdG9yW1N5bWJvbC5zcGVjaWVzXShbLi4udGhpcy5lbnRyaWVzKCldKSBhcyB0aGlzKS5zb3J0KChhdiwgYnYsIGFrLCBiaykgPT5cblx0XHRcdGNvbXBhcmVGdW5jdGlvbihhdiwgYnYsIGFrLCBiayksXG5cdFx0KTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb247XG5leHBvcnQgeyBDb2xsZWN0aW9uIH07XG5leHBvcnQgZGVmYXVsdCBDb2xsZWN0aW9uO1xuIl19