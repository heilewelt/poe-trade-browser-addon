document.body.style.borderTop = "3px solid yellow";

// remove top elements (logo, ...)
function scrollToTradeDiv() {
	document.getElementById("statusBar").remove();
	document.getElementsByClassName("linkBack")[0].remove();
	document.getElementsByClassName("logo")[0].remove();
	document.getElementsByClassName("language-select")[0].remove();
};
setTimeout(scrollToTradeDiv, 100);

// set default storage entry for previously parsed clipboard text
browser.storage.local.get("clipboardText").then(oldClipboard => {}, oldClipboard => {
	browser.storage.local.set({ "clipboardText" : "" });
});

function checkClipboard() {
	navigator.clipboard.readText().then(clipText => {
		let oldClipboard = browser.storage.local.get("clipboardText");
		oldClipboard.then(oldClipboard => {
			let oldClipboardText = oldClipboard.clipboardText;
			if (oldClipboardText != clipText && clipText != "") {
				browser.storage.local.set({ "clipboardText" : clipText });
				// split lines into array
				let lines = clipText.split("\n");
				// check format of possible PoE item
				if (lines.length >= 3 && lines[0].startsWith("Item Class:") && lines[1].startsWith("Rarity:")) {
					let itemName = lines[2];
					// get query id for trade website link
					let xhr = new XMLHttpRequest();
					xhr.onload = function () {
						// parse response json object
						var jsonResponse = JSON.parse(xhr.responseText);
						let queryId = jsonResponse["id"];
						let url = "https://www.pathofexile.com/trade/search/Scourge/" + queryId;
						if (window.location.href != url) {
							window.location.href = url;
						}
					};
					xhr.onerror = function () {
						console.log('XHR An error occurred.');
					}
					
					xhr.open("POST", "https://www.pathofexile.com/api/trade/search/Scourge");
					xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
					xhr.send(JSON.stringify({"query":{"status":{"option":"online"},"term":itemName,"stats":[{"type":"and","filters":[],"disabled":true}]},"sort":{"price":"asc"}}));
				}

			}
		});
	});
	setTimeout(checkClipboard, 1000);
}
setTimeout(checkClipboard, 2000);
