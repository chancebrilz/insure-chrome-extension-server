#!/usr/bin/env python
# coding: utf-8

# # Eyeball 

# In[87]:


# import required modules
import requests
import time
import numpy as np
import pandas
import validators
from bs4 import BeautifulSoup

# Enter url here
url = 'https://google.com'

# check if the url is valid
if(validators.url(url) == True): 
    links= [] # list to save all the links
    try:
        html = requests.get(url,timeout=30).text # html request to fetch the url
        
    # handle request.get exceptions
    except requests.exceptions.RequestException as err:
        print ("OOps: Something Else",err)
    except requests.exceptions.HTTPError as errh:
        print ("Http Error:",errh)
    except requests.exceptions.ConnectionError as errc:
        print ("Error Connecting:",errc)
    except requests.exceptions.Timeout as errt:
        print ("Timeout Error:",errt) 
    
    # get beautifulsoup object
    bs = BeautifulSoup(html)
    possible_links = bs.find_all('a') # find all possible links
    for link in possible_links:
        if link.has_attr('href'):
            if validators.url(link.attrs['href']):
                links.append(link.attrs['href']) # append the links to the list
                
    # convert list to daatframes and save to .csv file            
    df = pandas.DataFrame(data= links)
    df.to_csv("./ExtractedLinks.csv", sep=',',index=False)
    
# We can use the list straight a way without saving it to the .csv file. 


# In[ ]:




