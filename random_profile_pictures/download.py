import os

# Install trick if you have Windows: https://stackoverflow.com/a/60220855/8474284
os.environ['path'] += r';C:\Program Files\GIMP 2\32\bin'
from cairosvg import svg2png

scriptDir = os.path.dirname(os.path.abspath(__file__))
pictureFolder = os.path.join(scriptDir, "pictures")
os.mkdir(pictureFolder)

def download(url, id):
	# open in binary mode
	folder_name = os.path.join(pictureFolder, str(id))
	os.mkdir(folder_name)
	sizes = [50, 150, 300, 600, 1920]
	
	# write to file
	for size in sizes:
		""" 
		You need to convert the SVG to PNG here!
 		"""
		file_name = os.path.join(folder_name, str(size))
		svg2png(url=url, write_to=file_name, parent_width=size, parent_height=size)

i = 0
while i < 100:
	print(i)
	download('https://avatars.dicebear.com/4.4/api/avataaars/' + str(i) + '.svg', i)
	i += 1