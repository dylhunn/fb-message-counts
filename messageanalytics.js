window.onload = function() {
	//let ifrm = document.getElementById('iframeid');
	//console.log(ifrm);
	//let doc = ifrm.contentWindow.document;
	//console.log(doc);
	let data = loadMessageMetadata(document);
	//console.log(data);
	document.body.innerHTML = "";
	document.body.appendChild(makeThreadList(data));
};

function makeThreadList(threads) {
    var list = document.createElement('ul');
    list.className += "list-group";
    for(var i = 0; i < threads.length; i++) {
        var item = document.createElement('li');
        item.className += "list-item";
        let senderCounts = calculateSenderCounts(threads[i]);
        item.appendChild(document.createTextNode(threads[i].participants));
        Object.keys(senderCounts).forEach(function(key) {
        	item.appendChild(document.createElement("br"));
   			item.appendChild(document.createTextNode(key + ": " + senderCounts[key]));
		});
        list.appendChild(item);
		list.appendChild(document.createElement("br"));
    }
    return list;
}

// Returns an array of objects representing threads, each of which has a
// participants string, a count, and a "messages" array. Each array entry has a sender and date. 
function loadMessageMetadata(thedoc) {
	let processedThreads = new Array();
	let rawThreads = thedoc.getElementsByClassName("thread");
	// For every thread in the document
	for (let i = 0; i < rawThreads.length; i++) {
		// We will process the thread into an object with participants and a message list
		let processedThread = new Object();
		processedThread.participants = rawThreads[i].childNodes[0].textContent;
		let processedMessages = new Array();
		let rawMessageHeaders = rawThreads[i].getElementsByClassName("message_header");
		// For every message in the thread
		for (let j = 0; j < rawMessageHeaders.length; j++) {
			// Each message has a sender and a date
			let processedMessage = new Object();
			processedMessage.from = rawMessageHeaders[j].firstChild.textContent;
			processedMessage.dateString = rawMessageHeaders[j].lastChild.textContent;
			processedMessages.push(processedMessage);
		}
		processedThread.messages = processedMessages;
		processedThread.count = rawMessageHeaders.length;
		processedThreads.push(processedThread);
	}
	processedThreads.sort(function(a, b) {
		if (a.count > b.count) return -1;
		else return 1;
	});
	return processedThreads;
}

// Accepts a thread object, and returns a map of senders to message counts.
function calculateSenderCounts(thread) {
	let senderMap = new Map();
	for (let i = 0; i < thread.messages.length; i++) {
		let msg = thread.messages[i];
		senderMap[msg.from] = (senderMap[msg.from] || 0) + 1;
	}
	return senderMap;
}