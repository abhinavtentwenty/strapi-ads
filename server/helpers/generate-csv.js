const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const utils = require('@strapi/utils');
const _ = require('lodash');
const { NotFoundError, ApplicationError } = utils.errors;

const generate = async (data, templateFile, title = 'download') => {
    const tmpWorkingDirectory = await getTempDirectory();
    const csvId = uuidv4();
    const outputPath = path.resolve(`${tmpWorkingDirectory}/${csvId}.csv`);

    // Prepare CSV header
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','), // header row
        ...data.map(ad => headers.map(h => `"${(ad[h] ?? '').toString().replace(/"/g, '""')}"`).join(',')) // data rows
    ];

    fs.writeFileSync(outputPath, csvRows.join('\n'));

    return {
        message: 'CSV generated successfully',
        downloadUrl: `/api/download-csv/${csvId}/${_.kebabCase(title)}`,
    };
};

const download = async (ctx) => {
    const pdfId = ctx.params.id;
    const tmpWorkingDirectory = await getTempDirectory();
    const pdfPath = path.join(tmpWorkingDirectory, `${pdfId}.csv`);

    // Assuming the title is passed as a query parameter or fetched from a database
    const title = _.kebabCase(ctx.params.title) || 'document';

    if (fs.existsSync(pdfPath)) {
        ctx.set('Content-disposition', `attachment; filename=${title}.csv`);
        ctx.set('Content-type', 'text/csv');
        const readStream = fs.createReadStream(pdfPath);

        // Set up the response body to be the file stream
        ctx.body = readStream;

        // Log the path for debugging
        console.log(pdfPath);

        // Handle stream end to delete the file after sending
        readStream.on('end', () => {
            fs.unlink(pdfPath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('File deleted successfully');
                }
            });
        });

        // Handle errors on the read stream
        readStream.on('error', (err) => {
            console.error('Error reading file:', err);
            // Optionally handle errors here, such as sending a 500 response
        });

        console.log(pdfPath);
        // Delete the file after sending it
        //fs.unlinkSync(pdfPath);
    } else {
        throw new NotFoundError('File not found');
    }
}

const capitalizeFirst = (str) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

const getTempDirectory = async () => {
    const TEMP_PDF_DIR = path.join(process.cwd(), 'public', 'uploads', 'ads-attachments-temporary');
    if (!fs.existsSync(TEMP_PDF_DIR)) {
        fs.mkdirSync(TEMP_PDF_DIR);
    }
    return TEMP_PDF_DIR;
};

module.exports = {
    generate,
    download,
    getTempDirectory,
    capitalizeFirst,
};
