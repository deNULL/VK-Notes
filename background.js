chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.method == 'updateOptions') {
    saveOptions(request.update, true);
    /*rebuildMenu();*/
  } else
  if (request.method == 'getOptions') {
    sendResponse(opts);
  } else
  if (request.method == 'getNote') {
    var note = false;
    try {
      note = JSON.parse(localStorage['note' + request.user_id] || 'false') || false;
    } catch (e) {}

    sendResponse({ note: note });
  } else
  if (request.method == 'saveNote') {
    localStorage['note' + request.user_id] = JSON.stringify(request.note);
  }
});


chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
  if (request.method == 'getNote') {
    var note = false;
    try {
      note = JSON.parse(localStorage['note' + request.user_id] || 'false') || false;
    } catch (e) {}

    sendResponse(note);
  }
});

chrome.runtime.onInstalled.addListener(function(details) {
  chrome.tabs.create({ url: 'options.html' });
});