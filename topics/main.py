# -*- coding: utf-8 -*-
import loadFiles
import exportPickles
import preprocess

cities=[
     #'Amsterdam__Netherlands',
     #'Athens__Greece',
     #'Barcelona__Spain',
     #'Berlin__Germany',
     #'Brussels__Belgium',
     #'Lisbon__Portugal',
     #'London__United_Kingdom',
     #'Paris__France',
     #'Prague__Czech_Republic',
     'Rome__Italy'
    ]
	
def main():    
    print "started."
    stopwords=loadFiles.readStopWordList()
    for city in cities:
        print 'processing: ',city
        name='foursquare_'+city+'.txt';#name='tweets_'+city+'.txt';
        docsPayload,docsIDs=loadFiles.getFoursquare(name)
        docsPayload=preprocess.startPreprocessing(docsPayload)
        print ("docsPaylod length: %s "%len(docsPayload))
        print ("docsIDs length: %s "%len(docsIDs))
        print ('start cleaning')
        docsPayload,docsIDs=preprocess.discardEmptyLists(docsPayload,docsIDs)
        exportPickles.exportPicklesFunction(docsPayload,docsIDs,stopwords,name.split('.')[0])
    print "finished."




if __name__=="__main__":
    main()
