from requests import get  # to make GET request
import os

scriptDir = os.path.dirname(os.path.abspath(__file__))
pictureFolder = os.path.join(scriptDir, "pictures")
os.mkdir(pictureFolder)

def download(url, id):
	# open in binary mode
	folder_name = os.path.join(pictureFolder, str(id))
	os.mkdir(folder_name)
	response = get(url)
	sizes = [50, 150, 300, 600, 1920]
	
	# write to file
	for size in sizes:
		file_name = os.path.join(folder_name, str(size) + '.svg')
		with open(file_name, "wb") as file:
			file.write(response.content)

i = 0
while i < 1000:
	print(i)
	download('https://avatars.dicebear.com/4.4/api/avataaars/' + str(i) + '.svg', i)
	i += 1