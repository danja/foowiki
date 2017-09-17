from selenium import webdriver
from selenium.common.exceptions import TimeoutException, StaleElementReferenceException
from selenium.webdriver.support.ui import WebDriverWait
import time

pause = 3  # delay to allow page to fully load

file_dir = "../archive/"

# http://fuseki.local/foowiki/index-static.html
# http://fuseki.local/foowiki/index-static.html
url_base = "http://fuseki.local/foowiki"
to_be_scraped = ["http://fuseki.local/foowiki/index-static.html"]
scraped = []

# list of wildcards to ignore in URL pattern.
ignored = ["index.html", "edit.html", "page.html",
           "resources.html", "yasgui.html", "triples.html", "undefined"]


filename_special_cases = {"index-static.html":"index.html"}

log = open('crawler_log.txt', 'w')

# I require a specific firefox profile, you may not.
firefox_profile = "/home/danja/.mozilla/firefox/bxkc1pq1.Selenium"


def uniqify(seq):
    # uniqifies a list.  Not order preserving
    keys = {}
    for e in seq:
        keys[e] = 1
    return keys.keys()

# http://fuseki.local/foowiki/page.html?uri=http://hyperdata.it/wiki/FooWiki%20Manual


def convert_link(link):
    split = link.split("/")
    filename = split.pop()
    if filename == "":
        print "\n"+link
        print str(split)+"\n"
        return ""
    # filename = filename.replace("-","-_") # edge cases - is adequate?
    filename = filename.replace("%20","-")
    if filename_special_cases.has_key(filename):
        return filename_special_cases[filename]
    return filename+".html"

def getlinks(page):
    print "GETting %s\n" % (page)
    try:
        driver.get(page)
        time.sleep(pause)
    # non-existing pages will cause a pop-up to edit to appear
    # leading to a selenium.common.exceptions.UnexpectedAlertPresentException
    except:
        return
# # link[0:(len(url_base))] == url_base
    elements = driver.find_elements_by_xpath("//a")
    links = []
    for link in elements:
        try:
            # if str(link.get_attribute("href"))[0:4] == "http":
            url = str(link.get_attribute("href"))
            # print "url = " + url
            links.append(url)
        except StaleElementReferenceException:
            log.write("Stale element reference found!\n")
            log.flush()
    links = uniqify(links)

    filename = convert_link(page)
    try:
        content = driver.page_source
        # print links
        for link in links:
            local = False # clunky logic, but I was getting confused
            if link.startswith("http"):
                if link[0:(len(url_base))] == url_base:
                    local = True
            else:
                local = True

            print "\n" + link + " local: " +str(local)+"\n"
            if local:
                if link.startswith("page"):
                    print "FULL "+link + " => " + convert_link(link)
            #    print content
                content = content.replace(link, convert_link(link))
                print "TRIMMED "+link[(len(url_base)+1):]+ " => "+convert_link(link[(len(url_base)+1):])
                content = content.replace(link[(len(url_base)+1):], convert_link(link))
            #    print content
        save_page(filename, content)
    except:
    # non-existing pages will cause a pop-up to edit to appear
    # leading to a selenium.common.exceptions.UnexpectedAlertPresentException
        pass

    return links

def save_page(filename, content):
    fullname = file_dir+filename
    print "Saving "+fullname
    with open(fullname, "w") as text_file:
        text_file.write(content)
        text_file.close()

def ignore(link):
    for pattern in ignored:
        if pattern in link:
            return True

def crawler():
    while to_be_scraped:
        page = to_be_scraped.pop(0)
        # print "page = " + page
        links = getlinks(page)
        if not links:
            return

        scraped.append(page)
        # print links
        for link in links:
            if not link[0:(len(url_base))] == url_base:
                continue
            elif link in scraped:
                # print "%s has already been scraped" % (link)
                continue
            elif link in to_be_scraped:
                # print "%s is already on the queue" % (link)
                continue
            elif ignore(link):
                # print "%s is being ignored" % (link)
                continue
            else:
                # print "adding %s to the queue" % (link)
                to_be_scraped.append(link)


# to_be_scraped.append(url_base)
# driver = webdriver.Firefox(webdriver.firefox.firefox_profile.FirefoxProfile(firefox_profile))
driver = webdriver.Firefox()
crawler()
log.close()
