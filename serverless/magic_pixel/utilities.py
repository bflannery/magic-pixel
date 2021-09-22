def parse_url(url_dict):
    return f"{url_dict.protocol}//{url_dict.host}{url_dict.pathname}"
