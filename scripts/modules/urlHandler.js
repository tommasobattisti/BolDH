
function handleUrl(id, mode, param = 'event') {
    const currentUrl = window.location.href;

    if (mode === "open"){
      updateParam(id, currentUrl, param);
    } else {
        closeParam(currentUrl, param);
    }
}


function updateParam(id, currentUrl, param) {
    const key = param + "=";
    if (currentUrl.includes("?" + key) || currentUrl.includes("&" + key)) {
      let url = new URL(window.location.href);
      let currentValue = url.searchParams.get(param);
      if (currentValue !== id){
        let newUrl = currentUrl.replace(new RegExp(param + '=[^&]+'), param + '=' + id);
        window.history.pushState({}, '', newUrl);
      }
    } else if (currentUrl.includes("?")) {
      let newUrl = currentUrl + "&" + key + id;
      window.history.pushState({}, '', newUrl);
    } else {
      let newUrl = currentUrl + "?" + key + id;
      window.history.pushState({}, '', newUrl);
    }
}

function closeParam(currentUrl, param) {
    let url = new URL(currentUrl);
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      let newUrl = url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '') + url.hash;
      window.history.pushState({}, '', newUrl);
    }
}

export { handleUrl }
