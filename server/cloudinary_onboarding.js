const cloudinary = require('cloudinary').v2;

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: 'k9nqbfzp',
  api_key: '814548978435455',
  api_secret: '-d8USs3M1ySROIIGoMGafep1uwU'
});

async function run() {
  try {
    // 2. Upload an image
    const uploadResult = await cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/sample.jpg');
    console.log('Secure URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);

    // 3. Get image details
    const details = await cloudinary.api.resource(uploadResult.public_id);
    console.log('Width:', details.width);
    console.log('Height:', details.height);
    console.log('Format:', details.format);
    console.log('File size (bytes):', details.bytes);

    // 4. Transform the image
    // f_auto: Automatically converts the image to the most efficient format based on the requesting browser
    // q_auto: Automatically adjusts the image quality to reduce file size without visible degradation
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
    });
    console.log('Done! Click link below to see optimized version of the image. Check the size and the format.');
    console.log('Transformed URL:', transformedUrl);
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
