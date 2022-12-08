const fs = require('fs');

const getInput = async () => {
	try {
		const data = fs.readFileSync('./input.txt', 'utf8');
		return data.split('\n');
	} catch (error) {
		console.log(error);
	}
};

const main = async () => {
	try {
		let inputData = await getInput();

		// Let's create a folder structure from input data
		// Within the terminal output, lines that begin with $ are commands you executed, very much like some modern computers:
		// cd means change directory. This changes which directory is the current directory, but the specific result depends on the argument:
		// 		cd x moves in one level: it looks in the current directory for the directory named x and makes it the current directory.
		// 		cd .. moves out one level: it finds the directory that contains the current directory, then makes that directory the current directory.
		// 		cd / switches the current directory to the outermost directory, /.
		// ls means list. It prints out all of the files and directories immediately contained by the current directory:
		// 		123 abc means that the current directory contains a file named abc with size 123.
		// 		dir xyz means that the current directory contains a directory named xyz.

		// Directory structure
		// {
		// 	{
		//		name: '/',
		// 		files: [],
		// 		directories: [],
		// 		parent: null,
		// 		size: 0,
		// }
		// File structure
		// {
		// 		name: 'abc',
		// 		size: 123
		// 	}

		// Let's create a file structure
		let fileDirectoryStructure = {
			name: '/',
			files: [],
			directories: [],
			parent: null,
			size: 0,
		};

		let currentWorkingDirectory = fileDirectoryStructure['/'];

		for (let i = 0; i < inputData.length; i++) {
			let line = inputData[i];
			let lineParts = line.split(' ');

			// Check if the line is a command
			if (lineParts[0] === '$') {
				// Check if the command is cd
				if (lineParts[1] === 'cd') {
					// Check if the argument is a directory
					if (lineParts[2] === '/') {
						// This is the root directory
						currentWorkingDirectory = fileDirectoryStructure;
					} else if (lineParts[2] === '..') {
						// This is the parent directory
						currentWorkingDirectory = currentWorkingDirectory.parent;
					} else {
						// Navigate to the directory specified
						// Check if the directory exists
						if (currentWorkingDirectory.directories[lineParts[2]] === undefined) {
							// If it doesn't exist, create it
							currentWorkingDirectory.directories.push({
								name: lineParts[2],
								files: [],
								directories: [],
								parent: currentWorkingDirectory,
								size: 0,
							});
						}
						currentWorkingDirectory = currentWorkingDirectory.directories.find((directory) => directory.name === lineParts[2]);
					}
				}
			} else {
				// If the line is not a command, it is a file or directory
				// Check if the line is a directory
				if (lineParts[0] === 'dir') {
					// Check if the directory exists
					if (fileDirectoryStructure[lineParts[1]] === undefined) {
						// If it doesn't exist, create it
						currentWorkingDirectory.directories.push({
							name: lineParts[1],
							files: [],
							directories: [],
							parent: currentWorkingDirectory,
						});
					}
				} else {
					// The line is a file
					currentWorkingDirectory.files.push({
						name: lineParts[1],
						size: parseInt(lineParts[0]),
					});
				}
			}
		}

		// Now that we have a file structure
		// Let's calculate the size of each directory
		let calculateSize = (directory) => {
			let size = 0;
			for (let i = 0; i < directory.files.length; i++) {
				size += directory.files[i].size;
			}
			for (let i = 0; i < directory.directories.length; i++) {
				size += calculateSize(directory.directories[i]);
			}
			directory.size = size;
			return size;
		};
		calculateSize(fileDirectoryStructure);

		// Now that we have the size of each directory
		// Let's sum the size of all directories under 100000
		let sum = 0;
		let traverse = (directory) => {
			if (directory.size < 100000) {
				sum += directory.size;
			}
			for (let i = 0; i < directory.directories.length; i++) {
				traverse(directory.directories[i]);
			}
		};
		traverse(fileDirectoryStructure);

		console.log(sum);
	} catch (error) {
		console.error(error);
	}
};

main();
