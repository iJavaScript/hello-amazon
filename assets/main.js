;(function(chrome) {

    var theUrl = 'http://www.amazon.co.jp/gp/product/B00NNJ5B0E/ref=ox_sc_sfl_title_2?ie=UTF8&psc=1&smid=AN1VRQENFRJN5',
        notifyCount = 2;

    function isTheUrl(tab) {
        return tab.url.indexOf(theUrl) >= 0;
    }

    function focusTab(ids) {
        chrome.tabs.highlight({tabs: ids}, function () {
        });
    }

    function reloadTab(id, timer) {
        chrome.tabs.reload(id, {}, function findDesiredEls() {
            var codeStr = 'var x = document.getElementById("add-to-cart-button"); x.value; ';

            chrome.tabs.executeScript(id, {code: codeStr}, function (resp) {
                notifyCount--;
                if (notifyCount < 0) {
                    clearInterval(timer);
                }
                if (!!resp) {
                    console.log('~~~~', resp);
                    chrome.notifications.create(
                        null,
                        {type: 'basic',
                         //contextMessage: resp,
                         title: "Basic Notification",
                         message: "Short message part",
                         expandedMessage: "Longer part of the message"
                        },
                        function () {

                        });
                }
            });

        });
    }


    chrome.tabs.query({}, function (tabs) {
        console.log(tabs.filter);

        var ts = tabs.filter(isTheUrl),
            tIndexs = ts.map(function (t) { return t.index; }),
            tIds = ts.map(function (t) { return t.id; }),
            id = tIds[0];

        console.log(id);

        var timer = setInterval(function () {
            reloadTab(id, timer);
        }, 3000);

    });
})(chrome);
