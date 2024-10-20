async function get_req(url) {
    console.log('executing get_req: ', url);
    let response = await fetch(url)
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
    console.log('get_req response:', response);
    return response;
}

function site_has_ton_connect(body_html) {
    const TON_CONNECT_PATTERNS = new Set(['ton-connect', 'tonconnect', 'connect wallet']);
    let body_html_lower = body_html.toLowerCase();
    for (let str of TON_CONNECT_PATTERNS) {
      if (body_html_lower.includes(str)) {
        return true;
      }
    }
    return false;
}

async function is_whitelisted_domain(domain) {
    return true;
    let domain_status = await check_url('http://0.0.0.0:8090/site/', domain);
    return domain_status !== 'Bad';
}

async function get_address_info(address) {
    let url = 'http://127.0.0.1:8090/address_info/?address=' + encodeURIComponent(address);
    let rsp = await get_req(url);
    console.log('Address info:', rsp);
    return rsp;
}

function add_warning() {
    alert('Warning: Unsafe Site Detected. Add this site to wite-list to use TON Connect');
}

function extract_domain(url) {
    const domain = url.match(/:\/\/(www\.)?(.[^/]+)/)[2];
    const domainParts = domain.split('.');
    const secondLevelDomain = domainParts.slice(-2).join('.');
    return secondLevelDomain;
}

async function check_ton_connect() {
    console.log('TonDefender: checking ton-connect...');
    let body_html = document.body.innerHTML;
    if (!site_has_ton_connect(body_html)) {
        console.log('TonDefender: no ton-connect found');
        return;
    }
    console.log('TonDefender: found ton-connect. Checking url', window.location.href);

    let domain = extract_domain(window.location.href);
    console.log('Checking domain:', domain);
    if (!await is_whitelisted_domain(domain)) {
        console.log('Domain is not whitelisted');
        add_warning();
    } else {
        console.log('Domain is whitelisted');
    }
}


window.onload=async function() {
    console.log('TonDefender: activating...');
    const new_div = document.createElement("div");
    new_div.setAttribute("id", 'tondefender-block');
    // new_div.setAttribute("style", "background-color: green;position: sticky;top: 0px; padding: 10px 0px;");
    new_div.innerHTML = 'TonDefender: Activated';

    new_div.style.position = 'fixed';
    new_div.style.top = '0';
    new_div.style.left = '0';
    new_div.style.width = '100%';
    new_div.style.height = '10px';
    new_div.style.backgroundColor = 'green'
    new_div.style.color = 'white';
    new_div.style.zIndex = '999999';
    // new_div.style.display = 'flex';
    new_div.style.flexDirection = 'column';
    new_div.style.justifyContent = 'center';
    new_div.style.alignItems = 'center';
    new_div.style.textAlign = 'center';
    new_div.style.fontSize = '10px';
    new_div.style.fontFamily = 'Arial, sans-serif';
    new_div.style.padding = '10px';
    new_div.setAttribute("hidden", "hidden");

    document.body.insertBefore(new_div, document.body.firstChild);

    let body = document.getElementsByTagName('body')[0];
    var observer = new MutationObserver(function(mutations) {
        co
        body_change_handler();
    });
    observer.observe(body, {attributes: true, childList: true, subtree: true});
};

function extract_bc_addresses(site_body) {
    let re = /[a-zA-Z0-9_]{48}/g;
    let addresses = site_body.match(re);
    if (addresses) {
      return addresses;
    }
    return [];
  }

  async function update_bc_addresses() {
    let body_html = document.body.innerHTML;
    let addresses = extract_bc_addresses(body_html);
    let addresses_info = [];
    for (let address of addresses) {
        addr_info = await get_address_info(address);
        if (addr_info === undefined) {
            continue
        }
        let addr_info_string = "token: " + addr_info.asset_data.display_name + ", addr: " + address + ", rating: " + addr_info.rating;
        addresses_info.push(addr_info_string);
    }
    // observer.disconnect();
    // document.body.innerHTML = body_html;
    // observer.observe(body, {attributes: true, childList: true, subtree: true});
    console.log('Addressed info', addresses_info);
  }


async function body_change_handler() {
    await check_ton_connect();
    await update_bc_addresses();
  }