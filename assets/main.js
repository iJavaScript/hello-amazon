;(function(chrome) {

    var theUrl = 'www.amazon.co.jp/gp/product/B00NNJ5B0E/';
    var refreshInterval = 15000;
    var notifyCount = 0;
    var debug = false;

    function np() {}

    function notifyOpt(msg) {
        return { type: 'basic',
                 title: "Hello Amazon",
                 message: msg,
                 iconUrl: "/assets/imgs/icon_128.png",
                 expandedMessage: msg
               };
    }


    function isTheUrl(tab) {
        return tab.url.indexOf(theUrl) >= 7;
    }

    function focusTab(ids) {
        chrome.tabs.highlight({tabs: ids}, np);
    }

    function reloadTab(tabId, tabIndex) {

        chrome.tabs.reload(tabId, {}, function findDesiredEls() {
            var codeStr = 'var x = document.querySelectorAll("#baby disapers ul li"); x.length; ';

            chrome.tabs.executeScript(tabId, {code: codeStr}, function (resp) {
                if (resp>0) {
                    chrome.notifications.create("notification-running", notifyOpt("found trove !!! "), np);
                    focusTab([tabIndex]);
                }
            });

        });
    }

    function run(timer) {
        if (debug) {
            chrome.notifications.create("notification-action-start", notifyOpt("starting working"), np);
            console.log("count:", notifyCount++)
            if (notifyCount >= 3) {
                clearInterval(timer);
            }
        }

        chrome.tabs.query({}, function (tabs) {

            var ts = tabs.filter(isTheUrl);

            if (ts.length > 0) {
                var tab = ts[0],
                    tindex = tab.index,
                    tid = tab.id;
                reloadTab(tid, tindex);
            }

        });
    }

    var timer = setInterval(function () {
        run(timer)
    }, refreshInterval);



})(chrome);
