class Queue {
	count: number;
	lowestCount: number;
	items: any;
	maxSize: number;
	constructor(maxSize = 30) {
		this.count = 0;
		this.lowestCount = 0;
		this.items = {};
		this.maxSize = maxSize;
	}
	
	enqueue(element) {
		if (this.size() >= this.maxSize) {
			this.dequeue();
		}
		
		this.items[this.count] = element;
		this.count++;
	}
	
	isEmpty() {
		return this.count - this.lowestCount === 0;
	}
	
	size() {
		return this.count - this.lowestCount;
	}
	
	dequeue() {
		if (this.isEmpty()) {
			return undefined;
		}
		const result = this.items[this.lowestCount];
		delete this.items[this.lowestCount];
		this.lowestCount++;
		return result;
	}
	
	peek() {
		if (this.isEmpty()) {
			return undefined;
		}
		return this.items[this.lowestCount];
	}
	
	clear() {
		this.count = 0;
		this.lowestCount = 0;
		this.items = {};
	}
	
	toString() {
		if (this.isEmpty()) {
			return '';
		}
		let objString = `${this.items[this.lowestCount]}`;
		for (let i = this.lowestCount + 1; i < this.count; i++) {
			objString = `${objString},${this.items[i]}`;
		}
		return objString;
	}
	
	// 新增方法：获取所有有效数据的数组
	toArray() {
		const arr = [];
		for (let i = this.lowestCount; i < this.count; i++) {
			arr.push(this.items[i]);
		}
		return arr;
	}
}

let secondqueue = new Queue();

export { Queue, secondqueue };
