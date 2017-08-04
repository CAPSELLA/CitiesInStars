# -*- coding: utf-8 -*-
import nltk
from nltk.corpus import stopwords 
from nltk.stem.wordnet import WordNetLemmatizer
import string
from gensim.models import Phrases

stop = set(stopwords.words('english'))
exclude = set(string.punctuation) 
lemma = WordNetLemmatizer()

def clean(doc):
     stop_free = " ".join([i for i in doc.lower().split() if i not in stop])
     punc_free = ''.join(ch for ch in stop_free if ch not in exclude)
     nouns=" "
     posResult=nltk.pos_tag(punc_free.split())
     for item in posResult:
         if keep(item[1]):
             if(len(item[0])>3):
                 nouns+=(item[0])+" "
     normalized = " ".join(lemma.lemmatize(word) for word in nouns.split() if not word.isnumeric())
     return normalized

def keep(tag):
    if 'V' in tag or 'DT' in tag or 'CC' in tag or 'CD' in tag:
        return False
    elif 'IN' in tag or 'JJR' in tag or 'JJS' in tag:
        return False
    elif 'LS' in tag or 'MD' in tag or 'NNP' in tag:
        return False
    elif 'PDT' in tag or 'POS' in tag or 'PRP' in tag:
        return False
    elif 'RB' in tag or 'W' in tag:
        return False
    elif 'UH' in tag or 'TO' in tag or 'SYM' in tag or 'RP' in tag:
        return False
    return True

def findBigrams(docs):
    #bigram = Phrases(docs, min_count=20)
    bigram = Phrases(docs, min_count=1)
    for idx in range(len(docs)):
        for token in bigram[docs[idx]]:
            if '_' in token:
                # Token is a bigram, add to document.
                docs[idx].append(token)
                
def startPreprocessing(docs):
    print ("Start preprocessing...")
    #doc_clean = [clean(doc).split() for doc in docs if(len(clean(doc).split())>0)]
    doc_clean = [clean(doc).split() for doc in docs]
    findBigrams(doc_clean)
    doc_clean_list=[" ".join(word for word in doc) for doc in doc_clean ]
    return doc_clean_list

def discardEmptyLists(docsPayload,docsIDs):
    payloadList=[]
    idList=[]
    for index,value in enumerate(docsPayload):
        if(len(value)!=0):
            payloadList.append(value)
            idList.append(docsIDs[index])
    return payloadList,idList
