import * as ExcelJS from "exceljs";
import path = require("path");
import { inspect } from "util";
import * as fs from "fs";

export async function parseExcelWithImages() {

    // Create a new workbook and load the Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, '2.xlsx')); // Replace with your file path

    // Select the worksheet you want to parse
    const worksheet = workbook.getWorksheet('Sheet1'); // Replace with your worksheet name

    // Object to store the data mapped with images
    const userData = [];

    // Map to keep track of image positioning in the worksheet
    const imageMap = new Map();

    // Extract all images from the worksheet
    worksheet.getImages().forEach(image => {
        console.log(image);
        
        const imageDetails = workbook.getImage(image.imageId);
        // fs.writeFileSync(path.join(__dirname, `1.${imageDetails.extension}`), imageDetails.buffer);
        const { range } = image;  // Get the cell range (e.g., 'C2')
        // Store the image buffer in a map with the cell where it is located
        imageMap.set(range.tl.nativeRow, {
            buffer: imageDetails.buffer,
            extension: imageDetails.extension
        });
    });

    // Iterate over the rows to extract user data
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {  // Assuming the first row is the header
            const id = row.getCell(1).value;
            const name = row.getCell(2).value;

            // Get the image corresponding to the row if it exists
            const image = imageMap.get(rowNumber);

            // Store the user data along with the image (if present)
            userData.push({
                id,
                name,
                image: image ? {
                    buffer: image.buffer,
                    extension: image.extension
                } : null
            });
        }
    });

    // Example output of user data with images
    userData.forEach(user => {
        console.log(`ID: ${user.id}, Name: ${user.name}`);

        if (user.image) {
            const imagePath = `profile_${user.id}.${user.image.extension}`;
            fs.writeFileSync(imagePath, user.image.buffer);
            console.log(`Image saved as ${imagePath}`);
        } else {
            console.log('No image for this user.');
        }
    });
}

// Run the function to parse the Excel file
parseExcelWithImages();







// ----------------------- Excel Parse 2 ----------------------------------//

function saveImage(imageBuffer: Buffer, fileName: string) {
  const imagePath = path.join(__dirname, "static", "images", fileName);
  fs.writeFileSync(imagePath, imageBuffer);
  console.log("Image saved to:", imagePath);
}

async function readExcelWithImages() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("H:/5.xlsx");

  const worksheet = workbook.worksheets[0];
  for (const image of worksheet.getImages()) {
    const img: ExcelMediaType = (workbook.model.media as ExcelMediaType[]).find(
      (m: ExcelMediaType) => m.index === image.imageId
    )!;
    const rowIndex = String(image.range.tl.nativeRow - 1);
    
    saveImage(img.buffer, (+ rowIndex + 1)+ "." + img.extension);
    //add the img to respective object using rowIndex and colIndex.
    //ExcelMediaType is a custom interface, to overwrite the default media type coz it doesn't has an index.
  }
}

export interface ExcelMediaType {
  type: string; // image,background
  name: string;
  extension: string;
  buffer: Buffer;
  index: string;
}

readExcelWithImages();

