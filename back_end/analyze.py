# -*- encoding: utf-8 -*-
# Author: li_colin

import spacy


def get_tokens(txt):
    nlp = spacy.load("zh_core_web_sm")
    doc = nlp(txt)
    keywords = [token.text for token in doc if token.is_alpha and not token.is_stop]
    print("keywords ", keywords)
    return keywords
