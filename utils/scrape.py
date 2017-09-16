from selenium import webdriver
from selenium.common.exceptions import TimeoutException, StaleElementReferenceException
from selenium.webdriver.support.ui import WebDriverWait
import time

pause = 3 # delay to allow page to fully load

# http://fuseki.local/foowiki/index-static.html
sut="http://fuseki.local/foowiki" # http://fuseki.local/foowiki/index-static.html
to_be_scraped=["http://fuseki.local/foowiki/index-static.html"]
scraped=[]

#list of wildcards to ignore in URL pattern.
ignored = ["edit.html", "page.html", "resources.html", "yasgui.html", "triples.html"]
log = open('crawler_log.txt', 'w')

#I require a specific firefox profile, you may not.
firefox_profile = "/home/danja/.mozilla/firefox/bxkc1pq1.Selenium"

def uniqify(seq):
  # uniqifies a list.  Not order preserving
  keys = {}
  for e in seq:
    keys[e] = 1
  return keys.keys()

def getlinks(page):
  print "Testing %s\n" % (page)
  driver.get(page)
  time.sleep(pause)

  print "  driver.get successful\n"
  elements = driver.find_elements_by_xpath("//a")
  source = driver.page_source

  print "  driver.find_elements_by_xpath successful\n"
  print source
  links = []
  for link in elements:
    try:
      # if str(link.get_attribute("href"))[0:4] == "http":
      url = str(link.get_attribute("href"))
      print "url = "+url
      links.append(url)
    except StaleElementReferenceException:
      log.write("Stale element reference found!\n")
      log.flush()
  links = uniqify(links)
  return links

def testlinks(links):
  badlinks = []
  for link in links:
    # I am testing for the $ character.  You can add more tests here.
    if '$' in link:
      badlinks.append(link)
  return badlinks

def ignore(link):
  for pattern in ignored:
    if pattern in link:
      return True

def scraper(page):
  links = getlinks(page)
  scraped.append(page)
  badlinks = testlinks(links)
  if badlinks:
    for link in badlinks:
      print "* Bad link on \"%s\" detected: \"%s\"" % (page, link)
      log.write("* Bad link on \"%s\" detected: \"%s\"" % (page, link))
      links.remove(link)
  log.write('Done scraping %s\n' % (page))
  log.flush()
  return links

def crawler():
  while to_be_scraped:
    page = to_be_scraped.pop(0)
    print "page = "+page
    links = scraper(page)
    print links
    for link in links:
      if not link[0:(len(sut))] == sut:
        print "%s not at sut" % (link)
        continue
      elif link in scraped:
        print "%s has already been scraped" % (link)
        continue
      elif link in to_be_scraped:
        print "%s is already on the queue" % (link)
        continue
      elif ignore(link):
        print "%s is being ignored" % (link)
        continue
      else:
        print "adding %s to the queue" % (link)
        to_be_scraped.append(link)

# to_be_scraped.append(sut)
# driver = webdriver.Firefox(webdriver.firefox.firefox_profile.FirefoxProfile(firefox_profile))
driver = webdriver.Firefox()
crawler()
log.close()
