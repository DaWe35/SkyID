import os
scriptDir = os.path.dirname(os.path.abspath(__file__))
pictureFolder = os.path.join(scriptDir, "pictures")

for path, subdirs, files in os.walk(pictureFolder):
	for name in files:
		file_path = os.path.join(path,name)
		new_name = os.path.join(path,name.lower().replace('.png', ''))
		os.rename(file_path, new_name)