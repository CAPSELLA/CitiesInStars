# -*- coding: utf-8 -*-
import os
from sklearn.externals import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
#------------------------------------------------------------
def exportPicklesFunction(documentsList,documentIDs,stopwords,name):
    (X,terms) = calculateTFIDF(documentsList,stopwords)
    print "function calculatetfidf completed." 
    save_results_year(X,terms,documentIDs,name)
    
def calculateTFIDF(docs,stopwords):
    tfidf=TfidfVectorizer(strip_accents='unicode',
                          norm='l2',
                          ngram_range=(1,1),
                          lowercase=True,
                          min_df=10,
                          use_idf=True,
                          stop_words=stopwords)
    X = tfidf.fit_transform(docs)
    terms = []
    v = tfidf.vocabulary_
    for i in range(len(v)):
        terms.append("")
    for term in v.keys():
        terms[ v[term] ] = term
    return (X,terms)


def save_results_year(X, terms, doc_ids,name):
    matrix_outpath='data/pickles_files'
    pikle_name="%s.pkl" % name
    if not os.path.exists(matrix_outpath):
        os.makedirs(matrix_outpath)
    joblib.dump((X,terms,doc_ids), matrix_outpath+"/"+pikle_name)
