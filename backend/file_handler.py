# store the raw scraped data to a file
def raw_html_to_txt_file(prettified_data):
    with open("scraped.txt", "w") as file:  # w overwrites the existing file
        file.write(str(prettified_data))
        print("Raw Scraped data saved to scraped.txt")
