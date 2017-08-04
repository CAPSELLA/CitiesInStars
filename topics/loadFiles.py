# -*- coding: utf-8 -*-
import codecs
from random import randint

def getFoursquare(name):
    lines=[]
    docsPayload=[]
    docsIDs=[]    
    CORPUS_PATH="data/"+"foursquare_comments/"+name;#CORPUS_PATH="data/"+"obesity_data/"+name;#CORPUS_PATH="data/"+"tweets_per_city/"+name;
    with codecs.open(CORPUS_PATH,'r',encoding='utf-8') as f:
        data=f.readlines()
    lines=[line.split('\n')[0] for line in data]
    for line in lines:
        parts=line.split('\t')
        if(len(parts)==2):
            docsIDs.append(parts[0])
            docsPayload.append(parts[1])
        else:
            print 'e',name,line
            #docsPayload.append(parts[0])
            #docsIDs.append(randint(0,10000))
    return docsPayload,docsIDs

def readStopWordList():
    with codecs.open('data/stopwords.txt','r',encoding='utf-8') as f:
        data=f.readlines()
    return [line.split('\n')[0] for line in data]
